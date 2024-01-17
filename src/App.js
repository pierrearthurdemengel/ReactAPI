import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    email: '',
    breaches: null,
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email } = this.state;
  
    fetch(`http://localhost:3001/api/breachedaccount/${encodeURIComponent(email)}`)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Aucune fuite trouvée pour cet email.');
    })
    .then(data => {
      this.setState({ breaches: data });
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
  };  

  renderBreaches() {
    const { breaches } = this.state;
    if (!breaches) return null;
    return breaches.map(breach => (
      <li key={breach.Name}>
        {breach.Name} ({breach.Domain})
      </li>
    ));
  }

  render() {
    return (
      <div className="App">
        <h1>Vérifiez si votre email a été compromis</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
            placeholder="Entrez votre email"
            required
          />
          <button type="submit">Vérifier</button>
        </form>
        <ul>{this.renderBreaches()}</ul>
      </div>
    );
  }
}

export default App;
