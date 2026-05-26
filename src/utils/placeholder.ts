const cache = new Map<string, string>();

export async function getPlaceholder(url: string): Promise<string> {
  const baseUrl = url.split('?')[0];
  if (cache.has(baseUrl)) return cache.get(baseUrl)!;

  try {
    const tinyUrl = `${baseUrl}?w=20&q=1&fm=webp`;
    const res = await fetch(tinyUrl);
    if (!res.ok) return '';
    const buf = Buffer.from(await res.arrayBuffer());
    const dataUri = `data:image/webp;base64,${buf.toString('base64')}`;
    cache.set(baseUrl, dataUri);
    return dataUri;
  } catch {
    return '';
  }
}
