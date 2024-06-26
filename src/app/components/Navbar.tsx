"use client";

import { usePathname } from "next/navigation";
import { useLogin, usePrivy } from "@privy-io/react-auth";
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
  const { ready, authenticated, user, logout } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const disableLogout = !ready || (ready && !authenticated);

  const { login } = useLogin({
    onComplete: async (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount,
    ) => {
      console.log({
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount,
      });
      if (isNewUser) {
        const res = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(user),
        });
        const data = await res.json();
        console.log({ returnedData: data });
      }
    },
    onError: (error) => {
      console.log(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  return (
    <div className="w-full flex justify-between gap-4">
      <h1 className="text-xl font-bold w-fit">⚡ Onchain Shop ⚡</h1>
      <div className="w-auto flex gap-4">
        <NavbarLink href="/" isSelected={pathname === "/"}>
          Home
        </NavbarLink>
        {ready ? (
          authenticated ? (
            <>
              <NavbarLink href="/create" isSelected={pathname === "/create"}>
                Create
              </NavbarLink>
              <NavbarLink
                href="/dashboard"
                isSelected={pathname === "/dashboard"}
              >
                Dashboard
              </NavbarLink>
              <button
                disabled={disableLogout}
                onClick={logout}
                className="hover:text-white text-primary-dark group transition duration-300"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              disabled={disableLogin}
              onClick={login}
              className="hover:text-white text-primary-light group transition duration-300"
            >
              Log in
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};
