(function () {
  const navItems = [
    {
      label: "About",
      children: [
        { label: "About", href: "/about" },
        { label: "Updates", href: "/updates" },
      ],
    },
    { label: "Footprints", href: "/footprints" },
    { label: "Impact Snapshot", href: "/impact-snapshot" },
    { label: "Evaluate", href: "/calculator" },
    {
      label: "Learn",
      children: [
        { label: "Knowledge Base", href: "/knowledge-base" },
        { label: "Standard and SDGs", href: "/the-standard-and-the-sdgs" },
      ],
    },
    { label: "Imagine", href: "/brief-generator" },
    { label: "Get Involved", href: "/#get-involved" },
  ];

  function isKnowledgeBaseLink(href) {
    return href === "/knowledge-base" || href === "/knowledge-base/";
  }

  function createLink({ label, href }, baseClassName, inactiveClassName, activeClassName) {
    const link = document.createElement("a");
    link.className = `${baseClassName} ${
      isKnowledgeBaseLink(href) ? activeClassName : inactiveClassName
    }`;
    link.href = href;
    link.textContent = label;

    if (isKnowledgeBaseLink(href)) {
      link.setAttribute("aria-current", "page");
    }

    return link;
  }

  function updateHeaderHeight(header) {
    document.documentElement.style.setProperty(
      "--sd-site-nav-height",
      `${Math.ceil(header.getBoundingClientRect().height)}px`,
    );
  }

  function initSiteNav() {
    if (document.querySelector("[data-sd-site-nav]")) return;

    const header = document.createElement("header");
    header.className = "border-b border-[#d9d4c8] bg-[#fffdf8]/95 backdrop-blur";
    header.setAttribute("data-sd-site-nav", "");

    const inner = document.createElement("div");
    inner.className = "mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10";

    const brand = document.createElement("a");
    brand.className = "text-lg font-extrabold tracking-normal text-[#1f241f]";
    brand.href = "/";
    brand.textContent = "SD Standard";

    const nav = document.createElement("nav");
    nav.className = "flex flex-wrap gap-2";
    nav.id = "sd-site-nav-links";
    nav.setAttribute("aria-label", "Main navigation");
    navItems.forEach((item) => {
      const navLinkClasses =
        "inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8]";
      const inactiveNavLinkClasses = "text-[#5f5a50] hover:bg-white hover:text-[#1f241f]";
      const activeNavLinkClasses = "bg-[#e5efe9] text-[#28775e]";
      const dropdownLinkClasses =
        "block rounded-md px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#85bba8]";

      if (!item.children) {
        nav.appendChild(
          createLink(
            item,
            navLinkClasses,
            inactiveNavLinkClasses,
            activeNavLinkClasses,
          ),
        );
        return;
      }

      const group = document.createElement("div");
      group.className = "group relative flex items-center";

      const parentLink = document.createElement("button");
      parentLink.className = `${navLinkClasses} ${
        inactiveNavLinkClasses
      } inline-flex items-center gap-1`;
      parentLink.type = "button";
      parentLink.setAttribute("aria-haspopup", "true");
      parentLink.textContent = item.label;

      const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      chevron.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      chevron.setAttribute("width", "24");
      chevron.setAttribute("height", "24");
      chevron.setAttribute("viewBox", "0 0 24 24");
      chevron.setAttribute("fill", "none");
      chevron.setAttribute("stroke", "currentColor");
      chevron.setAttribute("stroke-width", "2");
      chevron.setAttribute("stroke-linecap", "round");
      chevron.setAttribute("stroke-linejoin", "round");
      chevron.setAttribute("class", "lucide lucide-chevron-down h-4 w-4");
      chevron.setAttribute("aria-hidden", "true");

      const chevronPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      chevronPath.setAttribute("d", "m6 9 6 6 6-6");
      chevron.appendChild(chevronPath);
      parentLink.appendChild(chevron);

      const menu = document.createElement("div");
      menu.className =
        "invisible absolute left-0 top-full z-20 min-w-56 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";
      const menuInner = document.createElement("div");
      menuInner.className =
        "rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-2 shadow-[0_18px_50px_rgba(45,39,28,0.12)]";

      item.children.forEach((child) => {
        menuInner.appendChild(
          createLink(
            child,
            dropdownLinkClasses,
            inactiveNavLinkClasses,
            activeNavLinkClasses,
          ),
        );
      });

      menu.appendChild(menuInner);
      group.append(parentLink, menu);
      nav.appendChild(group);
    });

    inner.append(brand, nav);
    header.appendChild(inner);

    const bodyContainer = document.getElementById("mdbook-body-container");
    document.body.insertBefore(header, bodyContainer || document.body.firstChild);

    updateHeaderHeight(header);

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => updateHeaderHeight(header)).observe(header);
    } else {
      window.addEventListener("resize", () => updateHeaderHeight(header));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSiteNav);
  } else {
    initSiteNav();
  }
})();
