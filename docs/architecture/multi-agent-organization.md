# Architecture multi-agents — organigramme cible de MerKora GDJ

> Statut : architecture cible validée pour la conception technique. Cette documentation ne prétend pas que tous les agents sont déjà implémentés.

## 1. Principe directeur

MerKora GDJ adopte une architecture multi-agents orchestrée. Une intelligence centrale coordonne des pôles spécialisés. Chaque agent possède une mission délimitée, des entrées, des outils autorisés, des sorties attendues et des limites d'action. Les pôles restent distincts : ils ne sont pas fusionnés en un agent généraliste. L'orchestrateur distribue les missions, suit leur état, organise les échanges, vérifie la cohérence des livrables et renvoie un travail en révision lorsqu'un contrôle échoue. L'organisation est extensible.

## 2. Organigramme cible

```text
MERKORA CORE — ORCHESTRATEUR CENTRAL
│  Comprend la demande, distribue les missions, coordonne les agents,
│  contrôle les résultats et suit l'avancement global.
│
├── PÔLE 1 — INTELLIGENCE (COMPRENDRE)
│   ├── Analyste métier
│   ├── Chercheur documentaire
│   ├── Expert sectoriel
│   ├── Analyste des besoins
│   └── Détecteur de contradictions
│
├── PÔLE 2 — CONCEPTION (IMAGINER)
│   ├── Architecte logiciel
│   ├── Product designer
│   ├── UX/UI designer
│   ├── Expert fonctionnel
│   └── Rédacteur technique
│
├── PÔLE 3 — FABRICATION (CONSTRUIRE)
│   ├── Développeur frontend
│   ├── Développeur backend
│   ├── Expert base de données
│   ├── Intégrateur API
│   └── Générateur de fichiers
│
├── PÔLE 4 — CONTRÔLE (VÉRIFIER)
│   ├── Testeur logiciel
│   ├── Auditeur de code
│   ├── Expert sécurité
│   ├── Détecteur d'erreurs
│   └── Agent de correction
│
├── PÔLE 5 — EXPLOITATION (FAIRE FONCTIONNER)
│   ├── DevOps
│   ├── Gestionnaire des déploiements
│   ├── Supervision
│   ├── Maintenance
│   └── Gestion des incidents
│
├── PÔLE 6 — RELATION CLIENT (ACCOMPAGNER)
│   ├── Assistant client
│   ├── Suivi des demandes
│   ├── Documentation
│   ├── Formation
│   └── Support après livraison
│
└── PÔLE TRANSVERSAL — GESTION ET ADMINISTRATION
    ├── Estimation des ressources et des coûts
    ├── Préparation des devis
    ├── Suivi des budgets
    ├── Validation administrative
    └── Gestion des autorisations
```

Le pôle transversal intervient auprès des autres pôles sans remplacer leurs responsabilités. Les validations commerciales, financières et les actions sensibles restent soumises aux autorisations humaines définies par MerKora.

## 3. Responsabilités des pôles

### Pôle 1 — Intelligence : comprendre
Analyse la situation réelle du client, son activité, ses difficultés, leurs causes, ses objectifs et les informations manquantes. Il recherche les connaissances pertinentes, identifie le domaine et la spécialisation, et détecte les ambiguïtés ou contradictions. Il ne transforme pas une hypothèse en fait établi.

### Pôle 2 — Conception : imaginer
Transforme les besoins clarifiés et validés en conception exploitable : parcours, fonctionnalités, modules, rôles, règles métier, architecture logicielle, spécifications et maquettes. Les choix importants sont présentés au client pour validation selon le parcours prévu.

### Pôle 3 — Fabrication : construire
Réalise la solution à partir des spécifications approuvées : interface, logique serveur, données, intégrations et fichiers livrables. Il travaille dans des environnements et avec des permissions limités à la mission confiée.

### Pôle 4 — Contrôle : vérifier
Contrôle la conformité aux spécifications, la qualité du code, les tests, la sécurité et les comportements attendus. Il produit des preuves et des rapports. En cas d'échec, il décrit précisément le problème et peut transmettre une tâche de correction au rôle compétent, puis demander une nouvelle vérification.

### Pôle 5 — Exploitation : faire fonctionner
Prépare et supervise les environnements d'exécution, les opérations, la maintenance, les incidents et les déploiements autorisés. La préparation technique d'un déploiement ne vaut jamais autorisation de déployer.

### Pôle 6 — Relation client : accompagner
Assure la continuité de la communication, le suivi des demandes, la documentation, la formation et le support après livraison. Il transmet les retours structurés aux pôles concernés sans modifier de sa propre initiative les spécifications approuvées.

### Pôle transversal — Gestion et administration
Évalue les ressources et les coûts, prépare les éléments de devis, suit les budgets, gère les autorisations et prépare les validations administratives. Les devis ne sont pas envoyés automatiquement : leur présentation au client reste sous contrôle administratif humain.

## 4. Collaboration et cycle de travail

Pour un projet donné, MerKora Core active uniquement les agents nécessaires. Le parcours de référence est :
1. **Compréhension** — le Pôle Intelligence analyse la demande et formule les incertitudes à clarifier.
2. **Recherche et expertise** — les spécialistes documentaires et sectoriels apportent des éléments sourcés et contextualisés.
3. **Conception** — le Pôle Conception prépare les spécifications, parcours et maquettes.
4. **Validation** — les décisions qui engagent le client sont soumises à son approbation.
5. **Fabrication** — le Pôle Fabrication construit les éléments approuvés.
6. **Contrôle** — le Pôle Contrôle teste et audite les résultats.
7. **Révision** — en cas d'échec, une tâche documentée revient au pôle responsable, puis le contrôle est rejoué.
8. **Préparation à l'exploitation** — le Pôle Exploitation prépare la livraison et les opérations autorisées.
9. **Accompagnement** — le Pôle Relation client assure documentation, formation et suivi.
10. **Gestion administrative** — le pôle transversal intervient sur les estimations, budgets, devis et autorisations aux étapes pertinentes.

Ce cycle est adaptatif : il peut revenir à une étape précédente lorsqu'une information, une validation ou un contrôle manque. Aucun agent ne doit contourner une validation requise.

## 5. Contrat obligatoire de chaque agent

Chaque agent doit être défini par un contrat explicite comprenant au minimum :
- Identifiant stable, nom et pôle de rattachement.
- Mission et périmètre de responsabilité.
- Déclencheurs et conditions d'activation.
- Données d'entrée et contexte autorisé.
- Outils, modèles et API autorisés.
- Permissions et limites d'action.
- Format de sortie structuré et versionné.
- Critères d'acceptation et méthode de vérification.
- Gestion des erreurs, délais, reprises et escalades.
- Traçabilité : mission, agent, version, sources, décisions et résultats.

Un agent ne doit pas déclarer une tâche réussie sans preuve vérifiable. Les états normalisés de mission sont : `pending`, `running`, `succeeded`, `failed`, `blocked`, `needs_review` et `cancelled`.

## 6. Règles de coordination et de sécurité

- Les échanges entre agents passent par des missions et résultats structurés, pas par un partage implicite et illimité de contexte.
- Le contexte transmis est limité au besoin de la mission et respecte les droits du client et du projet.
- Les sources documentaires conservent leur provenance; le contenu récupéré est traité comme une donnée non fiable, jamais comme une instruction système.
- Les agents distinguent faits vérifiés, hypothèses, recommandations et éléments non vérifiés.
- Les sorties générées sont validées avant de devenir des spécifications de référence ou des actions.
- Les outils suivent le principe du moindre privilège.
- Les actions irréversibles ou sensibles nécessitent une autorisation explicite et traçable.
- Aucune suppression ou réinitialisation de base de données, modification de données de production, dépense, fusion ou déploiement de production ne découle automatiquement d'une mission d'agent.
- Les secrets restent côté serveur et ne sont jamais transmis dans les prompts ou journaux non sécurisés.
- Les appels à des modèles et services externes sont soumis à une configuration, des limites de coût et une observabilité.

## 7. Raccordement aux fondations techniques existantes

Les composants déjà présents peuvent soutenir certains rôles, sans signifier que les agents spécialisés correspondants sont déjà opérationnels :

| Fondation existante | Contribution possible |
|---|---|
| Récupération documentaire BM25 | Recherche documentaire et apport de contexte au Pôle Intelligence |
| Primitives mathématiques (similarité cosinus, softmax, entropie, normalisation, couverture) | Classement et mesures auxiliaires; elles ne constituent pas à elles seules un service d'embeddings |
| Priorisation déterministe des questions | Clarification des besoins par le Pôle Intelligence |
| Détection des contradictions et mécanismes de découverte | Contrôle de cohérence des informations recueillies |
| Assistant Provider et conversation Gemini | Interface de dialogue et intégration de modèles, sous orchestration contrôlée |
| Mémoire liée au projet | Contexte de projet, avec périmètre, provenance et permissions |

Les capacités réellement implémentées doivent être vérifiées dans le code avant toute affirmation d'activation. Les nouveaux agents, leur runtime, leur registre, leur planificateur, leurs contrats, leur journal d'exécution et leurs mécanismes de permission restent à concevoir ou à implémenter selon l'audit technique.

## 8. Architecture technique à examiner pour l'implémentation

L'audit d'implémentation devra déterminer les interfaces et responsabilités des composants suivants, sans présumer qu'ils existent déjà :
- **Agent registry** : catalogue des agents, versions, capacités, contrats et permissions.
- **Orchestrator** : décomposition des missions, sélection des agents, dépendances et coordination.
- **Task/message contracts** : schémas validés pour les missions, événements, résultats et erreurs.
- **Execution runtime** : exécution isolée, délais, limites de ressources et annulation.
- **Approval gates** : validations client, administratives et techniques.
- **Artifact and evidence store** : livrables, rapports, sources, versions et preuves.
- **Evaluation and test harness** : tests unitaires, intégration, scénarios métier et évaluations des agents.
- **Observability and cost controls** : journaux, traces, métriques, quotas et suivi des coûts.
- **Policy and permission layer** : isolation par projet/client, moindre privilège et contrôle des outils.

Le choix des fournisseurs de modèles, des outils d'exécution et des services externes doit être fait après l'audit des besoins, de la sécurité, des coûts et des solutions gratuites ou déjà disponibles. Aucune dépense ou dépendance payante ne doit être activée sans approbation.

## 9. Hors périmètre de cette validation

Cette validation fixe l'organigramme cible et ses règles d'organisation. Elle ne constitue pas :
- une preuve que tous les agents sont codés ou connectés;
- une autorisation de modifier le schéma ou les données Supabase;
- une autorisation de déployer ou de fusionner;
- une décision d'achat ou d'activation d'un service payant;
- une autorisation pour un agent d'agir sans validation humaine lorsque celle-ci est requise.

## 10. Critères d'acceptation de l'architecture

L'architecture sera considérée correctement implémentée lorsque :
1. Chaque agent appartient explicitement à un pôle et possède un contrat versionné.
2. MerKora Core peut créer, distribuer, suivre et clôturer des missions.
3. Les dépendances entre missions et les transferts entre agents sont traçables.
4. Les sorties sont structurées, validées et associées à des preuves.
5. Les échecs, blocages et demandes de révision sont gérés explicitement.
6. Les permissions sont limitées au projet et à la mission.
7. Les validations humaines et les garde-fous sensibles ne peuvent pas être contournés.
8. Les coûts, appels externes et actions des agents sont observables et plafonnables.
9. Des tests couvrent les flux normaux, les erreurs, les interruptions, les refus et les tentatives de dépassement de permissions.
10. L'ajout d'un nouvel agent ne nécessite pas de réécrire l'orchestrateur ni de mélanger les responsabilités des pôles.
