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


## Complément approuvé — cadrage universel du produit

L'écran 06 commence désormais par un cadrage produit obligatoire avant d'afficher la proposition :

1. Nom du projet.
2. Type de réalisation, choisi parmi des catégories distinctes : site vitrine, plateforme web, application mobile, application web/logiciel, réservation, e-commerce, jeu, générateur, espace de conception architecturale et solution opérationnelle.
3. Un ou plusieurs domaines métier. Le multi-choix active une composition hybride ; il ne fusionne pas les règles des domaines.
4. Préférence de navigation : latérale, horizontale, inférieure mobile, contextuelle ou sans navigation logicielle.
5. Situation de l'identité visuelle : logo existant, création souhaitée ou à définir.

Le catalogue fournit des modules de départ adaptés au type de produit et aux domaines sélectionnés. Les catalogues de présence, réservation, finance, éducation, architecture, réseau social, jeu, génération de code, commerce, gestion d'entreprise, télécommunications, santé, agriculture, transport et médias sont distincts. Les domaines sélectionnés peuvent être combinés.

L'espace de la personne propriétaire/administratrice est séparé des espaces des utilisateurs finaux. Les rôles spécialisés proposés par un catalogue restent à confirmer avant de devenir des droits réels.

Les modules du catalogue sont des suggestions. Ils ne sont ni activés, ni tarifés officiellement, ni exécutés tant que le client ne les a pas retenus et que les règles de validation correspondantes ne sont pas satisfaites.

Le cadrage est conservé dans le sessionStorage existant, au même titre que les étapes 03 à 06. Il n'y a donc pas de synchronisation multi-appareils garantie dans cette version.

## Frontière avec IDPH et MerKora Direct

L'écran 06 décrit ici sert le parcours de composition autonome MerKora Direct. Le mode IDPH (accompagnement humain) réutilise les mêmes dossiers, catalogues, devis et Fabrique, mais ajoute la conversation avec un conseiller, la revue humaine du périmètre et l'envoi humain du devis. Le cycle commercial et les connexions sont détaillés dans `docs/architecture/merkora-modes-factory-and-integrations.md`.

La connexion des services listés dans ce document est une étape d'architecture distincte. Aucun service externe n'est installé ou appelé par le seul fait qu'il figure dans un catalogue.
