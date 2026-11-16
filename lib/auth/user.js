export async function authUser(client) {
  let timer;
  const unavailable = () => ({
    data: { user: null },
    error: { code: "auth_service_unavailable" },
  });
  try {
    return await Promise.race([
      client.auth.getUser(),
      new Promise(resolve => {
        timer = setTimeout(() => resolve(unavailable()), 3500);
      }),
    ]);
  } catch {
    return unavailable();
  } finally {
    clearTimeout(timer);
  }
}
