export const replicaAnimation = {
  introEnd: "bottom bottom",
  scrub: 0.65,
  // Mobile used scrub: true, pinning every scene 1:1 to the scroll offset with no catch-up. Touch
  // scrolling arrives in momentum bursts rather than the smooth deltas a wheel produces, so a
  // rigid coupling reproduces every jolt and the motion reads as unnatural. A catch-up window in
  // the same range as the desktop scenes absorbs the bursts without feeling laggy.
  mobileScrub: 0.55,
  cardPerspective: 1200,
  desktopCardScale: 2,
  desktopCardLift: -244,
  // Breathing room left between the mobile portrait's resting edge and the intro line that sits
  // under it. useReplicaMotion adds this to the hole it reserves in the about copy.
  mobilePortraitClearance: 18,
  statementScrub: 0.45,
};
