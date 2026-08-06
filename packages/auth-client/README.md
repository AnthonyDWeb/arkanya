# @arkanya/auth-client

Client d’authentification commun pour Account, Platform, ArkNest, ArkCare et les futurs projets.

- l’API reste la source de vérité ;
- le Web utilise les cookies de session de `api.arkanya.fr` ;
- un client natif fournit un `TokenStore` adossé au stockage sécurisé du système ;
- aucun jeton ne doit être placé dans `localStorage`.

Le package exporte `ArkanyaAuthClient`, `ArkanyaAuthProvider`, `useArkanyaAuth` et
`ArkanyaAuthPanel`. Les applications peuvent conserver leur style tout en partageant le protocole.

## Convention de navigation

Tout projet Arkanya utilisant ce package réserve `/auth` à la connexion et `/auth/register` à
l’inscription. Une page « Mon compte » située dans les réglages n’embarque pas ces formulaires :
elle affiche les données et droits du produit courant et renvoie vers `account.arkanya.fr` pour la
gestion globale ou les demandes sensibles.

## Cache et revalidation

Le Provider conserve un instantané non sensible de l’utilisateur et de ses droits dans
`sessionStorage`, séparé par produit. Un instantané récent évite les appels API de simple
vérification pendant cinq minutes. La revalidation suivante s’exécute en arrière-plan, sans message,
écran de chargement ni jeton dans le stockage Web. L’API reste obligatoire pour toute opération
sensible et demeure la source de vérité.
