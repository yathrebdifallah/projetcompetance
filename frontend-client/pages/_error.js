export default function Error({ statusCode }) {
    return (
      <div>
        <h1>{statusCode ? `Erreur ${statusCode}` : 'Une erreur est survenue'}</h1>
        <p>Il y a eu un problème en traitant la demande.</p>
      </div>
    );
  }
  