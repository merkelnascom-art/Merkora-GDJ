import {createFamilyCatalog} from "./family-catalog-builder";
const result=createFamilyCatalog({
  "familyId": "family:crafts-personal-services",
  "familyFr": "Artisanat et services personnels",
  "familyEn": "Crafts and personal services",
  "sourceId": "source:merkora-family-20-crafts-personal-services-v1",
  "familyNumber": 20,
  "domains": [
    {
      "id": "domain:crafts",
      "fr": "Artisanat et production artisanale",
      "en": "Crafts and artisanal production",
      "create": false
    },
    {
      "id": "domain:beauty-personal-care",
      "fr": "Beauté et soins personnels",
      "en": "Beauty and personal care",
      "create": true
    },
    {
      "id": "domain:repair-maintenance",
      "fr": "Réparation et maintenance",
      "en": "Repair and maintenance",
      "create": true
    },
    {
      "id": "domain:domestic-services",
      "fr": "Services domestiques et à domicile",
      "en": "Domestic and home services",
      "create": true
    },
    {
      "id": "domain:local-personal-services",
      "fr": "Services personnels et de proximité",
      "en": "Personal and local services",
      "create": true
    }
  ],
  "seeds": [
    {
      "id": "subdomain-craft:artisanal-production",
      "type": "subdomain",
      "fr": "Fabrication artisanale et production sur mesure",
      "en": "Artisanal and custom production",
      "parentId": "domain:crafts",
      "aliases": [
        "Fabrication artisanale et production sur mesure",
        "fabrication artisanale sur mesure"
      ]
    },
    {
      "id": "subdomain-craft:textile-craft",
      "type": "subdomain",
      "fr": "Artisanat textile, couture et confection",
      "en": "Textile crafts, sewing and tailoring",
      "parentId": "domain:crafts",
      "aliases": [
        "Artisanat textile, couture et confection"
      ]
    },
    {
      "id": "subdomain-craft:wood-metal-craft",
      "type": "subdomain",
      "fr": "Travail du bois, métal et matériaux",
      "en": "Wood, metal and material crafts",
      "parentId": "domain:crafts",
      "aliases": [
        "Travail du bois, métal et matériaux"
      ]
    },
    {
      "id": "subdomain-craft:food-craft",
      "type": "subdomain",
      "fr": "Transformation et artisanat alimentaire",
      "en": "Food processing and culinary crafts",
      "parentId": "domain:crafts",
      "aliases": [
        "Transformation et artisanat alimentaire"
      ]
    },
    {
      "id": "subdomain-craft:beauty-services",
      "type": "subdomain",
      "fr": "Soins esthétiques et beauté",
      "en": "Beauty and aesthetic services",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Soins esthétiques et beauté",
        "soins esthétiques et beauté"
      ]
    },
    {
      "id": "subdomain-craft:hairdressing",
      "type": "subdomain",
      "fr": "Coiffure et soins capillaires",
      "en": "Hairdressing and hair care",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Coiffure et soins capillaires"
      ]
    },
    {
      "id": "subdomain-craft:wellness-personal-care",
      "type": "subdomain",
      "fr": "Bien-être et soins personnels non médicaux",
      "en": "Wellbeing and non-medical personal care",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Bien-être et soins personnels non médicaux"
      ]
    },
    {
      "id": "subdomain-craft:nail-care",
      "type": "subdomain",
      "fr": "Soins des mains, pieds et ongles",
      "en": "Hand, foot and nail care",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Soins des mains, pieds et ongles"
      ]
    },
    {
      "id": "subdomain-craft:equipment-repair",
      "type": "subdomain",
      "fr": "Réparation et maintenance d'équipements",
      "en": "Equipment repair and maintenance",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Réparation et maintenance d'équipements",
        "réparation et maintenance d'équipements"
      ]
    },
    {
      "id": "subdomain-craft:electronics-repair",
      "type": "subdomain",
      "fr": "Réparation électronique et électroménager",
      "en": "Electronics and appliance repair",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Réparation électronique et électroménager"
      ]
    },
    {
      "id": "subdomain-craft:vehicle-maintenance",
      "type": "subdomain",
      "fr": "Entretien et réparation de véhicules",
      "en": "Vehicle maintenance and repair",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Entretien et réparation de véhicules"
      ]
    },
    {
      "id": "subdomain-craft:building-maintenance",
      "type": "subdomain",
      "fr": "Petite maintenance et réparations du bâtiment",
      "en": "Building upkeep and minor repairs",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Petite maintenance et réparations du bâtiment"
      ]
    },
    {
      "id": "subdomain-craft:home-cleaning",
      "type": "subdomain",
      "fr": "Entretien ménager à domicile",
      "en": "Home cleaning services",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Entretien ménager à domicile",
        "entretien ménager à domicile"
      ]
    },
    {
      "id": "subdomain-craft:laundry-services",
      "type": "subdomain",
      "fr": "Blanchisserie, repassage et entretien textile",
      "en": "Laundry, ironing and textile care",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Blanchisserie, repassage et entretien textile"
      ]
    },
    {
      "id": "subdomain-craft:home-assistance",
      "type": "subdomain",
      "fr": "Assistance domestique et aide quotidienne",
      "en": "Domestic assistance and daily living support",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Assistance domestique et aide quotidienne"
      ]
    },
    {
      "id": "subdomain-craft:gardening-services",
      "type": "subdomain",
      "fr": "Jardinage et entretien des espaces privés",
      "en": "Gardening and private outdoor maintenance",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Jardinage et entretien des espaces privés"
      ]
    },
    {
      "id": "subdomain-craft:local-personal-services",
      "type": "subdomain",
      "fr": "Services de proximité aux particuliers",
      "en": "Local personal services",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Services de proximité aux particuliers",
        "services de proximité aux particuliers"
      ]
    },
    {
      "id": "subdomain-craft:tailoring-alterations",
      "type": "subdomain",
      "fr": "Retouches, ajustements et réparation textile",
      "en": "Clothing alterations and textile repair",
      "parentId": "domain:crafts",
      "aliases": [
        "Retouches, ajustements et réparation textile"
      ]
    },
    {
      "id": "subdomain-craft:personal-concierge",
      "type": "subdomain",
      "fr": "Conciergerie et services pratiques aux particuliers",
      "en": "Concierge and practical personal services",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Conciergerie et services pratiques aux particuliers"
      ]
    },
    {
      "id": "subdomain-craft:household-organization",
      "type": "subdomain",
      "fr": "Organisation et gestion du quotidien domestique",
      "en": "Household organization and daily management",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Organisation et gestion du quotidien domestique"
      ]
    },
    {
      "id": "specialization-craft:custom-craft",
      "type": "specialization",
      "fr": "Création artisanale personnalisée",
      "en": "Custom artisanal creation",
      "parentId": "domain:crafts",
      "aliases": [
        "Création artisanale personnalisée"
      ]
    },
    {
      "id": "specialization-craft:sustainable-craft",
      "type": "specialization",
      "fr": "Artisanat durable et réemploi des matériaux",
      "en": "Sustainable crafts and material reuse",
      "parentId": "domain:crafts",
      "aliases": [
        "Artisanat durable et réemploi des matériaux"
      ]
    },
    {
      "id": "specialization-craft:beauty-hygiene",
      "type": "specialization",
      "fr": "Hygiène, sécurité et qualité des soins esthétiques",
      "en": "Hygiene, safety and quality in beauty services",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Hygiène, sécurité et qualité des soins esthétiques"
      ]
    },
    {
      "id": "specialization-craft:mobile-personal-services",
      "type": "specialization",
      "fr": "Services personnels mobiles et à domicile",
      "en": "Mobile and home-based personal services",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Services personnels mobiles et à domicile"
      ]
    },
    {
      "id": "specialization-craft:repair-circular-economy",
      "type": "specialization",
      "fr": "Réparation et économie circulaire",
      "en": "Repair and circular economy",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Réparation et économie circulaire"
      ]
    },
    {
      "id": "specialization-craft:home-care-coordination",
      "type": "specialization",
      "fr": "Coordination des services domestiques",
      "en": "Home service coordination",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Coordination des services domestiques"
      ]
    },
    {
      "id": "specialization-craft:local-microbusiness",
      "type": "specialization",
      "fr": "Microentreprises et services de quartier",
      "en": "Local microbusiness and neighborhood services",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Microentreprises et services de quartier"
      ]
    },
    {
      "id": "occupation-craft:artisan",
      "type": "occupation",
      "fr": "Artisan ou artisan d'art",
      "en": "Craftsperson or artisan",
      "parentId": "domain:crafts",
      "aliases": [
        "Artisan ou artisan d'art"
      ]
    },
    {
      "id": "occupation-craft:tailor",
      "type": "occupation",
      "fr": "Couturier ou tailleur",
      "en": "Tailor",
      "parentId": "domain:crafts",
      "aliases": [
        "Couturier ou tailleur"
      ]
    },
    {
      "id": "occupation-craft:craft-maker",
      "type": "occupation",
      "fr": "Fabricant et créateur artisanal",
      "en": "Artisanal maker",
      "parentId": "domain:crafts",
      "aliases": [
        "Fabricant et créateur artisanal"
      ]
    },
    {
      "id": "occupation-craft:hairdresser",
      "type": "occupation",
      "fr": "Coiffeur",
      "en": "Hairdresser",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Coiffeur"
      ]
    },
    {
      "id": "occupation-craft:beautician",
      "type": "occupation",
      "fr": "Esthéticien",
      "en": "Beautician",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Esthéticien"
      ]
    },
    {
      "id": "occupation-craft:nail-technician",
      "type": "occupation",
      "fr": "Technicien de soins des ongles",
      "en": "Nail technician",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Technicien de soins des ongles"
      ]
    },
    {
      "id": "occupation-craft:repair-technician",
      "type": "occupation",
      "fr": "Technicien réparateur",
      "en": "Repair technician",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Technicien réparateur"
      ]
    },
    {
      "id": "occupation-craft:appliance-technician",
      "type": "occupation",
      "fr": "Technicien électroménager",
      "en": "Appliance technician",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Technicien électroménager"
      ]
    },
    {
      "id": "occupation-craft:vehicle-mechanic",
      "type": "occupation",
      "fr": "Mécanicien automobile",
      "en": "Vehicle mechanic",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Mécanicien automobile"
      ]
    },
    {
      "id": "occupation-craft:home-cleaner",
      "type": "occupation",
      "fr": "Agent d'entretien à domicile",
      "en": "Home cleaner",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Agent d'entretien à domicile"
      ]
    },
    {
      "id": "occupation-craft:domestic-helper",
      "type": "occupation",
      "fr": "Employé de maison et assistant domestique",
      "en": "Domestic worker and home assistant",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Employé de maison et assistant domestique"
      ]
    },
    {
      "id": "occupation-craft:local-service-provider",
      "type": "occupation",
      "fr": "Prestataire de services de proximité",
      "en": "Local service provider",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Prestataire de services de proximité"
      ]
    },
    {
      "id": "activity-craft:craft-object-making",
      "type": "activity",
      "fr": "Fabrication d'un objet artisanal",
      "en": "Making an artisanal object",
      "parentId": "domain:crafts",
      "aliases": [
        "Fabrication d'un objet artisanal",
        "fabrication d'un objet artisanal"
      ]
    },
    {
      "id": "activity-craft:custom-order-fulfillment",
      "type": "activity",
      "fr": "Réalisation d'une commande personnalisée",
      "en": "Fulfilling a custom order",
      "parentId": "domain:crafts",
      "aliases": [
        "Réalisation d'une commande personnalisée"
      ]
    },
    {
      "id": "activity-craft:home-maintenance",
      "type": "activity",
      "fr": "Entretien d'un logement",
      "en": "Home maintenance",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Entretien d'un logement",
        "entretien d'un logement"
      ]
    },
    {
      "id": "activity-craft:equipment-repair",
      "type": "activity",
      "fr": "Réparation d'un appareil",
      "en": "Repairing an appliance",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Réparation d'un appareil",
        "réparation d'un appareil"
      ]
    },
    {
      "id": "activity-craft:hairdressing-service",
      "type": "activity",
      "fr": "Prestation de coiffure",
      "en": "Hairdressing service",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Prestation de coiffure",
        "prestation de coiffure"
      ]
    },
    {
      "id": "activity-craft:beauty-treatment",
      "type": "activity",
      "fr": "Réalisation d'un soin esthétique non médical",
      "en": "Providing a non-medical beauty treatment",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Réalisation d'un soin esthétique non médical"
      ]
    },
    {
      "id": "activity-craft:laundry-processing",
      "type": "activity",
      "fr": "Traitement du linge et repassage",
      "en": "Laundry processing and ironing",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Traitement du linge et repassage"
      ]
    },
    {
      "id": "activity-craft:vehicle-servicing",
      "type": "activity",
      "fr": "Entretien courant d'un véhicule",
      "en": "Routine vehicle servicing",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Entretien courant d'un véhicule"
      ]
    },
    {
      "id": "activity-craft:home-service-visit",
      "type": "activity",
      "fr": "Intervention d'un service à domicile",
      "en": "Home service visit",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Intervention d'un service à domicile",
        "intervention d'un service à domicile"
      ]
    },
    {
      "id": "activity-craft:garden-maintenance",
      "type": "activity",
      "fr": "Entretien d'un jardin ou espace extérieur",
      "en": "Garden and outdoor maintenance",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Entretien d'un jardin ou espace extérieur"
      ]
    },
    {
      "id": "activity-craft:customer-appointment",
      "type": "activity",
      "fr": "Gestion d'un rendez-vous client",
      "en": "Customer appointment management",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Gestion d'un rendez-vous client"
      ]
    },
    {
      "id": "activity-craft:product-delivery",
      "type": "activity",
      "fr": "Livraison d'un produit ou objet réparé",
      "en": "Delivery of a product or repaired item",
      "parentId": "domain:crafts",
      "aliases": [
        "Livraison d'un produit ou objet réparé"
      ]
    },
    {
      "id": "process-craft:custom-order-cycle",
      "type": "process",
      "fr": "Cycle de commande et fabrication personnalisée",
      "en": "Custom order and production cycle",
      "parentId": "domain:crafts",
      "aliases": [
        "Cycle de commande et fabrication personnalisée"
      ]
    },
    {
      "id": "process-craft:craft-production-cycle",
      "type": "process",
      "fr": "Cycle de production artisanale",
      "en": "Artisanal production cycle",
      "parentId": "domain:crafts",
      "aliases": [
        "Cycle de production artisanale"
      ]
    },
    {
      "id": "process-craft:beauty-appointment-cycle",
      "type": "process",
      "fr": "Parcours de rendez-vous et prestation beauté",
      "en": "Beauty appointment and service pathway",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Parcours de rendez-vous et prestation beauté"
      ]
    },
    {
      "id": "process-craft:repair-diagnosis-cycle",
      "type": "process",
      "fr": "Cycle de diagnostic technique, devis et réparation",
      "en": "Technical diagnosis, quotation and repair cycle",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Cycle de diagnostic technique, devis et réparation"
      ]
    },
    {
      "id": "process-craft:home-service-cycle",
      "type": "process",
      "fr": "Cycle de planification et intervention à domicile",
      "en": "Home service scheduling and delivery cycle",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Cycle de planification et intervention à domicile"
      ]
    },
    {
      "id": "process-craft:laundry-service-cycle",
      "type": "process",
      "fr": "Cycle de collecte, traitement et restitution du linge",
      "en": "Laundry collection, processing and return cycle",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Cycle de collecte, traitement et restitution du linge"
      ]
    },
    {
      "id": "process-craft:local-service-booking",
      "type": "process",
      "fr": "Réservation et réalisation d'un service de proximité",
      "en": "Local service booking and delivery",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Réservation et réalisation d'un service de proximité"
      ]
    },
    {
      "id": "process-craft:after-service-followup",
      "type": "process",
      "fr": "Suivi qualité et service après-prestation",
      "en": "Service quality and after-service follow-up",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Suivi qualité et service après-prestation"
      ]
    },
    {
      "id": "problem-craft:craft-order-delays",
      "type": "problem",
      "fr": "Retards de fabrication et de livraison artisanales",
      "en": "Craft production and delivery delays",
      "parentId": "domain:crafts",
      "aliases": [
        "Retards de fabrication et de livraison artisanales"
      ]
    },
    {
      "id": "problem-craft:material-waste",
      "type": "problem",
      "fr": "Gaspillage de matières et pertes de production",
      "en": "Material waste and production loss",
      "parentId": "domain:crafts",
      "aliases": [
        "Gaspillage de matières et pertes de production"
      ]
    },
    {
      "id": "problem-craft:service-booking-gaps",
      "type": "problem",
      "fr": "Rendez-vous et réservations mal coordonnés",
      "en": "Poorly coordinated appointments and bookings",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Rendez-vous et réservations mal coordonnés"
      ]
    },
    {
      "id": "problem-craft:repair-diagnosis-errors",
      "type": "problem",
      "fr": "Diagnostics techniques et devis imprécis",
      "en": "Inaccurate technical diagnosis and quotations",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Diagnostics techniques et devis imprécis"
      ]
    },
    {
      "id": "problem-craft:parts-stockouts",
      "type": "problem",
      "fr": "Ruptures de pièces et consommables",
      "en": "Parts and consumables stockouts",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Ruptures de pièces et consommables"
      ]
    },
    {
      "id": "problem-craft:home-service-reliability",
      "type": "problem",
      "fr": "Retards et manque de fiabilité des interventions à domicile",
      "en": "Unreliable or late home service visits",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Retards et manque de fiabilité des interventions à domicile"
      ]
    },
    {
      "id": "problem-craft:service-quality-issues",
      "type": "problem",
      "fr": "Qualité irrégulière des prestations personnelles",
      "en": "Inconsistent personal service quality",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Qualité irrégulière des prestations personnelles"
      ]
    },
    {
      "id": "problem-craft:customer-trust",
      "type": "problem",
      "fr": "Manque de confiance et traçabilité insuffisante",
      "en": "Low trust and insufficient traceability",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Manque de confiance et traçabilité insuffisante"
      ]
    },
    {
      "id": "problem-craft:worker-safety",
      "type": "problem",
      "fr": "Risques de sécurité et d'hygiène pour les intervenants",
      "en": "Worker safety and hygiene risks",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Risques de sécurité et d'hygiène pour les intervenants"
      ]
    },
    {
      "id": "problem-craft:informal-business-records",
      "type": "problem",
      "fr": "Gestion informelle des commandes, paiements et clients",
      "en": "Informal order, payment and customer records",
      "parentId": "domain:crafts",
      "aliases": [
        "Gestion informelle des commandes, paiements et clients"
      ]
    },
    {
      "id": "resource-craft:craft-designs",
      "type": "resource",
      "fr": "Modèles, plans et patrons de fabrication",
      "en": "Craft designs, plans and patterns",
      "parentId": "domain:crafts",
      "aliases": [
        "Modèles, plans et patrons de fabrication"
      ]
    },
    {
      "id": "resource-craft:materials-inventory",
      "type": "resource",
      "fr": "Inventaire des matières et consommables",
      "en": "Materials and consumables inventory",
      "parentId": "domain:crafts",
      "aliases": [
        "Inventaire des matières et consommables"
      ]
    },
    {
      "id": "resource-craft:customer-orders",
      "type": "resource",
      "fr": "Commandes, devis et fiches clients",
      "en": "Customer orders, quotations and records",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Commandes, devis et fiches clients"
      ]
    },
    {
      "id": "resource-craft:repair-parts",
      "type": "resource",
      "fr": "Pièces détachées et historiques techniques",
      "en": "Spare parts and technical histories",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Pièces détachées et historiques techniques"
      ]
    },
    {
      "id": "resource-craft:service-equipment",
      "type": "resource",
      "fr": "Équipements, outils et matériels d'intervention",
      "en": "Tools and service equipment",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Équipements, outils et matériels d'intervention"
      ]
    },
    {
      "id": "resource-craft:appointment-calendar",
      "type": "resource",
      "fr": "Calendrier des rendez-vous et interventions",
      "en": "Appointment and service calendar",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Calendrier des rendez-vous et interventions"
      ]
    },
    {
      "id": "resource-craft:hygiene-protocols",
      "type": "resource",
      "fr": "Protocoles d'hygiène et de sécurité",
      "en": "Hygiene and safety protocols",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Protocoles d'hygiène et de sécurité"
      ]
    },
    {
      "id": "function-craft:craft-workshop-management",
      "type": "function",
      "fr": "Gestion d'atelier, fabrication et commandes artisanales",
      "en": "Craft workshop, production and order management",
      "parentId": "domain:crafts",
      "aliases": [
        "Gestion d'atelier, fabrication et commandes artisanales"
      ]
    },
    {
      "id": "function-craft:customer-booking",
      "type": "function",
      "fr": "Réservation et gestion des rendez-vous clients",
      "en": "Customer booking and appointment management",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Réservation et gestion des rendez-vous clients"
      ]
    },
    {
      "id": "function-craft:beauty-salon-management",
      "type": "function",
      "fr": "Gestion d'un salon de beauté ou coiffure",
      "en": "Beauty salon and hairdressing management",
      "parentId": "domain:beauty-personal-care",
      "aliases": [
        "Gestion d'un salon de beauté ou coiffure"
      ]
    },
    {
      "id": "function-craft:repair-job-tracking",
      "type": "function",
      "fr": "Suivi des diagnostics, devis et réparations",
      "en": "Repair diagnosis, quotation and job tracking",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Suivi des diagnostics, devis et réparations"
      ]
    },
    {
      "id": "function-craft:home-service-scheduling",
      "type": "function",
      "fr": "Planification des services et interventions à domicile",
      "en": "Home service and visit scheduling",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Planification des services et interventions à domicile"
      ]
    },
    {
      "id": "function-craft:materials-stock-management",
      "type": "function",
      "fr": "Gestion des stocks de matières et pièces",
      "en": "Materials and spare parts inventory management",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Gestion des stocks de matières et pièces"
      ]
    },
    {
      "id": "function-craft:customer-feedback",
      "type": "function",
      "fr": "Suivi de satisfaction et réclamations clients",
      "en": "Customer satisfaction and complaint tracking",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Suivi de satisfaction et réclamations clients"
      ]
    },
    {
      "id": "indicator-craft:order-delivery-time",
      "type": "indicator",
      "fr": "Délai moyen de réalisation et livraison d'une commande",
      "en": "Average order completion and delivery time",
      "parentId": "domain:crafts",
      "aliases": [
        "Délai moyen de réalisation et livraison d'une commande"
      ]
    },
    {
      "id": "indicator-craft:craft-material-waste",
      "type": "indicator",
      "fr": "Taux de pertes et gaspillage de matières",
      "en": "Material waste rate",
      "parentId": "domain:crafts",
      "aliases": [
        "Taux de pertes et gaspillage de matières"
      ]
    },
    {
      "id": "indicator-craft:appointment-attendance",
      "type": "indicator",
      "fr": "Taux de présence aux rendez-vous",
      "en": "Appointment attendance rate",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Taux de présence aux rendez-vous"
      ]
    },
    {
      "id": "indicator-craft:repair-first-time-fix",
      "type": "indicator",
      "fr": "Taux de réparation réussie dès la première intervention",
      "en": "First-time fix rate",
      "parentId": "domain:repair-maintenance",
      "aliases": [
        "Taux de réparation réussie dès la première intervention"
      ]
    },
    {
      "id": "indicator-craft:home-service-on-time",
      "type": "indicator",
      "fr": "Taux d'interventions à domicile réalisées à l'heure",
      "en": "On-time home service rate",
      "parentId": "domain:domestic-services",
      "aliases": [
        "Taux d'interventions à domicile réalisées à l'heure"
      ]
    },
    {
      "id": "indicator-craft:customer-satisfaction",
      "type": "indicator",
      "fr": "Satisfaction des clients des services personnels",
      "en": "Personal service customer satisfaction",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Satisfaction des clients des services personnels"
      ]
    },
    {
      "id": "indicator-craft:repeat-customer-rate",
      "type": "indicator",
      "fr": "Taux de retour et fidélisation des clients",
      "en": "Repeat customer and retention rate",
      "parentId": "domain:local-personal-services",
      "aliases": [
        "Taux de retour et fidélisation des clients"
      ]
    }
  ],
  "safetyNotes": [
    "Les activités de beauté et soins personnels ne doivent pas être confondues avec des actes médicaux ; les qualifications, produits, hygiène et limites professionnelles sont vérifiés localement.",
    "Les réparations d'appareils, véhicules et bâtiments peuvent comporter des risques électriques, mécaniques ou structurels ; les intervenants doivent disposer des compétences et équipements requis.",
    "Les services à domicile nécessitent consentement, identification des intervenants, traçabilité des visites et protection des personnes, biens et clés d'accès.",
    "Les données clients, adresses, habitudes domestiques, paiements et photos d'intervention sont personnelles et doivent être protégées et limitées à la finalité de service.",
    "Les règles de sécurité au travail, gestion des déchets, produits chimiques, garanties et responsabilités varient selon le métier et la juridiction."
  ]
},[
  [
    "activity-craft:craft-object-making",
    "process-craft:craft-production-cycle",
    "part_of"
  ],
  [
    "activity-craft:equipment-repair",
    "process-craft:repair-diagnosis-cycle",
    "part_of"
  ],
  [
    "function-craft:repair-job-tracking",
    "activity-craft:equipment-repair",
    "supports"
  ],
  [
    "function-craft:customer-booking",
    "resource-craft:appointment-calendar",
    "manages"
  ],
  [
    "problem-craft:parts-stockouts",
    "function-craft:materials-stock-management",
    "may_be_mitigated_by"
  ],
  [
    "function-craft:craft-workshop-management",
    "resource-craft:craft-designs",
    "manages"
  ],
  [
    "activity-craft:home-service-visit",
    "process-craft:home-service-cycle",
    "part_of"
  ],
  [
    "problem-craft:service-booking-gaps",
    "function-craft:customer-booking",
    "may_be_mitigated_by"
  ]
]);
export const CRAFTS_PERSONAL_SERVICES_FAMILY_CONCEPTS=result.familyConcepts;
export const CRAFTS_PERSONAL_SERVICES_CATALOG=result.catalog;
export const CRAFTS_PERSONAL_SERVICES_RELATIONSHIPS=result.relationships;
