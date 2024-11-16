import { useRef, useCallback } from 'react';
import * as Comlink from 'comlink';
import type { Worker } from '../workers/imageProcessor.worker';

export const useBackgroundEffects = () => {
  const workerRef = useRef<Comlink.Remote<typeof Worker>>();
  const canvasRef = useRef<HTMLCanvasElement>();

  const initWorker = useCallback(async () => {
    if (!workerRef.current) {
      const worker = new Worker(
        new URL('../workers/imageProcessor.worker.ts', import.meta.url),
        { type: 'module' }
      );
      workerRef.current = Comlink.wrap<typeof Worker>(worker);
      await workerRef.current.initModel();
    }
  }, []);

  const applyBackgroundBlur = useCallback(async (videoTrack: MediaStreamTrack) => {
    await initWorker();

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const { width, height } = videoTrack.getSettings();
    canvasRef.current.width = width!;
    canvasRef.current.height = height!;
    const ctx = canvasRef.current.getContext('2d')!;

    const processFrame = async () => {
      const imageCapture = new ImageCapture(videoTrack);
      const imageBitmap = await imageCapture.grabFrame();
      
      ctx.drawImage(imageBitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, width!, height!);
      
      const predictions = await workerRef.current!.processImage(imageData);
      const processedData = await workerRef.current!.applyBackgroundBlur(imageData, predictions);
      
      ctx.putImageData(processedData, 0, 0);
      requestAnimationFrame(processFrame);
    };

    requestAnimationFrame(processFrame);

    return canvasRef.current.captureStream().getVideoTracks()[0];
  }, [initWorker]);

  return {
    applyBackgroundBlur
  };
};