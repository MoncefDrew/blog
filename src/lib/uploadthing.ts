import { generateKey, generateSignedURL } from '@uploadthing/shared';
import * as Micro from 'effect/Micro';
import * as Redacted from 'effect/Redacted';
import { validateImageFile, checkRateLimit, recordFailedAttempt } from '@/lib/security';

export const UPLOADTHING_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPLOADTHING_TOKEN) ||
  'eyJhcGlLZXkiOiJza19saXZlX2U2OGE3M2M3ODdhMmRhY2MxOWM5YmY5ODdmNmE2ZTkxOGI3ZDRhODc5Nzk5YmRlZGNlY2UzZmVmZTA1ODkwZGQiLCJhcHBJZCI6ImY1Z3NtcTJ5dm8iLCJyZWdpb25zIjpbInNlYTEiXX0=';

export interface UploadResult {
  url: string;
  ufsUrl: string;
  name: string;
  size: number;
}

/**
 * Uploads a file directly to UploadThing using the provided token credentials
 * via presigned ingest URLs, with file validation and rate limiting.
 */
export async function uploadImageToUploadThing(
  file: File,
  token: string = UPLOADTHING_TOKEN
): Promise<{ data: UploadResult | null; error: string | null }> {
  // Rate limit check: max 10 uploads per 15-minute window
  const limitCheck = checkRateLimit('upload_image', 10, 15 * 60 * 1000);
  if (!limitCheck.allowed) {
    return {
      data: null,
      error: `Upload rate limit reached. Please wait ${limitCheck.waitSeconds}s before uploading again.`,
    };
  }

  // File validation
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return {
      data: null,
      error: validation.error || 'Invalid file.',
    };
  }

  try {
    const parsed = JSON.parse(atob(token));
    const apiKey = parsed.apiKey as string;
    const appId = parsed.appId as string;
    const regions = (parsed.regions as string[]) || ['sea1'];
    const region = regions[0] || 'sea1';
    const ingestUrl = `https://${region}.ingest.uploadthing.com`;

    // Generate UploadThing key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = Micro.runSync(generateKey(file, appId) as any) as string;

    // Generate signed ingest URL with HMAC-SHA256 signature
    const signedUrl = (await Micro.runPromise(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateSignedURL(`${ingestUrl}/${key}`, Redacted.make(apiKey) as any, {
        ttlInSeconds: 3600,
        data: {
          'x-ut-identifier': appId,
          'x-ut-file-name': file.name,
          'x-ut-file-size': file.size,
          'x-ut-file-type': file.type,
          'x-ut-content-disposition': 'inline',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    )) as string;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: formData,
      headers: {
        Range: 'bytes=0-',
        'x-uploadthing-version': '7.7.4',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Upload failed (${response.status}): ${errText}`);
    }

    const resJson = await response.json();
    const ufsUrl = (resJson.ufsUrl as string) || `https://${appId}.ufs.sh/f/${key}`;
    const url = (resJson.url as string) || `https://utfs.io/f/${key}`;

    return {
      data: {
        url,
        ufsUrl,
        name: file.name,
        size: file.size,
      },
      error: null,
    };
  } catch (err) {
    console.error('UploadThing upload error:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown upload error',
    };
  }
}
