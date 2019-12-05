import React, { PureComponent, createRef } from 'react';
import './App.scss';
import io from 'socket.io-client';

const EVENTS = {
  VIDEO: 'Video'
};

const VIDEO = {
  width: 320,
  height: 240
};

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      numDetections: 0
    };

    this.videoRef = createRef();
    this.canvasRef = createRef();
    this.resultsCanvasRef = createRef();

    this.io = io(process.env.REACT_APP_SERVER);

    this.io.on('connect', async () => {
      this.showCameraOutput();
      await this.showOutput();
    });

    this.io.on(EVENTS.VIDEO, this.onMessageReceive);
  }

  componentDidMount() {
    this.resultsCanvasRef.current.width = this.getVideoSize().width;
    this.resultsCanvasRef.current.height = this.getVideoSize().height;
  }

  onMessageReceive = data => {
    if (data) {
      this.resultsContext = this.resultsCanvasRef.current.getContext('2d');

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

      if (this.state.numDetections !== data.count) {
        this.setState({
          numDetections: data.count
        });
      }

      image.src = `data:image/png;base64, ${Buffer.from(data.image).toString(
        'base64'
      )}`;
    }
  };

  getVideoSize() {
    return {
      width: VIDEO.width,
      height: VIDEO.height
    };
  }

  async showOutput() {
    this.context = this.canvasRef.current.getContext('2d');
    this.context.filter = 'grayscale(100%)';

    this.context.clearRect(
      0,
      0,
      this.canvasRef.current.width,
      this.canvasRef.current.height
    );

    this.context.drawImage(
      this.videoRef.current,
      0,
      0,
      VIDEO.width,
      VIDEO.height
    );

    this.io.emit(EVENTS.VIDEO, await this.getBlob());
  }

  async getBlob() {
    return new Promise(resolve => {
      this.canvasRef.current.toBlob(
        blob => {
          resolve(blob);
        },
        'image/jpeg',
        0.1
      );
    });
  }

  showCameraOutput() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(stream => {
          this.videoRef.current.srcObject = stream;
          this.videoRef.current.play();
        });
    }
  }

  render() {
    return (
      <div className="container">
        <canvas
          className="original"
          width={VIDEO.width}
          height={VIDEO.height}
          ref={this.canvasRef}
        />
        <div className="video">
          <video
            ref={this.videoRef}
            width={VIDEO.width}
            height={VIDEO.height}
            autoPlay
          ></video>
          <canvas
            width={VIDEO.width}
            height={VIDEO.height}
            ref={this.resultsCanvasRef}
          />
        </div>

        <div className="info">Detected faces: {this.state.numDetections}</div>
      </div>
    );
  }
}

export default App;
