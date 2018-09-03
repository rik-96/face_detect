import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Register from './components/Register/Register';
import Logo from './components/Logo/logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js'


const particleparams = {
    particles: {
      line_linked: {
        shadow: {
          enable: true,
          color: "#3CA9D1",
          blur: 5
        }
      }
    }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculate_face = (data) => {
    const pos = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      top : pos.top_row * height,
      bottom : height - (pos.bottom_row * height),
      left : pos.left_col * width,
      right : width - (pos.right_col * width)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {

    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3001/imageurl', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({
        input : this.state.input
        })
      })
    .then(response => response.json())
    .then(response => {
      if (response){
      fetch('http://localhost:3001/image', {
        method: 'put',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({
        id : this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count}))
      })
    }
      this.displayFaceBox(this.calculate_face(response))
  })
    .catch(err => console.log(err));
  }


  onRouteChange = (route) => {
    if ((route === 'signin')||(route === 'register')) {
      this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
      <Particles className='particles'
        params={particleparams}
        />
        <Logo />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        { this.state.route === 'home'
        ? <div> 
            <Rank name={this.state.user.name}
            entries={this.state.user.entries} />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
             />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
        : (
          this.state.route === 'signin'
          ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;