# ArkNest V1 - Recette manuelle restante

Les validations automatisees ne remplacent pas les controles suivants sur appareils reels.

## Appareils et navigation

- petit telephone Android avec Brave et Chrome ;
- tablette en portrait et paysage ;
- ordinateur avec navigation clavier uniquement ;
- installation PWA, fermeture complete puis reouverture ;
- verification du focus visible, de l'ordre de tabulation et des boutons avec lecteur d'ecran.

## Scenarios metier

- foyer de 1, 2, 5 et 10 membres ;
- repartitions egalitaire, proportionnelle sans revenu et personnalisee totalisant 100 % ;
- suppression d'un membre pendant un mode personnalise ;
- revenus mensuels et hebdomadaires ;
- montants avec centimes et depense globale produisant un centime residuel ;
- passage reel au mois suivant, application fermee, puis verification de la cloture ;
- plusieurs objectifs automatiques, objectif archive et objectif presque atteint ;
- historique long avec noms et montants de grande taille.

## Sauvegardes

- export puis import sur un autre navigateur ;
- ancienne sauvegarde avec `userId` ;
- fichier JSON tronque, schema futur, montant negatif et reference inconnue ;
- annulation apres l'apercu d'import ;
- confirmation que les donnees courantes ne changent pas avant validation explicite.

Chaque anomalie doit preciser appareil, navigateur, orientation, etapes, resultat obtenu et resultat
attendu avant validation de la release candidate.
