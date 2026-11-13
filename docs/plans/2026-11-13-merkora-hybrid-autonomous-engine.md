# MerKora GDJ — moteur hybride autonome et mémoire durable

Date : 13 novembre 2026  
Statut : implémentation en cours sur la branche `feature/merkora-universal-reference-implementation`

## Décisions produit validées

- Le client échange uniquement avec MerKora. Il ne choisit jamais un fournisseur ou un assistant.
- MerKora orchestre le parcours et reste responsable du dossier, des règles, des validations et des décisions.
- Le moteur IA peut être appelé automatiquement en arrière-plan lorsque le dossier l'autorise et que le service est configuré.
- Le parcours doit accepter des projets numériques, physiques, de services, commerciaux, communautaires, créatifs et hybrides.
- La nature du projet et les formats de livrables sont deux dimensions différentes.
- MerKora recommande les livrables pertinents, mais le client peut choisir, retirer ou ajouter des formats.
- Les décisions confirmées du client priment sur les hypothèses et recommandations.
- Une indisponibilité du moteur externe doit laisser une réponse MerKora déterministe disponible.
- Les échanges, réponses de diagnostic et choix du Studio doivent être récupérables sur plusieurs appareils.

## Confidentialité et consentement

Le client ne choisit pas le fournisseur technique et l'interface ne présente pas de bouton « Gemini ». En revanche, la politique de confidentialité et l'écran d'autorisation doivent expliquer qu'un traitement assisté peut impliquer des prestataires externes d'IA, quelles catégories de données sont concernées et comment retirer son accord.

L'autorisation est enregistrée une fois par projet dans `project_ai_processing_consents`. Elle est vérifiée côté serveur avant tout appel externe. Le retrait bloque les prochains appels. Les routes ne doivent jamais accepter un simple booléen envoyé avec chaque message comme preuve de consentement.

Ne pas transmettre de secrets, mots de passe ou données personnelles non nécessaires. Les données reçues par le modèle restent des données utilisateur non fiables et ne peuvent pas modifier les instructions système.

## Mémoire durable

La migration additive `20261113100000_create_hybrid_project_workspace.sql` ajoute :

- `project_workspace_state` : instantané versionné du contexte validé, diagnostic, préférences de livrables et choix du Studio.
- `project_workspace_events` : historique append-only des changements et décisions.
- `project_conversation_messages` : historique durable des échanges MerKora.
- `project_ai_processing_consents` : autorisation par projet.

La migration `20261113101000_add_hybrid_workspace_save_rpc.sql` ajoute `save_project_workspace_state`, une fonction transactionnelle avec contrôle optimiste de version. Les deux migrations sont uniquement présentes dans Git à ce stade. Elles ne sont pas appliquées à Supabase.

Les données restent liées au propriétaire via RLS. Aucun effacement, reset ou changement de tables existantes n'est prévu.

## Comportement déjà ajouté dans cette tranche

- API authentifiée de lecture et de sauvegarde du workspace avec révision et détection de conflits.
- Consentement IA par projet, persistant et révocable.
- Historique de conversation lu et écrit côté serveur pour retrouver le fil sur plusieurs appareils.
- Assistant MerKora qui lit le contexte du workspace et les derniers échanges avant l'analyse.
- Appel au moteur externe automatique après autorisation enregistrée, sans exposer le nom du fournisseur dans le parcours client.
- Réponse déterministe MerKora conservée comme solution de repli et garde-fou sur les modules.
- Studio qui synchronise les réponses du diagnostic, secteurs, métiers, modules et préférences de présentation dans le workspace.
- Analyse approfondie qui reçoit les choix enregistrés et vérifie le consentement côté serveur.
- Interface de l'analyse approfondie sans sélection de fournisseur.

## Garanties métier

- Un secteur ou un métier repéré reste candidat tant que le client ne l'a pas confirmé.
- Une recommandation n'est jamais une décision.
- Un choix confirmé ne peut être remplacé silencieusement par l'IA.
- Le client peut demander un changement ; MerKora crée alors une nouvelle version/trace.
- Un projet physique ou de service n'est pas forcé dans une maquette d'application.
- Les prix, délais, contraintes légales et partenaires doivent être vérifiés ; l'IA ne les invente pas.
- Aucun paiement, publication, réservation, achat ou lancement de réalisation ne découle d'une analyse seule.

## Vérifications et limites

- Les contrôles TypeScript, Deno, Supabase Edge, worker identity, tests et build sont déclenchés via GitHub Actions après chaque mise à jour.
- Aucun appel réel au fournisseur IA n'est effectué pendant les tests.
- Les migrations restent en attente de revue et d'application contrôlée sur Preview.
- Aucun merge ni déploiement de production n'est autorisé par cette tranche.
