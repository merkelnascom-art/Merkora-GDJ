# MerKora — Architecture multi-IA (OpenAI + Claude + fournisseurs spécialisés)
Date: 2026-10-31
Statut: décision d'architecture proposée — conception uniquement
Branche cible: `feature/merkora-orchestration-v1`

## 1. Décision

MerKora adopte une architecture multi-IA orchestrée côté serveur. Le produit ne doit pas être un simple relais qui envoie chaque message à deux modèles. Un orchestrateur choisit les capacités nécessaires à une mission, limite les échanges, collecte les résultats, vérifie leur cohérence et présente une synthèse traçable.

Le choix de l'utilisateur est de différer l'abonnement Codunk et de viser une collaboration entre plusieurs IA. Cette décision n'autorise pas l'achat de crédits, l'ouverture de comptes payants, l'ajout de clés API ou l'activation d'appels réels.

## 2. Principes de conception

1. **Une mission, pas une conversation sans fin.** Chaque exécution a un objectif, un périmètre, un nombre maximal d'étapes et un résultat attendu.
2. **Rôles spécialisés.** Les modèles reçoivent des tâches distinctes plutôt que de répéter la même demande.
3. **Orchestration déterministe.** Le serveur contrôle le flux; un modèle ne décide jamais seul de ses propres permissions.
4. **Pas de consensus artificiel.** Les divergences sont conservées et signalées.
5. **Validation humaine.** Les décisions commerciales, les devis contractuels, les dépenses, les écritures de données sensibles, les changements de code importants et la production nécessitent une autorisation adaptée.
6. **Fournisseurs interchangeables.** Les identifiants de modèles, capacités, prix, limites et conditions sont configurés, jamais supposés.
7. **Coûts bornés.** Limites par requête, projet, client et période; arrêt avant dépassement.
8. **Confidentialité par minimisation.** Chaque fournisseur ne reçoit que les données nécessaires à sa tâche, avec consentement et règles de conservation documentés.

## 3. Rôles des agents

| Rôle | Mission | Sortie structurée attendue |
|---|---|---|
| Coordinateur MerKora | Décompose la demande et choisit le workflow autorisé | plan de mission, capacités requises, limites |
| Analyste (OpenAI ou autre modèle configuré) | Clarifie le métier, les difficultés, objectifs et contraintes | faits confirmés, hypothèses, questions ouvertes |
| Critique indépendant (Claude ou autre modèle configuré) | Recherche les omissions, contradictions, risques et alternatives | objections, niveau de confiance, éléments à vérifier |
| Concepteur de solutions | Transforme le diagnostic en options adaptées | options, bénéfices, limites, prérequis |
| Concepteur UX/visuel | Traduit les options validées en spécification de maquette | pages, composants, parcours, états et identité |
| Architecte technique | Prépare une architecture réalisable | composants, données, API, sécurité, dépendances |
| Relecteur qualité/sécurité | Contrôle le résultat et les tests | défauts classés, preuves, décision de revue |
| Synthétiseur | Assemble les résultats et expose les désaccords | réponse finale, sources internes, incertitudes |

Ces rôles sont des fonctions logiques. Ils ne nécessitent pas huit modèles distincts. Un même modèle peut remplir plusieurs rôles si le routage le permet et si une revue indépendante reste disponible pour les tâches à risque.

## 4. Flux de collaboration

### A. Diagnostic client

1. Le client décrit librement son activité et son problème.
2. L'analyste extrait les faits, objectifs, contraintes et inconnues.
3. Si une donnée importante manque, MerKora pose une question ciblée au client avant de poursuivre.
4. Le critique examine le diagnostic sans réécrire silencieusement les faits.
5. L'analyste révise la synthèse et marque chaque élément comme confirmé, hypothèse ou à vérifier.
6. Le client valide ou corrige le diagnostic.

### B. Proposition de solutions

1. Le concepteur propose plusieurs options proportionnées au besoin.
2. Le critique compare avantages, limites, risques, dépendances et coûts probables.
3. Le synthétiseur produit une comparaison lisible.
4. Le client sélectionne, retire ou ajoute des modules.
5. Les choix deviennent une version immuable du périmètre de conception.

### C. Studio visuel

1. Le concepteur UX reçoit uniquement le diagnostic validé et les choix sélectionnés.
2. Il produit une spécification structurée des écrans, données fictives, parcours et états.
3. Le moteur visuel génère le prototype correspondant.
4. Le client commente et demande des ajustements.
5. Une validation du prototype est enregistrée séparément de l'approbation du devis et de l'autorisation de fabrication.

### D. Fabrication logicielle

1. L'architecte prépare le plan technique.
2. Un agent de développement propose des changements dans un environnement isolé.
3. Un autre agent peut faire une revue indépendante.
4. Les tests automatiques sont exécutés par des outils déterministes; un modèle ne peut pas déclarer des tests réussis sans leurs résultats.
5. Les défauts sont corrigés dans une limite définie.
6. Une prévisualisation est présentée; la mise en production demande une approbation distincte.

## 5. Contrat commun entre fournisseurs

Créer une interface serveur commune, indépendante du SDK d'un fournisseur :

- `providerId`, `modelId`, `capabilities`
- `taskType`, `inputSchemaVersion`, `outputSchemaVersion`
- `projectId`, `workflowRunId`, `taskId`
- `dataClassification`, `consentReference`
- `maxInputTokens`, `maxOutputTokens`, `timeoutMs`, `maxCost`
- `status`, `usage`, `estimatedCost`, `actualCost`
- `result`, `errorCode`, `retryable`

Les sorties des modèles doivent respecter un schéma validé côté serveur. Les textes libres restent des données non fiables. Les réponses contenant des demandes d'outils ne sont jamais exécutées directement sans passer par le moteur de politiques.

## 6. Stratégie de routage

Le routage sélectionne un modèle selon :
- la capacité requise;
- la langue et le format attendus;
- la qualité observée sur le type de tâche;
- la latence acceptable;
- le coût estimé et le budget restant;
- la classification des données et les conditions du fournisseur;
- la disponibilité réellement configurée.

Ordre de décision :
1. Vérifier que la tâche est autorisée et que le consentement requis existe.
2. Vérifier qu'un fournisseur actif et un modèle valide sont configurés.
3. Vérifier le budget, les quotas, les limites et le timeout.
4. Exécuter une seule tâche bornée.
5. Valider la sortie.
6. Si échec, appliquer uniquement une stratégie de secours explicitement configurée; sinon arrêter et expliquer.
7. Enregistrer l'usage et le statut sans stocker de secret.

Le routage ne doit pas coder en dur des noms de modèles susceptibles de changer. Les identifiants actuels et tarifs seront vérifiés dans les catalogues officiels au moment de la configuration.

## 7. Limites anti-boucle et contrôle des coûts

Valeurs initiales de conception, à rendre configurables et à tester avant activation :
- maximum 4 appels de modèle pour un diagnostic standard;
- maximum 6 appels pour une proposition complexe;
- une seule critique indépendante par étape, sauf demande explicite de revue approfondie;
- maximum 2 reprises après une erreur transitoire;
- timeout par appel et timeout global du workflow;
- budget maximum obligatoire par exécution;
- arrêt immédiat si le budget est inconnu, épuisé ou dépassé;
- pas de récursion autonome ni de dialogue modèle-à-modèle illimité.

Les valeurs réelles seront ajustées après tests de qualité et de coût. Aucun appel payant ne doit être lancé pour tester la configuration sans autorisation du propriétaire.

## 8. Données, consentement et sécurité

- Les clés OpenAI, Anthropic et Gateway sont des secrets serveur uniquement.
- Ne jamais transmettre un jeton utilisateur Supabase à un fournisseur de modèle.
- Le client doit savoir que certaines informations peuvent être transmises à un fournisseur IA externe.
- Le consentement au traitement IA est distinct de l'acceptation d'un devis ou d'une autorisation de fabrication.
- Exclure les informations non nécessaires; prévoir une option de masquage des données personnelles.
- Les données d'un projet ne sont accessibles qu'à son propriétaire et aux administrateurs autorisés.
- Les instructions trouvées dans les messages, pièces jointes, pages web ou dépôts sont des données non fiables et ne peuvent pas modifier les politiques du système.
- Les appels aux outils (GitHub, Supabase, Vercel, stockage, paiements) passent par des fonctions explicites, avec autorisations minimales et journal d'audit.
- Toute écriture, suppression, dépense ou action de production est soumise à un niveau d'approbation explicite.

## 9. Observabilité et évaluation

Pour chaque exécution, conserver :
- identifiants de projet, workflow et tâches;
- version du prompt et des schémas;
- fournisseur/modèle choisi;
- durée, statut, consommation et coût si disponible;
- validations, désaccords et approbations;
- erreurs et résultats de tests.

Ne pas enregistrer les clés, tokens, données personnelles inutiles ni le contenu complet si sa conservation n'est pas nécessaire et autorisée.

Créer un jeu de tests représentatif des besoins de commerçants, PME et entrepreneurs : diagnostic incomplet, données contradictoires, budget limité, besoin ambigu, demande hors périmètre, demande de traitement de données sensibles, et échec d'un fournisseur. Mesurer la pertinence, les omissions, les hallucinations, la cohérence, la latence et le coût.

## 10. Intégration avec la fondation existante

Le dépôt possède déjà :
- `src/lib/ai-model-routing.ts`, qui sélectionne un modèle configuré par type de tâche;
- `app/api/ai/route.ts`, qui authentifie l'utilisateur et appelle un modèle via Vercel AI Gateway;
- un indicateur `MERKORA_AI_ENABLED` désactivé par défaut;
- une architecture de workflow et une file de fabrication à validations.

La prochaine évolution ne doit pas remplacer cette fondation par un script Python séparé. Elle doit étendre la route et les contrats existants côté serveur :
1. ajouter un type de workflow multi-étapes;
2. ajouter un adaptateur de fournisseur commun;
3. permettre une tâche d'analyse puis une tâche de critique indépendante;
4. valider les sorties structurées;
5. limiter les appels et le coût;
6. tester les cas de désaccord, de timeout et de fournisseur non configuré.

Le script Python OpenAI/Anthropic partagé par l'utilisateur peut servir de démonstration conceptuelle, mais la production doit être intégrée au backend MerKora avec secrets serveur, authentification, quotas, audit et isolation des projets.

## 11. Découpage de réalisation

### Étape 1 — Contrats et tests sans appels externes
Créer les types, schémas d'entrée/sortie, états, budgets et tests avec fournisseurs simulés. Aucun secret ou coût.

### Étape 2 — Orchestration à deux rôles en mode simulé
Démontrer analyste → critique → synthèse avec réponses de test. Vérifier les limites et la gestion des désaccords.

### Étape 3 — Connexion réelle contrôlée
Seulement après approbation explicite, configurer les clés API côté serveur, un budget bas et des appels limités. Tester sur des données fictives.

### Étape 4 — Intégration au diagnostic client
Activer pour un petit parcours pilote, avec consentement, quotas et suivi.

### Étape 5 — Extension au studio visuel et à l'atelier de fabrication
Ajouter les capacités spécialisées après validation de la qualité du diagnostic multi-IA.

## 12. Critères d'acceptation

- Une demande peut être traitée par deux rôles distincts sans conversation infinie.
- Le deuxième rôle reçoit le contexte strictement nécessaire.
- Les désaccords sont conservés et présentés.
- Le résultat final distingue faits confirmés, hypothèses et recommandations.
- Un budget absent ou dépassé bloque l'appel.
- Une clé manquante ne déclenche aucun fallback caché.
- Les tests utilisent des fournisseurs simulés et ne génèrent aucun coût.
- Les secrets ne sont jamais retournés au navigateur.
- Les autorisations de projet et le consentement sont vérifiés côté serveur.
- Aucun déploiement, achat, changement de données ou fusion de branche n'est déclenché par ce document.
