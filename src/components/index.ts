import { load } from "piecesjs";

export type ComponentDefinition = {
  tag: string;
  loader: () => Promise<any>;
};

export const components: ComponentDefinition[] = [
  {
    tag: "c-text-reveal",
    loader: () => import("./text-reveal.ts"),
  },
  {
    tag: "c-homepage",
    loader: () => import("./home-page.ts"),
  },
  {
    tag: "c-home-intro",
    loader: () => import("./home-intro.ts"),
  },
];

export const loader = (dom: HTMLElement) => {
  return Promise.all(components.map((component) => load(component.tag, component.loader, dom)));
};
