// Normalizes API errors into a user-friendly message
// Usage: throw new Error(getErrorMessage(err)) in catch blocks
export function getErrorMessage(error: unknown): string {
  const anyErr = error as any

  // Prefer server-provided messages
  const serverDetail =
    anyErr?.response?.data?.detail ??
    anyErr?.response?.data?.message ??
    anyErr?.message

  if (typeof serverDetail === "string" && serverDetail.trim().length > 0) {
    return serverDetail
  }

  // FastAPI validation errors (array)
  if (Array.isArray(anyErr?.response?.data?.detail)) {
    const first = anyErr.response.data.detail[0]
    if (typeof first?.msg === "string" && first.msg.trim().length > 0) {
      return first.msg
    }
  }

  return "Something went wrong, please try again."
}
