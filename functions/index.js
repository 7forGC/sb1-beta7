const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Translate } = require('@google-cloud/translate').v2;
const fetch = require('node-fetch');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();
const translate = new Translate();

// User Management
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;
  
  await db.collection('users').doc(uid).set({
    email,
    displayName,
    photoURL,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    status: 'online',
    role: 'user'
  });
});

exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  await db.collection('users').doc(user.uid).delete();
});

// Message Translation
exports.translateMessage = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const { text, language, receiverId } = message;
    
    if (!text || !receiverId) return;
    
    try {
      const receiverDoc = await db.collection('users').doc(receiverId).get();
      const targetLanguage = receiverDoc.data().settings?.language || 'en';
      
      if (language === targetLanguage) return;
      
      const [translation] = await translate.translate(text, targetLanguage);
      
      await snap.ref.update({
        translations: {
          [targetLanguage]: translation
        }
      });
    } catch (error) {
      console.error('Translation error:', error);
    }
  });

// Media Processing
exports.processUploadedMedia = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name;
    const contentType = object.contentType;
    
    if (!filePath || !contentType) return;
    
    if (contentType.startsWith('image/')) {
      await processImage(object);
    } else if (contentType.startsWith('video/')) {
      await processVideo(object);
    }
  });

async function processImage(object) {
  const bucket = storage.bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const workingDir = '/tmp/';
  
  const tempFilePath = workingDir + fileName;
  
  await bucket.file(filePath).download({
    destination: tempFilePath
  });
  
  // Generate thumbnail
  const thumbnailPath = workingDir + 'thumb_' + fileName;
  await sharp(tempFilePath)
    .resize(300, 300, { fit: 'inside' })
    .toFile(thumbnailPath);
    
  // Upload thumbnail
  const thumbDestination = filePath.replace(fileName, 'thumb_' + fileName);
  await bucket.upload(thumbnailPath, {
    destination: thumbDestination,
    metadata: {
      contentType: object.contentType
    }
  });
}

async function processVideo(object) {
  const bucket = storage.bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const workingDir = '/tmp/';
  
  const tempFilePath = workingDir + fileName;
  const thumbnailPath = workingDir + 'thumb_' + fileName.replace(/\.[^/.]+$/, '.jpg');
  
  await bucket.file(filePath).download({
    destination: tempFilePath
  });
  
  // Generate thumbnail
  await new Promise((resolve, reject) => {
    ffmpeg(tempFilePath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: 'thumb_' + fileName.replace(/\.[^/.]+$/, '.jpg'),
        folder: workingDir
      })
      .on('end', resolve)
      .on('error', reject);
  });
  
  // Upload thumbnail
  const thumbDestination = filePath.replace(fileName, 'thumb_' + fileName.replace(/\.[^/.]+$/, '.jpg'));
  await bucket.upload(thumbnailPath, {
    destination: thumbDestination,
    metadata: {
      contentType: 'image/jpeg'
    }
  });
}

// Cleanup Functions
exports.cleanupTempFiles = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles({ prefix: 'temp/' });
    
    const now = Date.now();
    const deletePromises = files.map(async (file) => {
      const [metadata] = await file.getMetadata();
      const created = new Date(metadata.timeCreated).getTime();
      
      if (now - created > 24 * 60 * 60 * 1000) {
        return file.delete();
      }
    });
    
    await Promise.all(deletePromises);
  });

exports.cleanupExpiredStories = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    const expiredStories = await db.collection('stories')
      .where('expiresAt', '<=', now)
      .get();
      
    const deletePromises = expiredStories.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
  });

// Notification Functions
exports.sendMessageNotification = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const { senderId, receiverId, text } = message;
    
    const senderDoc = await db.collection('users').doc(senderId).get();
    const receiverDoc = await db.collection('users').doc(receiverId).get();
    
    const senderName = senderDoc.data().displayName;
    const receiverToken = receiverDoc.data().fcmToken;
    
    if (!receiverToken) return;
    
    const notification = {
      title: senderName,
      body: text,
      icon: senderDoc.data().photoURL || '/default-avatar.png'
    };
    
    await admin.messaging().sendToDevice(receiverToken, {
      notification,
      data: {
        type: 'message',
        senderId,
        messageId: context.params.messageId
      }
    });
  });

exports.sendCallNotification = functions.firestore
  .document('calls/{callId}')
  .onCreate(async (snap, context) => {
    const call = snap.data();
    const { callerId, receiverId, type } = call;
    
    const callerDoc = await db.collection('users').doc(callerId).get();
    const receiverDoc = await db.collection('users').doc(receiverId).get();
    
    const callerName = callerDoc.data().displayName;
    const receiverToken = receiverDoc.data().fcmToken;
    
    if (!receiverToken) return;
    
    const notification = {
      title: `Incoming ${type} Call`,
      body: `${callerName} is calling...`,
      icon: callerDoc.data().photoURL || '/default-avatar.png'
    };
    
    await admin.messaging().sendToDevice(receiverToken, {
      notification,
      data: {
        type: 'call',
        callerId,
        callId: context.params.callId,
        callType: type
      }
    });
  });