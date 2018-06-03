class Camera {
  constructor() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.resultsCanvas = document.getElementById('resultsCanvas');
    this.resultsContext = this.resultsCanvas.getContext('2d');

    this.resultsCanvas.width = this.getVideoSize().width;
    this.resultsCanvas.height = this.getVideoSize().height;

    this.infoBlock = document.querySelector('.camera-view--results');
  }

  getVideoSize() {
    return {
      width: window.innerHeight * 1.33,
      height: window.innerHeight
    };
  }

  async init() {
    await this.connectSocket();
  }

  async showOutput() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.video, 0, 0, 1280, 720);
    this.socket.send(
      JSON.stringify({
        type: 'image',
        data: await this.getBlob()
      })
    );
  }

  connectSocket() {
    this.socket = new WebSocket('ws://localhost:2020');
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = async () => {
      this.showCameraOutput();
      await this.showOutput();
    };

    this.socket.onmessage = async message => {
      const data = JSON.parse(message.data);

      if (data.type === 'results') {
        var image = new Image();
        image.onload = async () => {
          this.resultsContext.drawImage(
            image,
            0,
            0,
            this.getVideoSize().width,
            this.getVideoSize().height
          );
          await this.showOutput();
        };
        this.infoBlock.innerHTML = data.data.count;
        image.src = `data:image/jpg;base64, ${data.data.image}`;
      }
    };
  }

  async getBlob() {
    return new Promise(resolve => {
      resolve(this.canvas.toDataURL());
    });
  }

  showCameraOutput() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          this.video.src = window.URL.createObjectURL(stream);
          this.video.play();
        });
    }
  }
}

const camera = new Camera();
camera.init();
