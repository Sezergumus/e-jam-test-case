import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import Image from "next/image";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, MailIcon } from "@/components/icons";

export const Navbar = () => {
  return (
    <HeroUINavbar className="header" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              alt="e-jam logo"
              className="white-logo mt-1.5"
              height={48}
              src="/ejam_logo.png"
              width={48}
            />
            <Image
              alt="e-jam logo"
              className="dark:hidden mt-1.5"
              height={48}
              src="/ejam_logo_black.png"
              width={48}
            />
          </NextLink>
        </NavbarBrand>
        <ul className="flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center gap-2">
          <Link isExternal aria-label="Discord" href={siteConfig.links.mail}>
            <MailIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
