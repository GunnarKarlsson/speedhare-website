import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  keywords?: ReadonlyArray<string>;
  jsonLd?: Readonly<Record<string, unknown>> | ReadonlyArray<Readonly<Record<string, unknown>>>;
}

const MANAGED_ATTR = "data-seo-managed";

function ensureMetaByName(name: string) {
  const selector = `meta[name="${name}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute(MANAGED_ATTR, "1");
  return el;
}

function ensureMetaByProperty(property: string) {
  const selector = `meta[property="${property}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute(MANAGED_ATTR, "1");
  return el;
}

function ensureCanonicalLink() {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute(MANAGED_ATTR, "1");
  return link;
}

function removeManagedJsonLdScripts() {
  document.head.querySelectorAll(`script[${MANAGED_ATTR}="1"]`).forEach((node) => node.remove());
}

function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.origin}${normalizedPath}`;
}

export function SeoHead({ title, description, canonicalPath, robots, keywords, jsonLd }: SeoHeadProps) {
  useEffect(() => {
    document.title = title;

    ensureMetaByName("description").setAttribute("content", description);
    ensureMetaByProperty("og:title").setAttribute("content", title);
    ensureMetaByProperty("og:description").setAttribute("content", description);
    ensureMetaByProperty("og:type").setAttribute("content", "website");

    const canonical = ensureCanonicalLink();
    canonical.setAttribute("href", absoluteUrl(canonicalPath ?? window.location.pathname));
    ensureMetaByProperty("og:url").setAttribute("content", canonical.getAttribute("href") ?? "");

    const robotsMeta = ensureMetaByName("robots");
    robotsMeta.setAttribute("content", robots ?? "index,follow");

    const keywordsMeta = ensureMetaByName("keywords");
    if (keywords && keywords.length > 0) {
      keywordsMeta.setAttribute("content", keywords.join(", "));
    } else {
      keywordsMeta.remove();
    }

    removeManagedJsonLdScripts();
    const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    blocks.forEach((entry) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute(MANAGED_ATTR, "1");
      script.textContent = JSON.stringify(entry);
      document.head.appendChild(script);
    });

    return () => {
      removeManagedJsonLdScripts();
    };
  }, [canonicalPath, description, jsonLd, keywords, robots, title]);

  return null;
}
