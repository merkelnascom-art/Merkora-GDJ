# Persistance des données des modules — 3 novembre 2026

## Objectif

Préparer une sauvegarde durable des données opérationnelles propres à chaque module, séparée des dossiers commerciaux, des briefs, des plans approuvés et des tâches de fabrication.

## Contrat API préparé

- `GET /api/projects/{projectId}/modules/{moduleId}` : lit le payload du module.
- `PUT /api/projects/{projectId}/modules/{moduleId}` : crée ou remplace le payload du module.
- Authentification : cookies de session MerKora HttpOnly, vérifiés côté serveur.
- Autorisation : requête PostgREST avec le jeton de l'utilisateur ; RLS doit vérifier la propriété du projet ou l'accès administrateur.
- Protection CSRF : vérification de l'origine pour les écritures.
- Validation : identifiant de module strict, payload objet JSON de 64 Ko maximum, réponse sans cache.
- Pas de clé service-role dans le navigateur et aucune confiance dans un projectId envoyé par le client sans contrôle RLS.

## Schéma préparé

La migration `20261103000100_project_module_data.sql` ajoute `public.project_module_data`, clé primaire composée `(project_id, module_id)`, référence vers `user_projects(id)`, payload JSONB, auteur et dates. RLS est activé. Aucun droit DELETE n'est accordé.

## Limite d'intégration actuelle

Le composant `ModuleWorkspace` généré est un prototype autonome qui utilise encore le stockage local du navigateur. Les projets générés sont destinés à être déployés sur des domaines distincts ; ils ne peuvent donc pas réutiliser automatiquement les cookies HttpOnly de la session MerKora.

Ne pas connecter le générateur à cet endpoint en envoyant simplement un projectId ou un token depuis le navigateur. Avant la sauvegarde distante depuis une application livrée, choisir et implémenter une identité applicative sécurisée (par exemple, une passerelle backend propre au projet avec des jetons courts, révocables, limités au projet et à ses permissions), puis tester l'isolation inter-clients.

## Ordre de mise en service

1. Revoir le schéma et les policies RLS.
2. Appliquer la migration uniquement après validation explicite.
3. Tester GET/PUT avec un propriétaire, un autre client et un administrateur.
4. Tester CSRF, payload trop grand, module invalide, session expirée et conflits d'écriture.
5. Concevoir l'identité des applications livrées avant de remplacer le stockage local du générateur.
6. Activer la sauvegarde distante seulement après tests de bout en bout.

## État

Le code de l'API, le validateur et la migration sont sur la branche de travail. La migration n'a pas été appliquée à Supabase. Aucun déploiement production n'a été effectué.
