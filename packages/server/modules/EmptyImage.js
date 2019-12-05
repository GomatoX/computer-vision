import Jimp from 'jimp';
import cv from 'opencv4nodejs';

function getImage(image) {
  return cv.imdecode(image);
}

function emptyImage(
  props = {
    width: 320,
    height: 240,
    background: '0x000000ff'
  }
) {
  return new Promise((resolve, reject) => {
    new Jimp(
      props.width,
      props.height,
      props.background,
      async (err, image) => {
        if (err) {
          reject(err);
        }

        const newIamge = await image.getBufferAsync('image/png');
        resolve(getImage(newIamge));
      }
    );
  });
}

export default emptyImage;
