document.addEventListener("DOMContentLoaded", () => {
  const returnToTop = document.getElementById("return-to-top");
  const hero = document.querySelector(".hero-section");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let scrollFrame = null;

  const updateScrollEffects = () => {
    scrollFrame = null;
    if (hero) {
      const bounds = hero.getBoundingClientRect();
      const distance = Math.min(Math.max(-bounds.top, 0), bounds.height);
      hero.style.setProperty("--parallax-offset", reducedMotion.matches ? "0px" : `${distance * 0.25}px`);
    }
    if (returnToTop) {
      returnToTop.style.opacity = window.scrollY > 800 ? "1" : "0";
    }
  };
  const scheduleScrollEffects = () => {
    if (scrollFrame === null) {
      scrollFrame = window.requestAnimationFrame(updateScrollEffects);
    }
  };

  window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
  window.addEventListener("resize", scheduleScrollEffects);
  reducedMotion.addEventListener("change", scheduleScrollEffects);
  updateScrollEffects();

  document.querySelectorAll(".timeline a, .timeline ~ * a").forEach(link => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const linkSites = {
    "discord.com": ["Discord", "favicon-discord.png"],
    "discordapp.com": ["Discord", "favicon-discord.png"],
    "github.com": ["GitHub", "favicon-github.svg"],
    "twitter.com": ["Twitter", "favicon-x.png"],
    "x.com": ["X", "favicon-x.png"],
    "reddit.com": ["Reddit", "favicon-reddit.png"],
    "redd.it": ["Reddit", "favicon-reddit.png"],
    "medium.com": ["Medium"],
    "bitcointalk.org": ["Bitcointalk", "favicon-bitcointalk.ico"],
    "coinmarketcap.com": ["CoinMarketCap", "favicon-coinmarketcap.ico"],
    "youtube.com": ["YouTube", "favicon-youtube.png"],
    "youtu.be": ["YouTube", "favicon-youtube.png"],
    "piratechain.com": ["Pirate Chain", "logo-mark.svg"],
    "explorer.piratechain.com": ["Pirate Chain Explorer", "logo-mark.svg"],
    "explorer.pirate.black": ["Pirate Chain Explorer", "logo-mark.svg"],
    "docs.piratechain.com": ["Pirate Chain Docs", "logo-mark.svg"],
    "bilaxy.zendesk.com": ["Bilaxy"],
    "kucoin.com": ["KuCoin"],
    "mexc.com": ["MEXC"],
    "zthalliance.com": ["ZTH Alliance"],
    "piratewallet.io": ["Pirate Wallet"]
  };
  document.querySelectorAll(".milestone-link").forEach(link => {
    const hostname = new URL(link.href).hostname.replace(/^www\./, "");
    const domain = hostname.split(".").slice(-2).join(".");
    const label = domain.split(".")[0];
    const [name, iconFile] = linkSites[hostname] || linkSites[domain] ||
      [label ? label[0].toUpperCase() + label.slice(1) : link.href];
    link.title = name;
    link.setAttribute("aria-label", name);
    const siteName = document.createElement("span");
    siteName.textContent = name;
    link.append(siteName);
    if (iconFile) {
      const icon = document.createElement("img");
      icon.alt = "";
      icon.addEventListener("load", () => link.querySelector("svg").replaceWith(icon));
      icon.src = `${link.parentElement.dataset.iconRoot}/${iconFile}`;
    }
  });

  const descriptions = document.querySelectorAll(".milestone-body");
  if (descriptions.length) {
    const setDescriptionExpanded = (description, expanded) => {
      const button = description.nextElementSibling;
      const action = expanded ? "Show less" : "Show more";
      description.classList.toggle("is-expanded", expanded);
      button.textContent = action;
      button.setAttribute("aria-expanded", String(expanded));
      button.setAttribute("aria-label", `${action} about ${description.parentElement.querySelector("h3").textContent}`);
    };
    const updateDescription = description => {
      const lineHeight = parseFloat(getComputedStyle(description).lineHeight);
      const button = description.nextElementSibling;
      button.hidden = description.scrollHeight <= lineHeight * 4 + 1;
      if (button.hidden) setDescriptionExpanded(description, false);
    };
    const descriptionObserver = new ResizeObserver(entries => {
      entries.forEach(entry => updateDescription(entry.target));
    });
    descriptions.forEach((description, index) => {
      description.classList.add("milestone-description");
      description.id = `milestone-description-${index + 1}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "milestone-toggle";
      button.setAttribute("aria-controls", description.id);
      button.hidden = true;
      description.after(button);
      setDescriptionExpanded(description, false);
      button.addEventListener("click", () => {
        setDescriptionExpanded(description, !description.classList.contains("is-expanded"));
      });
      description.addEventListener("focusin", () => {
        if (!button.hidden) setDescriptionExpanded(description, true);
      });
      descriptionObserver.observe(description);
    });
    const updateDescriptions = () => descriptions.forEach(updateDescription);
    updateDescriptions();
    document.fonts.ready.then(updateDescriptions);
  }

  const viewer = document.getElementById("image-viewer");
  if (!viewer || typeof viewer.showModal !== "function") return;

  const viewerImage = viewer.querySelector(".image-viewer-image");
  const openImage = document.getElementById("image-viewer-open");
  const downloadImage = document.getElementById("image-viewer-download");

  document.querySelectorAll(".milestone-image img").forEach(image => {
    const link = image.closest("a");
    if (!link) return;
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      viewerImage.src = link.href;
      viewerImage.alt = image.alt;
      viewerImage.style.setProperty("--image-ratio", image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1);
      openImage.href = link.href;
      downloadImage.href = link.href;
      downloadImage.download = new URL(link.href).pathname.split("/").pop();
      viewer.showModal();
      document.documentElement.classList.add("image-viewer-open");
    });
  });

  viewerImage.addEventListener("load", () => {
    viewerImage.style.setProperty("--image-ratio", viewerImage.naturalWidth / viewerImage.naturalHeight);
  });
  document.getElementById("image-viewer-close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("close", () => {
    document.documentElement.classList.remove("image-viewer-open");
    viewerImage.removeAttribute("src");
  });
});
