import { Piece } from "piecesjs";
import DefaultRenderer from "./defaultRenderer";

export default class HomeRenderer extends DefaultRenderer {
  $homePiece: Piece | undefined;

  constructor(args: any) {
    super(args, {
      exitLoaderComponentCallbacks: [
        {
          selector: "c-homepage",
          component: "HomePage",
          method: "introAnimation",
        },
      ],
    });
  }
}
