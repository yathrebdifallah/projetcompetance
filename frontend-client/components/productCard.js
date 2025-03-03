// components/ProductCard.js
import axios from 'axios';

export default function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/orders/cart', { productId: product.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }); // Endpoint de l'API backend
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur lors de l’ajout au panier :', error);
      alert('Erreur lors de l’ajout au panier.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>{product.name}</h3>
      <p>Prix : {product.price}€</p>
      <button onClick={addToCart}>Ajouter au Panier</button>
    </div>
  );
}
