import React, { Component } from 'react'
import { withAuth } from '../components/AuthProvider';
import CreateService from '../lib/create-service';
import { Form, Button } from 'react-bootstrap';
import FirebaseImage from '../components/FirebaseImage';
import '../stylesheets/Create.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'

library.add(faShare);

class Create extends Component {
  state = {
    location: '',
    imageUrl: '',
    description: '',
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const {location, imageUrl, description} = this.state;
    const body = {
      location,
      imageUrl,
      description,
    }
    // console.log('before createservice')
    CreateService.createPost(body)
      .then(() => {
        // console.log('done')
        this.props.history.push(`/feed`);
      })
      .catch((error) => {console.log(error.message)}) 
  }

  handleChange = (event) => {  
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  imageUrlGetter = (url) => {
    this.setState({
      imageUrl: url,
    })
  }
  renderImage = () => {
    if(this.state.imageUrl !== ''){
      return <img src={this.state.imageUrl} alt='image-upload'/>
    }
  }
  render() {
    const { location, imageUrl, description } = this.state;
    console.log(this.state)
    return (
      <div className='create-container'>
        {this.renderImage()}
        <FirebaseImage userId={this.props.user._id} imageUrlGetter={this.imageUrlGetter}/>
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Group controlId="formBasicLocation">
            <Form.Control type="text" name="location" value={location} onChange={this.handleChange} placeholder="Location" />
          </Form.Group>
          <Form.Group controlId="formBasicDescription">
            <Form.Control type="text" name="description" value={description} onChange={this.handleChange} placeholder="Description" />
          </Form.Group>
          <div id='create-btn'>
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon="share" size="1x" />                
          </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default withAuth()(Create);