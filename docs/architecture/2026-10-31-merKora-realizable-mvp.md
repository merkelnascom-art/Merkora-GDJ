# MerKora GDJ — Architecture de la plateforme de conception et de réalisation numérique

Date: 2026-11-01
Branch: `feature/merkora-production-security-hardening`
Status: décision de conception, non déployée

## Décision produit

MerKora GDJ est une **plateforme généraliste de découverte, de conception et de réalisation de solutions numériques**. Elle ne se limite ni à la gestion d'entreprise, ni à une liste prédéfinie d'applications.

Le client commence par décrire librement ce qu'il veut, ce qu'il vit, ce qui ne fonctionne pas, pourquoi il cherche une solution et le résultat qu'il imagine. Il n'a pas à connaître le vocabulaire technique, à choisir une catégorie dans un menu fermé, ni à savoir à l'avance si son besoin correspond à un site, une application, une automatisation ou un autre service numérique.

MerKora analyse cette demande et **déduit la nature du besoin**. Elle peut ensuite poser des questions ciblées, proposer plusieurs pistes, expliquer leurs avantages et limites, laisser le client choisir et affiner, puis produire une maquette correspondant réellement aux choix exprimés. La proposition commerciale et la réalisation viennent après cette découverte et les validations nécessaires.

Le principe fondamental est donc:

> La catégorie est découverte à partir du besoin exprimé par le client; elle ne lui est pas imposée au départ.

Les besoins peuvent concerner, entre autres, des applications de gestion, des plateformes scolaires, du commerce, des réservations, des sites web, des espaces personnels, des outils créatifs, des automatisations, des intégrations ou des services numériques spécifiques. Cette liste donne des exemples et ne constitue pas une limite du produit.

## Deux périmètres à ne pas confondre

### 1. La découverte et l'orchestration sont généralistes dès la conception

Le parcours d'accueil, l'analyse du problème, les questions de clarification, la reformulation, les propositions de solutions, la comparaison des options, la spécification et le devis doivent pouvoir traiter une demande ouverte, même si elle ne correspond pas encore à un module existant.

Si le besoin est nouveau ou hors des capacités de réalisation disponibles, MerKora doit le dire clairement, conserver le besoin dans la spécification et proposer une étude ou une réalisation spécialisée. Elle ne doit jamais forcer artificiellement le besoin dans une catégorie de gestion pour faire croire qu'il est pris en charge.

### 2. Le premier moteur de construction sera volontairement limité

La capacité à comprendre les demandes est plus large que la capacité initiale à générer automatiquement tous les produits possibles. Pour prouver le fonctionnement sans promettre l'impossible, le premier exécuteur pourra commencer par un petit ensemble de modèles et composants web répétables, testés et documentés.

Le premier catalogue de construction pourra notamment inclure:
- comptes, authentification et rôles;
- tableaux de bord et interfaces administratives;
- gestion de dossiers, clients et équipes;
- formulaires, tableaux, rapports et exports;
- premiers modules de ventes, stocks, caisse ou présence lorsque le projet le demande.

Ce catalogue est un **point de départ technique extensible**, pas le catalogue obligatoire des besoins du client. Les sites vitrines, boutiques en ligne, plateformes éducatives, réservations, outils personnels, automatisations, applications mobiles natives, biométrie, paiements réglementés et intégrations complexes doivent être identifiés comme des types de solutions distincts. Tant qu'un générateur ou un processus fiable n'existe pas pour eux, ils sont marqués « étude spécifique / réalisation non automatisée », avec leurs limites exposées.

## Expérience client cible

1. **Expression libre** — le client décrit son idée, sa situation, son problème, ses utilisateurs, ses contraintes et le résultat souhaité en texte libre; il peut joindre des éléments utiles si la fonction est disponible.
2. **Compréhension** — MerKora reformule ce qu'elle a compris, distingue le problème de la solution imaginée et signale les ambiguïtés sans enfermer la demande dans une catégorie.
3. **Clarification** — elle pose uniquement les questions utiles pour comprendre le contexte, les utilisateurs, les appareils, les contraintes, le budget indicatif et les critères de réussite.
4. **Diagnostic et pistes** — elle identifie le ou les types de solutions plausibles, explique pourquoi, présente les alternatives et leurs limites.
5. **Choix du client** — le client sélectionne, combine, refuse ou modifie les propositions; MerKora met à jour la compréhension et la portée du projet.
6. **Spécification** — le système produit un document structuré et versionné: problème, objectifs, utilisateurs, parcours, fonctions, règles, données, contraintes, critères d'acceptation, hypothèses et exclusions.
7. **Studio visuel** — la maquette reflète les choix et options réellement validés par le client. Elle doit montrer les écrans et interactions prévus; une image illustrative ne doit jamais être présentée comme une application fonctionnelle.
8. **Estimation** — une grille de coûts et d'efforts administrable calcule une fourchette selon le type de solution, la complexité, les intégrations et le niveau de service. L'administrateur valide le devis avant publication.
9. **Accords** — le client valide la portée, le devis et les consentements nécessaires; l'administrateur autorise le lancement. Aucune action payante, sensible ou de production n'est déclenchée implicitement.
10. **Réalisation** — MerKora choisit un parcours de réalisation compatible avec la solution: génération automatisée si elle est prise en charge, assemblage de composants, intégration ou étude spécialisée.
11. **Vérification et preview** — les critères convenus sont testés; les résultats, limites et éventuels écarts sont présentés sur une prévisualisation protégée.
12. **Livraison** — après validation, le livrable, les accès, la documentation et le transfert sont préparés. Le déploiement de production reste une action distincte et explicitement autorisée.

## Architecture technique

Conserver le socle Next.js + TypeScript + Supabase + GitHub déjà présent. Construire d'abord un monolithe modulaire; ne pas introduire des microservices ou une infrastructure payante obligatoire sans preuve de nécessité.

- **Interface Next.js**: espace client, espace administrateur, expression libre, clarification, choix, studio visuel, devis et suivi.
- **Couche de découverte**: analyse du texte libre, reformulation, questions, classification inférée et détection des demandes hors capacité.
- **Modèle de demande indépendant du catalogue**: stocker la demande originale et ses versions; ne jamais perdre le texte du client au profit d'une étiquette.
- **Orchestrateur de solutions**: comparer les pistes, capacités disponibles, contraintes, coûts et autorisations; sélectionner un processus de réalisation approprié.
- **Catalogue de capacités**: décrire les types de livrables, modèles, modules, intégrations, dépendances, limites et maturité. Il doit être extensible et versionné.
- **Spécification et validations**: conserver les versions et les décisions du client et de l'administrateur.
- **Studio visuel**: composer des maquettes à partir de la spécification et des composants réels disponibles; relier chaque écran aux exigences correspondantes.
- **Supabase Auth et PostgreSQL**: identité, sessions, projets, demandes, spécifications, options, consentements, validations, tâches, événements et résultats.
- **RLS**: isolation des données par propriétaire; opérations administratives et transitions sensibles contrôlées côté serveur et en base.
- **GitHub**: dépôts modèles, versions et historique des livrables; aucun secret client dans le navigateur.
- **Exécution**: environnement isolé et jetable pour générer, installer, tester et construire du code. Aucun code généré ne s'exécute dans le processus Next.js de production.
- **IA**: commencer avec un seul fournisseur/modèle derrière une interface interne; garder les règles déterministes pour les validations et calculs. Ajouter d'autres fournisseurs seulement après fiabilisation et mesure des coûts.
- **Déploiement**: étape séparée, soumise à autorisation explicite; aucune auto-publication déclenchée par une réponse IA.

## Modèle de données conceptuel

Séparer les concepts suivants afin que le système ne confonde pas un besoin et une capacité technique:

- `client_request`: texte original, contexte, pièces jointes référencées et historique des échanges;
- `request_understanding`: reformulations, questions ouvertes, réponses et niveau de confiance;
- `solution_candidates`: pistes proposées, raisons, avantages, limites et choix du client;
- `capability_catalog`: types de livrables et capacités réellement disponibles, avec statut expérimental, disponible ou non pris en charge;
- `project_specifications`: spécifications versionnées et critères d'acceptation;
- `visual_prototypes`: maquettes liées à une version de spécification;
- `quotes`: estimations versionnées, calculs, validation administrative et acceptation client;
- `approvals_and_consents`: consentements explicites et autorisations distinctes;
- `factory_jobs_and_tasks`: tâches de réalisation bornées, dépendances et résultats;
- `deliverables`: previews, versions livrables, documentation et historique de livraison.

Les noms ci-dessus décrivent les responsabilités logiques; ils ne signifient pas que toutes ces tables existent déjà. Toute évolution de schéma doit être conçue, testée et approuvée séparément.

## Règles de sécurité non négociables

- Chaque demande, projet et artefact est associé à un propriétaire et à un identifiant stable.
- Le navigateur ne décide jamais du rôle, du statut d'approbation, du prix confirmé, du consentement ou de l'état d'exécution.
- Les changements de statut sensibles passent par des routes serveur qui vérifient identité, rôle et transition autorisée.
- RLS demeure activé; aucune politique large ne doit être ajoutée pour contourner un problème applicatif.
- Les secrets fournisseurs restent côté serveur ou dans un coffre dédié; jamais dans le code généré, les journaux ou les réponses API.
- Les tâches sont idempotentes, bornées, annulables et journalisées.
- L'exécuteur revalide les autorisations et consentements au moment de prendre une tâche.
- Le code généré est non fiable et s'exécute dans un bac à sable sans accès aux secrets de production.
- Les migrations sont additives, relues, testées hors production et sauvegardées avant application.
- Aucun reset Supabase, aucune modification de données de production et aucun déploiement sans autorisation explicite.

## Plan de livraison avec critères de sortie

### Jalon 0 — sécuriser et stabiliser l'existant
- Vérifier rôles, sessions, RLS, routes de projet et synchronisation.
- Corriger les écarts sans modifier les données ni les comportements commerciaux validés.
- Ajouter des tests de propriété, autorisation, validation et synchronisation.
- Sortie: typecheck, tests et build passent; données existantes intactes.

### Jalon 1 — accueil réellement ouvert et compréhension du besoin
- Remplacer toute catégorie obligatoire initiale par une description libre.
- Conserver la demande originale; inférer une ou plusieurs catégories internes sans les imposer.
- Poser des questions pertinentes et permettre au client de corriger la reformulation.
- Tester des demandes volontairement différentes: application de gestion, site vitrine, plateforme scolaire, boutique en ligne, automatisation et besoin personnel/créatif.
- Sortie: aucune demande n'est rejetée simplement parce qu'elle ne correspond pas à une catégorie préétablie; les limites de capacité sont explicites.

### Jalon 2 — pistes de solution et catalogue extensible
- Définir un format commun de capacités et de livrables.
- Distinguer « compris », « réalisable automatiquement », « réalisable avec intégration » et « étude spécialisée ».
- Présenter des alternatives compréhensibles et permettre au client de choisir.
- Sortie: le système ne confond pas la nature du besoin avec les modules actuellement générables.

### Jalon 3 — spécification et studio visuel cohérents
- Générer une spécification versionnée depuis les choix validés.
- Composer une maquette qui correspond aux écrans, fonctions et options de cette spécification.
- Montrer les éléments non disponibles ou encore conceptuels.
- Sortie: chaque élément important de la maquette peut être relié à un besoin ou à un choix du client.

### Jalon 4 — devis fiable et autorisations
- Grille d'efforts et de coûts configurable par l'administrateur selon le type de solution.
- Calcul déterministe; l'IA peut expliquer, mais ne fixe pas seule le prix.
- Historique des versions, consentement et acceptation client, validation administrative.
- Sortie: même entrée et même grille donnent le même montant; aucun devis n'est publié sans validation admin.

### Jalon 5 — premier moteur de réalisation borné
- Choisir un seul type de livrable web répétable pour la première preuve de construction automatique.
- Générer à partir d'un modèle versionné dans un environnement isolé.
- Exécuter tests et build; enregistrer un rapport vérifiable.
- Sortie: un projet synthétique passe de spécification approuvée à preview testée sans exécuter de code dans le serveur de production.

### Jalon 6 — élargissement progressif et livraison
- Ajouter d'autres types de livrables uniquement après définition de leurs modèles, tests, limites et coûts.
- Prévoir un chemin d'étude ou d'intervention spécialisée pour les demandes non automatisées.
- Sortie: un projet pilote est livré après autorisations explicites; les capacités annoncées correspondent aux capacités réellement testées.

## Maîtrise des coûts

- Aucun nouveau service payant obligatoire pour les premiers jalons de découverte, spécification, maquette et devis.
- L'analyse déterministe reste disponible sans appel IA lorsque possible.
- Un seul fournisseur IA au départ, appels déclenchés après consentement, avec limites de tokens et de budget.
- Les coûts d'exécution isolée et d'hébergement sont mesurés avant d'ouvrir la génération aux clients.
- Pas de worker Render payant obligatoire au démarrage; choisir un exécuteur seulement après un prototype démontrant le besoin.
- Toute nouvelle dépense récurrente doit être présentée avec son prix et validée avant activation.

## Limites assumées

MerKora doit accepter et comprendre des demandes très variées, mais cela ne signifie pas qu'elle sait déjà construire automatiquement tous les logiciels, sites, automatisations ou systèmes spécialisés. La plateforme doit être honnête sur la différence entre comprendre une demande, savoir la concevoir et être capable de la réaliser avec les outils actuellement disponibles.

Le succès initial se mesure par un parcours vérifiable: demande libre, compréhension corrigible, pistes pertinentes, choix du client, spécification, maquette fidèle, devis validé, réalisation testée et livraison contrôlée.

## État de ce document

Ce document corrige explicitement toute interprétation qui ferait de MerKora un simple générateur d'applications de gestion. Il fixe une direction généraliste pour l'expérience et l'orchestration, avec un premier moteur de construction volontairement limité et extensible.

Il ne signifie pas que ces jalons sont déjà livrés. Aucune migration Supabase, aucun déploiement et aucune dépense ne sont déclenchés par cette décision.
