# Vérification manuelle — Studio de maquettes MerKora GDJ

## Accès et contexte
- [ ] Ouvrir un dossier existant et confirmer que le studio apparaît dans le détail du dossier.
- [ ] Vérifier que la liste des dossiers, l'analyse locale, les propositions éditables et le compte restent accessibles.
- [ ] Vérifier que le studio affiche explicitement qu'il s'agit d'une maquette conceptuelle non fonctionnelle.

## Student Vision
- [ ] Ouvrir le dossier Student Vision.
- [ ] Confirmer que les blocs proposés sont orientés profil de l'élève, tests, métiers, formations et écoles.
- [ ] Changer le format Site web → Mobile → Tableau de bord et vérifier que la disposition change.
- [ ] Changer les palettes Violet, Bleu, Émeraude et Ambre.
- [ ] Désactiver un bloc puis le réactiver ; vérifier que l'aperçu est mis à jour.
- [ ] Copier le résumé et vérifier qu'il ne contient aucun établissement, prix ou taux de réussite inventé.

## Autres domaines
- [ ] Ouvrir un dossier de gestion d'équipe et vérifier les blocs de présence, tâches, responsabilités et historique.
- [ ] Ouvrir un besoin créatif et vérifier les blocs de direction créative, contenus et validation.
- [ ] Ouvrir un besoin ambigu et vérifier que le studio reste neutre au lieu d'inventer un secteur.

## Persistance et sécurité
- [ ] Changer format, palette et blocs, rafraîchir la page dans le même navigateur et vérifier que les réglages sont conservés.
- [ ] Confirmer que les préférences utilisent une clé locale distincte par dossier et n'écrasent pas `merkora-gdj-projects-v1`.
- [ ] Confirmer que le texte indique que les réglages du studio ne sont pas encore synchronisés dans le cloud.
- [ ] Vérifier que le studio n'appelle aucun endpoint IA et ne nécessite aucune clé fournisseur.
- [ ] Tester l'affichage sur mobile et desktop.
- [ ] Vérifier qu'aucune donnée Supabase n'a été modifiée et que le déploiement est un Preview (target null), pas la production.

## Limites actuelles
- Le studio assemble des composants d'interface à partir de règles locales ; ce n'est pas encore une image IA ni une application générée.
- Les boutons de démonstration de l'aperçu ne sont pas reliés à un vrai produit.
- Les préférences du studio restent locales à ce navigateur.
- Les validations du client, les versions de maquette, le devis officiel et le suivi de réalisation restent à construire.
