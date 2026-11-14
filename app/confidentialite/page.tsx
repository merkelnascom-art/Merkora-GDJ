export const metadata = {
  title: "Confidentialité et traitement assisté | MerKora GDJ",
  description: "Comprendre les données utilisées pour analyser et concevoir un projet avec MerKora GDJ.",
};

export default function ConfidentialitePage() {
  return (
    <main className="page-shell" style={{ maxWidth: 920, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <div className="eyebrow">MERKORA GDJ · INFORMATION</div>
      <h1>Confidentialité et traitement assisté</h1>
      <p>
        MerKora conserve le contexte de votre projet pour vous permettre de reprendre le travail,
        de corriger notre compréhension et de retrouver vos décisions sur vos différents appareils.
      </p>

      <section className="panel">
        <h2>Pourquoi certaines données peuvent être traitées par une IA externe</h2>
        <p>
          Pour approfondir une analyse, comprendre une demande complexe ou préparer des propositions,
          MerKora peut utiliser des services spécialisés de traitement par intelligence artificielle.
          MerKora reste votre interlocuteur et pilote le dossier : vous n'avez pas à choisir un assistant
          ou un fournisseur technique.
        </p>
      </section>

      <section className="panel">
        <h2>Quelles informations peuvent être concernées ?</h2>
        <ul>
          <li>Le titre, l'activité, le problème décrit et le résultat attendu.</li>
          <li>Vos messages et les réponses nécessaires pour conserver le fil de la conversation.</li>
          <li>Les réponses au diagnostic, les secteurs et métiers que vous confirmez.</li>
          <li>Les modules, formats de livrables, contraintes et choix de conception enregistrés.</li>
          <li>Les éléments financiers ou organisationnels que vous décidez de communiquer, lorsqu'ils sont utiles au projet.</li>
        </ul>
        <p>
          Les informations strictement nécessaires à l'analyse doivent être privilégiées.
          N'envoyez pas de mot de passe, de clé secrète, de coordonnées bancaires complètes,
          ni de données personnelles sensibles qui ne sont pas indispensables.
        </p>
      </section>

      <section className="panel">
        <h2>Votre choix et son retrait</h2>
        <p>
          Le traitement assisté par des prestataires externes n'est activé pour un dossier qu'après
          votre autorisation explicite. Sans cette autorisation, MerKora peut continuer à proposer
          une première analyse reposant sur ses règles internes, avec des capacités plus limitées.
        </p>
        <p>
          Vous pouvez retirer votre autorisation depuis l'espace de conversation du projet.
          Le retrait bloque les prochains envois aux services externes. Il n'efface pas automatiquement
          les messages ou les décisions déjà enregistrés dans votre dossier.
        </p>
      </section>

      <section className="panel">
        <h2>Traitement par les prestataires</h2>
        <p>
          Les prestataires techniques peuvent traiter les informations transmises pour produire
          le résultat demandé. Les conditions de conservation, de sécurité et d'utilisation des données
          dépendent du service et de l'offre effectivement configurés par MerKora.
        </p>
        <p>
          Avant toute ouverture publique du traitement assisté, MerKora doit vérifier les conditions
          contractuelles du prestataire retenu, les paramètres de conservation, les éventuels usages
          des données pour l'amélioration de ses services, les lieux de traitement et les garanties
          applicables. Aucune promesse de non-réutilisation ou de durée précise n'est faite ici sans
          vérification de ces éléments.
        </p>
      </section>

      <section className="panel">
        <h2>Mémoire et synchronisation</h2>
        <p>
          Lorsque vous êtes connecté, les échanges et décisions du projet peuvent être enregistrés
          dans son espace sécurisé afin d'être retrouvés sur un autre appareil. Le navigateur peut
          également conserver une copie locale de travail. En cas de désaccord entre deux versions,
          MerKora doit vous demander de recharger la version récente plutôt que d'écraser silencieusement
          vos choix.
        </p>
      </section>

      <p className="discovery-notice">
        Cette page décrit le fonctionnement prévu du traitement assisté. Elle ne remplace pas
        les mentions légales et la politique de confidentialité complètes de l'exploitant.
        Les coordonnées du responsable du traitement, les durées de conservation et les modalités
        détaillées d'exercice des droits doivent être complétées et validées avant la mise en production.
      </p>
      <a className="button button-secondary" href="/">Retour à MerKora</a>
    </main>
  );
}
