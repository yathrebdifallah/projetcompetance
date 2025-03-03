import axios from 'axios';
import ProductCard from '../components/productCard';

// Fonction pour récupérer les données côté serveur
export async function getServerSideProps() {
  try {
    // Appel de l'API backend pour récupérer les produits
    const res = await axios.get('http://localhost:4000/products'); // Vérifiez que le port est correct
    const products = res.data;

    // Vérifie si des produits ont été retournés
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Aucun produit trouvé.');
    }

    // Retour des produits comme propriétés
    return { props: { products } };
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error.message);

    // Retourne un tableau vide si une erreur survient
    return { props: { products: [] } };
  }
}

// Composant de la page d'accueil
export default function Home({ products }) {
  return (
    <div>
      <h1>Catalogue des Produits</h1>
      {products.length === 0 ? (
        // Affichage d'un message si aucun produit
        <p>Aucun produit disponible pour le moment.</p>
      ) : (
        // Affichage des produits sous forme de cartes
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
