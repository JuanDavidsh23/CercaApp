import { Actor } from "./actor";
import { BookingStatus } from "./status";

export type ReviewBlockedReason =
  "not_your_booking" | "not_completed" | "already_reviewed" | "window_closed";

export type ReviewEligibility = { ok: true } | { ok: false; reason: ReviewBlockedReason };

export const REVIEW_WINDOW_DAYS = 30;

interface Booking {
  readonly id: string;
  readonly customerId: string;
  readonly status: BookingStatus;
  readonly hasReview: boolean;
}

export function canReviewBooking(
  actor: Actor,
  booking: Booking,
  now: Date,
): ReviewEligibility {
  if (booking.customerId !== actor.id) {
    return { ok: false, reason: "not_your_booking" };
  }

  if (booking.status.kind !== "completed") {
    return { ok: false, reason: "not_completed" };
  }

  if (booking.hasReview) {
    return { ok: false, reason: "already_reviewed" };
  }

  const completedAt = new Date(booking.status.completedAt);
  const diffTime = Math.abs(now.getTime() - completedAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > REVIEW_WINDOW_DAYS) {
    return { ok: false, reason: "window_closed" };
  }

  return { ok: true };
}
