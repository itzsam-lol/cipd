const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_eb6a90af-0223-4df6-b0fe-5d08599bee18/artifacts/sjkzh3zl_b17e3429-79de-4a8b-9888-d8026c138658.jpg";

export default function Logo({ className = "h-8 w-auto", invert = false, alt = "CiPD" }) {
  return (
    <img
      src={LOGO_URL}
      alt={alt}
      className={className}
      style={{
        objectFit: "contain",
        // The source asset has an off-white background; multiply blends it away
        // on light backgrounds; on dark we screen-out the white.
        mixBlendMode: invert ? "screen" : "multiply",
      }}
    />
  );
}

export { LOGO_URL };
