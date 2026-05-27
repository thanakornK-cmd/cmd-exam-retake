export function isPrismaInitializationError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "PrismaClientInitializationError"
  );
}
