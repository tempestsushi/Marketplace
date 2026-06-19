import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { requireUser } from '../auth.js';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

const BUCKET_BY_KIND = {
  product: 'product-images',
  profile: 'profile-images',
};

function getSupabaseStorageConfig() {
  const url = String(process.env.SUPABASE_URL || '')
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return { url, serviceRoleKey };
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid image data');

  const mimeType = match[1].toLowerCase();
  const extension = ALLOWED_MIME_TYPES.get(mimeType);
  if (!extension) throw new Error('Unsupported image type');

  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) throw new Error('Image is empty');
  if (buffer.length > MAX_UPLOAD_BYTES) throw new Error('Image must be 5MB or smaller');

  return { buffer, mimeType, extension };
}

export function createUploadRoutes() {
  const router = Router();

  router.post('/uploads/image', requireUser, async (req, res) => {
    try {
      const kind = String(req.body?.kind || '').toLowerCase();
      const bucket = BUCKET_BY_KIND[kind];
      if (!bucket) return res.status(400).json({ error: 'Invalid upload kind' });

      const { buffer, mimeType, extension } = parseDataUrl(req.body?.dataUrl);
      const { url, serviceRoleKey } = getSupabaseStorageConfig();

      const safeUserId = encodeURIComponent(String(req.user.user_id));
      const objectPath = `${safeUserId}/${Date.now()}-${randomUUID()}.${extension}`;
      const uploadUrl = `${url}/storage/v1/object/${bucket}/${objectPath}`;

      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': mimeType,
          'x-upsert': 'false',
        },
        body: buffer,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        return res.status(uploadRes.status).json({ error: text || 'Image upload failed' });
      }

      res.status(201).json({
        bucket,
        path: objectPath,
        url: `${url}/storage/v1/object/public/${bucket}/${objectPath}`,
      });
    } catch (e) {
      res.status(400).json({ error: String(e?.message || e) });
    }
  });

  return router;
}
