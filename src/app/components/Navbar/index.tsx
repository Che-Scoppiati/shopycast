"use client";

import { usePathname } from "next/navigation";
import { Link, LinkProps } from "@nextui-org/react";

interface NavbarLinkProps extends LinkProps {
  href: string;
  isSelected: boolean;
  children: React.ReactNode;
}

export const NavbarLink: React.FC<NavbarLinkProps> = ({
  href,
  isSelected,
  children,
  ...props
}) => {
  return (
    <Link href={href} {...props}>
      <p
        className={`${isSelected ? "text-white cursor-default" : "text-primary-light"} hover:text-white group transition duration-300`}
      >
        {children}
        <span
          className={`block max-w-0 ${isSelected ? "max-w-full" : "group-hover:max-w-full"} transition-all duration-500 h-0.5 bg-primary`}
        ></span>
      </p>
    </Link>
  );
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  return (
    <div className="w-full flex justify-between gap-4">
      <h1 className="text-xl font-bold w-fit">⚡ Onchain Shop ⚡</h1>
      <div className="w-auto flex gap-4">
        <NavbarLink href="/" isSelected={pathname === "/"}>
          Home
        </NavbarLink>
        <NavbarLink href="/create" isSelected={pathname === "/create"}>
          Create
        </NavbarLink>
        <NavbarLink href="/showcases" isSelected={pathname === "/showcases"}>
          Showcases
        </NavbarLink>
      </div>
    </div>
  );
};
