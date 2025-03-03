// pages/cart.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }); // Endpoint de l'API backend
        setCartItems(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement du panier :', error);
      }
    };
    fetchCart();
  }, []);

  return (
    <div>
      <h1>Mon Panier</h1>
      {cartItems.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Prix : {item.price}€</p>
        </div>
      ))}
    </div>
  );
}
