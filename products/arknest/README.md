# ArkNest

Application locale de gestion et simulation budgetaire. Les donnees sont conservees dans le
navigateur de l'utilisateur.

## Commandes

```bash
pnpm dev
pnpm lint
pnpm check-types
pnpm test
pnpm build
pnpm cap:sync
pnpm cap:android:debug
```

ArkNest utilise les versions communes Node, Next.js, React et TypeScript du monorepo. Les regles
metier et priorites sont decrites dans `AGENTS.md` et `ARKANYA_ROADMAP.md`.

Le perimetre et les regles V1 sont documentes dans `ARKNEST_V1.md`. Les controles restant a
effectuer sur appareils reels sont listes dans `ARKNEST_MANUAL_TESTS.md`.

## Application Android

ArkNest est encapsule avec Capacitor sous l'identifiant `com.arknest.app`. L'application embarque
l'export statique Next.js dans sa WebView et conserve ses donnees localement sur l'appareil.

- `pnpm cap:sync` reconstruit l'interface et synchronise le projet natif ;
- `pnpm cap:android` ouvre le projet dans Android Studio ;
- `pnpm cap:android:debug` produit une APK de test ;
- `pnpm android:icons` regenere les icones Android depuis `public/icon-512.png` ;
- `pnpm cap:android:release` produit une APK signee.

Les scripts Android retirent temporairement l'ancienne APK publique avant l'export afin de ne pas
l'embarquer dans l'application. Apres un build reussi, l'APK produite est publiee dans
`public/downloads/arknest.apk`. Le manifeste `public/app-version.json` doit etre aligne avec
`data/appInfo.ts` et les valeurs `versionName`/`versionCode` Android a chaque release.

Une release exige un certificat propre a ArkNest. Copier `android/keystore.properties.example` vers
`android/keystore.properties`, renseigner le chemin du keystore et ses secrets, puis conserver ce
keystore hors de Git et dans une sauvegarde securisee. Une future mise a jour Android devra etre
signee avec le meme certificat pour conserver l'installation et les donnees locales.

La cle de release locale creee pour ArkNest et son fichier `keystore.properties` sont ignores par
Git. Ils doivent etre sauvegardes dans un coffre externe avant toute diffusion de l'APK.
