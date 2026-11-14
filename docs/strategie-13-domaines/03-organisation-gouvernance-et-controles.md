# 03 — Organisation, rôles, validations et gouvernance

## 1. Espaces séparés

### Espace client
- Décrire une demande et consulter le diagnostic.
- Corriger le domaine, le métier et les hypothèses.
- Comparer les options et confirmer le périmètre.
- Examiner les maquettes et spécifications.
- Suivre les lots, tests, anomalies et livraisons.
- Échanger avec MerKora et consulter les documents contractuels.

### Espace administrateur MerKora
- Tableau de bord des demandes et priorités.
- Analyse et conception.
- Validation des propositions et devis.
- Suivi de réalisation et contrôle qualité.
- Gestion des clients, abonnements, facturation et échéances.
- Gestion des intégrations, coûts et autorisations.
- Support, audits, incidents et historique.

### Espace équipe de réalisation
- Tâches assignées, spécifications et critères.
- Environnements, branches, commits et previews.
- Tests, anomalies et revues.
- Documentation technique et transfert.

Ne pas mélanger l'administration de la plateforme MerKora avec l'administration du logiciel construit pour le client. Ce sont deux périmètres et deux ensembles de permissions distincts.

## 2. Rôles types

| Rôle | Responsabilité |
|---|---|
| Client demandeur | Exprime le besoin, fournit les informations, corrige l'analyse |
| Décideur client | Valide le périmètre, le devis et la recette |
| Référent métier | Vérifie les processus et règles métier |
| Administrateur MerKora | Pilote le dossier, contrôle les estimations et autorise les étapes |
| Analyste / concepteur | Diagnostic, processus, UX, spécifications |
| Développeur / fabricant | Implémentation et documentation |
| QA / auditeur | Tests indépendants, preuves, risques et anomalies |
| Support / exploitation | Suivi, sauvegardes, incidents et maintenance |

Une même personne peut porter plusieurs rôles dans une petite équipe, mais les actions critiques doivent garder une séparation ou une revue compensatoire.

## 3. Validations obligatoires

- Confirmation du diagnostic et des hypothèses sensibles.
- Validation du périmètre fonctionnel et de sa version.
- Approbation du devis par l'administrateur avant communication.
- Accord explicite avant dépense, abonnement tiers ou intégration payante.
- Validation des contenus ou données réels importés.
- Approbation des changements hors périmètre.
- Recette métier avant livraison.
- Autorisation distincte avant mise en production.
- Autorisation spécifique avant suspension d'un service ou action ayant un impact client.

## 4. Traçabilité

Pour chaque validation : identifiant du projet, objet et version, décision, auteur, rôle, date, commentaire et pièces justificatives éventuelles. Les validations doivent être révocables uniquement par un processus explicite qui conserve l'historique.

## 5. Gouvernance des domaines

Chaque domaine doit avoir :
- un responsable fonctionnel ;
- un catalogue de processus et modules ;
- un glossaire métier ;
- des questions de diagnostic ;
- des règles de sécurité et points réglementaires à vérifier ;
- des cas de test de référence ;
- une date et un numéro de version ;
- une procédure de proposition de mise à jour.

Les experts métier et clients pilotes doivent relire les règles. L'IA ne peut pas être seule source d'une règle réglementaire.

## 6. Gestion des incidents et litiges

Classer les événements : incident technique, erreur de données, défaut métier, problème d'accès, indisponibilité d'intégration, demande d'évolution, contestation de facture. Enregistrer l'impact, la priorité, le responsable, les actions, les communications et la résolution. Ne pas effacer les traces d'une opération contestée.

## 7. Contrôle financier et commercial

Le modèle commercial envisagé est mixte :
- frais de conception et réalisation sur devis ;
- abonnement d'utilisation de la plateforme MerKora ;
- hébergement géré en option ;
- maintenance selon le besoin et le contrat ;
- évolutions et développements supplémentaires facturés séparément.

Les prix sont exprimés en FCFA dans le contexte initial, mais la devise doit rester configurable. Les règles de prix, limites d'offres et conditions de suspension doivent être définies et approuvées par l'administrateur. Pour les impayés, la piste retenue est un délai recommandé de 15 jours, puis mode limité éventuel et décision manuelle avant suspension ; aucune suppression immédiate des données. Les droits sur l'application livrée dépendent du contrat.
