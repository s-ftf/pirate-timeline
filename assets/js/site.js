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

  document.querySelectorAll(".timeline a:not(.milestone-bookmark), .timeline ~ * a").forEach(link => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const milestones = Array.from(document.querySelectorAll(".timeline .post[id]"));
  if (milestones.length) {
    const updateSelectedMilestone = (scroll = false) => {
      const selected = milestones.find(post => `#${encodeURIComponent(post.id)}` === window.location.hash);
      milestones.forEach(post => {
        post.classList.toggle("is-selected", post === selected);
        const bookmark = post.querySelector(".milestone-bookmark");
        if (post === selected) bookmark.setAttribute("aria-current", "location");
        else bookmark.removeAttribute("aria-current");
      });
      if (scroll && selected) {
        selected.scrollIntoView({ block: "start", behavior: reducedMotion.matches ? "auto" : "smooth" });
      }
    };
    milestones.forEach(post => {
      post.addEventListener("click", event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const bookmark = event.target.closest(".milestone-bookmark");
        if (event.target.closest("a, button") && !bookmark) return;
        if (!bookmark && window.getSelection()?.toString()) return;
        event.preventDefault();
        const hash = `#${encodeURIComponent(post.id)}`;
        if (window.location.hash !== hash) window.history.pushState(null, "", hash);
        updateSelectedMilestone();
      });
    });
    window.addEventListener("hashchange", () => updateSelectedMilestone(true));
    updateSelectedMilestone();
    const initialHash = window.location.hash;
    const scrollToInitialMilestone = () => {
      if (window.location.hash === initialHash) updateSelectedMilestone(true);
    };
    document.fonts.ready.then(scrollToInitialMilestone);
    window.addEventListener("load", scrollToInitialMilestone, { once: true });
  }

  const linkSites = {
    "discord.com": ["Discord", "discord.webp"],
    "discordapp.com": ["Discord", "discord.webp"],
    "github.com": ["GitHub", "github.webp"],
    "twitter.com": ["Twitter", "x.webp"],
    "x.com": ["X", "x.webp"],
    "reddit.com": ["Reddit", "reddit.webp"],
    "redd.it": ["Reddit", "reddit.webp"],
    "medium.com": ["Medium", "medium.webp"],
    "bitcointalk.org": ["Bitcointalk", "bitcointalk.webp"],
    "coinmarketcap.com": ["CoinMarketCap", "coinmarketcap.webp"],
    "youtube.com": ["YouTube", "youtube.webp"],
    "youtu.be": ["YouTube", "youtube.webp"],
    "piratechain.com": ["piratechain.com", "logo-mark.svg"],
    "explorer.piratechain.com": ["Explorer", "logo-mark.svg"],
    "explorer.pirate.black": ["Explorer", "logo-mark.svg"],
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
