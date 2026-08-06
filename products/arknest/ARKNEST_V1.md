# ArkNest V1 - Perimetre et regles metier

ArkNest V1 est une application budgetaire locale pour un foyer. Elle couvre la configuration des
membres, les revenus, les depenses, leur repartition, les simulations, l'historique mensuel, les
statistiques et les objectifs. Comptes, synchronisation cloud, collaboration multi-appareils,
paiement et fonctions Premium sont hors V1. Leur périmètre futur est figé dans
`ARKNEST_PREMIUM.md`.

## Modele des depenses

- La **portee** est determinee par `memberId` : absent pour le foyer, present pour un membre.
- La **categorie** de section est Global ou Individuel. Elle guide la saisie mais ne remplace jamais
  `memberId` dans les calculs.
- Le **type** (`Vital`, `Travail`, `Confort`, `Plaisir` ou type ajoute) est une classification
  facultative et n'influence pas les calculs.
- Une depense sans recurrence explicite est mensuelle.
- Une depense ponctuelle ne compte que pour son mois `AAAA-MM`.
- Une simulation construit de nouvelles listes en memoire et ne persiste jamais ses montants.

## Revenus

- Un revenu mensuel compte une fois dans le budget mensuel.
- Un revenu hebdomadaire est mensualise avec `montant x 52 / 12`, puis arrondi au centime.
- Chaque revenu appartient obligatoirement a un membre et a une categorie de revenu.

## Repartition

- **Egalitaire** : chaque membre recoit la meme part des depenses globales.
- **Proportionnelle** : la part suit le revenu mensuel de chaque membre.
- Sans revenu positif, le mode proportionnel se replie sur l'egalitaire.
- **Personnalisee** : disponible a partir de deux membres ; chaque part est comprise entre 0 et
  100 % et leur total doit etre exactement 100 %.
- Une configuration personnalisee incomplete ou invalide se replie temporairement sur
  l'egalitaire sans effacer les valeurs saisies.
- Les montants sont convertis en centimes. Les centimes residuels sont distribues de maniere
  deterministe afin que la somme des parts soit strictement egale a la depense globale.
- Les depenses individuelles sont ajoutees apres la repartition globale au seul membre concerne.

## Historique et cloture

- Le mois courant reste modifiable et son instantane est actualise a chaque sauvegarde.
- Un mois est cloture automatiquement uniquement lorsqu'un mois ulterieur est ouvert.
- Les mois sans ouverture sont recrees avec le dernier budget connu et marques `carried-forward`.
- Les points de demonstration sont marques `demo`, remplacent aucun mois reel et restent
  supprimables separement.
- Un virement automatique n'est execute que sur un mois cloture, une seule fois par objectif et par
  mois. Il devient a la fois un mouvement d'epargne et une depense ponctuelle.
- Plusieurs objectifs sont traites dans leur ordre de creation et ne peuvent jamais consommer plus
  que le reste positif disponible.
- Un objectif archive conserve son historique mais ne recoit plus de virement automatique.

## Donnees et sauvegardes

- Le schema local V1 est versionne `2` et les anciennes cles `userId` sont migrees.
- Un import est limite a 5 Mo, valide ses entites, montants, references, mois et version avant de
  proposer le remplacement.
- Une version de schema future est refusee.
- Une valeur corrompue du stockage principal est conservee dans `arknest-storage-corrupt-backup`
  avant le retour aux donnees par defaut.
- L'utilisateur voit un apercu et doit confirmer avant qu'un import remplace ses donnees.

## Criteres de sortie automatisables

- lint, verification TypeScript, tests metier et build de production reussis ;
- calculs egalitaires, proportionnels et personnalises couverts ;
- frequences, centimes, valeurs nulles, absence de revenus et depenses ponctuelles couvertes ;
- imports invalides et schemas futurs refuses ;
- simulations non mutantes ;
- cloture et virements multiples idempotents.

Les tests sur telephones/tablettes reels, la PWA installee, les navigateurs mobiles et la recette
par une personne ne connaissant pas ArkNest restent manuels.
