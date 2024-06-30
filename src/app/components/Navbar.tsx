"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import {
  Navbar as NextUiNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { LinkProps, useDisclosure, Image } from "@nextui-org/react";
import { UpdateShopModal } from "./UpdateShopModal";
import { useState } from "react";

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
  const {
    isOpen: isOpenMenu,
    onOpenChange: onOpenMenuChange,
    onClose: onCloseMenu,
  } = useDisclosure();
  const {
    isOpen: isOpenUpdate,
    onOpenChange: onOpenUpdateChange,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();

  const { ready, authenticated, user } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const disableLogout = !ready || (ready && !authenticated);

  const [loginButtonPressed, setLoginButtonPressed] = useState(false);

  const { login } = useLogin({
    onComplete: async (user) => {
      console.log("onComplete user", loginButtonPressed);
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
        onOpenUpdateChange();
      }

      if (loginButtonPressed) {
        router.push("/dashboard");
      }
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

  const handleLogin = () => {
    setLoginButtonPressed(true);
    login();
  };

  return (
    <NextUiNavbar
      onMenuOpenChange={onOpenMenuChange}
      className="rounded-xl w-full"
      classNames={{
        wrapper: "max-w-none",
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isOpenMenu ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            <div className="w-[50px] rounded-lg">
              <Image
                src="/images/logo.png"
                alt="Shopycast Logo"
                width={40}
                height={40}
              />
            </div>
            <h1 className="text-3xl font-bold w-fit leading-none text-primary-light">
              Shopycast
            </h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link href="/" color={pathname === "/" ? "primary" : "secondary"}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/dashboard"}>
          <Link
            color={pathname === "/dashboard" ? "primary" : "secondary"}
            onPress={
              authenticated ? () => router.push("/dashboard") : handleLogin
            }
            className="hover:cursor-pointer"
          >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/faq"}>
          <Link
            href="/faq"
            color={pathname === "/faq" ? "primary" : "secondary"}
          >
            FAQ
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="hidden lg:flex">
        <NavbarItem>
          <Button
            className="w-[50%] text-white"
            color="primary"
            variant="flat"
            onClick={ready && authenticated ? logout : handleLogin}
          >
            {ready && authenticated ? "Logout" : "Login"}
          </Button>
        </NavbarItem>
      </NavbarContent>

      <UpdateShopModal
        isOpen={isOpenUpdate}
        onOpenChange={onOpenUpdateChange}
        onClose={onCloseUpdate}
        user={user}
      />

      <NavbarMenu className="bg-[rgba(0,0,0,0.5)] mt-1 pt-20 gap-4 items-center text-center">
        <NavbarMenuItem isActive={pathname === "/"}>
          <Link
            className="w-full"
            href="/"
            size="lg"
            color={pathname === "/" ? "primary" : "secondary"}
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={pathname === "/dashboard"}>
          <Link
            className="w-full"
            href="/dashboard"
            size="lg"
            color={pathname === "/dashboard" ? "primary" : "secondary"}
            isDisabled={!ready || !authenticated}
          >
            Dashboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={pathname === "/dashboard"}>
          <Link
            className="w-full"
            href="/faq"
            size="lg"
            color={pathname === "/faq" ? "primary" : "secondary"}
            isDisabled={!ready || !authenticated}
          >
            FAQ
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            className="w-[50%] text-white"
            color="primary"
            variant="flat"
            onClick={ready && authenticated ? logout : login}
            isDisabled={ready && authenticated ? disableLogout : disableLogin}
          >
            {ready && authenticated ? "Logout" : "Login"}
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUiNavbar>
  );
};
