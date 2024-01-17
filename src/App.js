import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    post: {}
  };

  componentDidMount() {
    // Récupération depuis l'API
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.setState({ post: result });
      });
  }

  render() {
    // Affichage des données
    return (
      <div className="App">
        <h1>Notre dernier article :</h1>
        <p>{this.state.post.title}</p>
      </div>
    );
  }
}

export default App;
