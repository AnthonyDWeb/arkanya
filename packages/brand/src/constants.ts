export const ARKANYA_BRAND_NAME = 'Arkanya';

export type ArkanyaBrandContext = 'arkanya' | 'account' | 'platform' | 'api' | 'builder' | 'worker';

export const arkanyaBrandContexts = {
  arkanya: { label: 'Arkanya', qualifier: null, accent: '#d6a928' },
  account: { label: 'Arkanya', qualifier: 'Compte', accent: '#3977f6' },
  platform: { label: 'Arkanya', qualifier: 'Platform', accent: '#7657e8' },
  api: { label: 'Arkanya', qualifier: 'API', accent: '#159fb7' },
  builder: { label: 'Arkanya', qualifier: 'Builder', accent: '#e18432' },
  worker: { label: 'Arkanya', qualifier: 'Worker', accent: '#29966f' },
} as const satisfies Record<
  ArkanyaBrandContext,
  { label: string; qualifier: string | null; accent: string }
>;
