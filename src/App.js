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
  
    fetch(`http://localhost:3001/api/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Aucune fuite trouvée pour cet email.');
    })
    .then(data => {
      console.log(data); // Affiche les données pour vérification
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
      <div key={breach.Name} className="breach-details">
        <h3>{breach.Title || breach.Name}</h3>
        <p><strong>Date de la fuite :</strong> {breach.BreachDate || 'Non spécifié'}</p>
        <p>{breach.Description || 'Pas de description disponible'}</p>
        <p><strong>Comptes affectés :</strong> {breach.PwnCount || 'Non spécifié'}</p>
        <p><strong>Données exposées :</strong> {breach.DataClasses ? breach.DataClasses.join(', ') : 'Non spécifié'}</p>
      </div>
    ));
  }
  
  
  

  render() {
    const { email, breaches } = this.state;
    const breachCount = breaches ? breaches.length : 0;
    const breachMessage = breachCount > 0 ? 
      `Votre adresse mail est compromise. Vos informations personnelles ont fuité ${breachCount} fois.` : 
      "Aucune fuite trouvée pour cet email.";
  
    return (
      <div className="App">
        <h1>Vérifiez si votre email a été compromis</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={this.handleEmailChange}
            placeholder="Entrez votre email"
            required
          />
          <button type="submit">Vérifier</button>
        </form>
        {breaches && <p>{breachMessage}</p>}
        <ul>{this.renderBreaches()}</ul>
        {breaches && breaches.length > 0 && (
          <div className="secure-now">
            <button onClick={this.handleSecureNow}>Sécuriser maintenant</button>
          </div>
        )}
      </div>
    );
  }
  
  handleSecureNow = () => {
    // Logique pour gérer le clic sur "Sécuriser maintenant"
    // Par exemple, rediriger vers une page de conseils de sécurité
  };
  
}

export default App;
