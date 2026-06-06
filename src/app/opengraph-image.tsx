import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function truncate(input: string, max = 80) {
  const s = (input || "").trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

export default function OpenGraphImage({
  searchParams,
}: {
  searchParams?: { title?: string; subtitle?: string; brand?: string };
}) {
  const title = truncate(
    searchParams?.title ?? "Engineering-driven analysis of German cars",
    64
  );

  const subtitle = truncate(
    searchParams?.subtitle ??
      "Reliability insights • Buying guides • Ownership costs • Engineering notes",
    96
  );

  const brand = truncate(searchParams?.brand ?? "", 24);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0B1220 0%, #0F1B33 55%, #0B1220 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.08,
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -70,
            right: -90,
            width: 620,
            height: 620,
            background:
              "radial-gradient(circle at 60% 40%, rgba(255,0,0,0.32), transparent 62%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -90,
            left: -70,
            width: 520,
            height: 520,
            background:
              "radial-gradient(circle at 40% 60%, rgba(255,255,255,0.10), transparent 65%)",
          }}
        />

        {/* Top */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, opacity: 0.88 }}>TT AUTO’S Engineering</div>

          {brand ? (
            <div
              style={{
                fontSize: 18,
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {brand}
            </div>
          ) : (
            <div
              style={{
                fontSize: 18,
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                opacity: 0.85,
              }}
            >
              German Engineering Hub
            </div>
          )}
        </div>

        {/* Middle */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 66, fontWeight: 850, lineHeight: 1.05, maxWidth: 1020 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, opacity: 0.85, maxWidth: 1020 }}>{subtitle}</div>
        </div>

        {/* Bottom */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["BMW", "Mercedes", "Audi", "Volkswagen"].map((b) => (
              <div
                key={b}
                style={{
                  fontSize: 18,
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                {b}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 22, opacity: 0.7 }}>ttautosengineering.com</div>
        </div>
      </div>
    ),
    size
  );
}