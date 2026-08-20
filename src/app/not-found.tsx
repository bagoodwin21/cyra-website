import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/content/site-content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { NotFoundTracker } from "./not-found-tracker";

const { notFound, brand } = content;

export default function NotFound() {
  return (
    <>
      <NotFoundTracker />
      <header className="bg-background shadow-nav">
        <div className="mx-auto flex h-18 max-w-content items-center px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="font-heading text-3xl font-bold text-foreground"
            aria-label={`${brand.name} home`}
          >
            {brand.name}
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-xl rounded-[3px] border border-border bg-background p-8 text-center shadow-card md:p-10">
          <p className="text-small font-semibold uppercase tracking-[0.18em] text-primary">
            {notFound.label}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {notFound.heading}
          </h1>
          <p className="text-body-copy mt-4">{notFound.body}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/quiz"
              className={cn(buttonVariants({ variant: "accent" }), "w-full")}
            >
              {notFound.quizCta}
            </Link>
            <Link
              href="/book"
              data-analytics-event="book_consult_click"
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              {notFound.bookCta}
            </Link>
          </div>
          <p className="mt-6 text-small text-foreground-muted">
            <Link
              href="/"
              className="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {notFound.homeCta}
            </Link>
            {" · "}
            Questions? Text us at{" "}
            <a
              href={`sms:${siteConfig.smsNumber}`}
              className="font-semibold text-primary hover:text-primary-light"
            >
              {siteConfig.smsDisplay}
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
