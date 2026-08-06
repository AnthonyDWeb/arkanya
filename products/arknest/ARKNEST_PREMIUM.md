# ArkNest — périmètre Gratuit et Premium

Décision produit au 2026-07-23. Ce document complète `ARKNEST_V1.md` et devient la référence pour
les droits fonctionnels ArkNest.

## Principes

- ArkNest reste utilisable sans compte et hors ligne.
- Le budget mensuel essentiel reste gratuit.
- Premium finance les fonctions d’anticipation, d’analyse et les services cloud.
- Une expiration Premium ne supprime aucune donnée.
- L’interface peut présenter une fonction Premium, mais l’API vérifie toujours le droit réel.
- L’export JSON manuel reste gratuit afin de protéger la portabilité des données.

## Gratuit

- un foyer local ;
- membres budgétaires ;
- revenus et dépenses ;
- dépenses globales et individuelles ;
- catégories et types personnalisés ;
- répartitions égale, proportionnelle et personnalisée ;
- dashboard du mois courant ;
- vues cartes et tableau ;
- totaux revenus, dépenses et reste ;
- fonctionnement hors ligne ;
- export et import JSON manuels ;
- réinitialisation locale ;
- application Android et mises à jour.

## ArkNest Premium V1

- simulations budgétaires ;
- objectifs d’épargne et leur évolution ;
- mouvements et virements automatiques liés aux objectifs ;
- statistiques historiques et graphiques ;
- comparaison entre mois et membres ;
- sauvegarde cloud automatique ;
- restauration cloud ;
- synchronisation multi-appareils ;
- gestion et révocation des appareils ;
- plusieurs foyers ;
- collaboration, invitations et rôles ;
- historique cloud étendu ;
- rapports PDF, CSV ou compatibles tableur.

## Évolutions Premium prévues

- enveloppes et plafonds avancés ;
- prévisions à plusieurs mois ;
- scénarios enregistrés ;
- notifications personnalisées ;
- import CSV assisté ;
- justificatifs ;
- objectifs récurrents et priorisés ;
- personnalisation avancée ;
- assistance intelligente avec consentement explicite.

## Droits techniques envisagés

```text
arknest.simulations
arknest.goals
arknest.advanced_statistics
arknest.cloud_sync
arknest.cloud_restore
arknest.multi_device
arknest.multiple_households
arknest.household_collaboration
arknest.extended_history
arknest.advanced_exports
```

Les limites de foyers, utilisateurs, historique et appareils proviennent des entitlements de l’API
et ne sont jamais codées en dur dans l’application.

## Accès

Les droits peuvent provenir d’un abonnement ArkNest, d’Arkanya+, d’un essai, d’un achat, d’un code
universel ou d’un accès manuel. Le moyen d’obtention ne modifie pas la vérification fonctionnelle.

Avant l’intégration du paiement, toutes les restrictions et fonctions Premium doivent être
opérationnelles. L’accès est alors accordé par un code configuré ou une attribution administrative
auditée ; aucun contournement local permanent n’est autorisé dans l’application.
