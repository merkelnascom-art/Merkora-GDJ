import { gzipSync } from "node:zlib";
import type { GeneratedProjectSource } from "./project-generator";
import { validateGeneratedProjectSource } from "./validate-generated-source";

export type ProjectArchive = {
  bytes: Buffer;
  contentType: "application/gzip";
  fileName: string;
};

function writeString(header: Buffer, value: string, offset: number, length: number): void {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length > length) throw new Error("Chemin d'archive trop long.");
  bytes.copy(header, offset);
}

function writeOctal(header: Buffer, value: number, offset: number, length: number): void {
  const encoded = value.toString(8).padStart(length - 1, "0") + "\0";
  writeString(header, encoded, offset, length);
}

function splitTarPath(path: string): { name: string; prefix: string } {
  if (Buffer.byteLength(path, "utf8") <= 100) return { name: path, prefix: "" };
  const segments = path.split("/");
  for (let index = segments.length - 1; index > 0; index -= 1) {
    const prefix = segments.slice(0, index).join("/");
    const name = segments.slice(index).join("/");
    if (Buffer.byteLength(name, "utf8") <= 100 && Buffer.byteLength(prefix, "utf8") <= 155) {
      return { name, prefix };
    }
  }
  throw new Error("Chemin de fichier incompatible avec le format d'archive.");
}

function tarHeader(path: string, size: number): Buffer {
  const header = Buffer.alloc(512, 0);
  const { name, prefix } = splitTarPath(path);
  writeString(header, name, 0, 100);
  writeOctal(header, 0o644, 100, 8);
  writeOctal(header, 0, 108, 8);
  writeOctal(header, 0, 116, 8);
  writeOctal(header, size, 124, 12);
  writeOctal(header, 0, 136, 12);
  header.fill(0x20, 148, 156);
  header[156] = "0".charCodeAt(0);
  writeString(header, "ustar\0", 257, 6);
  writeString(header, "00", 263, 2);
  writeString(header, "Merkora", 265, 32);
  writeString(header, "GDJ", 297, 32);
  writeString(header, prefix, 345, 155);
  const checksum = header.reduce((sum, byte) => sum + byte, 0);
  const checksumText = checksum.toString(8).padStart(6, "0");
  writeString(header, `${checksumText}\0 `, 148, 8);
  return header;
}

/**
 * Creates a deterministic-path tar.gz archive from a verified source manifest.
 * The archive contains only files from the approved generated manifest.
 */
export function createProjectArchive(source: GeneratedProjectSource): ProjectArchive {
  const validation = validateGeneratedProjectSource(source);
  if (!validation.ok) throw new Error(`Source de projet invalide : ${validation.reason}.`);

  const chunks: Buffer[] = [];
  for (const file of source.files) {
    const content = Buffer.from(file.content, "utf8");
    chunks.push(tarHeader(file.path, content.length), content);
    const remainder = content.length % 512;
    if (remainder) chunks.push(Buffer.alloc(512 - remainder, 0));
  }
  chunks.push(Buffer.alloc(1024, 0));

  return {
    bytes: gzipSync(Buffer.concat(chunks), { level: 9 }),
    contentType: "application/gzip",
    fileName: `merkora-project-${source.digest.slice(0, 12)}.tar.gz`,
  };
}
