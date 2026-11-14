# MerKora GDJ — synchronisation des sept pôles avec la fabrique

Date : 14 novembre 2026  
Statut : contrat de coordination ajouté sur une branche isolée ; exécution réelle non activée.

## 1. Réutiliser les fondations existantes

Cette intégration ne remplace pas les travaux déjà présents dans MerKora GDJ. Elle les relie progressivement.

| Fondation existante | Responsabilité conservée |
|---|---|
| Référentiel stratégique des 13 domaines | Dossiers métier approfondis et principes opérationnels |
| Référentiel universel | 20 familles, 100 secteurs et catalogue extensible de métiers |
| Référentiel de professions | Candidats métier indexés ; le comptage précédemment contrôlé était de 484 candidats, et non 2 000 fiches approfondies |
| Compréhension universelle | Séparer intentions, faits, hypothèses, contraintes et questions |
| Modèle de projet universel | Conserver les besoins, relations inconnues, rôles à confirmer et formats de solution |
| Découverte et options métier | Proposer des options sans les inclure avant le choix du client |
| Studio et mémoire de projet | Conserver les versions, décisions, maquettes et réponses du client |
| Génération de plans | Produire un plan versionné à partir du besoin et du périmètre approuvés |
| Orchestration multi-IA | Affecter des rôles génériques à des fournisseurs autorisés |
| Contrats et cycle d'exécution | Valider les résultats, dépendances, transitions et preuves |
| Fabrique et worker | Préparer les tâches, exécuter dans un environnement isolé et revenir en revue humaine |
| Équipe et accès projet | Encadrer les accès des collaborateurs et des utilisateurs du livrable |

La cible du référentiel universel est un catalogue pouvant aller jusqu'à 2 000 métiers candidats. Ce plafond ne signifie pas que 2 000 fiches professionnelles complètes sont déjà rédigées ou vérifiées. Les référentiels et les dossiers métier doivent rester les sources de vérité ; le catalogue d'agents ne doit pas les recopier.

## 2. Parcours de fabrication coordonné

Le planificateur de cette branche relie le catalogue des 35 spécialistes au graphe de dépendances existant.

1. **Intelligence** — comprendre l'activité, les besoins, les causes possibles, les contraintes et les contradictions.
2. **Conception** — élaborer les parcours, les maquettes, les règles, les spécifications et l'architecture.
3. **Gouvernance avant fabrication** — préparer l'estimation, le budget, le devis et les autorisations.
4. **Fabrication** — construire les composants et livrables retenus.
5. **Contrôle** — tester, auditer, détecter les erreurs et transmettre les corrections.
6. **Gouvernance avant livraison** — vérifier le dossier administratif et les conditions de sortie.
7. **Exploitation** — préparer les environnements, la supervision, la maintenance et les opérations autorisées.
8. **Relation client** — documenter, former, livrer, suivre les demandes et accompagner après livraison.

Les agents d'une même phase peuvent être planifiés en parallèle. Une phase dépend de toutes les missions de la phase précédente sélectionnée. Les phases non nécessaires ne sont pas artificiellement activées. Le pôle transversal intervient à deux moments de gouvernance et ses contrôles peuvent aussi être sollicités par les autres pôles.

## 3. Contrats et correspondances techniques

- Les 35 spécialistes conservent leur identifiant, leur pôle et leur contrat descriptif.
- Le sélecteur n'ajoute aucun spécialiste non demandé.
- Les spécialistes compatibles sont préparés sous les six rôles d'exécution existants : analyst, architect, implementer, reviewer, tester et cross_checker.
- Les spécialistes sans rôle générique sémantiquement adapté restent explicitement marqués `requires_specialized_runtime`. Ils ne sont pas envoyés arbitrairement à un modèle sous un faux rôle.
- Le contrat de mission existant continue d'exiger un résultat structuré, une portée projet, des constats et une section de vérification.
- Le graphe d'exécution existant vérifie les dépendances ; le cycle d'exécution existant conserve les transitions, les approbations, les tentatives et les états d'échec.
- Les rapports d'un fournisseur ne constituent pas des preuves indépendantes. Les tests doivent être exécutés par les mécanismes de vérification de confiance.

## 4. Portes de décision

Le planificateur expose les portes suivantes, toutes à l'état `not_evaluated` jusqu'à lecture de la source d'autorisation existante :

- validation du périmètre par le client ;
- revue administrative du plan et du devis ;
- autorisation explicite de fabrication ;
- acceptation des contrôles qualité ;
- autorisation distincte de mise en production ;
- acceptation de la livraison par le client.

Ces marqueurs ne créent aucune approbation et ne remplacent pas les routes, preuves et contrôles existants. La préparation d'un devis ne l'envoie pas. La préparation d'une livraison ne la publie pas. Le worker de fabrication ne doit pas devenir un déploiement automatique.

## 5. État exact de cette intégration

Ajouts réalisés dans la branche multi-agent :

- catalogue des sept pôles et 35 spécialistes ;
- exploration administrative en lecture seule ;
- sélection explicite des spécialistes ;
- adaptation prudente vers les rôles génériques existants ;
- planificateur de missions avec dépendances ;
- composition de workflow reliant les pôles, les contrats de mission et le graphe d'exécution ;
- tests ciblant le parcours complet, les barrières de phases, les spécialistes non raccordés et les portes humaines.

Le workflow généré porte volontairement `status: planned` et `executionEnabled: false`. Il ne déclenche ni appel IA, ni worker, ni budget, ni modification de données, ni déploiement. Le planificateur est une couche de coordination, pas encore le raccordement opérationnel final au dossier client et à la file de fabrication.

## 6. Étapes restantes avant activation opérationnelle

1. Raccorder le workflow au snapshot versionné du projet et au périmètre approuvé, sans relire des données hors du projet.
2. Faire vérifier les portes humaines par les services d'approbation existants avant toute transition.
3. Ajouter les adaptateurs spécialisés manquants pour les agents qui nécessitent des outils d'exploitation, de relation client ou de gestion administrative.
4. Relier les missions aux tâches durables existantes de la fabrique et à leurs événements d'audit, sans créer un second système de file.
5. Raccorder les preuves de tests et d'audit au contrôle de sortie.
6. Effectuer un test Preview sur un projet de démonstration autorisé ; vérifier la reprise, les erreurs, les refus, les dépendances et la revue humaine.
7. N'envisager une migration, une activation de fournisseur, un lancement Sandbox facturé, une fusion ou un déploiement qu'après revue explicite et autorisation distincte.

## 7. Garanties de périmètre

Cette branche ne modifie ni les tables ni les données Supabase, les comptes, les secrets, les dépendances ou les configurations de production. Aucun appel réel à un fournisseur, aucune dépense de Sandbox, aucun lancement de fabrication client, aucun merge et aucun déploiement ne sont effectués par le planificateur.
