export type UserId = string;

export type Capacity = "customer" | "provider";

export type PlatformRole = "user" | "moderator" | "admin";

export interface Actor {
  readonly id: UserId;
  readonly capacities: readonly Capacity[];
  readonly platformRole: PlatformRole;
}
