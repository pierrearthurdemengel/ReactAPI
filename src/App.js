import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    email: '',
    breaches: null,
    lastCheckedEmail: '',
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, lastCheckedEmail } = this.state;
  
    if (email === lastCheckedEmail) {
      alert("Veuillez entrer une adresse email différente pour une nouvelle vérification.");
      return;
    }
  
    try {
      const response = await fetch(`https://salty-meadow-74963-9a39f496f9d8.herokuapp.com/api/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`);
      if (!response.ok) throw new Error('Erreur lors de la recherche de fuites pour cet email.');
  
      const breaches = await response.json();
      const detailedBreaches = await Promise.all(breaches.map(async (breach) => {
        try {
          const detailResponse = await fetch(`https://salty-meadow-74963-9a39f496f9d8.herokuapp.com/api/breach/${breach.Name}`);
          if (!detailResponse.ok) throw new Error();
          return detailResponse.json();
        } catch (error) {
          return { Name: breach.Name, error: true }; // Retourne un objet avec le nom et une indication d'erreur
        }
      }));
  
      this.setState({ breaches: detailedBreaches, lastCheckedEmail: email });
    } catch (error) {
      console.error('Erreur:', error);
      this.setState({ breaches: null, lastCheckedEmail: '' });
    }
  };

  renderBreaches() {
    const { breaches } = this.state;
    if (!breaches) return null;
    return breaches.map(breach => {
      const formattedDate = breach.BreachDate 
        ? new Date(breach.BreachDate).toLocaleDateString('fr-FR') 
        : 'Non spécifié';
  
      return (
        <div key={breach.Name} className="breach-details">
          <h3>{breach.Title || breach.Name}</h3>
          {breach.LogoPath && <img src={breach.LogoPath} alt={breach.Name} />}
          <p><strong>Date de la fuite :</strong> {formattedDate}</p>
          {breach.error 
            ? <p>Détails non disponibles</p> 
            : <p dangerouslySetInnerHTML={{ __html: breach.Description || 'Pas de description disponible' }}></p>}
          <p><strong>Comptes affectés :</strong> {breach.PwnCount || 'Non spécifié'}</p>
          <p><strong>Données exposées :</strong> {breach.DataClasses ? breach.DataClasses.join(', ') : 'Non spécifié'}</p>
        </div>
      );
    });
  }
  

  render() {
    const { email, breaches } = this.state;
    const breachCount = breaches ? breaches.length : 0;

    return (
      <div className="App">
        <h1>Vérifiez si votre adresse e-mail est victime d'une violation de données</h1>
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
        {breaches && (
          <div className={breachCount > 0 ? "card" : ""}>
            <p>
              {breachCount > 0
                ? `Votre adresse email est compromise. Vos informations personnelles ont fuité ${breachCount} fois.`
                : "Aucune fuite trouvée pour cet email."}
            </p>
          </div>
        )}
        <ul>{this.renderBreaches()}</ul>
        {breaches && breaches.length > 0 && (
          <div className="secure-now">
            <button onClick={this.handleSecureNow}>Sécuriser maintenant</button>
          </div>
        )}
        {/* Nouvelle section des risques */}
        {breaches && breaches.length > 0 && (
          <div className="risks-section">
            <h2>Risques liés aux fuites de données</h2>
            <ul>
              <li><strong>Usurpation d'identité :</strong> Les fuites d'informations personnelles peuvent faciliter l'usurpation d'identité.</li>
              <li><strong>Fraudes financières :</strong> Les données bancaires compromises peuvent entraîner des pertes financières considérables.</li>
              <li><strong>Risques pour la sécurité personnelle :</strong> Les informations telles que l'adresse ou le numéro de téléphone peuvent mettre votre sécurité personnelle en danger.</li>
              <li><strong>Impact sur la réputation :</strong> Les fuites d'emails et de mots de passe peuvent entraîner la diffusion de contenus personnels sensibles.</li>
              <li><strong>Pertes professionnelles :</strong> Les violations de données dans les entreprises peuvent mener à des pertes économiques et une perte de confiance de la part des clients.</li>
            </ul>
            <p>Agir maintenant peut prévenir ces risques et protéger vos informations.</p>
          </div>
        )}
        {breaches && breaches.length > 0 && (
          <div className="secure-now">
            <button onClick={this.handleSecureNow}>Sécuriser maintenant</button>
          </div>
        )}
        {/* Section Éducative */}
        {breaches && breaches.length > 0 && (
          <div className="educational-section">
            <h2>Comment se protéger contre les violations de données ?</h2>
            <ul>
              <li>Utilisez des mots de passe uniques et complexes pour chaque compte.</li>
              <li>Activez l'authentification à deux facteurs lorsque c'est possible.</li>
              <li>Mettez régulièrement à jour vos logiciels et systèmes d'exploitation.</li>
              <li>Faites attention aux emails de phishing et aux liens suspects.</li>
              <li>Envisagez l'utilisation d'un gestionnaire de mots de passe.</li>
            </ul>
          </div>
        )}
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
  };

}

export default App;
