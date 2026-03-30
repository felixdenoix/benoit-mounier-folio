import { Piece } from "piecesjs";

export default class HomePage extends Piece {
  constructor() {
    super("HomePage");
  }

  mounted() {
    if (window.app) {
      // TODO: scroll to the end of the first section of the intro component
      // window.app.smoothScroll?.scrollTo(window.innerHeight * 2);
    }
  }
}

customElements.define("c-homepage", HomePage);
