import beautifulMd from "./beautiful-md.json" with { type: "json" };
import olistSupport from "./olist-support.json" with { type: "json" };
import revenueIntegrity from "./revenue-integrity.json" with { type: "json" };

export const syncedProjects = [beautifulMd, olistSupport, revenueIntegrity].map((project) => ({
  ...project,
  href: `/v2/work/${project.id}/`,
}));
