import crypto from "node:crypto";

import type mongoose from "mongoose";

import * as passkeyRepository from "@/server/repositories/passkey.repository";

const MS_PER_DAY = 86_400_000;

export const normalizePassKeyCode = (code: string): string =>
  code.trim().toUpperCase();

export const generatePassKeyCode = (): string => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(14);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += alphabet[bytes[i]! % alphabet.length]!;
  }
  return `${out.slice(0, 6)}-${out.slice(6, 12)}`;
};

export const issuePassKey = async (input: {
  code: string;
  userId: mongoose.Types.ObjectId | null;
  duration: number;
  expiresAt: Date;
}) => {
  return passkeyRepository.createPassKey({
    ...input,
    code: normalizePassKeyCode(input.code),
    isActive: true,
    usedAt: null,
  });
};

export const getPassKeyByCode = async (code: string) => {
  return passkeyRepository.findPassKeyByCode(code);
};

export const deactivatePassKey = async (id: string) => {
  return passkeyRepository.updatePassKeyById(id, { isActive: false });
};

export const activatePassKey = async (id: string) => {
  return passkeyRepository.updatePassKeyById(id, { isActive: true });
};

export const expirePassKeyImmediately = async (id: string) => {
  const past = new Date(Date.now() - 1000);
  return passkeyRepository.updatePassKeyById(id, {
    isActive: false,
    expiresAt: past,
  });
};

export const listPassKeysForAdmin = async (limit = 150) => {
  return passkeyRepository.listPassKeysForAdmin(limit);
};

export const listPassKeysForUser = async (userId: string) => {
  return passkeyRepository.listPassKeysForUser(userId);
};

export const hasValidPublishPassKey = async (userId: string) => {
  return passkeyRepository.hasValidPublishPassKey(userId);
};

export const consumePassKeyAfterPublish = async (userId: string) => {
  return passkeyRepository.consumeOldestUnusedPassKey(userId);
};

export const deletePassKeyIfUnused = async (
  id: string,
): Promise<{ ok: true } | { ok: false; reason: "not_found" | "was_used" }> => {
  return passkeyRepository.deletePassKeyByIdIfUnused(id);
};

export type RedeemPassKeyResult =
  | { ok: true; passKeyId: string; alreadyOwned?: boolean }
  | {
      ok: false;
      reason:
        | "not_found"
        | "inactive"
        | "expired"
        | "used"
        | "wrong_user"
        | "redeem_failed";
    };

export const redeemPassKeyForUser = async (
  rawCode: string,
  currentUserId: string,
): Promise<RedeemPassKeyResult> => {
  const doc = await passkeyRepository.findPassKeyByCode(rawCode);
  if (!doc) {
    return { ok: false, reason: "not_found" };
  }
  const now = new Date();
  if (!doc.isActive) {
    return { ok: false, reason: "inactive" };
  }
  if (doc.expiresAt <= now) {
    return { ok: false, reason: "expired" };
  }
  if (doc.usedAt) {
    return { ok: false, reason: "used" };
  }

  const assignedId = doc.userId ? String(doc.userId) : null;
  if (assignedId && assignedId !== currentUserId) {
    return { ok: false, reason: "wrong_user" };
  }

  if (!assignedId) {
    const updated = await passkeyRepository.redeemPassKeyPoolToUser(
      String(doc._id),
      currentUserId,
    );
    if (!updated) {
      return { ok: false, reason: "redeem_failed" };
    }
    return { ok: true, passKeyId: String(updated._id) };
  }

  return { ok: true, passKeyId: String(doc._id), alreadyOwned: true };
};

export const computePassKeyExpiresAt = (durationDays: number): Date => {
  const safe = Math.min(Math.max(1, Math.floor(durationDays)), 3650);
  return new Date(Date.now() + safe * MS_PER_DAY);
};
