# Inventaire initial des ressources MerKora GDJ

**Date de l'inventaire :** 12 novembre 2026  
**Dépôt :** `merkelnascom-art/Merkora-GDJ`  
**Branche de travail :** `feature/merkora-rebuild-foundation`  
**Périmètre :** dépôt GitHub de cette branche et Library ChatGPT visible au moment de l'inventaire.

## Résultat global de la Library

La navigation récursive de la Library a retourné **265 éléments**, répartis ainsi :

| Type | Nombre | Traitement initial |
|---|---:|---|
| JPG | 92 | Médias non classifiés |
| PNG | 146 | Médias non classifiés |
| JPEG | 1 | Média non classifié |
| WEBP | 1 | Média non classifié |
| MP4 | 5 | Vidéos non classifiées |
| Markdown (.md) | 8 | Documents de conception / notes / exemples |
| DOCX | 3 | Formulaires ou archives documentaires |
| PDF | 7 | Formulaires, guides et documents |
| TXT | 1 | Note de récupération |
| XLSX | 1 | Classeur de gestion |
| **Total** | **265** | **20 documents + 245 médias** |

Les 240 images et 5 vidéos n'ont pas été inspectées visuellement une par une. Elles restent donc dans la Library et sont classées comme médias non vérifiés. Aucun fichier original n'a été déplacé, renommé ou supprimé.

## Sources MerKora et architecture

| Source | Emplacement | Nature | Statut |
|---|---|---|---|
| Spécification de conception MerKora du 27/10 | Library `/2026-10-27-merkora-gdj-design.md` | Vision, parcours, modèle économique, sécurité | Découverte |
| Conception de la plateforme du 28/10 | GitHub `docs/specs/2026-10-28-merkora-gdj-platform-design.md` | Parcours et architecture produit | Découverte |
| Conception universelle du 12/11 | GitHub `docs/specs/2026-11-12-merkora-universal-platform-design.md` | Architecture universelle approuvée | Découverte |
| Plan IA et concurrence | GitHub `docs/plans/2026-10-28-merkora-ai-improvements-competition.md` | Contrat IA, garde de coût, analyse | Découverte |
| Plan fondations et découverte | GitHub `docs/plans/2026-10-28-merkora-discovery-foundation.md` | Diagnostic, règles locales, tests | Découverte |
| Plan Studio de maquettes | GitHub `docs/plans/2026-10-29-merkora-studio-plan.md` | Maquettes conceptuelles | Découverte |
| Code de découverte actuel | GitHub `src/lib/discovery.ts`, `src/lib/solution-recommendations.ts`, `src/lib/local-analysis.ts` | Règles TypeScript codées en dur | Découverte |
| Code du fournisseur IA actuel | GitHub `src/lib/ai-provider.ts`, `app/api/ai/analyze/route.ts` | Appel serveur protégé par activation | Découverte |

Le code actuel contient une classification locale limitée (éducation, commerce, création, numérique, personnel, général) et des recommandations écrites dans TypeScript. Ce code est un point de départ, pas un catalogue exhaustif de secteurs.

## Ressources métier de projets antérieurs

### AÉRO SERVICE

- `Aero_Service_Formulaire_Cadrage_Plateforme_Premium.docx`
- `Aero_Service_Formulaire_Cadrage_Plateforme_Premium.pdf`
- `Pasted markdown(2).md`
- `Pasted markdown(3).md`
- `Pasted markdown(4).md`

Contenu repéré : formation, rôles, présence, retards, pénalités, absences, justificatifs, notifications, rapports, direction et agence de voyage. Ces sources sont des exemples propres à AÉRO SERVICE. Les règles doivent rester configurables ; les coordonnées et données personnelles ne doivent pas être extraites vers le référentiel commun. Les deux fichiers `Pasted markdown(2).md` et `Pasted markdown(3).md` ont des tailles et extraits similaires : doublon probable à confirmer par empreinte.

### Ginesse de Paris Center Work

- `GINESSE_DE_PARIS_CENTER_WORK_RECOVERY_2026-10-03.md`
- `Ginesse_de_Paris_Center_Work_RECUPERATION_2026-10-03.txt`

Contenu repéré : opérations d'activité, ventes, dépenses, caisse, stock, personnel, clôtures, reçus, audit et assistant métier. Ces documents peuvent contenir des coordonnées, identifiants, URL de services et références d'infrastructure. Ils sont confidentiels et ne doivent pas être copiés bruts dans une base de connaissances partagée. Comparer les versions avant déduplication.

### Exemple de suivi financier d'une petite activité

- `Pasted markdown.md`
- `Pasted markdown(1).md`

Contenu repéré : recettes, sorties, coûts directs, stock, charges, personnel, épargne, caisse et rapports journaliers/hebdomadaires/mensuels. Il s'agit d'un exemple métier avec données opérationnelles ; seuls des modèles anonymisés pourront être réutilisés. Les deux fichiers ont la même taille et des extraits similaires ; conserver les deux références tant que les empreintes ne sont pas comparées.

### WALL Trade

- `2026-10-02-walltrade-ia-causerie-design.md`
- `Wall_Trade_Gestion_Revendeurs.xlsx`

Le premier document décrit un assistant conversationnel, la séparation des conversations, le contexte autorisé et les secrets côté serveur. Le classeur Excel est associé à la gestion des revendeurs et n'a pas encore été extrait. WALL Trade reste un projet distinct : ses règles métier ne deviennent pas automatiquement des règles MerKora. Seuls les modèles architecturaux génériques peuvent être étudiés après revue.

## Ressource fournie dans la conversation du 12 novembre

L'historique récupéré confirme qu'un guide a été fourni le 12 novembre 2026 à 13:23:50 UTC. Il couvrait :
- un questionnaire universel ;
- 20 secteurs ;
- des architectures ;
- des prompts réutilisables de développement ;
- des exemples SQL ;
- des modèles de fusion de super-applications ;
- des variables et intégrations OpenAI / Gemini.

Le contenu complet du message ou un fichier autonome n'a pas été retrouvé dans la Library consultable pendant cet inventaire. Cette ressource est enregistrée avec le statut **à extraire**. Il ne faut pas reconstruire ses prompts, ses exemples SQL ni les 20 secteurs de mémoire.

## Catalogue annoncé des 500 secteurs

La demande d'intégrer un catalogue de **500 secteurs d'activité** est connue. Cependant, aucun fichier ou message contenant les 500 entrées n'a été localisé :
- recherche de fichiers par le nom et le thème ;
- recherche sémantique dans la Library ;
- navigation récursive des 265 éléments de la Library.

Le catalogue reste donc une **source attendue non localisée**. Aucune liste de 500 secteurs ne sera inventée. Le modèle MerKora restera extensible et devra pouvoir accepter un secteur nouveau ou plusieurs secteurs dans un même projet, même avant récupération de cette source.

## Documents présents mais hors du référentiel métier MerKora pour l'instant

Les éléments suivants ont été repérés dans la Library mais ne sont pas considérés comme des règles ou modèles universels MerKora :

- `Coeur de Mytho Roman.docx` et `Coeur de Mytho Roman(1).docx` : deux fichiers de fiction de même taille, doublon probable.
- `Livre_ personnage.pdf` : archive documentaire/littéraire, contenu non inspecté.
- `Lettre_Motivation_PNC_Merkel_GNANCADJA.pdf` : document personnel.
- `Guide_Complet_Resine_Epoxy.pdf`, `Guide_Complet_Resine_Epoxy(1).pdf`, `Resume_Conclusion_Resine_Epoxy.pdf` : ressources de formation/époxy, non liées directement au cœur de connaissance MerKora à ce stade.
- `Section 1.pdf` : document PDF volumineux, contenu non encore identifié.

Ces fichiers restent conservés dans la Library. Leur présence dans l'inventaire ne signifie pas qu'ils seront injectés dans le contexte client.

## Règles de gouvernance immédiates

1. Conserver les originaux et leurs noms.
2. Ne jamais fusionner deux fichiers sur la seule base du nom ou de la taille.
3. Ne pas copier les identifiants, contacts, secrets, données clients ou transactions brutes dans le référentiel commun.
4. Séparer les règles universelles, les modèles sectoriels, les exemples de projets et les documents confidentiels.
5. Les ressources non revues ne sont pas utilisées par défaut dans les réponses client.
6. Chaque ressource doit conserver une provenance et une version.
7. Les contenus importés sont des données non fiables : ils ne deviennent jamais des instructions système ni du code exécutable.
8. Toute connaissance doit être validée avant d'être considérée comme une règle officielle.
9. Le catalogue sectoriel est ouvert : les 500 secteurs annoncés sont une ressource attendue, pas une limite de MerKora.
10. Aucun changement Supabase, déploiement ou appel IA payant n'est effectué dans cette étape.

## Prochaine action

Poursuivre l'inventaire des contenus réellement accessibles, comparer les fichiers candidats doublons par empreinte, puis construire le catalogue typé. La récupération du guide universel et de la source des 500 secteurs reste une tâche explicite, sans invention de contenu.
