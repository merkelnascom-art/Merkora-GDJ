# Fondation A — Famille 10 : Finance, assurance et comptabilité

**Version :** 1.0 — 16 novembre 2026  
**Identifiant canonique :** `family:finance-insurance`  
**Catalogue :** 90 concepts bilingues français / anglais  
**État :** catalogue raccordé au registre ; validation CI et revue spécialisée requises avant fusion.

## 1. Périmètre et domaines canoniques

Cette famille décrit les services bancaires et de paiement, la comptabilité et l'audit, l'assurance, les investissements et la microfinance. Elle réutilise les cinq domaines canoniques de la cartographie universelle :

- `domain:banking` — Banque ;
- `domain:accounting-audit` — Comptabilité et audit ;
- `domain:insurance` — Assurance ;
- `domain:investment-finance` — Investissement et finance ;
- `domain:microfinance` — Microfinance.

Le catalogue spécialisé ajoute 90 concepts classés sous ces domaines ; il ne recrée ni la famille ni les cinq domaines.

### Frontières avec les familles voisines

- **Famille 09 — Commerce et marchés :** vente, commande, catalogue, prix, distribution et relation commerciale. La Famille 10 traite les opérations financières, la comptabilité, les contrats d'assurance et les investissements. Une vente peut générer une facture, un paiement et une écriture comptable, qui restent des objets différents.
- **Famille 11 — Administration et gouvernance :** budgets publics, recettes et dépenses publiques, fiscalité publique et gestion des administrations. La présente famille couvre les services financiers, la conformité comptable et les prestations financières. Les finances publiques ne sont pas absorbées dans le domaine bancaire.
- **Famille 08 — Logistique :** achats, stocks et flux physiques. Les coûts et factures logistiques peuvent alimenter la comptabilité, sans transformer les opérations logistiques en activités comptables.
- **Famille 14 — Santé et services sociaux :** prestations de santé et soins. Les remboursements ou assurances santé sont modélisés ici côté assureur/financeur, tandis que les actes de soins restent dans leur domaine propre.

## 2. Distinctions conceptuelles impératives

Le moteur de compréhension ne doit jamais fusionner :

1. **Revenu, chiffre d'affaires, encaissement, bénéfice et trésorerie.** Le revenu ou chiffre d'affaires relève d'une définition comptable ; l'encaissement est un flux de règlement ; le bénéfice dépend des charges et règles de calcul ; la trésorerie décrit les disponibilités et flux de liquidité.
2. **Paiement, transfert, transaction bancaire et écriture comptable.** Un paiement est une opération de règlement ; son passage en banque et son enregistrement comptable sont des événements et traces distincts.
3. **Facture, reçu, relevé bancaire, contrat et preuve de paiement.** Ces documents n'ont ni la même fonction ni la même valeur probante.
4. **Crédit accordé, montant décaissé, capital restant dû, échéance, intérêt, pénalité et remboursement.** Les montants doivent être distingués dans le temps et selon le contrat.
5. **Comptabilité générale, comptabilité analytique, fiscalité, contrôle de gestion, audit interne et audit externe.** Ces disciplines se croisent, mais ont des objectifs, responsabilités et niveaux d'indépendance distincts.
6. **Assuré, souscripteur, bénéficiaire, payeur, courtier, agent, assureur et réassureur.** Une même personne peut occuper plusieurs rôles, mais ils ne sont pas interchangeables.
7. **Prime, cotisation, garantie, franchise, exclusion, sinistre, provision et indemnité.** Les conditions exactes sont celles du contrat et des règles applicables.
8. **Épargne, dépôt, investissement, titre, portefeuille, rendement et risque.** Un dépôt bancaire n'est pas un investissement en titres ; un rendement passé n'est pas une promesse de rendement futur.
9. **Microfinance, tontine, crédit informel et banque.** Les modèles, responsabilités, autorisations et protections peuvent différer selon le pays.
10. **Solde comptable, solde bancaire et trésorerie disponible.** Ils peuvent différer à cause des opérations en circulation, dates de valeur et éléments de rapprochement.

## 3. Couverture du catalogue

| Catégorie | Nombre |
|---|---:|
| Sous-domaines | 20 |
| Spécialisations | 7 |
| Métiers | 12 |
| Activités | 12 |
| Processus | 8 |
| Problèmes | 10 |
| Ressources | 7 |
| Fonctions numériques | 7 |
| Indicateurs | 7 |
| **Total** | **90** |

Les sous-domaines couvrent banque de détail et d'entreprise, paiements, crédit, comptabilité générale et analytique, fiscalité, audit, souscription, sinistres, assurances de personnes et de biens, réassurance, gestion d'actifs, marchés de capitaux, conseil financier, microfinance, épargne collective et microassurance.

Les spécialisations comprennent notamment finance participative, financement agricole, financement du commerce international, actuariat, finance durable, audit des organismes d'intérêt public et finance numérique inclusive.

Les métiers sont décrits comme des rôles professionnels et non comme des fonctions logicielles : conseiller bancaire, analyste crédit, comptable, contrôleur de gestion, auditeur, fiscaliste, souscripteur, gestionnaire de sinistres, actuaire, analyste investissement, gestionnaire de portefeuille et agent de microfinance.

## 4. Questionnaire adaptatif — une question par sous-écran

Le diagnostic est séquentiel. MerKora pose une question, enregistre et valide la réponse en arrière-plan, puis choisit la question suivante. Il ne présente pas un long formulaire à faire défiler.

### Étape A — Identifier l'activité réelle
- Quelle activité exercez-vous : banque, paiement, crédit, comptabilité, audit, assurance, investissement, microfinance, conseil ou activité mixte ?
- Êtes-vous un particulier, une entreprise, une association, une institution financière, un intermédiaire ou un prestataire ?
- Dans quel pays et sous quelle autorisation, licence, statut ou cadre contractuel exercez-vous, si cela s'applique ?

### Étape B — Identifier les acteurs et leurs responsabilités
- Qui demande, instruit, valide, exécute, contrôle et supervise chaque opération ?
- Qui est client, bénéficiaire, déposant, emprunteur, assuré, souscripteur, payeur, investisseur ou intermédiaire ?
- Quelles opérations nécessitent une double validation ou une séparation des tâches ?

### Étape C — Décrire les produits et engagements
- Quels comptes, moyens de paiement, crédits, contrats, garanties, produits d'épargne ou instruments d'investissement sont proposés ?
- Quelles sont les conditions, échéances, taux, frais, limites, risques, exclusions et documents contractuels ?
- Quelles règles sont fixes, négociables, réglementées ou soumises à approbation ?

### Étape D — Comprendre les opérations et les preuves
- Comment une demande est-elle reçue, vérifiée, décidée, exécutée, comptabilisée et clôturée ?
- Quelles pièces justificatives, signatures, validations et traces sont exigées ?
- Comment sont traités les paiements partiels, rejets, remboursements, retards, corrections et litiges ?

### Étape E — Identifier les difficultés et leurs causes
- Retards de clôture, erreurs d'écritures, impayés, fraude, défaut de rapprochement, dossiers incomplets, sinistres en attente, mauvaise visibilité de trésorerie, risques concentrés ?
- Quelle fréquence, quel montant, quelle période, quels clients ou quels produits sont concernés ?
- Quelles causes sont démontrées par des éléments, et lesquelles restent des hypothèses ?

### Étape F — Données, systèmes et indicateurs
- Quels volumes de comptes, contrats, transactions, écritures, prêts, polices, sinistres ou portefeuilles sont traités ?
- Quels outils sont utilisés : tableurs, logiciel comptable, ERP, core banking, plateforme de paiement, gestion de portefeuille ou logiciel d'assurance ?
- Quels indicateurs sont suivis, avec quelles formules, sources, dates et responsables ?

### Étape G — Valider le diagnostic
Le moteur restitue les faits, hypothèses, inconnues, contradictions, risques et options de solution. Le client valide les règles métier et les responsabilités avant la production du cahier des charges.

## 5. Parcours opérationnels de référence

### Cycle d'un crédit
Demande → identification et dossier → analyse de capacité et de risque → garanties → décision selon délégation → contrat → décaissement → échéancier → suivi et recouvrement → remboursement ou restructuration → clôture.

### Cycle comptable
Collecte des pièces → contrôle de validité → imputation → écriture → validation → rapprochement → ajustements → clôture périodique → états financiers → archivage et auditabilité.

### Cycle d'un sinistre
Déclaration → accusé de réception → contrôle du contrat et de la garantie → collecte de pièces → expertise si nécessaire → analyse contradictoire → décision habilitée → indemnisation ou refus motivé → clôture et recours éventuel.

### Gestion de portefeuille
Mandat et objectifs → profil de risque → analyse → décision autorisée → ordre et exécution via intermédiaire habilité → confirmation → valorisation → suivi des risques → reporting → rééquilibrage ou sortie.

### Microfinance et épargne collective
Adhésion et information → règles et consentements → contributions ou demande de crédit → évaluation → décision → décaissement éventuel → suivi des remboursements → rapprochement collectif → reddition des comptes aux membres.

## 6. Rôles et écrans possibles

Rôles selon le modèle : administrateur, directeur d'agence, agent bancaire, caissier, chargé de clientèle, analyste crédit, responsable risque, comptable, chef comptable, contrôleur de gestion, auditeur, fiscaliste, souscripteur, gestionnaire de sinistres, actuaire, conseiller en investissement, gestionnaire de portefeuille, agent de microfinance, conformité et contrôleur habilité.

Écrans possibles :
- tableau de bord financier et opérations ;
- clients, bénéficiaires et dossiers de vigilance ;
- comptes, dépôts et mouvements ;
- demandes de crédit, analyses, décisions et échéanciers ;
- paiements, transferts et rapprochements ;
- journal, grand livre, balance et pièces comptables ;
- budgets, coûts et analyses de gestion ;
- déclarations fiscales et échéances ;
- missions d'audit, constats et plans d'action ;
- produits, contrats, garanties et primes d'assurance ;
- déclarations de sinistres, expertises et règlements ;
- portefeuilles, positions, risques et performances ;
- groupes d'épargne et microcrédits ;
- conformité, habilitations, contrôles et journal d'audit.

Chaque écran dépend du diagnostic, du rôle et des habilitations réelles. Un même logiciel ne doit pas donner automatiquement accès à toutes les fonctions financières réglementées.

## 7. Architecture de données indicative

Entités possibles : organisation, établissement, personne, client, bénéficiaire effectif, partie prenante, compte, devise, solde, dépôt, retrait, transaction, ordre de paiement, transfert, frais, rapprochement, demande de crédit, analyse de risque, garantie, contrat de prêt, échéancier, échéance, remboursement, retard, provision, écriture, journal, compte comptable, pièce justificative, période, clôture, budget, centre de coût, déclaration fiscale, mission d'audit, constat, recommandation, produit d'assurance, police, assuré, souscripteur, bénéficiaire, prime, garantie, exclusion, sinistre, expertise, indemnité, réassurance, actif, titre, portefeuille, ordre d'investissement, valorisation, exposition, rendement, groupe d'épargne, cotisation, microcrédit et consentement.

Principes :
- conserver un identifiant stable, l'origine, la date d'effet et l'historique de chaque opération ;
- séparer données comptables, opérations bancaires, contrats, paiements et pièces justificatives ;
- appliquer des écritures correctives et contre-passations plutôt que supprimer silencieusement une opération validée ;
- gérer devises, taux de change, dates de transaction, dates de valeur et règles d'arrondi ;
- conserver les versions de taux, frais, conditions et paramètres de calcul ;
- séparer les données de production, de test et de démonstration ;
- définir les règles d'accès par rôle, portefeuille, agence, entité et juridiction ;
- prévoir la réconciliation avec les systèmes sources sans inventer de soldes.

## 8. Intégrations et outils possibles

Selon les besoins et les autorisations : logiciels comptables et ERP, core banking, systèmes de paiement, mobile money, banques partenaires, passerelles de paiement, plateformes de transfert, services d'identification autorisés, outils de conformité et de filtrage, gestion documentaire, signature électronique, systèmes de gestion d'assurance, plateformes de courtage, dépositaires, marchés réglementés, outils de reporting et services de notification.

Avant toute intégration, vérifier le statut réglementaire du prestataire, l'API officielle, les droits d'accès, les coûts, les limites, la sécurité, la résidence des données, les règles de conservation, les responsabilités contractuelles et les procédures de réversibilité.

## 9. Règles métier et contrôles

- Les calculs d'intérêts, commissions, primes, pénalités, frais, taux et échéanciers doivent être versionnés, testés et expliqués.
- Les décisions de crédit, souscription, investissement, indemnisation, paiement important et écriture de clôture suivent des délégations explicites.
- Les opérations sensibles exigent séparation des tâches, double contrôle et journalisation.
- Une opération rejetée, annulée, corrigée ou remboursée conserve sa trace et son motif.
- Les soldes et rapprochements ne sont jamais modifiés silencieusement par l'IA.
- Les retards et impayés déclenchent des workflows paramétrés, pas des pénalités arbitraires.
- Les règles de calcul des provisions, risques, ratios prudentiels et indicateurs dépendent du référentiel applicable.
- Les données d'identification et de vigilance sont collectées selon le principe de minimisation et les obligations locales.
- Les décisions d'assurance respectent contrats, exclusions, délais et voies de contestation.
- Les informations d'investissement affichent risques, hypothèses, frais et limites ; aucune performance n'est garantie.
- Les activités réglementées ou réservées sont bloquées si les autorisations requises ne sont pas confirmées.

## 10. Sécurité, conformité et précautions

Contrôle d'accès fort, authentification renforcée, séparation des environnements, chiffrement, gestion des secrets, journal d'audit non altérable, sauvegardes testées, continuité d'activité, limitation des exports, détection des accès inhabituels et procédure de réponse aux incidents.

Les données financières, patrimoniales, d'identité, de crédit, de santé assurée et de sinistre peuvent être particulièrement sensibles. Leur collecte, leur traitement, leur partage et leur conservation doivent être justifiés et conformes aux règles applicables.

Les obligations de licence, agrément, lutte contre le blanchiment et le financement du terrorisme, connaissance client, sanctions, protection des consommateurs, assurance, marchés financiers, fiscalité, comptabilité et audit varient selon les pays et activités. Le catalogue ne constitue ni un avis juridique, ni une autorisation d'exercer, ni un conseil d'investissement.

## 11. Prompts professionnels pour le moteur MerKora

- **Analyste financier :** « Reconstitue le modèle financier, les flux, acteurs, contrats, devises, échéances et responsabilités. Distingue les faits vérifiés, hypothèses et données manquantes. »
- **Comptable :** « Classe les opérations sans confondre paiement, facture, encaissement, trésorerie et écriture. Demande le référentiel comptable et les pièces manquantes avant toute imputation définitive. »
- **Analyste crédit :** « Présente les éléments de capacité de remboursement, les engagements, garanties et risques. Ne décide pas automatiquement de l'octroi et signale les données insuffisantes ou potentiellement discriminatoires. »
- **Gestionnaire d'assurance :** « Analyse le dossier au regard des clauses, garanties, exclusions, dates et pièces. Distingue les faits, les déclarations et les points à expertiser. »
- **Analyste investissement :** « Présente objectifs, horizon, frais, liquidité, risques, scénarios et incertitudes. Ne promets aucun rendement et ne remplace pas un professionnel habilité. »
- **Auditeur de cohérence :** « Recherche les écarts entre relevés, transactions, écritures, soldes, contrats et justificatifs. Propose des contrôles et laisse les corrections à une personne autorisée. »

## 12. Validation humaine et limites

Le catalogue est un socle universel initial de 90 concepts, pas une nomenclature exhaustive ni une liste d'activités autorisées. Les variantes locales, formes de tontine, produits de crédit, régimes fiscaux, référentiels comptables et contrats d'assurance devront être ajoutés avec leur juridiction, source et validation.

L'IA peut expliquer, rapprocher, détecter des anomalies et préparer des propositions. Elle ne doit pas approuver seule un crédit, réaliser un investissement, fixer une prime, rejeter un sinistre, déposer une déclaration fiscale, valider des comptes ou transférer des fonds.

Aucune modification Supabase, aucune suppression de données et aucun déploiement de production ne sont inclus dans cette famille.
