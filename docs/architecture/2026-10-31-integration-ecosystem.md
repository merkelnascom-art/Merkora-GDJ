# MerKora — Écosystème d'intégrations et connexions

Date : 31 octobre 2026
Statut : conception approuvée pour une première implémentation sans connexion réelle ni secret

## 1. Décision produit

MerKora doit pouvoir se connecter à des applications externes pour accomplir des tâches précises. Une connexion n'est pas simplement un logo affiché : elle doit avoir un propriétaire, une méthode d'autorisation, des permissions limitées, un état vérifiable, un mécanisme de révocation et une trace d'utilisation.

On ne branche pas toutes les applications en même temps. On construit une couche d'intégration commune, puis on active chaque connecteur après vérification de son API, de ses conditions d'utilisation, de ses coûts et des autorisations nécessaires.

## 2. Les familles d'applications

### A. Fondations de MerKora
| Service | Rôle dans MerKora | Situation connue | Décision |
| --- | --- | --- | --- |
| GitHub | Code source, branches, PR et historique des changements | Dépôt MerKora existant et connecté à l'environnement de développement | Garder comme source de vérité du code |
| Vercel | Hébergement, previews, déploiements et variables d'environnement | Projet Vercel existant | Conserver le déploiement contrôlé par branche |
| Supabase | Authentification, données projet, approbations et suivi usine | Projet Supabase existant avec RLS | Conserver les données et politiques existantes ; aucune réinitialisation |

Ces services sont les fondations techniques. Leur présence dans l'environnement de développement ne signifie pas que chaque client MerKora pourra connecter son propre compte.

### B. Fournisseurs d'intelligence artificielle
| Fournisseur | Rôle envisagé | Méthode à étudier |
| --- | --- | --- |
| OpenAI | Analyse, raisonnement, synthèse et assistance | Vercel AI Gateway ou connexion fournisseur contrôlée |
| Anthropic Claude | Critique, revue et seconde opinion | Vercel AI Gateway ou connexion fournisseur contrôlée |
| Google Gemini et autres modèles | Vision, génération multimodale ou comparaison | Via un routeur commun après validation des modèles et coûts |

Le moteur multi-IA doit rester indépendant d'un fournisseur. Les modèles sont choisis selon la tâche, la qualité, les capacités, la confidentialité, le coût et le budget autorisé.

### C. Conception et fabrication visuelle
| Application | Rôle envisagé | Limite actuelle |
| --- | --- | --- |
| Figma | Maquettes, composants et transfert de conception | Vérifier les scopes OAuth et les fonctions API nécessaires |
| Runway | Vidéo et contenus visuels | Vérifier API, droits et tarification avant toute automatisation |
| HeyGen | Présentateurs et narration vidéo | Vérifier API, consentement et tarification |
| CapCut | Montage final | À traiter comme outil externe/manual tant qu'une intégration officielle adaptée n'est pas confirmée |

### D. Outil de construction initial
Codunk a servi à créer une première version et est synchronisé avec GitHub selon la configuration de l'utilisateur. Il reste un outil de construction externe, pas une dépendance d'exécution de MerKora. Ne pas supposer l'existence d'une API publique ou automatiser son interface sans autorisation écrite et documentation officielle.

## 3. Architecture commune d'un connecteur

Chaque connecteur doit déclarer :
- un identifiant stable et un nom d'affichage ;
- une catégorie et une description de ses capacités ;
- une méthode d'authentification (OAuth, clé API, webhook signé, lien externe ou aucune connexion) ;
- les permissions minimales demandées ;
- les actions autorisées et leurs limites ;
- les événements/webhooks acceptés, le cas échéant ;
- son état (non configuré, prêt à connecter, en attente d'autorisation, connecté, expiré, erreur, révoqué) ;
- les contrôles de santé et les dates de dernière vérification ;
- la méthode de révocation et de suppression des identifiants.

Interface conceptuelle :

```ts
type IntegrationStatus =
  | "not_configured"
  | "ready_to_connect"
  | "pending_authorization"
  | "connected"
  | "expired"
  | "error"
  | "revoked";

type IntegrationCapability = {
  id: string;
  label: string;
  description: string;
  requiresUserApproval: boolean;
};

type IntegrationDefinition = {
  id: string;
  name: string;
  category: "infrastructure" | "ai" | "design" | "media" | "communication";
  authMethod: "oauth" | "api_key" | "signed_webhook" | "external_link" | "none";
  capabilities: IntegrationCapability[];
};
```

Ce contrat est une proposition de conception ; il ne prétend pas que les connecteurs sont déjà opérationnels.

## 4. Sécurité obligatoire

1. Les secrets et jetons OAuth ne sont jamais placés dans le navigateur, le dépôt Git, les journaux ou les messages de conversation.
2. Les secrets sont chiffrés au repos dans un stockage serveur adapté ; les clés de chiffrement sont séparées des données.
3. Chaque client ne peut voir et utiliser que ses propres connexions. Les règles RLS et l'identité du propriétaire doivent être vérifiées côté serveur.
4. Les scopes OAuth sont minimaux et présentés à l'utilisateur avant autorisation.
5. Les actions qui publient, dépensent, suppriment, déploient, envoient un message ou modifient des données demandent une approbation explicite, sauf délégation distincte et documentée.
6. Les webhooks vérifient la signature, l'horodatage et la protection contre les rejeux.
7. Chaque action conserve une trace d'audit sans enregistrer les secrets ni les contenus sensibles inutiles.
8. Une connexion peut être testée, désactivée et révoquée par son propriétaire ou l'administrateur autorisé.
9. Les budgets et quotas sont appliqués par utilisateur, projet, fournisseur et tâche lorsque le service le permet.
10. Aucun connecteur n'est activé par défaut au seul motif qu'il est listé dans l'interface.

## 5. Expérience attendue dans MerKora

Espace Administration > Intégrations :
- catalogue par catégorie ;
- explication en langage simple de ce que chaque connexion permet ;
- permissions demandées et éventuels frais externes ;
- bouton de connexion uniquement quand le flux officiel est prêt ;
- état réel de la connexion, dernier contrôle et erreurs compréhensibles ;
- test de connexion non destructif ;
- réglage des actions autorisées et des budgets ;
- déconnexion et révocation.

Espace Client :
- afficher uniquement les connexions nécessaires à son projet ;
- expliquer pourquoi une connexion est demandée ;
- demander l'autorisation avant chaque famille d'actions sensibles ;
- ne jamais demander au client de coller un mot de passe ou une clé secrète dans le chat MerKora.

## 6. Ordre de réalisation recommandé

### Étape 1 — Catalogue sans identifiants
Construire le registre typé des intégrations, les catégories, les capacités, les états et les tests. Aucune API externe, aucun secret, aucune dépense.

### Étape 2 — Écran d'administration
Afficher les intégrations disponibles, leur état réel (au départ non configuré), les explications et les limites. Ne pas afficher un faux statut « connecté ».

### Étape 3 — Première connexion d'infrastructure
Choisir une seule intégration avec un besoin concret, une API officielle documentée et une autorisation explicite. Tester sur un environnement de prévisualisation.

### Étape 4 — Passerelle multi-IA
Brancher le moteur d'orchestration à une passerelle de modèles. Ajouter budgets, limites, journalisation et arrêt d'urgence avant toute activation réelle. Commencer par un seul fournisseur, puis ajouter Claude et les autres après validation.

### Étape 5 — Outils visuels et spécialisés
Ajouter Figma, puis les services vidéo ou médias dont les API et conditions permettent l'automatisation. Les outils sans API appropriée restent accessibles comme liens ou étapes manuelles.

### Étape 6 — Connexions par client
Isoler les autorisations et identifiants par compte client, ajouter les écrans de consentement, les tests de révocation et les audits.

## 7. Conditions de mise en production

Une intégration n'est « connectée » que si :
- son flux d'autorisation réel a été exécuté ;
- le serveur a vérifié l'identité et les permissions ;
- un appel de test non destructif a réussi ;
- les erreurs d'expiration, de refus, de quota et de révocation sont gérées ;
- les secrets ne sont jamais exposés au client ;
- les tests et contrôles de sécurité passent ;
- le propriétaire a approuvé les actions et les coûts éventuels.

## 8. Hors périmètre de cette étape

- Aucun OAuth ni API key réelle ajoutée.
- Aucun achat, abonnement, appel payant ou dépense.
- Aucune migration, suppression ou modification de données Supabase.
- Aucun changement de production ni fusion dans main.
- Aucune automatisation de Codunk.
- Aucun statut de connexion fictif.
