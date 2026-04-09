import { Renderer } from "@unseenco/taxi";
import { frameDOM } from "@fiddle-digital/string-tune";

export default class DefaultRenderer extends Renderer {
  initialLoad() {
    // console.log("😸 initialLoad");
    // run code that should only happen once for your site

    this.onEnter();
    this.onEnterCompleted();
  }

  // rest of your methods

  onEnter() {
    // console.log("😸 onEnter", arguments);
    this.handleLazyMedias(document);
    // run after the new content has been added to the Taxi container
  }

  onEnterCompleted() {
    // console.log("😸 onEnterCompleted");
    // run after the transition.onEnter has fully completed
  }

  onLeave() {
    // console.log("😸 onLeave");
    // run before the transition.onLeave method is called
  }

  onLeaveCompleted() {
    // console.log("😸 onLeaveCompleted");
    // run after the transition.onleave has fully completed
  }

  handleLazyMedias(doc: Document) {
    const lazyMedias = Array.from(doc.querySelectorAll('[data-dom="lazy-media"]')) as HTMLImageElement[];

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
}
