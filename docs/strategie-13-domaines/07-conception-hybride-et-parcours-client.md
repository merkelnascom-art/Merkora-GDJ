# Conception hybride MerKora — reconnaissance métier et diagnostic guidé

> Version de conception 1.0 — 12 novembre 2026  
> Statut : **conception proposée pour revue utilisateur**  
> Périmètre : conception fonctionnelle et architecture cible. Ce document n'affirme pas que toutes les fonctions sont déjà développées.

## 1. Décision de conception

MerKora ne doit jamais enfermer un projet dans une seule catégorie métier. Il doit comprendre l'activité principale, les activités secondaires, les fonctions transversales et les usages personnels ou organisationnels qui coexistent dans le besoin réel.

Un médecin peut demander un outil de présence pour son personnel, de gestion de rendez-vous pour son cabinet et de suivi du budget familial. Le projet peut donc combiner santé, ressources humaines, gestion du temps et finances personnelles. Le métier du demandeur ne suffit pas à classer le projet : c'est le travail que la solution doit réellement accomplir qui détermine sa composition.

La classification devient un résultat explicable et révisable, jamais une étiquette imposée.

## 2. Taxonomie : environ 500 secteurs dans 20 grands domaines

La cible produit est un référentiel extensible d'environ 500 secteurs, métiers, activités et sous-activités, organisés dans 20 grands domaines. Les 20 domaines sont des familles de navigation et de connaissance, pas des silos techniques. Un secteur peut être relié à plusieurs domaines lorsqu'il exerce réellement plusieurs activités.

### 2.1 Les 20 domaines-cadres proposés

1. Santé, médecine, pharmacie et bien-être.
2. Sport, fitness, loisirs sportifs et compétitions.
3. Agriculture, élevage, pêche et environnement.
4. Commerce, distribution, vente et e-commerce.
5. Finance, comptabilité, assurance et gestion patrimoniale.
6. Entrepreneuriat, direction et gestion des organisations.
7. Immobilier, architecture, urbanisme, BTP et maintenance des bâtiments.
8. Éducation, formation, recherche et orientation.
9. Transport, mobilité, logistique et automobile.
10. Restauration, alimentation, hôtellerie et hébergement.
11. Événementiel, culture, tourisme et voyages.
12. Ressources humaines, recrutement et organisation du travail.
13. Artisanat, fabrication, industrie et métiers techniques.
14. Services aux personnes, services à domicile et assistance.
15. Administration, collectivités, services publics et citoyenneté.
16. Droit, conformité, médiation et services juridiques.
17. Numérique, informatique, télécommunications et médias digitaux.
18. Énergie, eau, assainissement et services essentiels.
19. Sécurité, prévention, sûreté et gestion des risques.
20. Famille, vie personnelle, associations, solidarité et communauté.

Cette liste est une proposition de structuration cible. Les 13 domaines déjà présents dans le registre actuel doivent être conservés pendant la transition et reliés à ces 20 familles par une table de correspondance explicite. Aucun identifiant historique ne doit être supprimé ou renommé sans migration contrôlée. Les secteurs ne doivent pas être inventés pour atteindre artificiellement le nombre 500 : chaque entrée du catalogue devra avoir un libellé compréhensible, une description, des synonymes, des mots-clés, ses domaines liés et des exemples d'usages.

### 2.2 Structure d'une entrée de secteur

Chaque entrée du référentiel pourra contenir :

- identifiant stable et libellé du secteur ;
- domaine principal de référence et autres domaines liés ;
- métiers, variantes locales et synonymes ;
- activités courantes et problèmes fréquemment rencontrés ;
- profils d'utilisateurs et relations entre eux ;
- capacités métier souvent nécessaires ;
- questions de diagnostic pertinentes ;
- contraintes et précautions propres au secteur ;
- exemples de projets et critères d'acceptation.

Le référentiel doit être versionné et administrable. L'ajout d'un secteur ne doit pas nécessiter de modifier le moteur de conversation.

## 3. Moteur de reconnaissance hybride

Le moteur combine quatre niveaux complémentaires :

1. **Domaine principal** : le domaine qui porte l'objectif central du projet.
2. **Domaines secondaires** : les autres métiers qui apportent une activité réelle au projet.
3. **Spécialisations et secteurs** : le type précis de structure, métier ou activité.
4. **Capacités transversales** : présence, identité, rôles, finances, documents, notifications, paiements, communication, rapports, historique, intégrations, etc.

La classification doit s'appuyer sur le texte du client, les réponses du diagnostic, les opérations décrites, les utilisateurs, les résultats attendus et les liens entre les activités. Les mots-clés seuls ne suffisent pas.

### 3.1 Résultat de classification

Contrat conceptuel proposé :

```ts
type ProjectClassification = {
  primaryDomain: string | null;
  secondaryDomains: string[];
  sectors: string[];
  specializations: string[];
  transversalCapabilities: string[];
  evidence: Array<{
    itemId: string;
    reason: string;
    confidence: number;
  }>;
  confidence: number;
  status: "clear" | "hybrid" | "uncertain";
  clarificationQuestions: string[];
  clientConfirmed: boolean;
  version: string;
};
```

- **clear** : les activités principales et le résultat attendu sont suffisamment compris.
- **hybrid** : plusieurs domaines sont réellement nécessaires au projet.
- **uncertain** : les informations ne permettent pas de distinguer les usages ; MerKora pose une question ciblée.
- Une confiance calculée par l'IA n'est pas une validation du client.
- Le client peut corriger le domaine, ajouter un secteur, retirer une proposition ou préciser qu'une activité n'est pas concernée.
- L'historique conserve la proposition initiale, les corrections et la classification confirmée.

## 4. Parcours de conception guidé et adaptatif

Le parcours est un diagnostic progressif, non un formulaire géant. MerKora commence par comprendre l'idée et le problème, puis affiche les questions nécessaires au fur et à mesure. Il adapte les questions au niveau de clarté, au nombre de domaines et aux réponses déjà fournies.

### Étape A — Comprendre la personne et le projet

Identifier le demandeur et le contexte utile : personne, professionnel indépendant, entreprise, association, établissement, collectivité, famille ou autre organisation. Demander le nom du projet ou de la structure si utile, son activité réelle, le problème rencontré, ses causes, les personnes concernées et le résultat attendu.

Le demandeur peut décrire plusieurs activités dans un seul projet. MerKora ne doit pas déduire les besoins uniquement du titre, du statut ou de la profession.

### Étape B — Reconnaître les domaines et secteurs

MerKora affiche une synthèse lisible :
- domaine principal proposé ;
- domaines secondaires proposés ;
- secteurs et spécialisations détectés ;
- raisons de chaque proposition ;
- niveau de confiance et points à clarifier.

Le client peut cocher plusieurs secteurs, en décocher, en ajouter, corriger le domaine principal et écrire une activité qui ne figure pas dans le catalogue. La sélection multiple est normale et n'est pas traitée comme une anomalie.

### Étape C — Décrire les opérations réelles

Pour chaque activité retenue, MerKora cherche à comprendre ce que les personnes font concrètement : étapes de travail, événements déclencheurs, informations saisies, décisions, validations, documents produits, destinataires et résultat final.

Les questions propres à chaque domaine sont combinées aux questions communes. Une question déjà résolue ne doit pas être reposée sans raison.

### Étape D — Identifier les utilisateurs, rôles et responsabilités

Le diagnostic demande qui utilisera la solution et dans quel but :
- propriétaire, administrateur ou direction ;
- responsables de service ou superviseurs ;
- employés, agents, enseignants, soignants ou intervenants ;
- clients, patients, élèves, membres, fournisseurs ou partenaires ;
- visiteurs ou utilisateurs publics ;
- personnes externes autorisées à consulter ou transmettre une information.

Pour chaque profil, préciser les actions permises, les données visibles, les validations nécessaires et les limites d'accès. MerKora propose une matrice de rôles, mais le client ou le responsable habilité la confirme. Il ne doit pas attribuer automatiquement des droits sensibles.

### Étape E — Comprendre les relations et contacts

Identifier comment les utilisateurs et les clients finaux interagissent avec l'organisation :
- qui peut contacter qui ;
- qui peut initier une conversation ;
- quels renseignements peuvent être visibles publiquement ;
- quels canaux sont souhaités : espace dans l'application, téléphone, e-mail, WhatsApp ou autre canal disponible ;
- qui reçoit une demande et qui doit y répondre ;
- comment une demande est suivie jusqu'à sa clôture.

La solution doit permettre au client de choisir comment ses propres clients, patients, membres ou partenaires peuvent le joindre, dans les limites de sécurité et de confidentialité applicables. Les coordonnées privées ne deviennent pas publiques par défaut.

### Étape F — Définir les notifications et rappels

Demander quels événements doivent déclencher une notification, à qui, par quel canal, à quel moment et avec quelle priorité. Exemples : nouvelle demande, rendez-vous, retard, absence, paiement attendu, stock faible, document manquant, validation en attente, rapport disponible ou incident.

Distinguer les alertes obligatoires au fonctionnement, les rappels configurables et les messages promotionnels. Le client choisit les canaux autorisés et les préférences de fréquence. Prévoir l'historique d'envoi, les échecs et les possibilités de désactivation lorsque c'est approprié.

### Étape G — Connexion, appareils et intégrations

Comprendre les conditions réelles d'utilisation :
- téléphone, ordinateur, tablette, terminal partagé ou équipement spécialisé ;
- connexion Internet permanente, intermittente ou absente ;
- fonctionnement hors ligne nécessaire ou non ;
- plusieurs sites, agences, salles ou lieux de travail ;
- comptes existants et services à connecter ;
- import/export de données, API, synchronisation ou saisie manuelle ;
- appareils et méthodes d'identification souhaités.

Ne jamais supposer qu'une intégration, un appareil biométrique, un paiement ou un service externe est disponible ou gratuit. Présenter les prérequis, limites, coûts éventuels et alternatives avant validation.

### Étape H — Identification et sécurité

Questionner le niveau d'identification nécessaire : compte individuel, code d'accès, e-mail/téléphone, authentification renforcée, badge, QR code ou dispositif spécialisé. La biométrie n'est jamais proposée comme exigence par défaut ; elle demande une justification, une analyse de proportionnalité, des garanties et une validation explicite.

Identifier les données sensibles, les règles d'accès, les journaux d'audit, les sauvegardes, la conservation, la suppression, la récupération de compte et les risques de partage d'appareils. Le principe est le moindre privilège.

### Étape I — Documents, finances et rapports

Selon les besoins détectés, demander si le projet doit gérer les pièces jointes, contrats, reçus, factures, paiements, budgets, recettes, dépenses, commissions, rapports quotidiens/hebdomadaires/mensuels, tableaux de bord ou exports.

Ces capacités restent facultatives. La présence d'une entreprise ne signifie pas automatiquement qu'elle veut une comptabilité complète ; la présence d'un médecin ne signifie pas automatiquement qu'il veut un dossier médical numérique.

### Étape J — Priorités, limites et validation du périmètre

Demander les contraintes de budget, délai, langue, accessibilité, équipement, niveau de compétence numérique, maintenance, hébergement et évolutivité. Séparer les besoins indispensables, utiles, facultatifs et futurs.

Avant de passer à la maquette ou au plan, présenter une synthèse que le client peut corriger et confirmer.

## 5. Présentation des limites détectées et options à cocher

Chaque limite identifiée doit être présentée comme une fiche claire, reliée à une décision du client. MerKora ne doit pas seulement dire « il manque cette fonction » : il explique la conséquence et propose des réponses possibles.

Structure conceptuelle d'une fiche :

- **Constat / limite** : ce que l'analyse a détecté ou ce qui n'est pas encore défini.
- **Pourquoi c'est important** : conséquence concrète si rien n'est prévu.
- **Options proposées** : choix multiples sous forme de cases à cocher.
- **Réponse du client** : petit champ libre pour préciser son choix.
- **Autre besoin** : possibilité de décrire une solution ou une contrainte non proposée.
- **Statut** : à examiner, retenu, refusé, à confirmer ou reporté.

Exemple :

**Limite détectée :** les employés peuvent être enregistrés, mais aucune règle de validation des présences n'est encore définie.

**Pourquoi c'est important :** sans responsable de validation, une correction d'heure ou une absence contestée pourrait être acceptée sans contrôle.

**Options proposées :**
- [ ] Le responsable de service valide les corrections.
- [ ] La direction valide les exceptions.
- [ ] L'employé peut demander une correction avec justification.
- [ ] Un historique conserve chaque modification.
- [ ] Autre règle : champ de réponse libre.

Chaque option peut avoir un champ « Précisez » lorsque son fonctionnement dépend du contexte. Les options doivent être réellement multiples lorsque plusieurs réponses peuvent coexister. MerKora ne doit pas sélectionner automatiquement toutes les options recommandées.

## 6. Modèle de données de conception

Le modèle cible doit distinguer les éléments proposés par l'IA, les réponses du client et les éléments confirmés :

- **ProjectIntake** : demande initiale, demandeur, contexte, objectif et versions.
- **ProjectClassification** : domaines, secteurs, spécialisations, preuves, confiance et confirmation.
- **ActivityContext** : activité, opération, site et relation avec les autres activités.
- **StakeholderProfile** : profil utilisateur, objectifs et relations.
- **RoleProposal** : rôle proposé, permissions envisagées, justification et validation.
- **QuestionnaireResponse** : question, réponse structurée, texte libre, auteur et date.
- **GapFinding** : limite constatée, preuve, conséquence et priorité.
- **OptionProposal** : option, origine, domaine, dépendances et statut.
- **ClientSelection** : option cochée/décochée, précision libre et confirmation.
- **CommunicationPreference** : canaux, destinataires, règles et consentements nécessaires.
- **NotificationRule** : événement, destinataires, canal, fréquence et priorité.
- **IntegrationRequirement** : service ou appareil, objectif, prérequis, statut et coût à confirmer.
- **ScopeDecision** : inclus, exclu, reporté ou à confirmer, avec auteur et historique.

Les noms sont conceptuels : les schémas exacts doivent suivre les conventions existantes du dépôt. Les réponses libres ne doivent pas être perdues lors de la génération des plans ou des maquettes.

## 7. Comment la conception alimente toute la fabrication

La classification et les réponses confirmées doivent former un contexte de projet partagé par les étapes suivantes :

1. Questionnaire adaptatif et relances pertinentes.
2. Catalogue de secteurs et options métier.
3. Détection des limites, dépendances et risques.
4. Proposition de modules et capacités transversales.
5. Matrice des utilisateurs, rôles et permissions.
6. Parcours de communication, notifications et intégrations.
7. Studio de maquettes et scénarios d'utilisation.
8. Architecture et modèle de données.
9. Plan de réalisation, tâches et critères de test.
10. Fabrication, vérification, livraison et documentation.
11. Espace administrateur : synthèse, décisions en attente, périmètre confirmé, risques et suivi.

Chaque étape doit distinguer clairement :
- **détecté par MerKora** ;
- **proposé par MerKora** ;
- **choisi par le client** ;
- **confirmé par le client ou responsable habilité** ;
- **réalisé et vérifié**.

Aucune option non choisie ne doit entrer silencieusement dans le périmètre, le devis, la fabrication ou les permissions. Les éléments indispensables au fonctionnement peuvent être signalés comme dépendances, mais ils doivent être expliqués et validés avant engagement.

## 8. Exemple complet : médecin avec des besoins hybrides

Une médecin dirige un cabinet. Elle souhaite :
- suivre les présences et retards de ses employés ;
- organiser les rendez-vous et les demandes des patients ;
- suivre les recettes et dépenses du cabinet ;
- suivre séparément le budget de sa famille.

MerKora propose :
- domaine principal : santé et gestion du cabinet ;
- domaines secondaires : ressources humaines et finance ;
- contexte personnel distinct : budget familial ;
- capacités transversales : identité, rôles, présence, agenda, communication, notifications, rapports et séparation des espaces.

Le diagnostic demande ensuite :
- qui pointe et qui valide les présences ;
- si les employés peuvent demander une correction ;
- comment les patients prennent contact et reçoivent les rappels ;
- quelles informations de santé sont réellement nécessaires au projet ;
- qui saisit et contrôle les recettes et dépenses ;
- si le budget familial doit être dans un espace privé distinct, sans visibilité pour le personnel du cabinet ;
- quels appareils et quelles connexions sont disponibles.

La maquette montre des espaces séparés selon les rôles. Le client coche les fonctions retenues, précise les règles et confirme les limites. Les données familiales restent séparées des données du cabinet et ne sont accessibles à aucun employé. Les règles médicales, financières et de confidentialité sont soumises aux validations appropriées.

## 9. Règles de sécurité et de gouvernance

- La profession du demandeur n'autorise pas à déduire toutes ses fonctionnalités.
- Un projet multi-domaines est normal ; ne pas forcer un choix unique.
- Les recommandations de l'IA restent non confirmées jusqu'à décision explicite.
- Les droits sont définis par rôle et par ressource, avec moindre privilège.
- Les espaces personnels et professionnels doivent pouvoir être séparés.
- Les données médicales, financières, biométriques, familiales ou administratives exigent des précautions adaptées et une collecte minimale.
- Aucun canal de contact personnel n'est rendu public sans choix explicite.
- Aucune intégration ou dépense n'est engagée sans disponibilité, coût et accord confirmés.
- Les décisions et changements de périmètre sont historisés.
- L'IA doit demander une précision lorsqu'elle hésite au lieu de masquer l'incertitude.

## 10. Critères d'acceptation de la conception

1. Un même projet peut avoir un domaine principal, plusieurs domaines secondaires, plusieurs secteurs et plusieurs capacités transversales.
2. Un cas hybride santé + présence + finances personnelles est correctement représenté sans fusionner les données.
3. Le client peut cocher plusieurs options, en retirer, ajouter un besoin libre et corriger la classification.
4. Chaque limite possède une explication, des options pertinentes et un champ de précision.
5. Les questions d'identité, d'utilisateurs, de rôles, de notifications, de contacts, de connexion, d'intégrations, de sécurité et de rapports sont proposées selon le contexte.
6. Les réponses et sélections alimentent la maquette, le plan et l'architecture sans perte.
7. Une option proposée mais non confirmée reste hors périmètre.
8. Une incertitude déclenche une question ciblée et reste visible dans le dossier.
9. Les 13 identifiants historiques restent compatibles pendant l'évolution vers les 20 domaines-cadres.
10. Le référentiel de secteurs peut évoluer vers environ 500 entrées sans imposer de règles codées en dur pour chaque secteur.

## 11. Décisions à confirmer pendant la revue

- Valider ou ajuster les libellés et frontières des 20 domaines-cadres.
- Définir le mode d'administration du référentiel des quelque 500 secteurs et le processus de validation des nouvelles entrées.
- Définir les seuils de confiance qui déclenchent une question ; ces seuils doivent être testés et configurables, pas présentés comme des vérités universelles.
- Définir les canaux de notification réellement disponibles selon les intégrations activées.
- Définir les règles de conservation et les obligations locales par type de données et secteur.

## 12. Hors périmètre de cette conception

Ce document ne lance aucun achat, abonnement, connexion à un fournisseur, collecte de données réelles, activation biométrique, migration destructive, déploiement ou mise en production. Ces opérations nécessiteront des validations séparées.
