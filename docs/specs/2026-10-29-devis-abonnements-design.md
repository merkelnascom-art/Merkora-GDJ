# Conception — Devis, abonnements et parcours commercial MerKora GDJ

- **Date :** 2026-10-29
- **Dépôt :** `merkelnascom-art/Merkora-GDJ`
- **Branche cible :** `feature/admin-preview-secure-access`
- **Statut :** conception proposée à la relecture de l’utilisateur ; aucune implémentation métier incluse dans ce document
- **Périmètre :** devis, décisions client, négociation, catalogue d’abonnements et transitions vers paiement/réalisation, en prévisualisation uniquement

## 1. Objectif produit

Permettre à MerKora GDJ de transformer une demande client en proposition commerciale compréhensible, chiffrée et traçable. L’administration prépare et contrôle les devis ; le client les consulte dans son espace et peut accepter une version précise, demander une modification ou engager une négociation. Les abonnements standard et les prestations personnalisées utilisent des règles cohérentes, sans confondre proposition, acceptation, paiement, démarrage des travaux et livraison.

Le système doit préserver les dossiers existants et expliquer clairement ce qui est inclus, exclu, ponctuel ou récurrent. Aucun prix, frais, délai ou engagement ne doit être inventé lorsque les données nécessaires manquent.

## 2. Approches étudiées

### Option A — Modèle commercial unifié (recommandée)

Construire le devis, le catalogue d’abonnements, les décisions client et les étapes de projet autour de contrats de données et de statuts distincts. Réutiliser la réception de demandes existante et ajouter progressivement l’éditeur de devis puis l’espace client.

- **Avantages :** cohérence entre devis, abonnements et réalisation ; historique traçable ; évite une refonte lorsque les paiements seront ajoutés.
- **Limites :** nécessite de définir les états et les règles avant l’interface ; le paiement reste une étape distincte.

### Option B — Devis isolé en premier

Créer uniquement un formulaire et un document de devis, sans définir les abonnements et transitions futures.

- **Avantages :** première interface potentiellement plus rapide.
- **Limites :** risque de devoir remanier les données, le statut d’acceptation et la logique de facturation ensuite.

### Option C — Abonnements d’abord

Créer un catalogue de formules et repousser les devis personnalisés.

- **Avantages :** convient à une offre standard très simple.
- **Limites :** ne couvre pas les projets complexes, les négociations ou les périmètres personnalisés de MerKora.

**Décision de conception :** retenir l’option A. Construire en petites étapes, en commençant par le modèle de devis et l’éditeur administrateur.

## 3. Parcours commercial

1. Le client soumet une demande à partir de son dossier. La demande existante reste la source d’entrée ; les préférences locales du studio ne sont pas considérées automatiquement comme une preuve de validation commerciale.
2. L’administration examine le besoin, les informations disponibles, les hypothèses et les éventuels coûts à confirmer.
3. L’administration choisit une offre standard existante ou prépare un devis personnalisé, avec lignes de prestations, délais, conditions et éléments exclus.
4. Le devis est enregistré comme brouillon, puis publié au client sous une version immuable.
5. Le client peut :
   - accepter explicitement la version affichée ;
   - demander des modifications en précisant ses observations ;
   - demander une négociation.
6. Toute modification commerciale crée une nouvelle version du devis. Une décision client antérieure reste attachée à la version qu’il a réellement vue.
7. L’administration examine la réponse et publie, si nécessaire, une nouvelle version. Les remises, changements de périmètre et engagements restent sous validation humaine.
8. Après acceptation du devis par le client, les conditions convenues sont vérifiées. Le paiement est suivi séparément et ne peut être déclaré reçu que sur preuve ou confirmation vérifiable.
9. Le projet passe en réalisation seulement lorsque les prérequis convenus sont satisfaits. Le suivi de réalisation, les livrables et la livraison sont distincts de l’acceptation commerciale.

Une acceptation administrative d’un dossier ne vaut pas acceptation du devis par le client. Une acceptation de devis ne prouve pas le paiement. Une maquette approuvée n’est ni un devis ni un ordre de réalisation.

## 4. Contenu du devis

Chaque devis comporte les champs applicables suivants.

### 4.1 Identification et version

- numéro unique de devis ;
- date d’émission et date de validité ;
- identifiants du client et du dossier, titre du projet ;
- numéro de version ;
- statut courant ;
- identité du préparateur et, lorsque nécessaire, de la personne ayant autorisé une remise ou une exception.

### 4.2 Lignes chiffrées

Chaque ligne contient une description intelligible, une catégorie de prestation, une quantité, une unité, un prix unitaire, un montant calculé et des notes éventuelles. Les catégories peuvent comprendre conception, développement, configuration, intégration, tests, formation, déploiement, hébergement, maintenance, options et autres coûts réellement identifiés.

Le total est calculé à partir des lignes et des règles de remise/taxe explicites. Les valeurs monétaires sont enregistrées avec une devise explicite, par défaut XOF/FCFA pour le contexte initial, sans présumer d’une obligation fiscale. Les taxes ne sont appliquées que lorsque leur taux et leur applicabilité ont été confirmés par une personne autorisée. Les montants ne sont pas recalculés à partir d’un texte libre lorsque des valeurs structurées sont disponibles.

Un coût inconnu doit être marqué « à confirmer » ou exclu explicitement du total avec explication ; il ne doit jamais être traité silencieusement comme zéro. Les estimations sont distinguées des montants confirmés.

### 4.3 Conditions commerciales

- description du périmètre inclus ;
- exclusions, hypothèses et dépendances client ;
- délai estimé et étapes ou jalons ;
- nombre de cycles de révision inclus, si applicable ;
- modalités et échéances de paiement ;
- garantie, maintenance et support inclus ou exclus ;
- frais ponctuels et récurrents séparés ;
- options facultatives et leurs effets sur le prix ou le délai ;
- conséquences d’une expiration d’abonnement, communiquées avant souscription ;
- durée de validité et conditions d’acceptation.

Les conditions doivent être lisibles avant l’action d’acceptation. Les exigences légales, fiscales et contractuelles locales doivent être vérifiées avant un usage commercial réel ; cette spécification technique ne constitue pas un avis juridique.

## 5. États et historique

### 5.1 États de devis proposés

- `draft` — brouillon interne, invisible au client ;
- `pending_client` — version publiée, décision client attendue ;
- `changes_requested` — le client a demandé des modifications ;
- `negotiation` — discussion commerciale en cours ;
- `accepted_by_client` — le client a accepté cette version ;
- `declined_by_client` — le client a refusé cette version ;
- `expired` — la validité est échue sans acceptation ;
- `superseded` — remplacé par une version ultérieure.

Les états doivent être validés par une liste fermée côté serveur. Les transitions non autorisées sont refusées et affichent un message clair. Les changements de version et les décisions sont horodatés.

### 5.2 Historique immuable

Chaque version publiée conserve un instantané du contenu commercial présenté au client : lignes, prix, devise, conditions, échéance, périmètre et version. Une modification ne réécrit pas une version déjà publiée ou acceptée. L’historique doit enregistrer la décision, l’auteur et la date, sans exposer au client les notes internes de l’administration.

La décision d’acceptation doit se rapporter explicitement à l’identifiant et au numéro de version du devis. L’interface affiche un résumé clair avant confirmation. Les actions sensibles nécessitent une vérification serveur de l’identité, de l’autorisation et de la propriété du dossier.

## 6. Types d’offres et abonnements

Le modèle doit permettre :
- **offre forfaitaire** : prix défini pour un périmètre défini ;
- **offre personnalisée** : lignes et conditions adaptées au projet ;
- **offre évolutive** : périmètre initial et options ou évolutions distinctes ;
- **maintenance/support** : prestation ponctuelle ou récurrente clairement identifiée ;
- **abonnement standard** : accès récurrent aux fonctions décrites par une formule.

Catalogue initial à définir avant activation commerciale :

- **Découverte gratuite** : exploration, description du besoin et préparation d’un dossier, dans les limites qui seront documentées ;
- **Simple** : fonctions essentielles d’une solution standard ;
- **Avancé** : ensemble étendu de modules et fonctions ;
- **Premium** : fonctions avancées explicitement décrites dans l’offre.

Les noms sont des catégories de travail et ne constituent pas encore des promesses commerciales. Prix, quotas, limites, renouvellement, durée, support, frais de mise en service et fonctions incluses doivent être fixés et affichés avant la souscription. Aucune formule payante ne doit être activée avec un prix implicite ou un contenu indéfini.

Le système doit distinguer :
1. le prix initial de conception/développement ;
2. les frais ponctuels de mise en service ;
3. l’abonnement récurrent ;
4. les frais externes éventuels (hébergement, domaine, fournisseur tiers) ;
5. les options ou évolutions ultérieures.

Ces catégories ne doivent pas être fusionnées en un seul montant sans explication.

## 7. Expiration, changement de formule et conservation

- L’expiration d’un abonnement ne supprime ni le dossier client, ni les devis, ni l’historique des décisions.
- Les droits d’accès aux fonctions peuvent changer selon les règles de la formule, annoncées avant l’achat.
- Un retour à la formule gratuite ne doit pas effacer les données du client ni détruire un projet déjà payé.
- Les fonctions avancées ou les nouvelles demandes peuvent être limitées après expiration, mais les conditions de consultation, d’export et de conservation doivent être explicites.
- Aucun renouvellement payant automatique ne doit être ajouté sans mécanisme et consentement explicites, et sans moyen clair de consulter les conditions.
- Les accès aux données et actions sont vérifiés côté serveur ; les données d’un client ne doivent jamais être accessibles à un autre client.

## 8. Négociation et rôle de l’IA

L’IA peut aider à résumer la demande, repérer des informations manquantes, suggérer des lignes de prestation et expliquer les compromis possibles. Elle peut proposer des variantes de périmètre et recalculer une simulation à partir de tarifs structurés et de règles connues.

L’IA ne peut pas :
- inventer les prix ou présenter des coûts inconnus comme confirmés ;
- publier ou accepter un devis au nom de l’administration ;
- accorder une remise ou modifier les conditions contractuelles sans validation autorisée ;
- affirmer qu’un paiement est reçu sans preuve ;
- déclencher une réalisation ou une livraison sans les validations prévues.

Le moteur IA externe reste désactivé par défaut. Le parcours de devis doit être utilisable manuellement sans aucun appel payant. Aucune fonction créditée ou service tiers payant ne doit être activé dans le cadre de cette livraison.

## 9. Architecture et intégration

### 9.1 Réutiliser l’existant

- conserver la réception actuelle des demandes clients et ses contrôles d’accès ;
- intégrer l’éditeur de devis dans l’espace administrateur existant ;
- présenter au client ses devis et décisions dans son espace ;
- réutiliser les conventions TypeScript, Next.js App Router et les utilitaires d’authentification/RLS existants ;
- garder séparées les préférences locales du studio, les dossiers synchronisés et les données commerciales centralisées.

### 9.2 Persistance

Avant tout changement de schéma, inspecter les tables, routes et politiques RLS déjà disponibles. Aucune migration n’est autorisée implicitement par cette conception. Si une nouvelle structure s’avère indispensable, proposer une migration strictement additive, documenter les tables et politiques nécessaires, puis demander l’accord explicite de l’utilisateur avant de l’exécuter.

Les données commerciales doivent être liées au client et au dossier avec une vérification de propriété. Les politiques RLS doivent empêcher un client de lire ou modifier les devis d’un autre client. L’administration utilise l’accès sécurisé existant et n’ajoute pas de secret service-role au navigateur ni au dépôt.

### 9.3 Interface

**Administration :**
- liste des demandes et filtres de statut ;
- ouverture d’un dossier ;
- création et édition d’un brouillon de devis ;
- ajout, modification, suppression et réordonnancement des lignes ;
- calcul automatique des sous-totaux et du total ;
- saisie des conditions, délais, validité et frais récurrents ;
- aperçu avant publication ;
- publication d’une nouvelle version ;
- lecture des décisions client et de l’historique ;
- affichage distinct des notes internes.

**Client :**
- liste des devis liés à ses dossiers ;
- détail complet de la version courante et accès à l’historique pertinent ;
- acceptation explicite de la version affichée ;
- demande de modification avec commentaire ;
- demande de négociation avec commentaire ;
- confirmation visible de l’action et de la version concernée.

**Documents :**
La vue de devis doit être imprimable depuis le navigateur en première étape, afin d’éviter une dépendance à un service PDF payant. La génération ou le téléchargement d’un PDF dédié peut être ajouté seulement si cela reste compatible avec les ressources gratuites et la qualité requise.

## 10. Sécurité, erreurs et états vides

- Toutes les routes vérifient l’identité, l’autorisation et la propriété du dossier côté serveur.
- Les actions qui modifient les données vérifient l’origine de la requête selon les conventions du projet, valident les champs et refusent les statuts inconnus.
- Les prix, totaux et transitions sensibles sont recalculés ou validés côté serveur ; le navigateur ne constitue pas une autorité.
- Les erreurs réseau, session expirée, absence de devis, conflit de version et échec de sauvegarde doivent être expliqués clairement.
- Une action n’affiche jamais « enregistré », « accepté » ou « payé » avant confirmation du serveur.
- Les notes internes et données sensibles de l’administration ne sont jamais renvoyées à l’API client.
- Les formulaires sont utilisables sur mobile et au clavier ; les champs ont des libellés, erreurs et confirmations accessibles.
- Les données existantes restent intactes ; aucune remise à zéro ou suppression globale n’est autorisée.

## 11. Vérification et critères d’acceptation

La première livraison commerciale ne sera considérée comme vérifiée que si les contrôles suivants passent sur l’aperçu :

1. un administrateur autorisé peut créer et sauvegarder un brouillon ;
2. les lignes calculent des sous-totaux cohérents et le total correspond aux règles visibles ;
3. les champs requis, montants négatifs non autorisés, devise, dates et statuts invalides sont rejetés ;
4. un brouillon n’est pas visible dans l’espace client ;
5. la publication rend une version déterminée visible au bon client ;
6. un client ne peut ni consulter ni modifier le devis d’un autre client ;
7. l’acceptation, la demande de modification et la négociation sont enregistrées sur la version exacte ;
8. une nouvelle version ne détruit pas l’ancienne ;
9. une note interne reste invisible au client ;
10. aucune décision de devis ne marque automatiquement un paiement reçu ou un projet livré ;
11. les dossiers existants et la table actuelle `client_requests` restent intacts ;
12. les vérifications automatisées du projet, le build et les tests disponibles passent ;
13. le déploiement est vérifié en Preview uniquement ; aucune promotion en production n’est effectuée.

Le premier parcours ne comprend pas l’encaissement réel, le renouvellement automatique, la facturation fiscale, la signature électronique qualifiée ni l’activation d’un fournisseur IA payant. Ces fonctions exigent une conception et une validation séparées.

## 12. Découpage d’implémentation proposé

1. Inspecter les tables, types, composants et routes existants ; confirmer le modèle de données sans modifier la base.
2. Définir les types et fonctions pures de calcul/validation des devis, avec tests unitaires.
3. Construire l’éditeur de brouillon administrateur et l’aperçu imprimable.
4. Concevoir la persistance et les autorisations. Si le schéma actuel ne suffit pas, s’arrêter et demander l’autorisation avant toute migration additive.
5. Ajouter la publication versionnée et la consultation client.
6. Ajouter les décisions client et la négociation avec historique.
7. Définir le catalogue des abonnements et les règles d’expiration, sans activer de tarification tant qu’elle n’est pas validée.
8. Vérifier les tests, le build, les accès et le parcours complet sur Preview.

## 13. Contraintes non négociables

- Aucun coût supplémentaire, abonnement développeur ou appel IA payant.
- Aucun changement de production ou de branche principale.
- Aucune réinitialisation, suppression ou modification destructive de données.
- Aucune création de projet Supabase ou de branche Supabase.
- Aucune clé secrète ajoutée au dépôt ou exposée au navigateur.
- Aucun changement de schéma sans accord explicite.
- Aucun résultat présenté comme fonctionnel avant une vérification réelle.

## 14. Questions commerciales laissées volontairement à valider

Les montants exacts, taxes applicables, prix des formules, limites d’utilisation, frais externes, conditions de renouvellement et délais types ne sont pas déterminés dans cette conception. Ils devront être définis à partir des coûts et capacités réels de MerKora, puis validés par l’administration avant toute publication. En attendant, l’interface doit pouvoir enregistrer un brouillon clairement marqué comme incomplet et empêcher sa publication si les informations indispensables manquent.
