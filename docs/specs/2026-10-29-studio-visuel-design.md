# Conception — Studio visuel MerKora GDJ

- **Date :** 2026-10-29
- **Dépôt :** `merkelnascom-art/Merkora-GDJ`
- **Branche cible :** `feature/admin-preview-secure-access`
- **Statut :** conception approuvée par l’utilisateur ; à relire avant le plan d’implémentation
- **Périmètre :** studio visuel client et consultation administrative associée, en environnement de prévisualisation uniquement

## 1. Objectif produit

Permettre à une personne qui décrit un besoin métier ou personnel de voir une représentation concrète et séduisante d’une solution possible avant de s’engager dans un devis. MerKora doit d’abord clarifier le problème, puis proposer un concept de site, d’application mobile ou de tableau de bord que le client peut examiner, personnaliser et commenter.

Le studio présente deux résultats distincts :
1. une maquette interactive assemblée par MerKora à partir des informations du dossier ;
2. une représentation visuelle générée par un service d’images IA lorsqu’un fournisseur est configuré et disponible.

Ces deux résultats ne doivent jamais être confondus. La maquette interactive est un prototype conceptuel ; elle ne représente pas une application déjà construite ni une fonctionnalité de production. Une image générée est une illustration de direction artistique, pas une interface exécutable.

## 2. Approches envisagées

### Option A — Améliorer le studio existant (recommandée)
Conserver `ProjectMockupStudio` et `buildMockupModel`, puis les renforcer et les relier à un état de concept sauvegardable. Avantages : limite les régressions, réutilise les formats et palettes existants, avance par étapes. Limite : l’architecture actuelle peut nécessiter quelques ajustements ciblés.

### Option B — Réécrire le studio depuis zéro
Construire une nouvelle interface et migrer les préférences existantes. Avantage : liberté de conception. Inconvénients : coût plus élevé, risques de régression et de perte de compatibilité des préférences locales. Cette option n’est pas retenue sans preuve qu’une évolution ciblée est impossible.

### Option C — Générer uniquement des images IA
Produire des visuels sans maquette interactive. Avantage : impact visuel rapide. Inconvénients : le client ne peut pas tester les choix ni voir les modules évoluer ; forte dépendance au fournisseur. Cette option ne répond pas à l’objectif complet et n’est pas retenue.

## 3. Expérience client

1. Le client ouvre un dossier issu du parcours de description des besoins.
2. MerKora affiche un concept de départ qui reprend le titre, le domaine, l’objectif et les informations utiles du dossier.
3. Le client choisit un format (site web, mobile ou tableau de bord), une palette et les blocs à montrer.
4. L’aperçu se met à jour sans rechargement ; les contrôles de démonstration sont clairement signalés comme conceptuels.
5. Le client peut consulter une illustration IA si le service est configuré, ou continuer avec la maquette interactive seule.
6. Le client enregistre ses choix, copie un résumé et peut soumettre une demande de modification ou une validation du concept.
7. La validation du concept ne vaut ni validation d’un devis, ni paiement, ni ordre de construction.

Les états proposés sont : `draft`, `ready_for_review`, `changes_requested` et `approved`. Ils s’appliquent au concept, sans écraser le statut métier général du dossier. Les transitions doivent être explicites et les actions confirmées par un retour visible à l’utilisateur.

## 4. Architecture et responsabilités

### Interface
- **`src/components/studio/project-mockup-studio.tsx`** : commandes du studio, aperçu, états de chargement/erreur, sauvegarde et actions du client.
- **`src/lib/mockup-studio.ts`** : construction pure du modèle d’aperçu à partir du dossier et des choix.
- **Types de projet existants** : garder la compatibilité avec les dossiers existants et rendre les nouveaux champs optionnels pendant la transition si nécessaire.

### Persistance
- Inspecter et réutiliser les mécanismes Supabase existants au lieu d’inventer une seconde source de vérité.
- Les concepts cloud sont liés au dossier et à son propriétaire ; les préférences locales existantes ne doivent pas être supprimées ni interprétées comme des données cloud.
- Les modifications doivent utiliser les politiques RLS existantes ou des politiques vérifiées. Aucun accès client ne doit permettre de lire ou modifier les dossiers d’un autre utilisateur.
- Ne pas faire de migration destructive, de remise à zéro, de suppression de table ou de suppression de dossier. Si un changement de schéma est requis, il doit être additif et documenté.

### Service d’images IA
- Ajouter une route serveur dédiée au rendu visuel, séparée de l’analyse de besoin déjà présente.
- Le serveur valide les entrées, limite leur taille, construit une instruction visuelle à partir des champs autorisés et appelle le fournisseur configuré.
- Les clés API restent exclusivement côté serveur. Ne jamais envoyer une clé au navigateur ni enregistrer de secrets dans le dépôt.
- Si aucun fournisseur n’est configuré, si la requête échoue ou si une limite est atteinte, afficher un message compréhensible et laisser le studio interactif disponible.
- Ne pas prétendre qu’une image a été générée tant que le service n’a pas renvoyé un résultat exploitable. Les coûts éventuels et les limites du fournisseur doivent être explicités avant activation.

### Administration
- Réutiliser le contrôle d’accès serveur existant de `/admin`.
- L’espace administrateur doit consulter uniquement les dossiers autorisés et afficher le concept, ses choix, son état et les demandes de modification.
- Les actions administratives de revue restent distinctes des actions de facturation et de livraison, qui ne sont pas incluses dans cette étape.
- L’interface doit indiquer clairement si une information est absente, locale, synchronisée ou indisponible.

## 5. Contrat de données conceptuel

Un concept associé à un dossier contient au minimum :
- identifiant du dossier et identifiant du propriétaire, selon les conventions de persistance existantes ;
- format : `website`, `mobile` ou `dashboard` ;
- palette : `violet`, `blue`, `emerald` ou `amber`, avec possibilité d’extension non destructive ;
- liste des modules activés ;
- état du concept parmi les quatre états définis ci-dessus ;
- note ou demande de modification du client, si fournie ;
- référence d’image générée et métadonnées utiles uniquement si le fournisseur retourne un résultat persistant ;
- dates de création et de mise à jour.

Le contrat définitif doit suivre le schéma réel et les conventions de nommage trouvés dans le dépôt. Les champs optionnels doivent être tolérés par les dossiers anciens. Aucune donnée de paiement ou aucun secret d’authentification ne fait partie de ce modèle.

## 6. Sécurité, confidentialité et erreurs

- Toutes les vérifications d’accès aux dossiers sont réalisées côté serveur et ne reposent pas sur des champs fournis par le navigateur.
- Les règles de base de données sont la frontière de sécurité pour les données cloud ; l’interface seule n’est jamais une protection suffisante.
- Les textes utilisateurs sont traités comme des données, jamais comme des instructions système destinées au fournisseur IA.
- Valider les formats et limites de longueur ; gérer les erreurs réseau, fournisseur absent, réponse invalide, session expirée et accès refusé.
- Ne pas exposer les prompts internes, clés, tokens ou données de dossiers dans les journaux client.
- Ne pas supprimer automatiquement les concepts ni les images existantes. Toute future politique de conservation doit être définie séparément.

## 7. Tests et critères d’acceptation

1. Le changement de format, de palette ou de module met à jour l’aperçu sans rechargement.
2. Le chargement de préférences locales anciennes ou malformées ne fait pas planter le studio.
3. Un concept sauvegardé peut être rechargé après reconnexion et reste associé au bon dossier.
4. Un utilisateur non authentifié ou non autorisé ne peut pas lire les concepts administratifs.
5. Un client ne peut pas lire ni modifier les dossiers ou concepts d’un autre client.
6. L’absence de fournisseur d’images IA ne bloque pas la maquette interactive et produit un message explicite.
7. Une erreur du fournisseur ne se présente jamais comme une réussite ; l’utilisateur peut réessayer.
8. Les états de concept ne déclenchent aucun devis, paiement, déploiement ou livraison.
9. Les tests existants, le contrôle TypeScript et le build passent, ou toute défaillance préexistante est identifiée et rapportée séparément.
10. Aucune donnée n’est effacée et aucune configuration de production n’est modifiée.

## 8. Hors périmètre

- Calcul automatique ou acceptation de devis ;
- paiement ou abonnement ;
- construction et déploiement automatique d’une application réelle ;
- réinitialisation de Supabase ou migration destructive ;
- refonte générale du parcours client ou de l’espace administrateur ;
- mise en production ou fusion dans la branche principale.

## 9. Limites de déploiement

Toute implémentation est limitée à `feature/admin-preview-secure-access` et à la prévisualisation associée. Ne pas modifier `main`, les déploiements de production, les variables d’environnement de production ou les données existantes. Vérifier les changements Git avant chaque commit et exécuter les tests adaptés avant de déclarer une étape terminée.
