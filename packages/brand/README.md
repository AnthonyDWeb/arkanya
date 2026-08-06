# Identité visuelle Arkanya

`@arkanya/brand` est la source commune des logos et signatures de l’écosystème Arkanya.

## Contenu

- symbole Arkanya WebP carré ;
- symbole Arkanya PNG transparent ;
- favicon ICO historique ;
- logos et icônes ArkNest et ArkCare ;
- signatures Arkanya, Compte, Platform, API, Builder et Worker ;
- couleurs d’accent contextuelles ;
- composant d’attribution « par Arkanya ».

Les formats raster proviennent des fichiers réellement utilisés dans le monorepo. Aucun SVG
artificiel n’est généré à partir de ces images : une future source vectorielle officielle pourra
être ajoutée sans changer l’API du package.

## Usage

```tsx
import { ArkanyaBrand } from '@arkanya/brand';
import '@arkanya/brand/styles.css';

<ArkanyaBrand context="platform" />;
```

Les produits gardent leur identité propre et peuvent utiliser `ProductAttribution` pour afficher
leur rattachement à Arkanya.
