import { frameDOM } from "@fiddle-digital/string-tune";

export function lazyMediaHandler(doc: Document, mediaQuerySelector: string = '[data-dom="lazy-media"]') {
  const lazyMedias = Array.from(doc.querySelectorAll(mediaQuerySelector)) as HTMLImageElement[];

  frameDOM.mutate(() => {
    lazyMedias.map((asset: HTMLImageElement) => {
      if (asset.complete || asset.naturalHeight) {
        asset.classList.add("loaded");
        asset.classList.remove("error");
      } else {
        asset.onload = () => {
          asset.classList.add("loaded");
        };
        asset.onerror = () => {
          asset.classList.add("error");
        };
      }
    });
  });
}
