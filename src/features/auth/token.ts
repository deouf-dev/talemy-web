export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("talemy_token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("talemy_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("talemy_token");
}
