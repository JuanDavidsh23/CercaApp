import { describe, it, expect } from 'vitest';
import { Actor, Capacity, PlatformRole } from '../actor';
import { can, has, Permission } from '../permissions';

const createActor = (capacities: Capacity[], platformRole: PlatformRole = 'user'): Actor => ({
  id: 'user_123',
  capacities,
  platformRole,
});

describe('Permissions', () => {
  describe('has', () => {
    it('returns true when actor has capacity', () => {
      const actor = createActor(['provider']);
      expect(has(actor, 'provider')).toBe(true);
    });

    it('returns false when actor lacks capacity', () => {
      const actor = createActor(['customer']);
      expect(has(actor, 'provider')).toBe(false);
    });
  });

  describe('can', () => {
    it('allows everyone to read listings', () => {
      const actor = createActor(['customer']);
      expect(can(actor, 'listing:read')).toBe(true);
    });

    it('allows providers and admins to create listings', () => {
      const customer = createActor(['customer']);
      const provider = createActor(['provider']);
      const admin = createActor(['customer'], 'admin');

      expect(can(customer, 'listing:create')).toBe(false);
      expect(can(provider, 'listing:create')).toBe(true);
      expect(can(admin, 'listing:create')).toBe(true);
    });

    it('allows providers and admins to update listings', () => {
      const customer = createActor(['customer']);
      const provider = createActor(['provider']);
      const admin = createActor(['customer'], 'admin');

      expect(can(customer, 'listing:update')).toBe(false);
      expect(can(provider, 'listing:update')).toBe(true);
      expect(can(admin, 'listing:update')).toBe(true);
    });

    it('allows moderators and admins to moderate listings', () => {
      const user = createActor(['customer'], 'user');
      const moderator = createActor(['customer'], 'moderator');
      const admin = createActor(['customer'], 'admin');

      expect(can(user, 'listing:moderate')).toBe(false);
      expect(can(moderator, 'listing:moderate')).toBe(true);
      expect(can(admin, 'listing:moderate')).toBe(true);
    });

    it('allows everyone to request a booking', () => {
      const customer = createActor(['customer']);
      expect(can(customer, 'booking:request')).toBe(true);
    });

    it('only allows providers to accept a booking', () => {
      const customer = createActor(['customer']);
      const provider = createActor(['provider']);
      const admin = createActor(['customer'], 'admin');

      expect(can(customer, 'booking:accept')).toBe(false);
      expect(can(provider, 'booking:accept')).toBe(true);
      expect(can(admin, 'booking:accept')).toBe(false); // Only provider capacity!
    });

    it('allows everyone to write a review', () => {
      const customer = createActor(['customer']);
      expect(can(customer, 'review:write')).toBe(true);
    });

    it('allows moderators and admins to moderate reviews and resolve reports', () => {
      const user = createActor(['customer'], 'user');
      const moderator = createActor(['customer'], 'moderator');
      const admin = createActor(['customer'], 'admin');

      expect(can(user, 'review:moderate')).toBe(false);
      expect(can(moderator, 'review:moderate')).toBe(true);
      expect(can(admin, 'review:moderate')).toBe(true);

      expect(can(user, 'report:resolve')).toBe(false);
      expect(can(moderator, 'report:resolve')).toBe(true);
      expect(can(admin, 'report:resolve')).toBe(true);
    });

    it('only allows admins to suspend users', () => {
      const user = createActor(['customer'], 'user');
      const moderator = createActor(['customer'], 'moderator');
      const admin = createActor(['customer'], 'admin');

      expect(can(user, 'user:suspend')).toBe(false);
      expect(can(moderator, 'user:suspend')).toBe(false);
      expect(can(admin, 'user:suspend')).toBe(true);
    });

    it('returns false for unknown permissions', () => {
      const user = createActor(['customer'], 'user');
      expect(can(user, 'unknown:permission' as Permission)).toBe(false);
    });
  });
});
