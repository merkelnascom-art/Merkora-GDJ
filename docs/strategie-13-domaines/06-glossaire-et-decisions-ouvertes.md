# 06 — Glossaire et décisions ouvertes

## Glossaire

- **Domaine** : grand secteur d'activité (ex. commerce, santé).
- **Spécialisation** : sous-métier ou type d'organisation dans un domaine.
- **Diagnostic** : compréhension structurée du problème, des causes, objectifs et contraintes.
- **Processus métier** : suite d'étapes, décisions et exceptions qui produisent un résultat.
- **Module métier** : ensemble cohérent de fonctions propres à un processus.
- **Option transversale** : capacité réutilisable entre plusieurs domaines.
- **Périmètre** : fonctions explicitement incluses dans un projet donné.
- **Maquette** : représentation de l'expérience ; elle ne prouve pas que la fonction est développée.
- **Spécification** : description vérifiable du comportement attendu.
- **Recette** : vérification par le client ou son représentant que les critères convenus sont satisfaits.
- **Preview** : version de préproduction destinée aux essais.
- **Livraison** : remise formelle d'une version et des éléments convenus.
- **Changement** : modification du périmètre après validation.

## Décisions déjà retenues dans la vision

- Plateforme destinée à des profils et secteurs variés.
- L'IA analyse et propose, le client garde le contrôle des décisions importantes.
- Le parcours s'adapte à la clarté et à la complexité du besoin.
- La conception et les maquettes précèdent la fabrication complète.
- Les composants réutilisables sont privilégiés, sans interdire le spécifique.
- Modèle commercial mixte : abonnement et projets sur mesure.
- FCFA comme devise initiale de référence, configurable.
- Devis contrôlé par l'administrateur avant présentation au client.
- Hébergement et maintenance séparables et facturables selon le besoin.
- Priorité aux offres gratuites ou déjà disponibles, sans dépense non autorisée.
- Aucune suppression ou réinitialisation de bases existantes dans le cadre de ce dossier.
- Pas de merge ou de déploiement production sans autorisation explicite.

## Décisions à approfondir avant implémentation

1. Quels statuts exacts et quelles transitions sont nécessaires dans le cycle de projet ?
2. Quel niveau de multi-tenant et quelles politiques d'isolation sont déjà présents dans la base ?
3. Quels documents contractuels, droits sur le code et conditions de réversibilité seront proposés ?
4. Quelles règles de prix et limites d'abonnement seront configurables par l'administrateur ?
5. Quels pays et cadres réglementaires seront pris en charge en premier ?
6. Quelles intégrations sont réellement prioritaires et accessibles depuis les pays ciblés ?
7. Quel niveau d'automatisation de génération de code est acceptable à chaque étape ?
8. Quelle politique de conservation, export et suppression des données sera contractualisée ?
9. Quels rôles peuvent approuver devis, paiements, publications et suspensions ?
10. Quel niveau de support et de disponibilité MerKora peut réellement garantir ?

## Principe de mise à jour

Toute décision nouvelle doit être ajoutée dans ce dossier avec date, auteur/responsable, contexte, options considérées, décision, conséquences et tâches de suivi. Une décision non validée reste marquée « proposée ».
