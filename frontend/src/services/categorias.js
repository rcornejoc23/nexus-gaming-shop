const CATEGORIES_KEY = "categoriasNexus";

export function leerCategorias(productos = []) {
  let saved = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || "[]");
    saved = Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    saved = [];
  }

  return [...new Set([...saved, ...productos.map((product) => product.categoria).filter(Boolean)])].sort((a, b) => a.localeCompare(b, "es"));
}

export function guardarCategorias(categorias) {
  const normalized = [...new Set(categorias.map((item) => String(item).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(normalized));
  return normalized;
}
