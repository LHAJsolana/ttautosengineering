import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import AIGarageComingSoon from "@/components/ai-garage/AIGarageComingSoon";
import GarageChat from "@/components/ai-garage/GarageChat.client";
import ToolPageHero from "@/components/ToolPageHero";
import { canAccessAiGarage } from "@/lib/ai/access";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  return localizedPageMetadata({
    locale,
    pathname: "/ai-garage",
    title: "TT AUTO'S AI Garage - Coming Soon",
    description:
      "TT AUTO'S AI Garage is a coming soon automotive AI product for voice guidance, diagnostics, fault-code help, comparisons, photo understanding, and Morocco import assistance.",
  });
}

export default async function AIGaragePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : defaultLocale;
  const requestHeaders = await headers();
  const requestCookies = await cookies();
  const canPreview = canAccessAiGarage(requestHeaders, requestCookies);

  if (!canPreview) {
    return <AIGarageComingSoon locale={locale} />;
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ToolPageHero
        eyebrow="TT AUTO'S Engineering"
        title="TT AUTO'S AI Garage"
        description="A multilingual automotive assistant for fault-code triage, used-car buying decisions, reliability research, maintenance planning, and Morocco import next steps."
      />

      <section className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-4">
        {["Fault diagnosis", "Buying advice", "Reliability research", "Morocco import"].map((item) => (
          <div key={item} className="text-sm font-bold text-gray-200">
            {item}
          </div>
        ))}
      </section>

      <div className="mt-8">
        <GarageChat locale={locale} />
      </div>
    </main>
  );
}
