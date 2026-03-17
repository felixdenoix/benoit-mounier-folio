import { Core } from "@unseenco/taxi";
import type { CacheEntry } from "@unseenco/taxi/src/Core";

const taxi = new Core();

taxi.on("NAVIGATE_IN", ({ to }: { to: CacheEntry }) => {
  const { title, description, image } = (to.content as HTMLElement).dataset;

  // Update URL
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);

  // Update Title
  if (title) {
    document.title = title;
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  }

  // Update Description
  if (description) {
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }

  // Update Image
  if (image) {
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", image);
  }
});

console.log("taxi init", taxi);
