# MerKora GDJ — Méthode algorithmique du cœur de compréhension

**Version 1.0 — 14 novembre 2026**  
**Périmètre : moteur local déterministe initial, sans modèle IA externe.**

## 1. Ce que cette première version sait faire

Le premier noyau logiciel fournit :
- des contrats typés pour les messages, éléments de preuve, profils de besoin et validations ;
- une sélection déterministe d'une seule question parmi des questions candidates préparées ;
- un score de priorité explicable ;
- une détection de conflits sur des assertions structurées et des règles explicitement déclarées exclusives ;
- une séparation stricte entre conflit apparent et conflit confirmé.

Il ne comprend pas encore une phrase libre en langage naturel. Il ne faut donc pas lui attribuer une capacité de compréhension sémantique qu'il ne possède pas. L'extraction libre, la résolution des métiers et la reformulation intelligente nécessiteront une étape distincte et un moteur de langage choisi ultérieurement.

## 2. Score de priorité d'une question

Chaque question candidate reçoit quatre valeurs normalisées dans l'intervalle [0, 1] :

- I(q) — impact de la réponse sur la solution ;
- U(q) — incertitude restante sur un point utile ;
- R(q) — pertinence pour une décision future ;
- A(q) — facilité probable à répondre sans deviner.

Le score initial est :

\[
S(q)=0.35I(q)+0.30U(q)+0.25R(q)+0.10A(q)
\]

Les poids totalisent 1. Le résultat reste donc dans [0, 1].

### Pourquoi ces poids ?

- L'impact reçoit 35 % : une réponse qui change l'architecture ou le fonctionnement doit passer en priorité.
- L'incertitude reçoit 30 % : il faut éclaircir les inconnues importantes.
- La pertinence décisionnelle reçoit 25 % : une question doit servir une décision réelle, pas seulement remplir un formulaire.
- La facilité de réponse reçoit 10 % : une question compréhensible est préférable à une question qui pousse la personne à inventer une réponse.

Ce sont des poids de conception initiaux, pas des vérités scientifiques ni des probabilités apprises. Ils devront être ajustés avec des scénarios métier et des retours utilisateurs. En cas d'égalité, l'identifiant stable de la question départage les candidates pour garantir un résultat reproductible.

### Filtrage avant notation

Une question est écartée si :
- son identifiant est vide ;
- son texte est vide ;
- sa dimension est déjà marquée comme répondue ;
- la personne a demandé à différer cette dimension ;
- cette question a déjà été posée.

Le moteur retourne zéro ou une question. Il ne fabrique pas de question lorsque la liste des candidates est épuisée.

## 3. Détection structurée d'un conflit

La première règle ne compare que des assertions déjà structurées. Deux assertions ne peuvent être signalées comme conflit apparent que si :

\[
C(a_i,a_j)=E_s \land E_p \land E_{scope} \land E_{context} \land E_{exclusive} \land E_{type} \land D_v
\]

Où :
- E_s : même sujet ;
- E_p : même prédicat ;
- E_scope : même périmètre ;
- E_context : même contexte temporel ou réglementaire ;
- E_exclusive : prédicat explicitement déclaré mutuellement exclusif ;
- E_type : valeurs de types comparables ;
- D_v : valeurs différentes.

Si la condition est vraie, le résultat est **apparent**. Le logiciel ne décide pas que la personne se contredit : une règle peut dépendre d'un horaire, d'un site, d'une période, d'un rôle ou d'une exception qui n'a pas encore été précisé.

Le passage à confirmed exige une référence à une confirmation explicite de la personne. Une simple détection algorithmique ne suffit jamais.

## 4. Information gain : étape future, pas encore activée

Quand MerKora disposera d'un modèle d'extraction évalué et de probabilités calibrées, le choix d'une question pourra intégrer le gain d'information attendu :

\[
IG(q)=H(X\mid E)-\sum_{a\in A_q}P(a\mid q,E)H(X\mid E,a)
\]

H représente l'entropie de l'état inconnu X, E les éléments déjà établis et A_q les réponses possibles à la question.

Cette formule ne doit pas être utilisée avec des probabilités inventées. Tant qu'un modèle n'a pas été évalué sur des cas réels et calibré, MerKora utilise le score déterministe explicable de la section 2.

## 5. Mesurer la compréhension sans fabriquer un pourcentage trompeur

Un unique « taux de compréhension à 92 % » serait trompeur si les dimensions obligatoires dépendent du métier et du projet. Le futur moteur devra plutôt produire un vecteur de couverture par dimension :

\[
V=(v_{contexte},v_{acteurs},v_{activités},v_{problème},v_{causes},v_{objectifs},v_{règles},v_{contraintes},\ldots)
\]

Chaque valeur devra représenter un état vérifiable (inconnu, exprimé, hypothèse, validé, rejeté), et non une confiance arbitraire. Un indicateur de préparation ne sera calculé qu'après définition des dimensions indispensables au type de besoin identifié et validé.

## 6. Chaîne de traitement cible

1. **Capture** — préserver le message original et son ordre.
2. **Extraction** — proposer des éléments structurés avec citation de leur passage source.
3. **Qualification** — distinguer déclaration, observation, inférence, hypothèse et inconnue.
4. **Résolution métier** — relier les mots aux activités, rôles et processus sans forcer une catégorie.
5. **Analyse de cohérence** — comparer les règles explicites, les contextes et les exceptions.
6. **Planification** — choisir la question qui réduit une incertitude importante.
7. **Reformulation** — montrer ce qui est compris et ce qui reste à confirmer.
8. **Validation** — enregistrer confirmation, correction, rejet ou report.
9. **Spécification** — générer le cahier des charges à partir des éléments validés et des inconnues acceptées.

Chaque sortie doit pouvoir remonter à un message, une preuve, une règle ou une validation. Les composants doivent rester remplaçables afin que le choix futur d'un moteur IA ne modifie pas les contrats métier.

## 7. Limites et garde-fous

- Aucun algorithme ne garantit une compréhension parfaite de toute expression humaine.
- Les scores de priorité ne sont pas des scores de vérité.
- Les contradictions structurées ne remplacent pas une compréhension du contexte.
- Une proposition IA reste une hypothèse tant que la personne ne l'a pas validée.
- Aucun appel payant, aucune migration de base de données et aucun déploiement de production ne sont déclenchés par ce noyau.
- L'écran 2 ne sera raccordé à ce moteur qu'après validation des tests et de son parcours conversationnel.

## 8. Suite technique prévue

Après vérification de cette base :
1. construire le registre des preuves et les opérations de validation versionnées ;
2. ajouter un moteur de reformulation fondé uniquement sur les éléments disponibles ;
3. définir des jeux de scénarios représentatifs (commerce, formation, santé non clinique, logistique, agriculture, services, projets hybrides, besoin personnel) ;
4. mesurer précision, omissions, questions inutiles, répétitions et faux conflits ;
5. seulement ensuite, comparer des extracteurs de langage gratuits, locaux ou à coût contrôlé, sans activer de service payant sans accord explicite.
