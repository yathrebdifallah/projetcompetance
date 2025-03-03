// pages/login.js
import axios from 'axios';
import { useState } from 'react';
import jwtDecode from 'jwt-decode';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }); // Endpoint de l'API backend
      const token = res.data.token;
      localStorage.setItem('token', token);
      const user = jwtDecode(token);
      alert(`Bienvenue ${user.role}`);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert('Erreur lors de la connexion.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Connexion</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
    </form>
  );
}
