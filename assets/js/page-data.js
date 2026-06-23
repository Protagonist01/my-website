import { routes, primaryNav, corePages } from "./page-data-core.js";
import { workPages } from "./page-data-work.js";

export { routes, primaryNav };

export const pageData = {
  ...corePages,
  ...workPages,
};
