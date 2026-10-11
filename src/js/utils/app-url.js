export function getAppUrl(path = "") {
  const baseUrl = import.meta.env.BASE_URL;

  const cleanPath = String(path).replace(/^\/+/, "");

  return `${baseUrl}${cleanPath}`;
}
