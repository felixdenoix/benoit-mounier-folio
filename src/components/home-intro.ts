import { Piece } from "piecesjs";

export default class HomeIntro extends Piece {
  constructor() {
    super("HomeIntro");
  }
}

customElements.define("c-home-intro", HomeIntro);
