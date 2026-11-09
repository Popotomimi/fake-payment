export type Scene = "checkout" | "exploit" | "terminal" | "doom" | "reveal";

export const SCENES: Scene[] = [
  "checkout",
  "exploit",
  "terminal",
  "doom",
  "reveal",
];

export function sceneFromHash(): Scene {
  if (typeof window === "undefined") return "checkout";
  const hash = window.location.hash.replace(/^#/, "") as Scene;
  return SCENES.includes(hash) ? hash : "checkout";
}
