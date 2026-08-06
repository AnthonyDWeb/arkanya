/**
 * Ports localhost Arkanya
 *
 * 3000+ apps
 * 4000+ services / API
 * 5000+ products
 * 6100+ marketing  (6000 réservé X11 par Next.js)
 * 7000+ clients
 */

export const PORTS = {
  // apps
  platform: 3000,
  account: 3001,

  // services
  worker: 4000,

  // products
  arknest: 5000,
  arkcare: 5001,

  // marketing
  "anthony-delforge": 6100,
  "arkanya-website": 6101,

  // clients
  lesservicesdemathilde: 7000,
}

/** Prochain port libre par famille (pour nouveaux projets). */
export const PORT_RANGES = {
  apps: { start: 3000, next: 3002 },
  services: { start: 4000, next: 4001 },
  products: { start: 5000, next: 5002 },
  marketing: { start: 6100, next: 6102 },
  clients: { start: 7000, next: 7001 },
}
