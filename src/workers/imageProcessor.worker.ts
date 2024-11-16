import * as Comlink from 'comlink';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

let model: blazeface.BlazeFaceModel | null = null;

const api = {
  async initModel() {
    if (!model) {
      model = await blazeface.load();
    }
  },

  async processImage(imageData: ImageData) {
    if (!model) await this.initModel();

    const tensor = tf.browser.fromPixels(imageData);
    const predictions = await model!.estimateFaces(tensor, false);
    tensor.dispose();

    return predictions;
  },

  async applyBackgroundBlur(imageData: ImageData, predictions: blazeface.NormalizedFace[]) {
    const canvas = new OffscreenCanvas(imageData.width, imageData.height);
    const ctx = canvas.getContext('2d')!;
    
    // Draw original image
    ctx.putImageData(imageData, 0, 0);

    // Create mask for face
    const maskCanvas = new OffscreenCanvas(imageData.width, imageData.height);
    const maskCtx = maskCanvas.getContext('2d')!;
    
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, imageData.width, imageData.height);
    maskCtx.fillStyle = 'white';
    
    predictions.forEach(face => {
      const x = face.topLeft[0];
      const y = face.topLeft[1];
      const width = face.bottomRight[0] - face.topLeft[0];
      const height = face.bottomRight[1] - face.topLeft[1];
      
      maskCtx.beginPath();
      maskCtx.ellipse(
        x + width / 2,
        y + height / 2,
        width * 0.6,
        height * 0.8,
        0,
        0,
        Math.PI * 2
      );
      maskCtx.fill();
    });

    // Apply blur to background
    ctx.filter = 'blur(10px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    // Apply original face using mask
    const maskData = maskCtx.getImageData(0, 0, imageData.width, imageData.height);
    const originalData = imageData.data;
    const blurredData = ctx.getImageData(0, 0, imageData.width, imageData.height).data;
    const finalData = new Uint8ClampedArray(imageData.width * imageData.height * 4);

    for (let i = 0; i < maskData.data.length; i += 4) {
      const maskValue = maskData.data[i] / 255;
      finalData[i] = originalData[i] * maskValue + blurredData[i] * (1 - maskValue);
      finalData[i + 1] = originalData[i + 1] * maskValue + blurredData[i + 1] * (1 - maskValue);
      finalData[i + 2] = originalData[i + 2] * maskValue + blurredData[i + 2] * (1 - maskValue);
      finalData[i + 3] = 255;
    }

    return new ImageData(finalData, imageData.width, imageData.height);
  }
};

Comlink.expose(api);