# Planification interne et pilotage administrateur — Conception

## Décision produit

Le plan de réalisation est un outil interne de MerKora. Le client ne génère pas, ne consulte pas et ne valide pas le plan technique ou opérationnel. Il exprime son besoin, choisit les fonctionnalités, valide les maquettes, accepte le devis et confirme les changements qui modifient réellement le résultat attendu. MerKora assume la responsabilité de l'organisation et de la fabrication.

## Parcours cible

1. Le client soumet son besoin et ses choix depuis le Studio.
2. Le client valide les maquettes et accepte le devis. Les changements commerciaux et de périmètre restent soumis à son accord.
3. L'administration vérifie le paiement et effectue le lancement officiel.
4. Le lancement officiel fait entrer le dossier dans une file interne « À planifier », de manière idempotente. Aucun travail payant ni worker n'est déclenché à cette étape.
5. L'administrateur génère le plan à partir du dossier, du devis accepté, des modules explicitement choisis et des maquettes validées. Les suggestions non sélectionnées restent exclues.
6. L'administrateur examine et ajuste les tâches, dépendances, livrables, critères de contrôle et hypothèses, puis valide le plan.
7. L'administrateur autorise l'exécution. La création du job et le déclenchement du worker restent des étapes distinctes.
8. Le worker ne démarre qu'après confirmation explicite de l'administrateur concernant le coût du Vercel Sandbox. Tout traitement IA externe payant conserve un consentement de traitement distinct et une confirmation de dépense distincte.
9. L'administrateur suit les tâches, vérifie les preuves et contrôle les jalons. La revue humaine reste obligatoire avant livraison.
10. Le client voit un suivi simplifié (statut global, jalon, éléments à tester ou décision métier nécessaire), jamais les détails internes de planification, de code ou d'infrastructure.

## Responsabilités

### Client
- Décrire son besoin et ses objectifs.
- Choisir les modules et options.
- Valider les maquettes.
- Accepter ou refuser le devis.
- Approuver les modifications substantielles de résultat, de périmètre commercial ou de prix.
- Tester le résultat présenté et signaler les corrections.

### Administration MerKora
- Générer, éditer et versionner le plan interne.
- Résoudre les questions internes ou solliciter le client uniquement pour une information métier indispensable.
- Valider le plan, les contrôles et les autorisations internes.
- Suivre l'exécution, les preuves, les blocages et les corrections.
- Autoriser séparément toute dépense ou action externe.

## Règles de sécurité et de traçabilité

- Les validations commerciales existantes (maquette, devis, paiement et lancement) ne sont ni effacées ni rejouées.
- Le lancement officiel doit créer ou rendre visible une entrée de planification interne, sans créer automatiquement un job de fabrication.
- La préparation du plan et sa validation ne déclenchent ni agent, ni Vercel Sandbox, ni fournisseur IA externe, ni déploiement.
- Le worker exige une version de plan immuable, deux validations administratives exactes liées au même digest (revue administrative et autorisation d'exécution), et une création de job atomique/idempotente.
- La validation du client sur un plan technique n'est plus une condition de lancement.
- Le consentement du client à un éventuel traitement par un fournisseur IA externe est une autorisation de confidentialité distincte, jamais présentée comme une approbation du plan. Elle est demandée uniquement si un tel traitement est effectivement nécessaire.
- Le lancement du worker dans Vercel Sandbox reste soumis à une confirmation de dépense explicite de l'administrateur.
- Aucun merge, déploiement de production, effacement ou réinitialisation de données Supabase n'est inclus.

## Interface attendue

### Administration
- Une file « Projets officiellement lancés — plan à préparer ».
- Une action « Générer le plan interne ».
- Un éditeur du plan avec périmètre source, tâches, dépendances, livrables, critères d'acceptation, jalons et questions.
- Des actions distinctes « Valider le plan interne », « Autoriser l'exécution », « Préparer le travail » et « Lancer le worker ».
- Une vue de suivi des tâches avec état, preuves, erreurs sûres et historique.
- Un contrôle qui empêche le lancement si le plan ou les autorisations administratives sont incomplets.

### Espace client
- Retirer le panneau « Générer mon plan », la lecture du plan technique et la confirmation du périmètre du plan.
- Conserver un suivi lisible du projet et les demandes d'information métier ou d'approbation de changement qui nécessitent réellement une décision du client.
- Ne jamais exposer les technologies, tâches internes, secrets, journaux techniques ou coûts internes.

## Cas Asho Sweet

Le dossier Asho Sweet conserve ses trois choix explicites : catalogue de gâteaux et pâtisseries, commande personnalisée, panier et validation de commande. Son devis accepté, le paiement confirmé au seuil de lancement, les maquettes validées et le lancement officiel existant servent de sources. L'administration prépare le plan interne à partir de ces éléments. Aucune nouvelle validation commerciale n'est demandée au client et aucun worker payant n'est lancé automatiquement.

## Critères d'acceptation

1. Un client connecté ne voit plus d'action pour générer ou confirmer un plan technique.
2. Un administrateur peut générer et enregistrer un plan interne pour un projet officiellement lancé.
3. Le plan reprend uniquement les choix sélectionnés et les éléments effectivement couverts par le devis accepté.
4. Le lancement commercial crée une entrée de planification visible une seule fois, même si l'événement est rejoué.
5. La génération, l'édition et la validation interne du plan ne créent aucun job et ne déclenchent aucun worker.
6. Un job ne peut être préparé qu'après validation administrative exacte du même plan.
7. Le client n'a pas à approuver le plan technique; ses accords restent requis pour les changements substantiels de sa demande.
8. Aucun coût Vercel Sandbox ou fournisseur IA externe n'est engagé sans les confirmations distinctes prévues.
9. Le suivi client ne révèle que le statut et les jalons adaptés au client.
10. Les validations et données existantes d'Asho Sweet sont préservées.

## Hors périmètre

- Refonte générale de l'administration ou du Studio.
- Génération automatique du code de l'application complète.
- Livraison ou publication automatique.
- Modification des montants, factures, paiements ou décisions commerciales déjà enregistrés.
