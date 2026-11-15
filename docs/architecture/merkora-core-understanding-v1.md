# MerKora GDJ — Cœur intelligent de compréhension des besoins

**Document de conception technique — V1.0 — 14 novembre 2026**  
**Périmètre : écran 2, conversation écrite et compréhension du besoin.**  
**Statut : spécification de référence — implémentation progressive en cours sur l'écran 2.**

## 1. Objectif

L'écran 2 ne doit pas être un simple formulaire qui enregistre un texte. Il doit devenir l'entrée d'un processus guidé qui transforme progressivement une expression libre en une compréhension structurée, vérifiable et validée par la personne.

MerKora ne doit pas présumer qu'une demande de logiciel est nécessaire. Le besoin peut appeler une application, un site, une automatisation, un accompagnement, une réorganisation, une intégration d'outils, une solution physique ou une combinaison de plusieurs réponses.

Le parcours commence par le problème et le résultat recherché, pas par le choix d'une technologie.

## 2. Principes non négociables

1. **Écouter avant de proposer.** Ne pas imposer de domaine, métier ou type de projet à l'accueil.
2. **Séparer les faits des interprétations.** Une hypothèse de MerKora n'est jamais une déclaration du client.
3. **Questionner avec parcimonie.** Une question principale par tour, seulement si la réponse peut changer la compréhension ou la conception.
4. **Préserver les mots du client.** Toute reformulation doit pouvoir être comparée au message d'origine.
5. **Valider progressivement.** Les éléments structurants sont présentés à la personne pour confirmation ou correction.
6. **Garder la possibilité de dire “je ne sais pas”.** L'incertitude n'est pas une erreur à masquer.
7. **Accepter les projets hybrides et inconnus.** Le référentiel doit être extensible et ne pas enfermer les demandes dans une taxonomie rigide.
8. **Tracer les changements.** Une correction ne détruit pas l'ancienne version d'une information ou d'une décision.
9. **Ne pas construire trop tôt.** Aucun cahier des charges final ni génération de code à partir d'une interprétation non validée.
10. **Aucune dépense obligatoire au démarrage.** Aucun appel à une API payante, service payant, abonnement ou activation de facturation sans accord explicite préalable.

## 3. Modèle de compréhension du besoin

Le moteur doit construire un dossier de compréhension composé des éléments suivants :

| Élément | Définition | Exemple |
|---|---|---|
| Contexte | Situation actuelle | « Je dirige un centre de formation » |
| Acteurs | Personnes concernées | Direction, secrétariat, enseignants, apprenants |
| Activités | Ce qui est réellement fait | Inscription, cours, présence, paiement |
| Problèmes | Difficultés observées | Retards difficiles à suivre |
| Causes supposées | Explications à vérifier | Absence de pointage centralisé |
| Objectifs | Changements souhaités | Savoir qui est présent et à quelle heure |
| Résultats attendus | Effets observables | Rapports fiables chaque jour |
| Contraintes | Limites réelles | Téléphones Android, connexion instable |
| Ressources | Moyens existants | Personnel, équipements, logiciels |
| Règles métier | Obligations et exceptions | Retard après 09 h soumis à validation |
| Risques | Effets négatifs possibles | Données personnelles exposées |
| Préférences | Choix exprimés | Interface simple sur mobile |
| Inconnues | Informations non établies | Nombre de sites à gérer |

Le dossier n'a pas besoin d'être complet dès le premier message. Il se remplit au fil de la conversation.

## 4. Statut épistémique des informations

Chaque élément extrait ou proposé porte obligatoirement une provenance et un statut.

- `user_stated` : directement exprimé par la personne.
- `observed` : constat provenant d'une pièce ou donnée fournie et effectivement consultée.
- `inferred` : déduction du moteur, à confirmer.
- `hypothesis` : piste possible, non démontrée.
- `unknown` : information manquante.
- `validated` : confirmé explicitement par la personne.
- `rejected` : interprétation ou proposition refusée.

Une information validée doit conserver la référence à la réponse ou à l'action de validation qui l'a confirmée. Une simple absence de correction ne vaut jamais validation.

## 5. Contrats de données proposés

Ces interfaces sont des contrats applicatifs de départ. Elles ne constituent pas une migration SQL et ne présument pas du schéma actuel de la base.

```ts
type EvidenceStatus =
  | "user_stated"
  | "observed"
  | "inferred"
  | "hypothesis"
  | "unknown"
  | "validated"
  | "rejected";

type NeedDimension =
  | "context"
  | "actor"
  | "activity"
  | "problem"
  | "cause"
  | "goal"
  | "expected_outcome"
  | "constraint"
  | "resource"
  | "business_rule"
  | "risk"
  | "preference"
  | "unknown";

interface NeedEvidence {
  id: string;
  dimension: NeedDimension;
  value: string;
  status: EvidenceStatus;
  sourceMessageId?: string;
  sourceQuote?: string;
  confidence?: number; // 0..1, réservé aux extractions assistées
  rationale?: string;
  createdAt: string;
  supersedesId?: string;
}

interface NeedProfile {
  id: string;
  conversationId: string;
  originalDescription: string;
  evidence: NeedEvidence[];
  unresolvedQuestions: string[];
  contradictionIds: string[];
  currentSummary?: string;
  version: number;
  updatedAt: string;
}

interface ConversationMessage {
  id: string;
  conversationId: string;
  role: "visitor" | "merkora" | "system";
  content: string;
  createdAt: string;
  relatedEvidenceIds?: string[];
}

interface ValidationDecision {
  id: string;
  conversationId: string;
  subject: string;
  presentedText: string;
  decision: "confirmed" | "corrected" | "rejected" | "deferred";
  correction?: string;
  evidenceIds: string[];
  createdAt: string;
}
```

Les valeurs de confiance ne doivent être ajoutées que si une méthode d'extraction les produit réellement. Ne pas inventer un score pour donner une apparence de précision.

## 6. Cycle conversationnel de l'écran 2

### Étape A — Expression libre

La personne décrit ce qu'elle veut, ce qui la gêne, son idée ou le changement souhaité. Elle n'a pas besoin de connaître le vocabulaire informatique.

Le système conserve le texte original sans le remplacer par un résumé.

### Étape B — Compréhension initiale

Le moteur identifie les dimensions présentes et absentes : contexte, acteurs, activités, problème, objectif, contraintes et résultat attendu.

Il ne pose pas immédiatement toutes les questions manquantes. Il classe les inconnues selon leur impact.

### Étape C — Choix de la meilleure question

Une seule question principale est présentée à la fois. Elle doit être :
- compréhensible sans jargon ;
- liée à une incertitude précise ;
- utile à une décision future ;
- non redondante avec une réponse déjà donnée ;
- accompagnée, si utile, de quelques exemples de réponse et d'un choix « autre ».

Le moteur peut accepter une réponse libre, « je ne sais pas », « pas encore décidé » ou « passer pour le moment ».

### Étape D — Reformulation vérifiable

À intervalles pertinents, MerKora résume :
- ce qu'elle a compris ;
- le problème qu'elle pense avoir identifié ;
- le résultat recherché ;
- ce qui reste incertain.

La personne peut confirmer, corriger ou rejeter chaque point important.

### Étape E — Validation du profil

Le profil n'est déclaré suffisamment compris que lorsque les éléments indispensables au type de besoin sont confirmés ou explicitement marqués comme inconnus acceptés.

La validation est progressive et versionnée. Elle ne signifie pas encore que la solution technique est choisie.

## 7. Politique de sélection des questions

Le moteur choisit la question qui réduit le plus une incertitude ayant un impact sur la suite.

Ordre indicatif de priorité :
1. Clarifier le problème ou le résultat recherché s'il est absent.
2. Identifier la personne ou le groupe principalement concerné.
3. Comprendre le fonctionnement actuel lorsqu'il conditionne la solution.
4. Clarifier les contraintes qui peuvent rendre une option impossible.
5. Identifier les règles, exceptions et autorisations.
6. Demander les préférences de forme ou de technologie seulement quand elles deviennent pertinentes.

Ne pas demander le budget, la technologie, le nom du domaine ou le type d'application par réflexe. Ces questions ne sont utiles que si elles changent une décision réelle.

Avant d'afficher une question, le moteur vérifie :
- cette information est-elle déjà disponible ?
- la réponse modifierait-elle la conception ?
- peut-on déduire quelque chose sans prendre de risque ?
- faut-il plutôt présenter une reformulation à valider ?
- cette question est-elle compréhensible et non intrusive ?

## 8. Détection des ambiguïtés et contradictions

Le moteur doit distinguer :
- **ambiguïté** : plusieurs interprétations plausibles d'une phrase ;
- **information manquante** : élément nécessaire non communiqué ;
- **contradiction apparente** : deux éléments semblent incompatibles ;
- **contradiction confirmée** : la personne confirme que les deux exigences doivent s'appliquer simultanément et qu'elles ne peuvent coexister dans les conditions données.

Une contradiction apparente ne doit pas être déclarée impossible avant clarification. Le moteur présente les deux éléments concernés, explique simplement la difficulté et demande à la personne de préciser sa priorité ou le contexte.

Chaque conflit conserve les références aux éléments concernés, son statut, ses conséquences potentielles et sa résolution.

## 9. Référentiel universel des domaines et activités

Le référentiel n'est pas une liste de catégories imposées au visiteur. C'est une base de connaissances interne utilisée après compréhension initiale pour reconnaître les réalités métier.

Il doit prendre en charge :
- domaines et sous-domaines ;
- secteurs économiques et services publics ;
- métiers, fonctions et rôles ;
- activités et processus ;
- objets métier et documents ;
- règles, événements et exceptions ;
- synonymes, variantes linguistiques et appellations locales ;
- relations entre plusieurs domaines ;
- concepts nouveaux ou non classés.

Un même projet peut relier plusieurs domaines. Le référentiel doit être versionné, sourcé et enrichi sans casser les identifiants existants. L'objectif de plusieurs milliers de métiers et activités est un objectif de couverture à construire et vérifier, pas un nombre à déclarer atteint sans inventaire fiable.

## 10. Architecture logique du moteur

Le cœur est découpé en interfaces indépendantes :

1. **Conversation Gateway** — reçoit et historise les messages.
2. **Evidence Extractor** — transforme les éléments exprimés en propositions structurées avec leurs sources.
3. **Need Profiler** — maintient le profil du besoin et ses versions.
4. **Knowledge Resolver** — rapproche les termes du référentiel universel.
5. **Question Planner** — choisit la prochaine question utile.
6. **Consistency Checker** — repère ambiguïtés et contradictions.
7. **Summary Composer** — prépare une reformulation fidèle.
8. **Validation Manager** — recueille les confirmations et corrections.
9. **Audit Trail** — conserve les changements et décisions.
10. **AI Provider Adapter** — interface interchangeable vers un moteur IA, activable uniquement après choix et autorisation des coûts.

Le moteur de conversation ne doit pas dépendre d'un fournisseur IA particulier. Les contrats d'entrée et de sortie restent stables si le fournisseur change.

## 11. Déploiement progressif sans dépense obligatoire

### Phase 0 — Capture honnête
- Saisie écrite et conservation du texte.
- Historique de session.
- Aucun message prétendant avoir été analysé.
- Aucun service externe payant.

### Phase 1 — Parcours guidé déterministe
- Questions fixes et règles explicites pour les informations que le visiteur choisit de préciser.
- Reformulations clairement présentées comme brouillons éditables.
- Pas de prétention à comprendre librement tous les textes.
- Tests sur des cas métier représentatifs.

### Phase 2 — Adaptateur IA interchangeable
- Connexion uniquement après comparaison des solutions gratuites, locales ou à coûts contrôlés.
- Aucun appel facturable sans consentement explicite.
- Limites, confidentialité, rétention et coût documentés.
- Possibilité de désactiver l'IA sans perdre les données du parcours.

### Phase 3 — Référentiel métier enrichi
- Import de sources fiables et licences vérifiées.
- Gestion des synonymes et variantes régionales.
- Revue humaine des nouvelles entrées.
- Mesure de couverture, doublons et qualité.

### Phase 4 — Cahier des charges validé
- Génération depuis les éléments confirmés.
- Séparation entre exigences confirmées, hypothèses et points ouverts.
- Historique des versions.
- Validation explicite avant passage à la conception.

## 12. Confidentialité, sécurité et conservation

- Ne collecter que les informations nécessaires à la compréhension.
- Ne jamais demander de mot de passe, secret ou donnée sensible sans justification fonctionnelle forte.
- Contrôler les accès par conversation et par rôle.
- Éviter de transmettre des données personnelles à un fournisseur externe par défaut.
- Prévoir export, correction et suppression selon les règles applicables, sans suppression silencieuse.
- Ne pas conserver de données dans un stockage de session comme unique solution durable lorsque le parcours devra survivre à plusieurs appareils.
- Toute persistance serveur future doit faire l'objet d'une conception et d'une autorisation séparées, sans toucher aux données existantes.

## 13. Critères d'acceptation

Le cœur de compréhension ne sera pas considéré prêt tant que les tests ne démontrent pas que :

1. Une demande libre n'est pas forcée dans une catégorie prédéfinie.
2. Les mots originaux du visiteur sont conservés.
3. Les faits et hypothèses sont visuellement et techniquement distingués.
4. Une hypothèse n'est jamais affichée comme une vérité confirmée.
5. Une seule question principale est posée par tour.
6. Une question déjà répondue n'est pas répétée sans raison.
7. Le visiteur peut corriger ou rejeter une reformulation.
8. Une contradiction apparente déclenche une clarification, pas une décision arbitraire.
9. Un besoin hybride peut référencer plusieurs domaines.
10. Le système peut reconnaître qu'il ne sait pas.
11. Les décisions et corrections sont traçables et versionnées.
12. Aucune fonctionnalité ne déclenche une dépense ou une action externe non autorisée.
13. Aucun cahier des charges final n'est produit avant validation des éléments structurants.

## 14. Hors périmètre de cette première livraison

- Génération automatique de code ou de maquettes.
- Choix automatique d'une technologie.
- Devis et paiement.
- Appels vocaux.
- Déploiement de services clients.
- Modification ou migration de base de données existante.
- Activation d'une API payante.

Ces sujets viendront après validation du besoin et des contrats du cœur intelligent.

---

**Décision d'architecture :** le moteur de compréhension est indépendant de l'interface, du fournisseur IA, du référentiel métier et de la future plateforme de fabrication. L'écran 2 en est le premier client, pas son unique usage.


## 12. État de l'implémentation unifiée — 15 novembre 2026

Le parcours écran 2 dispose désormais d'une première interface écrite, d'un moteur conversationnel déterministe, d'un planificateur de questions, d'une détection structurée de contradictions apparentes, d'un modèle de situation, d'un graphe universel avec provenance et d'un extracteur lexical prudent. Ces éléments constituent une base incrémentale et testée, pas encore un moteur sémantique universel.

Les limites et l'état de vérification sont documentés dans la Pull Request de prévisualisation unifiée. Les éléments non implémentés dans cette spécification restent des objectifs, et ne doivent pas être présentés comme des fonctionnalités déjà disponibles.
