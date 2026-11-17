# Fondation A — Famille 18 : Numérique et télécommunications

**Identifiant canonique :** `family:digital-technology` — **Version :** 1.0  
**Catalogue :** 90 concepts bilingues ; cinq domaines canoniques réutilisés.

## 1. Périmètre et frontières

Couvre développement logiciel, infrastructures et hébergement, réseaux et télécommunications, cybersécurité, données/IA et services numériques. La famille englobe conception, construction, intégration, déploiement, exploitation, protection, gouvernance et évolution des systèmes.

Elle réutilise la famille et les cinq domaines déjà présents dans la cartographie universelle : logiciel, infrastructure, cybersécurité, données/IA et services numériques. Elle ne crée aucun doublon de famille ou de domaine.

Frontières : les fonctionnalités métier restent dans leur famille d'activité ; le numérique est une capacité transversale. Une application de santé reste rattachée à la Famille 14 pour ses règles métier et à cette famille pour sa réalisation technique. Les systèmes financiers restent soumis aux contraintes de la Famille 10.

## 2. Structure du catalogue

20 sous-domaines, 7 spécialisations, 12 métiers, 12 activités, 8 processus, 10 problèmes, 7 ressources, 7 fonctions numériques et 7 indicateurs. Couverture : ingénierie logicielle, web/mobile, tests, DevOps, cloud, réseaux, systèmes, télécoms, opérations cyber, IAM, sécurité applicative, protection des données, IA, machine learning, gouvernance data, BI, plateformes, automatisation et UX.

## 3. Diagnostic adaptatif — une question par sous-écran

A. Quel produit ou service numérique faut-il créer, reprendre, intégrer, sécuriser ou exploiter ?  
B. Qui sont les utilisateurs, propriétaires, opérateurs, sous-traitants et responsables de données ?  
C. Quel problème concret est observé : lenteur, panne, coût, dette technique, sécurité, qualité, intégration, accès ou adoption ?  
D. Quelle architecture, infrastructure, application, base, API et dépendance existent déjà ?  
E. Quelles contraintes de disponibilité, performance, confidentialité, juridiction, budget, coût cloud, licence et réversibilité s'appliquent ?  
F. Quel niveau de service, résultat métier, indicateur et seuil d'alerte est attendu ?  
G. Quelles opérations sont autorisées, par qui, sur quel périmètre et avec quelle preuve ?

## 4. Parcours opérationnels

### Cycle logiciel
Besoin → architecture → conception → développement → revue de code → tests → sécurité → validation utilisateur → déploiement contrôlé → supervision → maintenance et versionnement.

### Infrastructure et télécoms
Inventaire → capacité → conception réseau/cloud → provisionnement → configuration → sécurité → tests → mise en service → supervision → sauvegarde → continuité → décommissionnement.

### Incident de sécurité
Détection → qualification → confinement autorisé → préservation des preuves → analyse → remédiation → restauration → notification selon obligations → retour d'expérience.

### Données et IA
Finalité → provenance et droits → qualité → gouvernance → préparation → entraînement/évaluation ou analytique → validation → déploiement → surveillance de dérive → revue humaine → retrait/versionnement.

### Service numérique
Parcours utilisateur → exigences → intégrations → tests d'accessibilité et sécurité → mise en service → support → mesure d'adoption → amélioration continue.

## 5. Rôles et écrans

Rôles : ingénieur logiciel, développeur front/back, architecte, DevOps, administrateur systèmes/réseaux, ingénieur télécom, analyste cyber, responsable sécurité, data engineer, data scientist, ingénieur IA, product manager, UX designer.

Écrans : architecture et dépendances ; backlog technique ; dépôts et versions ; pipeline CI/CD ; environnements ; inventaire cloud ; observabilité ; vulnérabilités ; incidents ; identités et accès ; catalogue API ; dictionnaire de données ; modèles IA ; évaluation et monitoring ; coûts et capacité ; support et disponibilité.

## 6. Données et architecture

Application, composant, dépôt, version, dépendance, build, test, déploiement, environnement, serveur, conteneur, réseau, service cloud, abonnement, coût, API, secret, identité, rôle, permission, vulnérabilité, incident, preuve, sauvegarde, restauration, dataset, schéma, provenance, modèle IA, prompt, évaluation, dérive, consentement, journal, SLA, SLO et indicateur.

Les secrets ne sont jamais stockés dans les champs de texte ou journaux. Les environnements de développement, test et production sont séparés. Les identifiants et accès sont gérés via un coffre et des permissions temporaires lorsque possible.

## 7. Intégrations

GitHub, gestion de code et CI/CD, cloud, hébergement, bases de données, observabilité, identité, secrets, scanners de dépendances, systèmes de tickets, télécoms, gestion API, stockage et outils IA. Toute intégration exige scopes minimaux, revue des coûts, propriétaire, logs, politique de données et plan de sortie.

## 8. Règles métier et sécurité

- Les opérations offensives de sécurité exigent une autorisation écrite et un périmètre explicite.
- Les changements production sont tracés, réversibles et validés selon leur criticité.
- Les secrets, clés et données sensibles ne sont pas exposés dans les logs, prompts ou exports.
- Les sauvegardes sont testées par des restaurations, pas seulement déclarées réussies.
- Les API appliquent authentification, autorisation, validation d'entrée, limitation et journalisation.
- Les dépendances, licences et vulnérabilités sont suivies et corrigées selon leur risque.
- Les systèmes IA sont évalués, surveillés et supervisés ; ils ne prennent pas de décision sensible sans validation.
- Les données ont un propriétaire, une finalité, une qualité, une rétention et une provenance documentées.
- Les coûts cloud et télécom sont suivis avec alertes et limites pour éviter les dépenses surprises.

## 9. Prompts professionnels

- **Architecte :** « Décris les composants, flux, dépendances, frontières de confiance, risques, coûts et modes de défaillance ; compare les options et explicite les compromis. »
- **Ingénieur sécurité :** « Analyse le périmètre autorisé, les menaces et contrôles ; ne lance aucune action offensive hors autorisation. »
- **Data engineer :** « Documente sources, schémas, qualité, provenance, accès et transformations ; signale les données non fiables. »
- **Ingénieur IA :** « Évalue performances, biais, robustesse, dérive, explicabilité et supervision ; documente les limites et critères d'arrêt. »

## 10. Limites

Le catalogue est un socle universel extensible. Les normes, lois, licences, exigences de sécurité, télécoms, hébergement et protection des données varient par pays et secteur. Aucune dépense, opération production ou action offensive n'est déclenchée sans autorisation explicite.
