import React, { Component } from 'react';
import UploadAvatarMutation from '../mutations/uploadAvatar';
import AvatarUpload from '../avatarModal';

export default class UserBar extends Component {
  state = {
    isOpen: false,
  };

  showModal = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  render() {
    const { user } = this.props;
    if (!user) return null;
    const { isOpen } = this.state;
    return (
      <div className="user">
        <img src={user.avatar} onClick={this.showModal} alt="avatar" />
        <UploadAvatarMutation>
          <AvatarUpload
            isOpen={isOpen}
            showModal={this.showModal}
          />
        </UploadAvatarMutation>
        <span>{user.username}</span>
      </div>
    );
  }
}
