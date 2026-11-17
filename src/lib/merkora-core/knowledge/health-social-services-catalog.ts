import {createFamilyCatalog} from "./family-catalog-builder";
const result=createFamilyCatalog({
  "familyId": "family:health-social-services",
  "familyFr": "Santé et services sociaux",
  "familyEn": "Health and social services",
  "sourceId": "source:merkora-family-14-health-social-services-v1",
  "familyNumber": 14,
  "domains": [
    {
      "id": "domain:medicine",
      "fr": "Médecine et consultations",
      "en": "Medicine and consultations",
      "create": false
    },
    {
      "id": "domain:nursing-midwifery",
      "fr": "Soins infirmiers et hospitaliers",
      "en": "Nursing and hospital care",
      "create": false
    },
    {
      "id": "domain:clinical-diagnostics",
      "fr": "Laboratoires et diagnostic",
      "en": "Laboratories and diagnostics",
      "create": true
    },
    {
      "id": "domain:pharmacy",
      "fr": "Pharmacie et produits de santé",
      "en": "Pharmacy and health products",
      "create": false
    },
    {
      "id": "domain:social-work",
      "fr": "Services sociaux et accompagnement",
      "en": "Social services and support",
      "create": false
    }
  ],
  "seeds": [
  {
    "id": "subdomain-health:medical-consultations",
    "type": "subdomain",
    "fr": "Consultations médicales",
    "en": "Medical consultations",
    "parentId": "domain:medicine",
    "aliases": [
      "consultation médicale"
    ]
  },
  {
    "id": "subdomain-health:primary-care",
    "type": "subdomain",
    "fr": "Soins de premier recours",
    "en": "Primary care",
    "parentId": "domain:medicine",
    "aliases": [
      "médecine générale"
    ]
  },
  {
    "id": "subdomain-health:specialist-care",
    "type": "subdomain",
    "fr": "Médecine spécialisée",
    "en": "Specialist medicine",
    "parentId": "domain:medicine",
    "aliases": [
      "consultation spécialiste"
    ]
  },
  {
    "id": "subdomain-health:preventive-medicine",
    "type": "subdomain",
    "fr": "Prévention et suivi médical",
    "en": "Preventive medicine and follow-up",
    "parentId": "domain:medicine",
    "aliases": [
      "médecine préventive"
    ]
  },
  {
    "id": "subdomain-health:hospital-nursing",
    "type": "subdomain",
    "fr": "Soins infirmiers hospitaliers",
    "en": "Hospital nursing care",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "soins infirmiers hospitaliers"
    ]
  },
  {
    "id": "subdomain-health:midwifery",
    "type": "subdomain",
    "fr": "Maïeutique et santé maternelle",
    "en": "Midwifery and maternal health",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "sage-femme"
    ]
  },
  {
    "id": "subdomain-health:emergency-care",
    "type": "subdomain",
    "fr": "Soins d'urgence et stabilisation",
    "en": "Emergency care and stabilization",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "soins urgence"
    ]
  },
  {
    "id": "subdomain-health:home-nursing",
    "type": "subdomain",
    "fr": "Soins infirmiers à domicile",
    "en": "Home nursing care",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "infirmier à domicile"
    ]
  },
  {
    "id": "subdomain-health:clinical-laboratory",
    "type": "subdomain",
    "fr": "Laboratoire d'analyses médicales",
    "en": "Medical laboratory testing",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "analyse de laboratoire"
    ]
  },
  {
    "id": "subdomain-health:medical-imaging",
    "type": "subdomain",
    "fr": "Imagerie et explorations diagnostiques",
    "en": "Medical imaging and diagnostic investigations",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "imagerie médicale"
    ]
  },
  {
    "id": "subdomain-health:pathology",
    "type": "subdomain",
    "fr": "Anatomopathologie et examens spécialisés",
    "en": "Pathology and specialized testing",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "anatomopathologie"
    ]
  },
  {
    "id": "subdomain-health:diagnostic-quality",
    "type": "subdomain",
    "fr": "Qualité et traçabilité des diagnostics",
    "en": "Diagnostic quality and traceability",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "qualité laboratoire"
    ]
  },
  {
    "id": "subdomain-health:medication-dispensing",
    "type": "subdomain",
    "fr": "Dispensation et conseil pharmaceutique",
    "en": "Medication dispensing and pharmacy counselling",
    "parentId": "domain:pharmacy",
    "aliases": [
      "dispensation de médicaments"
    ]
  },
  {
    "id": "subdomain-health:pharmaceutical-supply",
    "type": "subdomain",
    "fr": "Approvisionnement et stockage pharmaceutiques",
    "en": "Pharmaceutical supply and storage",
    "parentId": "domain:pharmacy",
    "aliases": [
      "stock pharmacie"
    ]
  },
  {
    "id": "subdomain-health:pharmacovigilance",
    "type": "subdomain",
    "fr": "Pharmacovigilance et sécurité des médicaments",
    "en": "Pharmacovigilance and medication safety",
    "parentId": "domain:pharmacy",
    "aliases": [
      "sécurité médicament"
    ]
  },
  {
    "id": "subdomain-health:medical-devices",
    "type": "subdomain",
    "fr": "Dispositifs et produits de santé",
    "en": "Medical devices and health products",
    "parentId": "domain:pharmacy",
    "aliases": [
      "dispositifs médicaux"
    ]
  },
  {
    "id": "subdomain-health:home-social-support",
    "type": "subdomain",
    "fr": "Accompagnement social à domicile",
    "en": "Home-based social support",
    "parentId": "domain:social-work",
    "aliases": [
      "accompagnement social à domicile"
    ]
  },
  {
    "id": "subdomain-health:family-support",
    "type": "subdomain",
    "fr": "Accompagnement des familles et aidants",
    "en": "Family and caregiver support",
    "parentId": "domain:social-work",
    "aliases": [
      "aide aux familles"
    ]
  },
  {
    "id": "subdomain-health:disability-support",
    "type": "subdomain",
    "fr": "Accompagnement du handicap et de l'autonomie",
    "en": "Disability and independent-living support",
    "parentId": "domain:social-work",
    "aliases": [
      "accompagnement handicap"
    ]
  },
  {
    "id": "subdomain-health:community-social-care",
    "type": "subdomain",
    "fr": "Action sociale communautaire",
    "en": "Community social care",
    "parentId": "domain:social-work",
    "aliases": [
      "service social communautaire"
    ]
  },
  {
    "id": "specialization-health:telemedicine",
    "type": "specialization",
    "fr": "Télémédecine et suivi à distance",
    "en": "Telemedicine and remote care",
    "parentId": "domain:medicine",
    "aliases": [
      "téléconsultation"
    ]
  },
  {
    "id": "specialization-health:chronic-care",
    "type": "specialization",
    "fr": "Parcours de soins des maladies chroniques",
    "en": "Chronic care pathways",
    "parentId": "domain:medicine",
    "aliases": [
      "suivi maladie chronique"
    ]
  },
  {
    "id": "specialization-health:patient-safety",
    "type": "specialization",
    "fr": "Sécurité des patients et gestion des risques",
    "en": "Patient safety and risk management",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "sécurité patient"
    ]
  },
  {
    "id": "specialization-health:diagnostic-analytics",
    "type": "specialization",
    "fr": "Analytique et qualité diagnostique",
    "en": "Diagnostic analytics and quality",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "analyse diagnostic"
    ]
  },
  {
    "id": "specialization-health:medication-management",
    "type": "specialization",
    "fr": "Gestion sécurisée des traitements",
    "en": "Safe medication management",
    "parentId": "domain:pharmacy",
    "aliases": [
      "gestion traitement"
    ]
  },
  {
    "id": "specialization-health:community-health",
    "type": "specialization",
    "fr": "Santé communautaire et prévention",
    "en": "Community health and prevention",
    "parentId": "domain:social-work",
    "aliases": [
      "santé communautaire"
    ]
  },
  {
    "id": "specialization-health:integrated-care",
    "type": "specialization",
    "fr": "Coordination intégrée santé-social",
    "en": "Integrated health and social care",
    "parentId": "domain:social-work",
    "aliases": [
      "coordination santé social"
    ]
  },
  {
    "id": "occupation-health:physician",
    "type": "occupation",
    "fr": "Médecin",
    "en": "Physician",
    "parentId": "domain:medicine",
    "aliases": [
      "docteur"
    ]
  },
  {
    "id": "occupation-health:nurse",
    "type": "occupation",
    "fr": "Infirmier",
    "en": "Nurse",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "infirmière"
    ]
  },
  {
    "id": "occupation-health:midwife",
    "type": "occupation",
    "fr": "Sage-femme",
    "en": "Midwife",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "sage femme"
    ]
  },
  {
    "id": "occupation-health:lab-technologist",
    "type": "occupation",
    "fr": "Technicien de laboratoire médical",
    "en": "Medical laboratory technologist",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "technicien laboratoire"
    ]
  },
  {
    "id": "occupation-health:radiographer",
    "type": "occupation",
    "fr": "Manipulateur en électroradiologie",
    "en": "Radiographer",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "technicien imagerie"
    ]
  },
  {
    "id": "occupation-health:pharmacist",
    "type": "occupation",
    "fr": "Pharmacien",
    "en": "Pharmacist",
    "parentId": "domain:pharmacy",
    "aliases": [
      "pharmacien"
    ]
  },
  {
    "id": "occupation-health:pharmacy-technician",
    "type": "occupation",
    "fr": "Préparateur en pharmacie",
    "en": "Pharmacy technician",
    "parentId": "domain:pharmacy",
    "aliases": [
      "préparateur pharmacie"
    ]
  },
  {
    "id": "occupation-health:social-worker",
    "type": "occupation",
    "fr": "Assistant de service social",
    "en": "Social worker",
    "parentId": "domain:social-work",
    "aliases": [
      "assistant social"
    ]
  },
  {
    "id": "occupation-health:psychologist",
    "type": "occupation",
    "fr": "Psychologue",
    "en": "Psychologist",
    "parentId": "domain:social-work",
    "aliases": [
      "psychologue"
    ]
  },
  {
    "id": "occupation-health:care-coordinator",
    "type": "occupation",
    "fr": "Coordinateur de parcours de soins",
    "en": "Care pathway coordinator",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "coordinateur soins"
    ]
  },
  {
    "id": "occupation-health:health-manager",
    "type": "occupation",
    "fr": "Responsable d'établissement ou de service de santé",
    "en": "Healthcare service manager",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "responsable centre de santé"
    ]
  },
  {
    "id": "occupation-health:community-worker",
    "type": "occupation",
    "fr": "Médiateur ou intervenant social communautaire",
    "en": "Community support worker",
    "parentId": "domain:social-work",
    "aliases": [
      "médiateur social"
    ]
  },
  {
    "id": "activity-health:patient-intake",
    "type": "activity",
    "fr": "Accueil et orientation d'un patient",
    "en": "Patient intake and orientation",
    "parentId": "domain:medicine",
    "aliases": [
      "accueil et orientation d'un patient"
    ]
  },
  {
    "id": "activity-health:medical-consultation",
    "type": "activity",
    "fr": "Réalisation d'une consultation médicale",
    "en": "Conducting a medical consultation",
    "parentId": "domain:medicine",
    "aliases": [
      "consultation par médecin"
    ]
  },
  {
    "id": "activity-health:nursing-plan",
    "type": "activity",
    "fr": "Planification et réalisation de soins infirmiers",
    "en": "Nursing care planning and delivery",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "planification de soins infirmiers"
    ]
  },
  {
    "id": "activity-health:emergency-triage",
    "type": "activity",
    "fr": "Triage et orientation des urgences",
    "en": "Emergency triage and referral",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "triage urgence"
    ]
  },
  {
    "id": "activity-health:diagnostic-test",
    "type": "activity",
    "fr": "Réalisation d'un examen diagnostique",
    "en": "Diagnostic test performance",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "réalisation d'un examen diagnostique"
    ]
  },
  {
    "id": "activity-health:result-validation",
    "type": "activity",
    "fr": "Validation professionnelle d'un résultat d'analyse",
    "en": "Professional validation of test results",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "validation résultat laboratoire"
    ]
  },
  {
    "id": "activity-health:medication-dispensing",
    "type": "activity",
    "fr": "Dispensation d'un médicament selon ordonnance applicable",
    "en": "Medication dispensing under applicable prescription",
    "parentId": "domain:pharmacy",
    "aliases": [
      "dispensation médicament"
    ]
  },
  {
    "id": "activity-health:medication-counselling",
    "type": "activity",
    "fr": "Information pharmaceutique sur un traitement",
    "en": "Medication counselling",
    "parentId": "domain:pharmacy",
    "aliases": [
      "conseil pharmaceutique"
    ]
  },
  {
    "id": "activity-health:social-needs-assessment",
    "type": "activity",
    "fr": "Évaluation des besoins sociaux",
    "en": "Social needs assessment",
    "parentId": "domain:social-work",
    "aliases": [
      "évaluation des besoins sociaux"
    ]
  },
  {
    "id": "activity-health:home-support",
    "type": "activity",
    "fr": "Organisation d'un accompagnement à domicile",
    "en": "Organizing home-based support",
    "parentId": "domain:social-work",
    "aliases": [
      "aide à domicile"
    ]
  },
  {
    "id": "activity-health:care-coordination",
    "type": "activity",
    "fr": "Coordination entre professionnels de santé",
    "en": "Coordination among healthcare professionals",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "coordination soins"
    ]
  },
  {
    "id": "activity-health:clinical-prescription",
    "type": "activity",
    "fr": "Prescription médicale par un professionnel habilité",
    "en": "Clinical prescription by an authorized professional",
    "parentId": "domain:medicine",
    "aliases": [
      "prescription médicale par un médecin habilité",
      "prescription médicale"
    ]
  },
  {
    "id": "process-health:patient-care-pathway",
    "type": "process",
    "fr": "Parcours de prise en charge d'un patient",
    "en": "Patient care pathway",
    "parentId": "domain:medicine",
    "aliases": [
      "parcours patient"
    ]
  },
  {
    "id": "process-health:emergency-response",
    "type": "process",
    "fr": "Parcours de réponse aux urgences",
    "en": "Emergency response pathway",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "prise en charge urgence"
    ]
  },
  {
    "id": "process-health:diagnostic-workflow",
    "type": "process",
    "fr": "Cycle de prescription, prélèvement, analyse et validation",
    "en": "Test ordering, sampling, analysis and validation workflow",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "parcours analyse médicale"
    ]
  },
  {
    "id": "process-health:medication-supply-cycle",
    "type": "process",
    "fr": "Cycle d'approvisionnement et de dispensation pharmaceutique",
    "en": "Pharmaceutical supply and dispensing cycle",
    "parentId": "domain:pharmacy",
    "aliases": [
      "cycle pharmacie"
    ]
  },
  {
    "id": "process-health:chronic-care-followup",
    "type": "process",
    "fr": "Suivi coordonné d'une maladie chronique",
    "en": "Coordinated chronic care follow-up",
    "parentId": "domain:medicine",
    "aliases": [
      "suivi maladie chronique"
    ]
  },
  {
    "id": "process-health:social-support-plan",
    "type": "process",
    "fr": "Évaluation, plan et suivi d'accompagnement social",
    "en": "Social support assessment and follow-up",
    "parentId": "domain:social-work",
    "aliases": [
      "plan accompagnement social"
    ]
  },
  {
    "id": "process-health:referral-discharge",
    "type": "process",
    "fr": "Orientation, transfert et sortie de prise en charge",
    "en": "Referral, transfer and discharge",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "transfert patient"
    ]
  },
  {
    "id": "process-health:incident-review",
    "type": "process",
    "fr": "Déclaration et analyse d'un incident de sécurité",
    "en": "Safety incident reporting and review",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "analyse incident patient"
    ]
  },
  {
    "id": "problem-health:care-access",
    "type": "problem",
    "fr": "Difficulté d'accès aux soins et aux services sociaux",
    "en": "Barriers to healthcare and social services",
    "parentId": "domain:medicine",
    "aliases": [
      "accès aux soins difficile"
    ]
  },
  {
    "id": "problem-health:appointment-delays",
    "type": "problem",
    "fr": "Délais d'attente et rendez-vous non coordonnés",
    "en": "Waiting times and uncoordinated appointments",
    "parentId": "domain:medicine",
    "aliases": [
      "attente consultation"
    ]
  },
  {
    "id": "problem-health:medication-errors",
    "type": "problem",
    "fr": "Erreurs ou risques liés aux médicaments",
    "en": "Medication errors and risks",
    "parentId": "domain:pharmacy",
    "aliases": [
      "erreur médicament"
    ]
  },
  {
    "id": "problem-health:diagnostic-delays",
    "type": "problem",
    "fr": "Retards ou pertes de résultats diagnostiques",
    "en": "Diagnostic delays or lost results",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "retard résultat laboratoire"
    ]
  },
  {
    "id": "problem-health:care-coordination-gaps",
    "type": "problem",
    "fr": "Ruptures de coordination entre professionnels",
    "en": "Gaps in care coordination",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "mauvaise coordination soins"
    ]
  },
  {
    "id": "problem-health:patient-data-exposure",
    "type": "problem",
    "fr": "Exposition non autorisée de données de santé",
    "en": "Unauthorized exposure of health data",
    "parentId": "domain:medicine",
    "aliases": [
      "fuite données santé"
    ]
  },
  {
    "id": "problem-health:caregiver-burden",
    "type": "problem",
    "fr": "Épuisement des proches aidants",
    "en": "Caregiver burden",
    "parentId": "domain:social-work",
    "aliases": [
      "épuisement aidant"
    ]
  },
  {
    "id": "problem-health:social-isolation",
    "type": "problem",
    "fr": "Isolement et vulnérabilité sociale",
    "en": "Social isolation and vulnerability",
    "parentId": "domain:social-work",
    "aliases": [
      "isolement social"
    ]
  },
  {
    "id": "problem-health:stockout-health-products",
    "type": "problem",
    "fr": "Ruptures de stock de médicaments ou produits de santé",
    "en": "Medicine and health-product stockouts",
    "parentId": "domain:pharmacy",
    "aliases": [
      "rupture stock pharmacie"
    ]
  },
  {
    "id": "problem-health:patient-safety-incidents",
    "type": "problem",
    "fr": "Incidents évitables affectant la sécurité des patients",
    "en": "Preventable patient safety incidents",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "incident sécurité patient"
    ]
  },
  {
    "id": "resource-health:patient-record",
    "type": "resource",
    "fr": "Dossier patient et informations de prise en charge",
    "en": "Patient record and care information",
    "parentId": "domain:medicine",
    "aliases": [
      "dossier patient"
    ]
  },
  {
    "id": "resource-health:clinical-protocols",
    "type": "resource",
    "fr": "Protocoles cliniques et référentiels de soins",
    "en": "Clinical protocols and care standards",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "protocole clinique"
    ]
  },
  {
    "id": "resource-health:lab-samples-results",
    "type": "resource",
    "fr": "Échantillons, résultats et comptes rendus de laboratoire",
    "en": "Laboratory samples and reports",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "résultat analyse"
    ]
  },
  {
    "id": "resource-health:medication-catalog",
    "type": "resource",
    "fr": "Référentiel des médicaments et produits de santé",
    "en": "Medicine and health product catalog",
    "parentId": "domain:pharmacy",
    "aliases": [
      "catalogue médicaments"
    ]
  },
  {
    "id": "resource-health:social-case-file",
    "type": "resource",
    "fr": "Dossier social et plan d'accompagnement",
    "en": "Social case file and support plan",
    "parentId": "domain:social-work",
    "aliases": [
      "dossier social"
    ]
  },
  {
    "id": "resource-health:care-team",
    "type": "resource",
    "fr": "Équipe pluridisciplinaire et réseau de soins",
    "en": "Multidisciplinary care team",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "équipe de soins"
    ]
  },
  {
    "id": "resource-health:consent-record",
    "type": "resource",
    "fr": "Consentements et autorisations documentés",
    "en": "Documented consents and authorizations",
    "parentId": "domain:medicine",
    "aliases": [
      "consentement patient"
    ]
  },
  {
    "id": "function-health:patient-record-management",
    "type": "function",
    "fr": "Gestion sécurisée du dossier patient",
    "en": "Secure patient record management",
    "parentId": "domain:medicine",
    "aliases": [
      "logiciel dossier patient"
    ]
  },
  {
    "id": "function-health:appointment-coordination",
    "type": "function",
    "fr": "Coordination des rendez-vous et parcours",
    "en": "Appointment and pathway coordination",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "gestion rendez-vous santé"
    ]
  },
  {
    "id": "function-health:lab-workflow",
    "type": "function",
    "fr": "Suivi des prélèvements et résultats de laboratoire",
    "en": "Laboratory workflow tracking",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "logiciel laboratoire"
    ]
  },
  {
    "id": "function-health:medication-stock",
    "type": "function",
    "fr": "Gestion des stocks et lots pharmaceutiques",
    "en": "Pharmacy inventory and batch management",
    "parentId": "domain:pharmacy",
    "aliases": [
      "gestion stock pharmacie"
    ]
  },
  {
    "id": "function-health:social-case-management",
    "type": "function",
    "fr": "Gestion des dossiers et plans sociaux",
    "en": "Social case management",
    "parentId": "domain:social-work",
    "aliases": [
      "gestion dossier social"
    ]
  },
  {
    "id": "function-health:care-alerts",
    "type": "function",
    "fr": "Alertes de coordination et de sécurité des soins",
    "en": "Care coordination and safety alerts",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "alertes soins"
    ]
  },
  {
    "id": "function-health:consent-access-control",
    "type": "function",
    "fr": "Gestion des consentements et habilitations d'accès",
    "en": "Consent and access control",
    "parentId": "domain:medicine",
    "aliases": [
      "gestion consentement"
    ]
  },
  {
    "id": "indicator-health:waiting-time",
    "type": "indicator",
    "fr": "Délai médian d'attente avant prise en charge",
    "en": "Median waiting time before care",
    "parentId": "domain:medicine",
    "aliases": [
      "délai attente soin"
    ]
  },
  {
    "id": "indicator-health:appointment-attendance",
    "type": "indicator",
    "fr": "Taux de présence aux rendez-vous de soins",
    "en": "Care appointment attendance rate",
    "parentId": "domain:medicine",
    "aliases": [
      "taux présence rendez-vous"
    ]
  },
  {
    "id": "indicator-health:diagnostic-turnaround",
    "type": "indicator",
    "fr": "Délai de rendu des résultats diagnostiques",
    "en": "Diagnostic turnaround time",
    "parentId": "domain:clinical-diagnostics",
    "aliases": [
      "délai résultat analyse"
    ]
  },
  {
    "id": "indicator-health:medication-stockout",
    "type": "indicator",
    "fr": "Fréquence des ruptures de stock pharmaceutique",
    "en": "Pharmaceutical stockout frequency",
    "parentId": "domain:pharmacy",
    "aliases": [
      "taux rupture médicament"
    ]
  },
  {
    "id": "indicator-health:care-continuity",
    "type": "indicator",
    "fr": "Taux de continuité et de coordination des parcours",
    "en": "Care continuity and coordination rate",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "continuité soins"
    ]
  },
  {
    "id": "indicator-health:social-support-outcome",
    "type": "indicator",
    "fr": "Atteinte des objectifs d'accompagnement social",
    "en": "Social support outcome achievement",
    "parentId": "domain:social-work",
    "aliases": [
      "résultat accompagnement social"
    ]
  },
  {
    "id": "indicator-health:patient-safety-incidents",
    "type": "indicator",
    "fr": "Nombre d'incidents de sécurité rapportés et analysés",
    "en": "Reported and reviewed patient safety incidents",
    "parentId": "domain:nursing-midwifery",
    "aliases": [
      "incident patient"
    ]
  }
],
  "safetyNotes": [
    "Les informations de santé sont hautement sensibles. Accès au moindre privilège, chiffrement, journalisation, consentement/base légale, minimisation et durées de conservation contrôlées sont indispensables.",
    "Le système n'établit aucun diagnostic, ne prescrit aucun médicament, ne choisit aucun traitement et ne remplace jamais un professionnel de santé habilité.",
    "Les décisions de triage, urgence, prescription, diagnostic, dispensation, intervention et sortie relèvent des professionnels et protocoles autorisés ; les alertes IA sont des signaux à vérifier.",
    "Les données sociales peuvent révéler des vulnérabilités, handicaps, situations familiales ou financières ; elles exigent cloisonnement, dignité, accès restreint et protection contre la stigmatisation.",
    "Les actes, professions, protocoles, produits autorisés et voies d'urgence dépendent de la juridiction et des autorités sanitaires locales."
  ]
},[
  [
    "activity-health:patient-intake",
    "process-health:patient-care-pathway",
    "part_of"
  ],
  [
    "activity-health:diagnostic-test",
    "process-health:diagnostic-workflow",
    "part_of"
  ],
  [
    "function-health:lab-workflow",
    "activity-health:result-validation",
    "supports"
  ],
  [
    "function-health:medication-stock",
    "resource-health:medication-catalog",
    "manages"
  ],
  [
    "problem-health:patient-data-exposure",
    "function-health:consent-access-control",
    "requires_control_by"
  ],
  [
    "problem-health:care-coordination-gaps",
    "function-health:appointment-coordination",
    "may_be_mitigated_by"
  ],
  [
    "activity-health:social-needs-assessment",
    "process-health:social-support-plan",
    "part_of"
  ],
  [
    "function-health:social-case-management",
    "resource-health:social-case-file",
    "manages"
  ]
]);
export const HEALTH_SOCIAL_SERVICES_FAMILY_CONCEPTS=result.familyConcepts;
export const HEALTH_SOCIAL_SERVICES_CATALOG=result.catalog;
export const HEALTH_SOCIAL_SERVICES_RELATIONSHIPS=result.relationships;
