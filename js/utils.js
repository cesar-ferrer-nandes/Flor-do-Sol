// ================= UTILITÁRIOS GLOBAIS =================
// Funções auxiliares usadas por todos os módulos do site.

// Escapa caracteres HTML para prevenir XSS em conteúdos dinâmicos.
// Usado ao inserir nomes, descrições e outros textos vindos da API.
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, c => map[c]);
}

// Faz parse seguro de JSON sem lançar exceções.
// Retorna null se o JSON for inválido.
function parseJSONSafe(json) {
  try { return JSON.parse(json); }
  catch { return null; }
}
