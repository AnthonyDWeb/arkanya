# ArkCare

Application locale de suivi des traitements et des prises, distribuee en PWA et en application
Android Capacitor. ArkCare est une aide au suivi : elle ne remplace pas un avis medical.

## Validation web

Depuis `apps/products/arkcare` :

```powershell
npm install
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Release Android signee

Prerequis : Android Studio/JDK, SDK Android et un keystore de release conserve hors de Git.
Creer `android/keystore.properties` :

```properties
storeFile=C:/chemin/securise/arkcare-release.jks
storePassword=SECRET
keyAlias=arkcare
keyPassword=SECRET
```

Ne jamais committer ce fichier ni le keystore. Verifier que `APP_VERSION`, `APP_VERSION_CODE`,
`versionName`, `versionCode` et `public/app-version.json` sont synchronises, puis lancer :

```powershell
npm run cap:android:release
```

Le script refuse de construire sans configuration de signature, execute le build Next, synchronise
Capacitor, assemble la release et copie l'APK dans `public/downloads/arkcare.apk`.

## Recette avant diffusion

- installer la release au-dessus de la version precedente et confirmer la conservation des donnees ;
- tester une sauvegarde puis sa restauration ;
- tester les rappels autorises et refuses, ecran verrouille, application fermee et telephone redemarre ;
- tester les alarmes exactes avec et sans autorisation Android ;
- verifier les mises a jour PWA et APK depuis le domaine canonique `arkcare.arkanya.fr` ;
- conserver une release candidate plusieurs jours avec des traitements quotidiens, cycliques et
  plusieurs dosages par jour.
