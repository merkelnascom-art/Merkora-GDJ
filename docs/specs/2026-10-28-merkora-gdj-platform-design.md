# MerKora GDJ — conception de la plateforme

**Date :** 2026-10-28  
**Statut :** conception issue des décisions validées par le propriétaire ; à relire avant le plan d'implémentation.

## 1. Vision produit

MerKora GDJ est une plateforme centrale qui transforme une difficulté ou une ambition exprimée en langage naturel en un projet concret, personnalisé, chiffrable, puis réalisable. Le client décrit d'abord son « pourquoi » ; il n'a pas besoin de connaître le bon outil ou la solution technique.

La plateforme doit pouvoir couvrir plusieurs domaines (orientation, commerce, organisation, gestion du personnel, finance, création, logiciels et autres besoins) sans imposer les mêmes recommandations ni la même maquette à tous les projets.

## 2. Expérience et parcours client

1. **Découverte libre sans compte obligatoire.** Le visiteur peut présenter son besoin et découvrir le fonctionnement. Un compte est demandé lorsqu'il veut sauvegarder son dossier et le retrouver plus tard.
2. **Dialogue hybride.** Une conversation naturelle est complétée par des formulaires, choix et questions contextuels lorsque cela améliore la précision.
3. **Diagnostic adaptatif.** Le système analyse ce qui est déjà fourni, identifie les inconnues importantes, pose uniquement les questions utiles et s'arrête quand le dossier est suffisamment clair. Il signale l'incertitude au lieu d'inventer des faits.
4. **Solutions pertinentes.** Le nombre de propositions dépend du besoin. Chaque option explique son fonctionnement, ses avantages, limites, fonctionnalités, dépendances et facteurs de coût. Aucune option générique n'est ajoutée pour atteindre un quota.
5. **Choix et personnalisation.** Le client peut sélectionner, modifier ou combiner les fonctionnalités cohérentes et préciser ses attentes.
6. **Aperçu conceptuel personnalisé.** Des composants fiables sont assemblés selon le domaine, les utilisateurs, le besoin et les fonctions retenues. L'IA peut contribuer à la composition et au contenu. L'aperçu est explicitement marqué comme conceptuel tant que le produit n'est pas construit.
7. **Cadrage et devis.** MerKora prépare un périmètre compréhensible, les livrables, hypothèses, délais et estimation. Les coûts de création sont distingués des frais récurrents (hébergement, services externes, maintenance, assistance, sauvegardes, sécurité et autres services optionnels).
8. **Validation commerciale humaine.** Le client peut accepter, poser des questions, négocier, demander une modification, refuser ou mettre en attente. Toute modification importante entraîne une nouvelle version du périmètre et du devis. Aucun devis officiel n'est transmis et aucun engagement de réalisation n'est pris sans validation de l'administrateur autorisé.
9. **Réalisation et suivi.** Après accord sur les conditions, un espace de suivi présente étapes, tâches, échéances, livrables, échanges, validations et historique. Les notes internes confidentielles restent invisibles au client.
10. **Services après livraison.** La plateforme pourra proposer, selon le contrat, hébergement géré facultatif, maintenance, assistance, sécurité, sauvegardes, réparations, suspensions/réactivations, audits et paiements vérifiés.

## 3. Identité visuelle et navigation

- Interface française, responsive, mobile-first.
- Direction artistique : luxe technologique, élégance sobre, accents futuristes et quelques moments visuels spectaculaires.
- Vitrine immersive pour expliquer la promesse, puis espace de travail personnalisé.
- Navigation latérale, zone centrale organisée, identité cohérente entre les onglets.
- Dossiers structurés, sauvegarde en ligne après connexion, progression lisible et retours d'état explicites.
- La présentation doit rester accessible, rapide et compréhensible ; les effets visuels ne doivent pas ralentir ou masquer les tâches.

## 4. Architecture fonctionnelle visée

- **Interface publique :** vitrine, découverte libre et entrée dans le parcours.
- **Espace de diagnostic :** conversation, questions adaptatives, réponses structurées et synthèse.
- **Moteur de solutions :** analyse du domaine et des contraintes, génération de propositions distinctes et explicables.
- **Studio de conception :** sélection de fonctions et aperçu conceptuel propre au dossier.
- **Espace client :** dossiers sauvegardés, décisions, versions de devis, échanges, suivi et livrables.
- **Espace administrateur :** dossiers, affectations, notes internes, contrôle des prix, validations, statuts et journal d'activité.
- **Gestion des rôles et accès :** client, collaborateurs autorisés et administrateur, droits appliqués côté serveur et base.
- **Couche IA :** modèle réel connecté côté serveur, avec contrôle des entrées/sorties, coûts, erreurs, disponibilité et limites clairement affichées.
- **Services et facturation :** périmètre, estimation, devis validé, services optionnels et suivi des engagements ; les paiements ne sont considérés confirmés qu'après vérification fiable.

## 5. Règles de vérité et de confiance

- Ne jamais présenter une pré-analyse à base de règles comme une analyse IA.
- Ne jamais présenter une maquette comme un produit fonctionnel.
- Ne jamais fabriquer un montant précis lorsque les données ne permettent qu'une fourchette ; exposer les hypothèses.
- L'IA recommande ; les règles métier appliquent les autorisations et les validations.
- Les secrets d'IA restent côté serveur ; aucun secret n'est commité dans Git.
- Les états d'enregistrement, d'échec et de synchronisation doivent refléter le résultat réel du service distant.
- Aucun déploiement en production sans autorisation explicite.

## 6. Données, confidentialité et sécurité

- Un client ne peut lire ou modifier que ses dossiers et ressources autorisés.
- Les collaborateurs n'accèdent qu'aux projets qui leur sont attribués.
- Les notes administratives et données internes ne sont jamais exposées par une simple restriction d'interface : les contrôles doivent être imposés par l'API et la base.
- Le rôle administrateur ne peut pas être attribué par modification d'un champ client.
- Les actions sensibles (changement de droits, validation de devis, décisions commerciales, transitions importantes) sont journalisées.
- Tester explicitement l'isolation entre deux clients et les droits du client, du collaborateur et de l'administrateur.
- Ne pas supprimer ni réinitialiser de base ou de données sans autorisation spécifique ; ne pas toucher à WALL Trade.

## 7. Stack et connexions

Base de travail prévue : Next.js App Router, React, TypeScript, composants CSS réutilisables, GitHub pour le versionnement, Supabase pour Auth/Postgres avec RLS, Vercel pour les prévisualisations et le déploiement, et un fournisseur de modèle IA appelé uniquement côté serveur. Les services externes seront connectés seulement après vérification du projet cible, des permissions, des variables d'environnement et des coûts. Figma/Notion restent facultatifs pour la conception et la documentation.

## 8. Phasage

1. **Fondations et expérience de découverte :** nouvelle base cohérente, identité, navigation, parcours public sans compte, diagnostic adaptatif initial, états et tests.
2. **Comptes et dossiers :** authentification, sauvegarde cloud, propriété des dossiers, règles RLS et tests d'isolation.
3. **Intelligence et propositions :** intégration IA côté serveur, questions adaptatives, propositions contextualisées, mode dégradé transparent et tests.
4. **Studio et cadrage commercial :** fonctions propres au projet, maquettes conceptuelles, synthèse, estimation, versions de devis et validations.
5. **Livraison et suivi :** affectations, tâches, échéances, livrables, échanges et historique.
6. **Services après livraison et gestion avancée :** contrats de services optionnels, maintenance, assistance, hébergement, sécurité, sauvegardes, audits et paiements vérifiés.

Chaque phase doit être testée et revue avant de poursuivre. Les migrations de base doivent être versionnées, réversibles lorsque possible et vérifiées avant application.

## 9. Contraintes de réalisation immédiates

- Travailler sur une branche isolée, sans fusion dans `main` et sans promotion en production.
- Ne pas effacer ou réinitialiser les projets Supabase existants dans cette phase.
- Vérifier l'état réel des intégrations avant de les configurer.
- Construire par livrables testables plutôt que prétendre que toute la plateforme sera terminée en un seul changement.
- Distinguer ce qui est déjà opérationnel, ce qui est prototype, et ce qui dépend encore d'une clé API ou d'une configuration.
