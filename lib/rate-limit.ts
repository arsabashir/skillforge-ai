const requests = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(request: Request, route: string, limit = 15, windowMs = 60_000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${route}:${ip}`;
  const now = Date.now();
  const entry = requests.get(key);
  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

// TODO: Replace this single-instance guard with Redis/Upstash before multi-instance deployment.
