# MerKora GDJ — Architecture du premier produit réellement livrable

Date: 2026-10-31
Branch: `feature/merkora-production-security-hardening`
Status: décision de conception, non déployée

## Décision produit

MerKora commence comme un **atelier logiciel assisté**, pas comme une usine universelle autonome.

Le premier résultat commercial visé est une application web de gestion construite à partir d'un catalogue de modules éprouvés. Le client décrit son activité et ses difficultés; MerKora transforme cette demande en spécification, propose des modules, compose une maquette, chiffre une estimation, puis prépare une réalisation. Les décisions engageant le client, l'argent, les données, les dépôts ou la production restent soumises à validation humaine.

Le premier périmètre de réalisations est volontairement limité:
- gestion des utilisateurs et des rôles;
- tableaux de bord;
- gestion du personnel et présence;
- clients et dossiers;
- ventes, caisse et stocks;
- formulaires, rapports et exports simples.

Les paiements en ligne, biométrie, comptabilité réglementaire, applications mobiles natives, intégrations bancaires et systèmes critiques ne font pas partie du premier générateur. Ils pourront être traités comme intégrations spécifiques après étude.

## Principe d'architecture

Conserver le socle Next.js + TypeScript + Supabase + GitHub déjà présent. Ne pas introduire de microservices, de Kubernetes, ni de worker payant obligatoire pour le premier jalon.

Architecture: **monolithe modulaire + file de tâches persistante + exécuteur contrôlé**.

- Next.js: interface client/admin et API serveur.
- Supabase Auth: identité et sessions.
- PostgreSQL/Supabase: projets, spécifications versionnées, validations, tâches, événements et résultats.
- RLS: isolation des données par propriétaire; opérations administratives contrôlées côté serveur et en base.
- GitHub: dépôt modèle et historique des versions générées; aucun secret client dans le navigateur.
- Exécution: environnement isolé et jetable pour installer, générer, tester et construire le code. Aucun code client ne s'exécute dans le processus Next.js de production.
- IA: un seul fournisseur/modèle configuré au début derrière une interface interne. Pas de multi-agent conversationnel ni de multi-fournisseurs tant que le flux simple n'est pas fiable.
- Déploiement: étape séparée, autorisée explicitement; pas d'auto-déploiement depuis une réponse IA.

## Flux fonctionnel

1. **Intake** — recueillir activité, utilisateurs, problème, résultat attendu, budget indicatif, contraintes et appareils.
2. **Clarification** — poser les questions manquantes. Tant que les informations sont insuffisantes, aucune estimation ferme n'est présentée.
3. **Spécification** — produire un document structuré et versionné: objectifs, rôles, écrans, modules, règles métier, données, critères d'acceptation, exclusions et hypothèses.
4. **Sélection des modules** — proposer uniquement les modules du catalogue compatibles avec la spécification. Les éléments hors catalogue deviennent des besoins spécifiques explicitement signalés.
5. **Maquette** — composer une prévisualisation à partir de composants UI réels du catalogue. Une image illustrative ne doit jamais être présentée comme une application fonctionnelle.
6. **Estimation** — calculer une fourchette à partir d'une grille de coûts/efforts administrable, puis soumettre le devis à validation de l'administrateur. Aucun prix final n'est inventé par le modèle.
7. **Autorisation** — recueillir l'accord du client sur la portée, le devis et le traitement IA des données avant tout appel IA impliquant ses données, puis l'accord administrateur sur le démarrage.
8. **Plan de réalisation** — convertir la spécification validée en tâches bornées, dépendances et critères de test.
9. **Construction** — générer le projet à partir d'un modèle versionné et des modules sélectionnés dans un environnement isolé. Chaque tâche dispose d'une limite de temps, de ressources et de tentatives.
10. **Vérification** — exécuter format, lint, typecheck, tests et build. Enregistrer les journaux expurgés et les preuves. Un échec bloque la livraison.
11. **Prévisualisation** — présenter une URL de preview protégée. Le client et l'administrateur valident les critères d'acceptation.
12. **Livraison** — créer une version livrable; déploiement de production et transfert de propriété restent des actions séparées et explicitement autorisées.

## Règles de sécurité non négociables

- Chaque projet et chaque artefact sont associés à un propriétaire et à un identifiant stable.
- Le navigateur ne décide jamais du rôle, du statut d'approbation, du prix confirmé, du consentement ou de l'état d'exécution.
- Les changements de statut sensibles passent par des routes serveur qui vérifient l'identité, le rôle et la transition permise.
- RLS demeure activé; aucune politique large ne doit être ajoutée pour contourner un problème applicatif.
- Les secrets fournisseurs restent dans des variables d'environnement côté serveur ou un coffre dédié; jamais dans le code généré, les journaux ou les réponses API.
- Les tâches sont idempotentes, bornées, annulables et journalisées.
- Le worker revalide les autorisations et consentements au moment de prendre une tâche, pas seulement au moment de la création.
- Le code généré est considéré comme non fiable et s'exécute dans un bac à sable sans accès aux secrets de production.
- Les migrations sont additives, relues, testées sur un environnement non productif et sauvegardées avant toute application.
- Aucun reset Supabase, aucune modification de données de production et aucun déploiement sans autorisation explicite.

## Plan de livraison avec critères de sortie

### Jalon 0 — stabiliser l'existant
- Vérifier les rôles, sessions, RLS, routes de projet et synchronisation.
- Corriger les écarts sans changer le comportement commercial validé.
- Ajouter des tests de propriété, d'autorisation, de validation et de synchronisation.
- Sortie: typecheck, tests et build passent; les données existantes restent intactes.

### Jalon 1 — un dossier devient une spécification exploitable
- Intake et questions de clarification.
- Spécification JSON validée par schéma et versionnée.
- Écran de relecture/édition client.
- Sortie: trois scénarios synthétiques différents produisent des spécifications complètes et cohérentes.

### Jalon 2 — catalogue et maquette réelle
- Catalogue de modules avec versions, dépendances et limites.
- Maquette composée avec les composants du vrai produit.
- Sortie: les modules sélectionnés correspondent visiblement aux exigences et les exclusions sont affichées.

### Jalon 3 — devis fiable
- Grille de coûts configurable par l'administrateur.
- Calcul déterministe; l'IA peut expliquer, mais ne fixe pas le montant.
- Historique des versions et acceptation client.
- Sortie: même entrée et même grille donnent le même montant; aucun devis n'est publié sans validation admin.

### Jalon 4 — première génération bornée
- Un seul modèle d'application web de gestion.
- Génération dans un environnement isolé.
- Tests automatiques et rapport de résultat.
- Sortie: au moins un projet synthétique passe de spécification approuvée à preview testée sans intervention dans le code source de production.

### Jalon 5 — livraison contrôlée
- Preview, retours, corrections, acceptation et procédure de déploiement.
- Sortie: un projet pilote complet est livré après autorisations explicites.

## Maîtrise des coûts

- Aucun nouveau service payant obligatoire pour les jalons 0 à 3.
- L'analyse locale déterministe reste disponible sans appel IA.
- Un seul fournisseur IA, appels déclenchés uniquement après consentement, limites de tokens et budget.
- Les coûts d'exécution isolée et d'hébergement sont mesurés avant d'ouvrir la génération aux clients.
- Pas de Render payant obligatoire au démarrage. Un exécuteur ponctuel ou un worker ne sera choisi qu'après un prototype local/non-production démontrant le besoin.
- Toute dépense récurrente nouvelle doit être présentée avec son prix et validée avant activation.

## Limites assumées du premier produit

MerKora ne promet pas de construire n'importe quel logiciel sans développeur. Elle automatise un périmètre croissant de produits web répétables. Les exigences hors catalogue, les intégrations sensibles, la sécurité avancée et les systèmes critiques peuvent nécessiter une intervention technique spécialisée.

Le succès initial est mesuré par une preuve: une demande réelle transformée en spécification, maquette, devis validé, application construite, tests réussis et livraison contrôlée.

## État de ce document

Ce document fixe une direction de réalisation. Il ne signifie pas que les jalons sont déjà livrés. Aucune migration Supabase, aucun déploiement et aucune dépense ne sont déclenchés par cette décision.
