import axios from 'axios';

// Base URL pour les appels API backend
const API_BASE_URL = 'http://localhost:5000'; // Modifier en fonction de votre backend

// Instance d'Axios avec configuration par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Fonction pour gérer les erreurs
const handleError = (error) => {
  const errorMessage = error.response?.data || error.message || 'An error occurred';
  console.error('API Error:', errorMessage);

  // Affichage dans la console pour un débogage plus approfondi
  console.error('Status code:', error.response?.status || 'No status code');
  console.error('Headers:', error.response?.headers || 'No headers');

  return Promise.reject(errorMessage);
};

// API: Inscription
export const signup = async (userData) => {
  try {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// API: Connexion
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// API: Récupérer les produits
export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// API: Ajouter un produit au panier
export const addToCart = async (productId) => {
  try {
    const response = await api.post('/api/orders/cart', { productId });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// API: Récupérer les articles du panier
export const getCart = async () => {
  try {
    const response = await api.get('/api/orders/cart');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export default api;
