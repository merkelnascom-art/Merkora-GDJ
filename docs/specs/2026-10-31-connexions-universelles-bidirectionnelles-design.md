# MerKora GDJ — Connexions universelles bidirectionnelles

Date : 31 octobre 2026
Statut : conception fonctionnelle proposée, à valider avant implémentation

## 1. Objectif

MerKora doit pouvoir à la fois se connecter à des services externes et être elle-même connectée depuis des applications externes compatibles. Le but n'est pas d'afficher un catalogue de logos, mais de permettre des échanges réels, autorisés, traçables et révocables.

Deux directions sont couvertes :
- **Sortant :** MerKora autorise l'accès à des services tiers (GitHub, Vercel, Supabase, OpenAI, Anthropic, Google, Notion, Figma, etc.) et utilise leurs capacités.
- **Entrant :** des applications externes (ChatGPT, Claude, autres clients MCP/API) peuvent accéder aux fonctions MerKora après authentification et consentement.

## 2. Expérience administrateur

Dans Administration > Centre des connexions, l'administrateur peut :
- parcourir les services par catégorie ;
- ouvrir la fiche d'un service et voir les fonctions, permissions, prérequis et éventuels coûts ;
- lancer le flux officiel OAuth ou saisir une clé API dans un formulaire sécurisé côté serveur ;
- vérifier la connexion avec un appel non destructif ;
- consulter l'état, le compte associé, les permissions, la date du dernier contrôle et les erreurs ;
- modifier les permissions, suspendre ou révoquer une connexion ;
- configurer des limites d'utilisation et budgets avant tout appel payant.

Un service n'est marqué « connecté » qu'après une autorisation valide et un test réussi. Les connexions disponibles au niveau du compte MerKora sont distinctes des connexions propres à chaque client.

## 3. Expérience des applications externes

MerKora expose une interface publique versionnée :
- API HTTPS documentée pour les intégrations logicielles ;
- serveur MCP pour les assistants compatibles, notamment ChatGPT et Claude lorsque leurs environnements permettent ce type de connecteur ;
- OAuth 2.1 / flux d'autorisation adapté à la plateforme cliente ;
- scopes séparés par fonction et par espace de travail ;
- révocation de jetons, expiration et rotation ;
- journal d'audit des appels.

Les outils exposés initialement seront en lecture seule : consulter le profil autorisé, lister les projets accessibles, lire un dossier de projet et consulter l'état des tâches. Les actions d'écriture (créer/modifier projet, lancer une tâche, approuver un devis, déployer, supprimer) seront ajoutées avec des scopes dédiés et confirmation explicite.

La disponibilité effective d'un connecteur ChatGPT/Claude dépend des mécanismes d'applications/connecteurs pris en charge par chaque plateforme et de ses conditions de publication. MerKora ne peut pas forcer une application tierce à accepter un connecteur.

## 4. Architecture logique

1. **Integration Registry** : catalogue des fournisseurs, méthodes d'authentification, capacités, scopes et statut.
2. **Connection Manager** : démarrage OAuth, callback, validation, révocation et renouvellement.
3. **Credential Vault** : secrets chiffrés côté serveur, jamais transmis au navigateur ni inscrits dans les logs.
4. **Provider Adapters** : adaptateurs isolés par service, contrats communs, gestion des quotas et erreurs.
5. **MerKora API** : endpoints versionnés, validation de schéma, authentification, autorisation et limitation de débit.
6. **MerKora MCP Server** : outils exposés aux clients IA compatibles, avec identité et scopes propres à chaque connexion.
7. **Webhook Gateway** : réception d'événements signés, anti-rejeu et idempotence.
8. **Audit & Usage** : historique des appels, coûts estimés, quotas, alertes et arrêt d'urgence.

## 5. Sécurité et séparation des comptes

- Séparer strictement les connexions de l'organisation MerKora de celles de chaque client.
- Vérifier l'identité, le rôle, le tenant et les scopes côté serveur sur chaque appel.
- Appliquer le principe du moindre privilège.
- Chiffrer les secrets au repos avec une clé séparée des données.
- Ne jamais exposer de clé service-role Supabase ou de jeton fournisseur dans le navigateur.
- Journaliser l'identité, l'action, la cible, l'heure et le résultat sans enregistrer les secrets.
- Prévoir expiration, rotation, révocation, détection de rejeu et limitation de débit.
- Exiger une approbation explicite pour les actions sensibles, destructrices, publiques ou payantes.
- Ne pas déclencher de frais API ni activer de facturation sans autorisation et budget définis.
- Ne pas modifier ni réinitialiser les données ou schémas Supabase existants sans autorisation spécifique.

## 6. Stratégie de livraison

### Phase A — Contrat commun et catalogue
Définir les statuts réels, capacités, scopes, modes d'authentification et séparation compte central / compte client. Corriger l'écran actuel qui présente encore des boutons désactivés.

### Phase B — Connexion sortante pilote
Implémenter un seul connecteur externe avec API officielle vérifiée, d'abord sur environnement de prévisualisation. Choisir le fournisseur selon les besoins techniques et l'accès disponible.

### Phase C — API entrante MerKora
Publier les premiers endpoints de lecture, documenter les schémas et appliquer les permissions tenant-aware.

### Phase D — Serveur MCP MerKora
Exposer les outils de lecture à un client compatible, tester l'autorisation, les erreurs, la révocation et l'isolation des données.

### Phase E — Écriture contrôlée et automatisations
Ajouter progressivement les opérations d'écriture, webhooks et workflows après tests de sécurité et approbation explicite.

### Phase F — Extension du catalogue
Ajouter OpenAI, Anthropic, Gemini, Notion, Figma, GitHub, Vercel, Supabase et autres selon leurs API, OAuth, quotas et conditions réels. Les services sans API adaptée restent en lien externe ou en transfert manuel.

## 7. Tests d'acceptation

- Un administrateur non autorisé ne peut ni connecter ni gérer les intégrations.
- Un client ne peut jamais lire ou utiliser les connexions d'un autre client.
- Une connexion n'apparaît active qu'après vérification réelle.
- Un secret n'est jamais renvoyé par une API front-end.
- Une connexion expirée, révoquée ou en erreur est clairement signalée.
- Un appel hors scope est refusé.
- Les endpoints MCP et API respectent les mêmes règles d'autorisation.
- Les actions d'écriture nécessitent une permission explicite et, si sensible, une confirmation.
- Les quotas et budgets bloquent les appels au-delà des limites.
- Les tests couvrent les refus OAuth, erreurs fournisseur, délais dépassés, rejeu webhook et révocation.

## 8. Hors périmètre sans autorisation ultérieure

- Aucun abonnement ou appel API payant.
- Aucun ajout de clé ou secret réel.
- Aucun déploiement de production.
- Aucune fusion dans main.
- Aucune migration ou modification destructive Supabase.
- Aucune automatisation d'interface non documentée de services tiers.
