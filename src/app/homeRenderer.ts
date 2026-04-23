import { Piece } from "piecesjs";
import DefaultRenderer from "./defaultRenderer";
import { callPieceMethod } from "../utils";

export default class HomeRenderer extends DefaultRenderer {
  $homePiece: Piece | undefined;

  onEnter() {
    super.onEnter();
    callPieceMethod(
      {
        selector: "c-header",
        component: "Header",
        method: "setTransparent",
        arguments: { value: true, immediate: true },
      },
      document,
    );
  }

  onEnterCompleted(): void {
    globalThis.app.smoothScroll?.onResize(true);
    requestAnimationFrame(() => {
      console.log("😸 onEnterCompleted");
      callPieceMethod({
        selector: "c-homepage",
        component: "HomePage",
        method: "introAnimation",
      });
    });
  }
}
