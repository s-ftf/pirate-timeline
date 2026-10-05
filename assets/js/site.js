document.addEventListener("DOMContentLoaded", () => {
  const returnToTop = document.getElementById("return-to-top");
  const updateReturnToTop = () => {
    returnToTop.style.opacity = window.scrollY > 800 ? "1" : "0";
  };

  window.addEventListener("scroll", updateReturnToTop, { passive: true });
  updateReturnToTop();

  document.querySelectorAll(".timeline a, .timeline ~ * a").forEach(link => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
});
