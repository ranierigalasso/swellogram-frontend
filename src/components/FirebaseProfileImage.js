import React, { Component } from 'react';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import ProfileService from '../lib/profile-service';
import { Card, Button, Form, FormControl, FormGroup } from 'react-bootstrap';
import { withAuth } from './AuthProvider';

import '../stylesheets/Spinner.css';
import '../lib/firebase-config'

class FirebaseProfileImage extends Component {
  state = {
    avatar: '',
    isUploading: false,
    progress: 0,
    avatarURL: ''
  };

  handlePictureChange = (e) => {
    e.preventDefault();
    const id = this.props.userId;
    const url = this.state.avatarURL;
    const data = {
      id,
      url,
    }
    ProfileService.changeProfilePicture(data)
      .then((data) => {
        this.props.setUser(data);
      })
      .catch((error) => {
        console.log(error)
      })
  }
  updateButton = () => {
    const { avatarURL, isUploading } = this.state;
    if( isUploading === true) {
      return <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    } else if (avatarURL !== '') {
      return <Form onSubmit={this.handlePictureChange}>
        <Button type='submit'>
        Update                                       
        </Button>
      </Form>
    } 
  }

  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
    this.setState({isUploading: false});
    console.error(error);
  }
  handleUploadSuccess = (filename) => {
    this.setState({avatar: filename, progress: 100, isUploading: false});
    firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({avatarURL: url}));
  };
  render() {
  return (
  <div>
    <form style={{display:'flex',justifyContent:'center'}}>
      <label style={{width:'6rem',backgroundColor: '#007eff', color: 'white', padding: '0', borderRadius: '4rem', pointer: 'cursor'}}>
        <FileUploader
          accept="image/*"
          name="avatar"
          randomizeFilename
          storageRef={firebase.storage().ref('images')}
          onUploadStart={this.handleUploadStart}
          onUploadError={this.handleUploadError}
          onUploadSuccess={this.handleUploadSuccess}
          onProgress={this.handleProgress}
        />
      </label>
    </form>
    {this.updateButton()}

  </div>
  );
}
}
export default withAuth()(FirebaseProfileImage);