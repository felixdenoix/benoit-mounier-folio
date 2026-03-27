import { Piece } from "piecesjs";

export default class HomeIntro extends Piece {
  constructor() {
    super("HomeIntro", {
      stylesheets: [() => import("../styles/components/home-intro.css")],
    });
  }
}

customElements.define("c-home-intro", HomeIntro);
