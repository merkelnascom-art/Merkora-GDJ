# 04 — Socle transversal et règles communes

Les capacités transversales peuvent servir plusieurs domaines. Elles restent facultatives et doivent être sélectionnées selon le besoin réel.

## 1. Capacités communes

| Capacité | Utilité | Contrôles |
|---|---|---|
| Utilisateurs et permissions | Comptes, rôles, équipes, sites | Principe du moindre privilège, révocation, revue |
| Notifications et rappels | Échéances, événements, alertes | Préférences, consentement, anti-spam, historique |
| Documents et pièces jointes | Contrats, preuves, justificatifs | Types autorisés, accès, antivirus si disponible, rétention |
| Paiements et facturation | Devis, factures, reçus, rapprochements | Confirmation fournisseur, idempotence, audit |
| Tableaux de bord et rapports | Indicateurs, exports, périodicité | Définitions vérifiables, droits d'accès, date de calcul |
| Historique et audit | Actions et validations | Journal non modifiable par les utilisateurs ordinaires |
| Messagerie et assistance | Échanges et réclamations | Confidentialité, pièces jointes, délais |
| Intégrations et automatisations | API et outils tiers | Autorisation, coût, secrets serveur, reprise sur erreur |

## 2. Capacités complémentaires à considérer

- Recherche, filtres et archivage.
- Multi-sites, multi-entités et délégation.
- Import/export et migration de données.
- Signature et approbation électronique, selon validité locale.
- Gestion de tâches et workflows.
- Calendrier et réservation.
- Géolocalisation limitée au besoin et au consentement.
- Mode faible connexion et synchronisation différée.
- Multilingue et formats régionaux.
- Accessibilité et assistance à l'utilisation.

## 3. Règles communes de données

- Collecter seulement les données nécessaires à une finalité expliquée.
- Définir propriétaire, responsable, source, qualité, durée de conservation et accès.
- Distinguer données de test, données personnelles et données sensibles.
- Prévoir export et suppression selon le contrat et les obligations applicables.
- Chiffrer les échanges et protéger les secrets.
- Ne pas utiliser les données d'un client pour entraîner ou enrichir un autre projet sans base légale et autorisation appropriées.

## 4. Règles communes de paiement

Un statut « payé » doit venir d'une confirmation vérifiée, jamais du simple retour du navigateur. Utiliser une référence unique, gérer les notifications répétées, réconcilier les transactions et conserver la preuve. Ne jamais demander ou stocker le code secret mobile money du client. Les remboursements et annulations exigent des droits et une trace.

## 5. Règles communes d'IA

- Afficher quand une réponse est une estimation ou une hypothèse.
- Citer les données du projet qui motivent une recommandation.
- Demander confirmation quand le niveau de confiance est insuffisant.
- Éviter de fabriquer des faits, tarifs, disponibilités, résultats ou règles.
- Ne pas prendre de décision clinique, disciplinaire, juridique ou administrative finale.
- Garder les instructions de l'utilisateur séparées des contenus non fiables importés.
- Prévoir une voie de correction humaine et un historique des versions.

## 6. Options et dépendances

Chaque option du catalogue doit préciser : identifiant stable, domaine, description, prérequis, dépendances, incompatibilités, données utilisées, rôles, niveau de risque, effort relatif, tests requis et état de maturité. Une option transversale n'est pas automatiquement nécessaire dans chaque projet. Exemple : un mini-site vitrine n'a pas forcément besoin de paiements, de comptes clients ou de géolocalisation.

## 7. Intégrations

Évaluer chaque intégration sur : cas d'usage, API documentée, disponibilité dans le pays, coût, limites, sécurité, traitement des données, dépendance fournisseur et plan de secours. Préférer un adaptateur remplaçable. Commencer par les outils gratuits ou déjà disponibles lorsque cela répond au besoin, sans sacrifier la sécurité ni la fiabilité.
