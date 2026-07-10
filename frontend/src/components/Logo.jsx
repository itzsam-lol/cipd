import LOGO_URL from "@/assets/logo.png";

export default function Logo({ className = "h-8 w-auto", alt = "CiPD" }) {
  return (
    <span className="inline-flex items-center justify-center bg-white rounded-md p-1.5 shrink-0">
      <img src={LOGO_URL} alt={alt} className={className} style={{ objectFit: "contain" }} />
    </span>
  );
}

export { LOGO_URL };
