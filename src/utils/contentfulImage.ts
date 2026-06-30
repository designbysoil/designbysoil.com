// Helpers for building optimized Contentful Image API URLs.
// All site images are served from the Contentful CDN (images.ctfassets.net);
// these helpers centralize format/quality/resize params so every component
// requests modern formats (WebP) and responsive sizes consistently.

const CDN_HOST = 'images.ctfassets.net';

export type CdnFormat = 'webp' | 'avif' | 'jpg' | 'png';

export interface CdnOptions {
  /** Target width in px. Omit for intrinsic size. */
  w?: number;
  /** Quality 1–100. Defaults to 80 (WebP at 80 is visually lossless and much smaller than JPEG q90). */
  q?: number;
  /** Output format. Defaults to 'webp'. */
  fm?: CdnFormat;
  /** Contentful resize behaviour (e.g. 'fill'). Omit for default. */
  fit?: 'fill' | 'pad' | 'crop' | 'scale' | 'thumb';
}

/** True only for Contentful-hosted URLs we can safely transform. */
export function isContentful(url: string | undefined | null): url is string {
  return typeof url === 'string' && url.includes(CDN_HOST);
}

/**
 * Build an optimized Contentful URL. Non-Contentful URLs (or empty values)
 * are returned unchanged so callers can pass any src safely.
 */
export function cdnUrl(url: string, opts: CdnOptions = {}): string {
  if (!isContentful(url)) return url;

  const base = url.split('?')[0];
  const { w, q = 80, fm = 'webp', fit } = opts;

  const params = new URLSearchParams();
  if (w) params.set('w', String(w));
  params.set('q', String(q));
  if (fm) params.set('fm', fm);
  if (fit) params.set('fit', fit);
  // `fl=progressive` is JPEG-only on the Contentful Images API — pairing it
  // with webp/avif returns HTTP 400. Only add it for JPEG output.
  if (!fm || fm === 'jpg') params.set('fl', 'progressive');

  return `${base}?${params.toString()}`;
}

/**
 * Build a responsive `srcset` of WebP (or given format) variants at the
 * supplied widths. Returns undefined for non-Contentful URLs so the `<img>`
 * simply falls back to its `src`.
 */
export function cdnSrcset(
  url: string,
  widths: number[],
  opts: Omit<CdnOptions, 'w'> = {},
): string | undefined {
  if (!isContentful(url)) return undefined;
  return widths.map((w) => `${cdnUrl(url, { ...opts, w })} ${w}w`).join(', ');
}
