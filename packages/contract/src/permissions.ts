import { Actor, Capacity } from './actor';

export type Permission =
  | 'listing:read'
  | 'listing:create'
  | 'listing:update'
  | 'listing:moderate'
  | 'booking:request'
  | 'booking:accept'
  | 'review:write'
  | 'review:moderate'
  | 'report:resolve'
  | 'user:suspend';

export function has(actor: Actor, capacity: Capacity): boolean {
  return actor.capacities.includes(capacity);
}

export function can(actor: Actor, permission: Permission): boolean {
  switch (permission) {
    case 'listing:read':
      return true; // Everyone can read

    case 'listing:create':
      return has(actor, 'provider') || actor.platformRole === 'admin';

    case 'listing:update':
      return has(actor, 'provider') || actor.platformRole === 'admin';

    case 'listing:moderate':
      return actor.platformRole === 'moderator' || actor.platformRole === 'admin';

    case 'booking:request':
      return true; // customer or provider or moderator or admin (all yes)

    case 'booking:accept':
      return has(actor, 'provider');

    case 'review:write':
      return true; // customer, provider, moderator, admin all yes

    case 'review:moderate':
    case 'report:resolve':
      return actor.platformRole === 'moderator' || actor.platformRole === 'admin';

    case 'user:suspend':
      return actor.platformRole === 'admin';

    default:
      return false;
  }
}
