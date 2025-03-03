// components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Accueil</Link>
      <Link href="/signup">Inscription</Link>
      <Link href="/login">Connexion</Link>
      <Link href="/cart">Panier</Link>
    </nav>
  );
}
