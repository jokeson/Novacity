import { maskPassKeyCode } from "@/features/passkeys/utils/maskPassKeyCode";
import type {
  PassKeyDashboardState,
  PassKeyListItem,
} from "@/features/passkeys/types";

const MS_PER_DAY = 86_400_000;

type PassKeyLean = {
  _id: { toString(): string };
  code: string;
  userId: { toString(): string } | null;
  duration: number;
  isActive: boolean;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

export const buildPassKeyDashboardState = (
  keys: PassKeyLean[],
  assigneeEmailByUserId: Map<string, string>,
): PassKeyDashboardState => {
  const now = new Date();
  const soon = new Date(now.getTime() + 7 * MS_PER_DAY);

  const items: PassKeyListItem[] = keys.map((k) => {
    const uid = k.userId ? k.userId.toString() : null;
    return {
      id: k._id.toString(),
      code: k.code,
      codeMasked: maskPassKeyCode(k.code),
      userId: uid,
      assigneeEmail: uid ? assigneeEmailByUserId.get(uid) ?? null : null,
      duration: k.duration,
      isActive: k.isActive,
      expiresAt: k.expiresAt.toISOString(),
      usedAt: k.usedAt ? k.usedAt.toISOString() : null,
      createdAt: k.createdAt.toISOString(),
    };
  });

  const validKeys = keys.filter(
    (k) => k.isActive && k.expiresAt > now && !k.usedAt,
  );
  const hasValidPassKey = validKeys.length > 0;

  let soonestValidExpiresAt: string | null = null;
  if (validKeys.length > 0) {
    const min = validKeys.reduce(
      (acc, k) => (k.expiresAt < acc ? k.expiresAt : acc),
      validKeys[0]!.expiresAt,
    );
    soonestValidExpiresAt = min.toISOString();
  }

  const expiringWithinSevenDays =
    hasValidPassKey &&
    validKeys.some((k) => k.expiresAt <= soon && k.expiresAt > now);

  return {
    hasValidPassKey,
    soonestValidExpiresAt,
    expiringWithinSevenDays,
    keys: items,
  };
};
