# Fondation A — Famille 14 : Santé et services sociaux

**Identifiant :** `family:health-social-services` — **Version :** 1.0  
**Catalogue :** 90 concepts bilingues dans neuf catégories.  
**Domaines :** médecine/consultations ; soins infirmiers et hospitaliers ; laboratoires/diagnostic ; pharmacie/produits de santé ; services sociaux/accompagnement.

## 1. Périmètre et frontières

Cette famille couvre les parcours de prévention, consultation, soins, diagnostic, pharmacie et accompagnement social. La santé concerne l'évaluation et la prise en charge par des professionnels autorisés ; l'action sociale porte sur les conditions de vie, l'autonomie, l'accès aux droits et le soutien des personnes et familles.

Frontières : la médecine vétérinaire reste en Famille 02 ; santé au travail est reliée à la Famille 19 ; les systèmes numériques de santé s'appuient sur la Famille 18 ; l'assurance et les paiements relèvent de la Famille 10. Un dossier social ne doit pas être transformé automatiquement en dossier médical.

## 2. Structure du catalogue

20 sous-domaines, 7 spécialisations, 12 métiers, 12 activités, 8 processus, 10 problèmes, 7 ressources, 7 fonctions numériques et 7 indicateurs. Les sous-domaines couvrent consultations, premier recours, spécialités, prévention, soins hospitaliers, maïeutique, urgences, soins à domicile, analyses, imagerie, anatomopathologie, qualité diagnostique, dispensation, approvisionnement, pharmacovigilance, dispositifs médicaux, accompagnement familial, handicap, autonomie et action sociale communautaire.

## 3. Diagnostic adaptatif — une question par sous-écran

A. Quel service est concerné : consultation, hospitalisation, urgence, laboratoire, pharmacie, suivi à domicile ou accompagnement social ?  
B. Qui est concerné et quel rôle joue l'interlocuteur ? Ne demander que les informations strictement nécessaires.  
C. Quel problème opérationnel est décrit : accès, attente, coordination, résultat manquant, stock, continuité, soutien social ou confidentialité ?  
D. Quel parcours existe actuellement, quels professionnels interviennent et quelles étapes sont déjà validées ?  
E. Quels protocoles officiels, autorisations, prescriptions, consentements et règles locales s'appliquent ?  
F. Quels résultats organisationnels sont attendus : délai, continuité, sécurité, disponibilité, autonomie ou accès aux droits ?  
G. Quelles informations sont incertaines et nécessitent un avis clinique ou social humain ?

Chaque réponse est conservée comme déclaration, observation documentée, hypothèse ou inconnue. Le moteur ne demande pas de détails médicaux sensibles s'ils ne sont pas nécessaires au projet numérique.

## 4. Parcours opérationnels

### Consultation et suivi
Accueil → identification proportionnée → vérification des droits/consentements → orientation vers un professionnel → consultation par personne habilitée → décision clinique humaine → plan de suivi → rendez-vous et coordination → clôture et archivage.

### Soins hospitaliers et urgences
Signalement/arrivée → évaluation par l'équipe autorisée → priorisation clinique humaine → stabilisation et soins → prescription/actes habilités → surveillance → transfert ou sortie validée → consignes et continuité.

### Laboratoire et diagnostic
Demande autorisée → identification et prélèvement → étiquetage et chaîne de traçabilité → réception → analyse selon protocole → contrôle qualité → validation par professionnel habilité → transmission sécurisée → archivage.

### Pharmacie
Réception d'approvisionnement → contrôle fournisseur/lot/date → stockage → vérification de prescription si nécessaire → dispensation par personne habilitée → conseil pharmaceutique → traçabilité des lots → pharmacovigilance.

### Accompagnement social
Demande → information et consentement → évaluation sociale par professionnel → identification des besoins et droits → plan d'accompagnement choisi avec la personne → orientation vers services → suivi → réévaluation et clôture.

## 5. Rôles et écrans

Rôles : patient/usager, représentant autorisé, médecin, infirmier, sage-femme, technicien de laboratoire, radiologue, pharmacien, préparateur, assistant social, psychologue, coordinateur, responsable d'établissement, agent d'accueil, administrateur de données.

Écrans : accueil et orientation ; rendez-vous ; dossier patient cloisonné ; plan de soins et coordination ; demandes et résultats de laboratoire ; gestion des lots pharmaceutiques ; suivi des incidents ; dossier social distinct ; plan d'accompagnement ; consentements ; habilitations ; journal d'accès ; tableaux de bord agrégés.

Les droits sont définis par établissement, unité, rôle, relation de prise en charge et dossier. Un agent administratif ne voit pas automatiquement les notes cliniques.

## 6. Architecture de données indicative

Patient/usager, identité minimale, représentant, consentement, professionnel, qualification, établissement, unité, consultation, rendez-vous, épisode de soins, demande d'examen, prélèvement, échantillon, résultat, validation, prescription, médicament, lot, dispensation, dispositif médical, plan de soins, orientation, transfert, sortie, incident, pharmacovigilance, dossier social, besoin, droit, plan d'accompagnement, partenaire, intervention, suivi, accès, export, archive, indicateur.

Les données médicales, sociales et administratives sont logiquement séparées. Les accès sont journalisés. Les données analytiques sont agrégées ou pseudonymisées lorsque possible.

## 7. Intégrations

Dossiers patients, systèmes hospitaliers, laboratoires, pharmacie, rendez-vous, téléconsultation autorisée, systèmes d'identité, dispositifs médicaux, services de notification sécurisés, structures sociales et référentiels sanitaires officiels. Chaque intégration doit être autorisée, documentée, chiffrée et limitée à son usage prévu.

## 8. Règles métier et sécurité

- L'IA ne diagnostique pas, ne prescrit pas, ne modifie pas un traitement et ne remplace pas le triage clinique.
- Une alerte de risque ou d'urgence n'est pas une décision ; elle doit être examinée immédiatement par les personnes et procédures compétentes.
- Les actes cliniques, résultats et prescriptions sont validés par des professionnels habilités.
- Les données de santé sont sensibles : minimisation, chiffrement, contrôle d'accès strict, journalisation et conservation limitée.
- Les dossiers sociaux sont protégés contre la stigmatisation, les accès non nécessaires et la réutilisation commerciale.
- La dispensation tient compte des prescriptions, lots, dates, retraits et règles pharmaceutiques locales.
- Les indicateurs de performance ne doivent pas encourager le refus des cas complexes ou la sélection des patients.
- Les urgences suivent les numéros et protocoles officiels locaux ; MerKora ne promet jamais une intervention d'urgence.

## 9. Prompts professionnels

- **Coordinateur de soins :** « Organise les étapes, acteurs, rendez-vous et transmissions autorisées ; signale les ruptures sans interpréter cliniquement les symptômes. »
- **Gestionnaire de laboratoire :** « Suit les échantillons, statuts, contrôles qualité et validations humaines ; n'altère aucun résultat. »
- **Responsable pharmacie :** « Suit les lots, dates, seuils de stock et alertes de retrait ; aucune décision de substitution ou prescription automatique. »
- **Intervenant social :** « Organise les besoins exprimés, droits, orientations et consentements en langage respectueux ; ne classe pas les personnes par mérite. »

## 10. Limites

Les règles sanitaires, professions, protocoles, médicaments, dispositifs et circuits d'urgence varient selon les pays. La famille est un référentiel de conception numérique, pas un protocole clinique ni un avis médical. Aucune décision médicale ou sociale sensible ne doit être prise uniquement par IA.
