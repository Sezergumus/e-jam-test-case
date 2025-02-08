import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import Table from "@/components/table";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Toaster closeButton richColors />
      <div className="max-w-xl text-center justify-center">
        <div>
          <span className={title()}>Humble&nbsp;</span>
          <span className={title({ color: "violet" })}>Superhero&nbsp;</span>
          <span className={title()}>API </span>
        </div>
        <div className={subtitle({ class: "mt-4" })}>
          <span className={subtitle({ color: "green" })}>Add</span>,&nbsp;
          <span className={subtitle({ color: "red" })}>delete&nbsp;</span>
          and&nbsp;
          <span className={subtitle({ color: "blue" })}>update&nbsp;</span>
          superheroes&nbsp;
          <span className={subtitle({ color: "orange" })}>blazingly&nbsp;</span>
          fast
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>
      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by adding <Code color="success">superheroes</Code>
          </span>
        </Snippet>
      </div>
      <Table />
    </section>
  );
}
