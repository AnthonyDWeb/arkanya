# @arkanya/capacitor

Adapters Capacitor partages pour les applications Arkanya.

## API publique

- `isNativePlatform`
- `checkLocalNotificationStatus`
- `requestLocalNotificationPermission`
- `getPendingLocalNotificationCount`
- `createLocalNotificationChannel`
- `scheduleLocalNotifications`
- `cancelLocalNotifications`
- `changeExactNotificationSetting`

## Variables d'environnement

Aucune.

## Exemple

```ts
import { scheduleLocalNotifications } from '@arkanya/capacitor';

await scheduleLocalNotifications({
  notifications: [{ id: 1, title: 'App', body: 'Rappel', schedule: { at: new Date() } }],
});
```
