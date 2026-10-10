export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedIfNeeded } = await import("@/server/seed");
    await seedIfNeeded();
  }
}
