import React, { Component } from 'react';
import Modal from 'react-modal';
import DropNCrop from '@synapsestudios/react-drop-n-crop';

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    width: '400px',
    height: '450px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ia = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export default class AvatarUpload extends Component {
  state = {
    result: null,
    filename: null,
    filetype: null,
    src: null,
    error: null,
  };

  onChange = (value) => {
    this.setState(value);
  };

  uploadAvatar = () => {
    const self = this;
    const { result, filename } = this.state;
    const file = dataURItoBlob(result);
    file.name = filename;
    const { uploadAvatar: uploadAvatar1 } = this.props;
    uploadAvatar1({ variables: { file } }).then(() => {
      self.props.showModal();
    });
  };

  changeImage = () => {
    this.setState({ src: null });
  };

  render() {
    const { showModal, isOpen } = this.props;
    const { src } = this.state;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={showModal}
        contentLabel="Change avatar"
        style={modalStyle}
      >
        <DropNCrop onChange={this.onChange} value={this.state} />
        {src !== null && (
          <button
            type="button"
            className="cancelUpload"
            onClick={this.changeImage}
          >Change image
          </button>
        )}
        <button
          type="button"
          className="uploadAvatar"
          onClick={this.uploadAvatar}
        >Save
        </button>
      </Modal>
    );
  }
}
