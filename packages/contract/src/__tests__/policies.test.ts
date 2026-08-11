import { describe, it, expect } from "vitest";
import { canReviewBooking, REVIEW_WINDOW_DAYS } from "../policies";
import { Actor } from "../actor";
import { BookingStatus } from "../status";

const createActor = (id: string): Actor => ({
  id,
  capacities: ["customer"],
  platformRole: "user",
});

const createBooking = (
  id: string,
  customerId: string,
  status: BookingStatus,
  hasReview: boolean = false,
) => ({
  id,
  customerId,
  status,
  hasReview,
});

describe("Policies: canReviewBooking", () => {
  const actor = createActor("user_1");
  const now = new Date("2026-08-05T12:00:00Z");

  it("blocks review if not your booking", () => {
    const booking = createBooking("booking_1", "user_2", {
      kind: "completed",
      completedAt: "2026-08-01T12:00:00Z",
    });
    expect(canReviewBooking(actor, booking, now)).toEqual({
      ok: false,
      reason: "not_your_booking",
    });
  });

  it("blocks review if booking is not completed", () => {
    const booking = createBooking("booking_1", "user_1", {
      kind: "accepted",
      acceptedAt: "2026-08-01T12:00:00Z",
      scheduledFor: "2026-08-06T12:00:00Z",
    });
    expect(canReviewBooking(actor, booking, now)).toEqual({
      ok: false,
      reason: "not_completed",
    });
  });

  it("blocks review if booking is already reviewed", () => {
    const booking = createBooking(
      "booking_1",
      "user_1",
      { kind: "completed", completedAt: "2026-08-01T12:00:00Z" },
      true,
    );
    expect(canReviewBooking(actor, booking, now)).toEqual({
      ok: false,
      reason: "already_reviewed",
    });
  });

  it("blocks review if window is closed", () => {
    const completedAt = new Date(
      now.getTime() - (REVIEW_WINDOW_DAYS + 1) * 24 * 60 * 60 * 1000,
    ).toISOString();
    const booking = createBooking("booking_1", "user_1", {
      kind: "completed",
      completedAt,
    });
    expect(canReviewBooking(actor, booking, now)).toEqual({
      ok: false,
      reason: "window_closed",
    });
  });

  it("allows review if all conditions are met", () => {
    const booking = createBooking("booking_1", "user_1", {
      kind: "completed",
      completedAt: "2026-08-01T12:00:00Z",
    });
    expect(canReviewBooking(actor, booking, now)).toEqual({ ok: true });
  });
});
