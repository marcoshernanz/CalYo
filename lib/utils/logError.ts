export default function logError(message: string, error: unknown) {
  console.error(
    message,
    error instanceof Error ? error.message : "Unknown error"
  );
}
