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
          setTimeout(() => {
            this.setState({ post: result });
          }, 1500);
      });
  }

  render() {
    // Affichage des données
    return (
      <div className="App">
        <h1>Notre dernier article :</h1>
        <p>{this.state.post.title ? this.state.post.title : <p>Chargement...</p>}</p>
      </div>
    );
  }
}

export default App;
