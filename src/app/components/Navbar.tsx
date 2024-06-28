"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { Link, LinkProps, useDisclosure } from "@nextui-org/react";
import { UpdateShopModal } from "./UpdateShopModal";
import { useEffect } from "react";
import router from "next/router";

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
  const { isOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const triggerLogin = searchParams.get("login") === "true";

  const { ready, authenticated, user } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const disableLogout = !ready || (ready && !authenticated);

  const { login } = useLogin({
    onComplete: async (user) => {
      const { user: existingUser } = await fetch(
        `/api/users?user_id=${user.id}`,
      ).then((res) => res.json());

      if (!existingUser) {
        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(user),
        });
      }

      // if !apiKey => Open the modal to insert the API key and the shop name
      if (!existingUser?.apiKey) {
        onOpenChange();
      }
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      localStorage?.removeItem("activeShopId");
      router.push("/");
    },
  });

  useEffect(() => {
    if (triggerLogin) {
      login();
    }
  }, []);

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
              <NavbarLink
                href="/dashboard"
                isSelected={pathname === "/dashboard"}
              >
                Dashboard
              </NavbarLink>
              <UpdateShopModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                user={user}
              />
              <button
                disabled={disableLogout}
                onClick={logout}
                className="hover:text-white text-primary-dark group transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              disabled={disableLogin}
              onClick={login}
              className="hover:text-white text-primary-light group transition duration-300"
            >
              Login
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};
