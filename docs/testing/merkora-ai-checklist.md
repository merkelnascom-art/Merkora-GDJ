# Checklist — analyse IA, amélioration et concurrence MerKora

## Contrôles automatiques
- [ ] `npm run typecheck` passe.
- [ ] `npm test` passe, y compris les tests de transport mocké, de garde de coût, de parse concurrentiel et de mode local.
- [ ] `npm run build` passe.
- [ ] Aucun test ne contacte un fournisseur IA réel.
- [ ] Quand `MERKORA_AI_ENABLED` n’est pas exactement `true`, la route retourne 503 avant l’appel fournisseur.
- [ ] Une origine invalide est refusée avant l’appel fournisseur.
- [ ] Les erreurs 401/403, 402, 429, timeout et réponse JSON incorrecte n’exposent aucun secret ni contenu brut du fournisseur.
- [ ] Les listes et champs de la réponse IA sont bornés et validés côté serveur.

## Mode local sans frais
- [ ] L’interface affiche explicitement « Préparer une analyse locale gratuite » si le moteur IA est désactivé.
- [ ] Une pré-analyse locale peut être préparée sans clé fournisseur ni requête réseau vers un modèle.
- [ ] Le résultat précise qu’il repose sur des règles locales, n’est pas une réponse IA et reste préliminaire.
- [ ] Les pistes peuvent être modifiées, retirées et ajoutées manuellement.
- [ ] Les améliorations peuvent être modifiées, retirées et ajoutées; une amélioration n’est ajoutée aux pistes qu’après action explicite.
- [ ] Appliquer les pistes ne modifie que les recommandations du dossier courant.
- [ ] Les dossiers non concernés restent inchangés.

## Analyse concurrentielle
- [ ] Sans concurrent/source fournie, l’état est « concurrence non vérifiée en direct ».
- [ ] Aucune marque, fonctionnalité, part de marché, performance ou prix de concurrent n’est inventé.
- [ ] Les informations saisies par l’utilisateur sont identifiées comme fournies par l’utilisateur, pas comme des faits indépendamment vérifiés.
- [ ] Les champs inconnus sont présentés comme à vérifier.
- [ ] La comparaison est facultative et n’empêche pas l’analyse d’un dossier.
- [ ] Les URL et notes saisies ne déclenchent pas de navigation, de scraping ni d’appel de recherche externe.

## Configuration et coûts
- [ ] Le code de la branche ne change pas `MERKORA_AI_ENABLED` et ne crée aucune variable fournisseur.
- [ ] Aucun budget, abonnement ou clé n’est créé automatiquement.
- [ ] Aucun appel de modèle réel n’est utilisé pendant les tests.
- [ ] Avant toute activation ultérieure, vérifier le modèle et son prix, configurer une limite de dépenses, puis obtenir une autorisation explicite.
- [ ] Ne jamais exposer `AI_GATEWAY_API_KEY` ou `VERCEL_OIDC_TOKEN` au navigateur.

## Vérification manuelle sur l’aperçu
- [ ] Ouvrir un dossier d’orientation scolaire et vérifier que les pistes correspondent au domaine, sans recommandations de gestion de boutique.
- [ ] Ouvrir un dossier de gestion d’équipe et vérifier les pistes de rôles, de présence et de suivi.
- [ ] Ajouter une piste, modifier ses trois champs, la retirer, puis en appliquer une autre.
- [ ] Ajouter une amélioration et vérifier qu’elle ne modifie pas les recommandations tant que l’action d’ajout n’a pas été choisie.
- [ ] Ajouter une source concurrentielle avec prix « à vérifier » et confirmer qu’aucun prix n’est présenté comme validé.
- [ ] Vérifier l’affichage sur mobile et desktop.
- [ ] Confirmer que l’inscription, la connexion, la confirmation e-mail et la synchronisation cloud continuent de fonctionner.
- [ ] Vérifier que l’aperçu n’a pas été promu en production et qu’aucune donnée Supabase n’a été supprimée ou réinitialisée.

## Limitations connues
- Le mode local ne consulte pas le web et ne produit pas une comparaison concurrentielle factuelle.
- L’analyse par un vrai modèle reste désactivée tant que la configuration et les dépenses ne sont pas explicitement autorisées.
- Les maquettes personnalisées, devis officiels, paiements et suivi de réalisation restent des phases distinctes.
