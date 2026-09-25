"use client";

import {
  ShieldCheck,
  Clock,
  RotateCw,
  Sparkles,
  Target,
  Lightbulb,
  Copy,
  ListChecks,
  BarChart3,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BrandMark } from "@/components/ui/BrandMark";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { StartAuditLink } from "@/components/ui/StartAuditLink";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const PAIN_ICONS = [Clock, RotateCw, Sparkles];
const WHAT_ITEMS = [
  { icon: Clock, accent: "primary" as const },
  { icon: Target, accent: "secondary" as const },
  { icon: Lightbulb, accent: "primary" as const },
  { icon: Copy, accent: "secondary" as const },
];

export default function Home() {
  const { dict, locale } = useLocale();
  const { landing } = dict;
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="hero-gradient min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:py-8 lg:px-8">
        <span className="flex items-center gap-2 font-heading text-lg font-extrabold text-text-primary">
          <BrandMark />
          {dict.common.siteName}
        </span>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <StartAuditLink>
            <Button className="text-sm px-5 py-2.5">{dict.common.startAudit}</Button>
          </StartAuditLink>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
        <section className="pt-6 sm:pt-12 text-center flex flex-col items-center gap-6">
          <span className="inline-block rounded-full bg-surface px-4 py-1.5 text-xs font-bold text-text-secondary">
            {landing.heroEyebrow}
          </span>
          <h1 className="max-w-3xl font-heading text-3xl sm:text-5xl font-extrabold leading-tight text-text-primary">
            {landing.heroHeadline}
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-text-secondary leading-relaxed">
            {landing.heroSupporting}
          </p>

          <div className="flex items-center gap-3 py-2 text-sm font-bold text-text-secondary sm:gap-4">
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft">
                <Clock className="h-4.5 w-4.5 text-primary" />
              </span>
              {landing.stepsStrip.time}
            </span>
            <ArrowIcon className="h-4 w-4 text-text-secondary/50" />
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-soft">
                <ListChecks className="h-4.5 w-4.5 text-secondary" />
              </span>
              {landing.stepsStrip.tasks}
            </span>
            <ArrowIcon className="h-4 w-4 text-text-secondary/50" />
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft">
                <BarChart3 className="h-4.5 w-4.5 text-primary" />
              </span>
              {landing.stepsStrip.insight}
            </span>
          </div>

          <StartAuditLink>
            <Button className="text-base px-8 py-4 transition-transform hover:scale-105">
              {landing.heroCta}
            </Button>
          </StartAuditLink>
          <p className="text-xs text-text-secondary">{landing.heroNote}</p>
        </section>

        <section className="mt-20 sm:mt-28">
          <h2 className="text-center font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-10">
            {landing.painHeading}
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {landing.painPoints.map((p, i) => {
              const Icon = PAIN_ICONS[i];
              return (
                <Card key={p.title} className="p-6 transition-shadow hover:shadow-lg">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="font-bold text-text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{p.desc}</p>
                </Card>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <StartAuditLink>
              <Button variant="secondary" className="hover:border-secondary">
                {landing.painCta}
              </Button>
            </StartAuditLink>
          </div>
        </section>

        <section className="mt-20 sm:mt-28">
          <h2 className="text-center font-heading text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
            {landing.whatHeading}
          </h2>
          <p className="text-center text-text-secondary mb-10">{landing.whatSubheading}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {landing.whatItems.map((item, i) => {
              const { icon: Icon, accent } = WHAT_ITEMS[i];
              return (
                <Card key={item.title} className="p-6 transition-shadow hover:shadow-lg">
                  <span
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${
                      accent === "primary" ? "bg-primary-soft" : "bg-secondary-soft"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${accent === "primary" ? "text-primary" : "text-secondary"}`}
                    />
                  </span>
                  <h3 className="font-bold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mt-20 sm:mt-28">
          <Card className="mx-auto max-w-2xl p-8 text-center flex flex-col items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-soft">
              <ShieldCheck className="h-6 w-6 text-secondary" />
            </span>
            <h2 className="font-heading text-xl font-extrabold text-text-primary">
              {landing.trustHeading}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-lg">{landing.trustBody}</p>
          </Card>
        </section>

        <section className="mt-20 sm:mt-28 text-center flex flex-col items-center gap-5">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
            {landing.finalHeading}
          </h2>
          <StartAuditLink>
            <Button className="text-base px-8 py-4 transition-transform hover:scale-105">
              {landing.finalCta}
            </Button>
          </StartAuditLink>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-text-secondary lg:px-8">
        {landing.footerDisclaimer}
      </footer>
    </div>
  );
}
