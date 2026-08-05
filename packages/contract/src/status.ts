import { UserId } from './actor';

export type ReportId = string;
export type RemovalReason = 'violation' | 'fraud' | 'inappropriate' | 'other';
export type DeclineReason = 'unavailable' | 'not_a_fit' | 'other';

export type ListingStatus =
  | { kind: 'draft' }
  | { kind: 'published'; publishedAt: string }
  | { kind: 'paused' }
  | { kind: 'under_review'; reportId: ReportId }
  | {
      kind: 'removed';
      removedBy: UserId;
      reason: RemovalReason;
    };

export type BookingStatus =
  | { kind: 'requested'; requestedAt: string }
  | {
      kind: 'accepted';
      acceptedAt: string;
      scheduledFor: string;
    }
  | { kind: 'declined'; reason: DeclineReason }
  | { kind: 'completed'; completedAt: string }
  | {
      kind: 'cancelled';
      cancelledBy: UserId;
      at: string;
    };
