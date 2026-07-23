import Link from "next/link";
import { content } from "@/content/site-content";

/**
 * Minimal distraction-free layout for the booking page:
 * logo-only header, no nav links, no footer.
 */
export default function BookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="bg-background shadow-nav">
        <div className="mx-auto flex h-18 max-w-content items-center px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="font-heading text-3xl font-bold text-foreground"
            aria-label={`${content.brand.name} home`}
          >
            {content.brand.name}
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
