import cv from 'opencv4nodejs';
import emptyImage from './EmptyImage';

export default class FaceDetector {
  constructor() {
    this.minDetections = 3;
    this.classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
  }

  async detect(imageBlob) {
    const image = this.getImage(imageBlob);
    const { objects, numDetections } = await this.detectFace(image);
    const generatedImage = await this.drawDetection(objects, numDetections);
    return {
      count: numDetections.filter(item => {
        return item >= this.minDetections;
      }).length,
      image: generatedImage
    };
  }

  getImage(image) {
    return cv.imdecode(image);
  }

  async detectFace(image) {
    const {
      objects,
      numDetections
    } = await this.classifier.detectMultiScaleAsync(image.bgrToGray());

    return {
      objects,
      numDetections
    };
  }

  async drawDetection(objects, numDetections) {
    const image = await emptyImage();

    objects.forEach((faceRect, i) => {
      if (numDetections[i] < this.minDetections) {
        return;
      }

      cv.drawDetection(image, faceRect, {
        color: new cv.Vec3(0, 0, 255),
        segmentFraction: 3
      });
    });

    return await cv.imencodeAsync('.png', image);
  }
}
