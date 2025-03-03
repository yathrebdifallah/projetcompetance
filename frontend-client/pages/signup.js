// pages/signup.js
import axios from 'axios';
import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { email, password }); // Endpoint de l'API backend
      alert('Inscription réussie !');
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
      alert('Erreur lors de l’inscription.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h1>Inscription</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
