# MerKora GDJ — Écran 06 : proposition et composition de la solution

## Intention produit

Transformer la définition validée à l'écran 05 en une proposition concrète et personnalisable. L'écran 06 prépare la décision sur la solution ; il ne produit pas encore la maquette graphique.

## Parcours visible

- Une vue initiale courte présente le nom, l'objectif, le besoin principal et le principe de fonctionnement.
- Une architecture principale est recommandée. Une ou deux alternatives ne sont présentées que lorsqu'une différence réelle et utile est établie par les informations du projet.
- Les composants sont adaptés au domaine et aux décisions de l'écran 05 : fonctions, services, espaces, équipements, procédures ou autres éléments pertinents.
- Chaque composant peut être examiné individuellement, retenu, modifié, écarté ou réintégré.
- Les explications et les points de cohérence restent repliés tant que le client ne les ouvre pas.

## Règles de vérité et de validation

- Les réponses confirmées à l'écran 05 peuvent alimenter des composants proposés.
- Une suggestion issue du référentiel reste une suggestion jusqu'à validation explicite du client.
- Les réponses « Je ne sais pas encore », les questions différées et les contradictions ne deviennent jamais des fonctions ou des faits.
- Les décisions du client sont conservées avec leur état : proposée, acceptée, modifiée ou écartée.
- Aucune architecture alternative n'est inventée pour remplir l'écran.

## Résultat transmis à l'écran 07

L'écran 06 prépare un dossier structuré contenant l'architecture choisie, les composants retenus, les profils et règles issus des réponses validées, les points encore inconnus et les décisions écartées.

L'écran 07 doit être une véritable maquette visuelle de la solution retenue : écrans concrets, espaces par profil, navigation, contenus représentatifs et interactions principales. La maquette doit refléter les décisions validées à l'écran 06 et ne pas ajouter silencieusement de fonctions non retenues.

## Expérience utilisateur

- Interface responsive, légère et lisible sur téléphone et ordinateur.
- Une proposition globale puis des composants ouverts à la demande.
- Pas de tableau géant, de dossier indigeste ou de formulaire regroupant toutes les décisions.
- Les informations détaillées restent accessibles sans encombrer la vue principale.

## Contraintes techniques

- Réutiliser le dossier et la session de définition de l'écran 05.
- Préserver les écrans précédents.
- Aucune migration, suppression ou réinitialisation Supabase sans autorisation explicite.
- Persister la progression dans le stockage de session déjà utilisé par le parcours, sans prétendre à une synchronisation multi-appareils.
