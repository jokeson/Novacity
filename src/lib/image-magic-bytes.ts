const hasJpegHeader = (buf: Buffer): boolean =>
  buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;

const hasPngHeader = (buf: Buffer): boolean =>
  buf.length >= 8 &&
  buf[0] === 0x89 &&
  buf[1] === 0x50 &&
  buf[2] === 0x4e &&
  buf[3] === 0x47 &&
  buf[4] === 0x0d &&
  buf[5] === 0x0a &&
  buf[6] === 0x1a &&
  buf[7] === 0x0a;

const hasGifHeader = (buf: Buffer): boolean => {
  if (buf.length < 6) {
    return false;
  }
  const sig = buf.subarray(0, 6).toString("ascii");
  return sig === "GIF87a" || sig === "GIF89a";
};

const hasWebpHeader = (buf: Buffer): boolean => {
  if (buf.length < 12) {
    return false;
  }
  const riff = buf.subarray(0, 4).toString("ascii");
  const webp = buf.subarray(8, 12).toString("ascii");
  return riff === "RIFF" && webp === "WEBP";
};

export const bufferMatchesDeclaredImageType = (
  buffer: Buffer,
  mimeType: string,
): boolean => {
  switch (mimeType) {
    case "image/jpeg":
      return hasJpegHeader(buffer);
    case "image/png":
      return hasPngHeader(buffer);
    case "image/gif":
      return hasGifHeader(buffer);
    case "image/webp":
      return hasWebpHeader(buffer);
    default:
      return false;
  }
};
