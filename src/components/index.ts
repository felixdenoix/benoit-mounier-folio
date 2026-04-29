import { load } from "piecesjs";

export type ComponentDefinition = {
  tag: string;
  loader: () => Promise<any>;
};

export const components: ComponentDefinition[] = [
  {
    tag: "c-header",
    loader: () => import("./header.ts"),
  },
  {
    tag: "c-homepage",
    loader: () => import("./home-page.ts"),
  },
  {
    tag: "c-home-expertise",
    loader: () => import("./home-expertise.ts"),
  },
  {
    tag: "c-mailto",
    loader: () => import("./mailto.ts"),
  },
  {
    tag: "c-project",
    loader: () => import("./project.ts"),
  },
  {
    tag: "c-text-reveal",
    loader: () => import("./text-reveal.ts"),
  },
];

export const loader = (dom: HTMLElement) => {
  return Promise.all(components.map((component) => load(component.tag, component.loader, dom)));
};
