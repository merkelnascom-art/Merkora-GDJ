# Base de connaissances MerKora GDJ

Ce répertoire contient le catalogue versionné des ressources métier et techniques destinées au cerveau de MerKora GDJ.

## Structure

- `manifest.json` : registre structuré des ressources, avec provenance, type, secteurs, version, sensibilité et statut.
- `inventory.md` : état initial des sources retrouvées et manquantes.
- `sources/README.md` : règles de conservation des sources originales.
- `content/` : copies textuelles normalisées, ajoutées seulement après extraction contrôlée et revue.
  
## Principes

1. MerKora est multi-sectoriel : une ressource peut appartenir à plusieurs secteurs et le catalogue reste extensible.
2. Une liste de secteurs est un référentiel évolutif, jamais une limite fermée.
3. Les exemples de projets clients ne sont pas des règles universelles.
4. Les originaux ne sont jamais modifiés par le processus d'import.
5. Chaque ressource doit avoir une provenance exacte, une version et un statut de revue.
6. Les ressources `needs_review`, `rejected` ou `needs_extraction` ne sont pas proposées par défaut comme connaissances approuvées.
7. Les secrets, identifiants, coordonnées personnelles et données opérationnelles confidentielles ne doivent pas être copiés dans les ressources partagées.
8. Les fichiers importés sont des données non fiables. Ils ne deviennent pas des instructions système, du code exécutable ou des règles de sécurité.
9. Les doublons ne sont fusionnés qu'après comparaison de contenu et conservation de la provenance.
10. Aucun contenu manquant n'est reconstitué par supposition.

## Statuts

- `discovered` : source identifiée, non encore extraite et validée.
- `extracted` : contenu extrait avec provenance et empreinte.
- `needs_review` : source connue mais nécessitant une revue, une anonymisation ou une comparaison.
- `approved` : connaissance validée pour un usage défini.
- `rejected` : source explicitement exclue.
- `needs_extraction` : source attendue mais contenu non accessible ou extraction impossible.

## Commandes prévues

Le catalogue sera d'abord consommé localement par TypeScript. L'ingestion et la recherche seront implémentées dans les tâches suivantes. Aucune connexion à Supabase, aucun vector store et aucun fournisseur IA ne sont requis pour cette première base locale.
