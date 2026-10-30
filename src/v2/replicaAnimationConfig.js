export const replicaAnimation = {
  introEnd: "bottom bottom",
  // Shared catch-up windows keep scroll-linked scenes moving as one system on both input types.
  scrub: 0.65,
  mobileScrub: 0.55,
  cardPerspective: 1200,
  desktopCardScale: 2,
  desktopCardLift: -244,
  // Breathing room left between the mobile portrait's resting edge and the intro line that sits
  // under it. useReplicaMotion adds this to the hole it reserves in the about copy.
  mobilePortraitClearance: 18,
};
