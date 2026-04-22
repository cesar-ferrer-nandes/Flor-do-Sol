async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  const response = await fetch(file);
  const html = await response.text();
  element.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("navbar", "components/navbar.html");
  await loadComponent("footer", "components/footer.html");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("header a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("text-[#aea100]");
    }
  });
});