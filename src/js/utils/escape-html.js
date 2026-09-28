const entities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}
