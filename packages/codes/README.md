# Codes Arkanya

`@arkanya/codes` fournit le parcours unique de saisie d’un code pour Account, ArkNest et ArkCare.

Le package contient uniquement :

- la normalisation et la validation de format ;
- le formulaire accessible partagé ;
- les types de résultats ;
- le client HTTP vers Arkanya API ;
- le panneau d’accès Premium réutilisable.

Il ne contient aucun code valide ni règle commerciale. L’API authentifiée et PostgreSQL restent la
seule source de vérité. Dans le périmètre initial, un code accorde uniquement l’accès à la version
Premium d’un produit ou d’Arkanya+, temporairement ou définitivement.

Les réductions, promotions, prolongations d’abonnement et droits unitaires ne sont pas activables
tant que le paiement n’est pas implémenté.
