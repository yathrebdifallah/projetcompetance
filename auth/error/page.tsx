'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Email ou mot de passe incorrect';
      case 'SessionRequired':
        return 'Vous devez être connecté pour accéder à cette page';
      default:
        return "Une erreur est survenue lors de l'authentification";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">
            Erreur d'authentification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {error ? getErrorMessage(error) : 'Une erreur est survenue'}
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/auth/signin">Réessayer</Link>
            </Button>
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
