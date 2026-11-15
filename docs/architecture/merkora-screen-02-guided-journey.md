# MerKora GDJ — parcours guidé de compréhension, écran 02

Version : 1.1 — 15 novembre 2026  
Statut : première intégration fonctionnelle, déterministe, à valider sur scénarios réels.

## 1. Objectif

L'écran 02 transforme une première expression libre en une compréhension progressive et vérifiable du besoin. Il ne choisit pas encore de solution, de domaine technique, de technologie ou de devis.

Le parcours suit la séquence :

1. expression libre, sans catégorie obligatoire ;
2. extraction prudente des indices explicitement formulés ;
3. clarification du périmètre lorsque plusieurs groupes d'activités semblent coexister ;
4. choix d'une seule question utile ;
5. clarification du besoin, du fonctionnement actuel, des causes, du résultat, du contexte, des acteurs et, lorsque nécessaire, des précautions de confidentialité ;
6. synthèse construite à partir des propos conservés ;
7. confirmation, correction ou report par la personne ;
8. clôture de cette première compréhension.

## 2. Règles de vérité

- La description originale est conservée séparément et n'est jamais remplacée par la synthèse.
- Une extraction lexicale produit un indice, pas une vérité générale.
- Une réponse est enregistrée comme `user_stated`, avec son message source et sa citation.
- Une hypothèse ne devient pas un fait par répétition.
- Des contradictions lexicales apparentes (accès, connectivité, automatisation) interrompent le parcours ordinaire et déclenchent une question de clarification ; elles ne sont jamais tranchées automatiquement.
- Les éléments ne deviennent `validated` qu'après confirmation explicite de la synthèse.
- Une correction est conservée comme une nouvelle trace, sans effacer la formulation précédente.
- Le report d'une question n'est jamais interprété comme une réponse.
- Aucun pourcentage de confiance n'est affiché sans modèle calibré.

## 3. Dimensions actuellement couvertes

| Dimension | Rôle |
|---|---|
| problem | besoin ou difficulté principale |
| activity | fonctionnement actuel |
| cause | cause explicitement évoquée |
| goal | résultat souhaité |
| context | cadre ou lieu explicitement mentionné |
| actor | personnes ou groupes explicitement nommés |
| constraint | contrainte explicitement détectée |
| project_scope | périmètre lorsque plusieurs groupes d'activités apparaissent |
| risk | confidentialité, information et accord des personnes concernées |
| unknown | correction non encore classée avec certitude |

Les indices de domaines/métiers issus du lexique sont stockés comme `intentClues`, jamais comme une classification métier validée.

## 4. Planification des questions

Une question candidate est admissible seulement si :
- son identifiant et son texte sont présents ;
- sa dimension ne possède pas déjà une preuve enregistrée ;
- la dimension n'a pas été reportée ;
- la question n'a pas déjà été posée.

Le score de priorité est :

`S(q) = 0.35 I(q) + 0.30 U(q) + 0.25 R(q) + 0.10 A(q)`

- `I` : impact de la réponse sur la compréhension et la solution future ;
- `U` : incertitude restante sur un élément utile ;
- `R` : pertinence pour une décision ultérieure ;
- `A` : facilité probable de réponse sans deviner.

Chaque valeur est actuellement une appréciation de conception comprise entre 0 et 1. Les poids sont des hypothèses de conception, pas des probabilités apprises ni des vérités scientifiques. Ils devront être évalués sur des conversations de test diversifiées.

## 5. État du parcours

- `clarification` : une seule question principale est proposée à la fois ;
- `summary_validation` : le moteur n'a plus de question candidate admissible et présente la synthèse ;
- `complete` : la personne a confirmé la synthèse ou a choisi de reporter sa validation.

Lorsque plusieurs groupes d'activités sont détectés, le moteur demande s'ils relèvent d'un seul projet ou de projets distincts. Une réponse « oui/non » isolée est jugée ambiguë et déclenche une reformulation explicite. Lorsque des tiers sont concernés et qu'aucune information de confidentialité/accord n'a été fournie, une question de précaution est ajoutée. La personne peut passer une question : le moteur conserve alors le point reporté dans la synthèse et n'invente aucune réponse.

## 6. Conservation et sécurité

- La conversation et le profil sont conservés dans `sessionStorage` pour la session du navigateur.
- Aucun compte n'est requis à cette étape.
- Aucune migration, base de données, API externe ou service payant n'est utilisé.
- Le stockage de session n'est pas une sauvegarde durable : fermer la session ou effacer les données du navigateur peut faire perdre le brouillon.
- La voix reste hors du parcours visible et son travail antérieur demeure séparé.

## 7. Limites connues

Cette version utilise des expressions régulières et des lexiques limités. Elle ne comprend pas librement toutes les formulations, ne raisonne pas sur toutes les causes possibles et ne détecte que quelques familles de contradictions formulées explicitement (accès, connectivité, automatisation). Elle ne détecte pas les contradictions sémantiques générales et ne couvre pas encore un référentiel exhaustif de métiers/activités.

Le détecteur de contradictions structuré existant ne doit être utilisé que lorsque des assertions structurées comparables sont disponibles. Le contrôle lexical intégré à l'écran 02 est volontairement limité et ne constitue pas un détecteur universel de contradictions en texte libre.

Aucun modèle IA n'est connecté. Cette décision évite toute dépense ou transmission externe non approuvée, mais signifie que la compréhension sémantique générale n'est pas encore atteinte.

## 8. Étapes ultérieures — toujours dans l'écran 02

1. élargir le référentiel universel des domaines, métiers, activités, processus, objets et synonymes locaux ;
2. améliorer l'extraction multilingue et la segmentation des faits, objectifs, règles et exceptions ;
3. relier les assertions structurées au contrôle de cohérence et présenter les contradictions apparentes comme des demandes de clarification ;
4. ajouter une analyse des causes sans transformer les hypothèses en faits ;
5. tester le parcours sur des scénarios hybrides, personnels, associatifs, administratifs et professionnels ;
6. évaluer séparément les options IA locales/gratuites et les coûts éventuels, sans activation ni dépense automatique.

L'écran 03 ne doit pas commencer avant validation du parcours de compréhension de l'écran 02.


## 9. Première couche d'interprétation par intention

Une première couche déterministe distingue désormais plusieurs intentions exprimées :
- organiser un événement ;
- effectuer une réservation ;
- envoyer une invitation ;
- formuler une demande ;
- créer une structure ou un projet ;
- explorer une invention ;
- améliorer une activité existante ;
- résoudre un problème ;
- explorer une idée encore floue.

La première question est choisie selon cette intention, et non systématiquement selon le schéma « problème → fonctionnement actuel → cause ». Par exemple, une réservation appelle des précisions sur l'objet, la date et les bénéficiaires ; un événement appelle des précisions sur le type, la date, les invités et les contraintes ; un projet de création appelle des précisions sur les bénéficiaires et la finalité.

Les formulations signalant que MerKora n'a pas compris déclenchent une réparation conversationnelle : le moteur reconnaît le décalage, reprend les mots déjà exprimés et invite la personne à corriger. Ces messages ne sont pas classés comme des causes métier.

Cette couche reste une heuristique lexicale explicable. Elle ne constitue pas encore une compréhension sémantique générale : les intentions implicites, les formulations inhabituelles, les langues mélangées, l'argot et les projets inédits nécessitent encore des tests et des mécanismes plus riches. Une classification proposée par le moteur reste une hypothèse de travail, jamais une validation du besoin.
