import NeonMesh from "./neon-mesh";

/**
 * Full-viewport background matching the StellarCade homepage exactly.
 * Sits behind all page content via z-index: -1.
 */
export default function NoiseBackground() {
  return (
    <NeonMesh
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{ zIndex: -1 }}
    />
  );
}
