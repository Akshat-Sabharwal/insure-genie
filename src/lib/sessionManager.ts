export function getSessionId(): string {
  let sessionId = localStorage.getItem("insuregenie_session");

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("insuregenie_session", sessionId);
  }

  return sessionId;
}

export function clearSession(): void {
  localStorage.removeItem("insuregenie_session");
}

export function generateUniqueId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
