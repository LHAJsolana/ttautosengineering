import Link from "@/components/LocalizedLink";

export default function ToolPageHero({
  eyebrow,
  title,
  description,
  links = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  links?: { label: string; href: string }[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.22),transparent_35%),linear-gradient(135deg,#111c32,#0b1220_58%,#1e0d1b)] p-7 shadow-2xl shadow-black/20 md:p-10">
      <div className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-red-400 via-red-600 to-transparent" />
      <div className="relative max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300 md:text-lg">{description}</p>
        {links.length ? (
          <div className="mt-7 flex flex-wrap gap-3">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={index === 0
                  ? "rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
                  : "rounded-2xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
