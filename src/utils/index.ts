import { frameDOM } from "@fiddle-digital/string-tune";
import { piecesManager, type PieceData } from "piecesjs";

export function lazyMediaHandler(doc: Document | ParentNode, mediaQuerySelector: string = '[data-dom="lazy-media"]') {
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

export function callPieceMethod(
  data: {
    selector: string;
    component: string;
    method: string;
    arguments?: Record<string, any>;
  },
  domNode?: Document | ParentNode,
) {
  const querySelectorDomNode = domNode || document;

  const componentDOM = querySelectorDomNode.querySelector(data.selector);
  const id = componentDOM && "cid" in componentDOM ? (componentDOM.cid as string) : null;
  if (id) {
    const pieceData = piecesManager.currentPieces?.[data.component]?.[id] as PieceData;

    const piece = pieceData.piece as Record<string, any>;

    if (data.method in piece && typeof piece[data.method] === "function") {
      piece[data.method](data.arguments);
    }
  }
}
