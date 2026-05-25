export type PassKeyListItem = {
  id: string;
  code: string;
  codeMasked: string;
  userId: string | null;
  assigneeEmail: string | null;
  duration: number;
  isActive: boolean;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export type PassKeyDashboardState = {
  hasValidPassKey: boolean;
  /** ISO date of soonest valid key expiry, if any */
  soonestValidExpiresAt: string | null;
  /** True if a valid key expires within 7 days */
  expiringWithinSevenDays: boolean;
  keys: PassKeyListItem[];
};
