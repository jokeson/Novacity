export const maskPassKeyCode = (code: string): string => {
  const normalized = code.trim().toUpperCase();
  if (normalized.length <= 4) {
    return "••••";
  }
  return `••••-••${normalized.slice(-4)}`;
};
