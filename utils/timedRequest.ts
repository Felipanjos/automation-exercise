export async function timedRequest<T>(request: () => Promise<T>) {
  const start = Date.now();
  const response = await request();
  const duration = Date.now() - start;
  return { response, duration };
}
