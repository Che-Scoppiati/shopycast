"use client";

import { Suspense, useContext, useEffect, useState } from "react";
import { Navbar, customLogin } from "@/app/components/Navbar";
import { Showcases } from "@/app/components/Showcases";
import { Shops } from "@/app/components/Shops";
import { Shop } from "@/lib/mongodb";
import { useQuery } from "@tanstack/react-query";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { AppContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import { UpdateShopModal } from "@/app/components/UpdateShopModal";

export default function Dashboard() {
  const { user } = usePrivy();
  const context = useContext(AppContext);
  const router = useRouter();
  const {
    isOpen: isOpenUpdate,
    onOpenChange: onOpenUpdateChange,
    onClose: onCloseUpdate,
  } = useDisclosure();

  const activeShopId = context?.activeShopId || "";
  const userId = user?.id || "";

  const [refetchShops, setRefetchShops] = useState(false);
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [refetchCount, setRefetchCount] = useState(0);

  const { login } = useLogin({
    onComplete: async (user) => {
      await customLogin(user, onOpenUpdateChange, router, true);
    },
    onError: (error) => {
      console.error(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  const {
    isLoading: isLoadingShops,
    error: errorShops,
    data: dataShops,
  } = useQuery({
    queryKey: ["getAllShops", userId, refetchCount],
    queryFn: () =>
      fetch(`/api/shops/user?user_id=${userId}`).then((res) => res.json()),
    select: (data) => data.shops,
    enabled: refetchShops,
  });

  useEffect(() => {
    if (!user) login();
  }, []);

  useEffect(() => {
    if (!!userId) setRefetchShops(true);
  }, [userId]);

  useEffect(() => {
    if (dataShops) {
      setShops(dataShops);
      if (!activeShopId && dataShops.length > 0) {
        context?.setActiveShopId(dataShops[0].id);
      }
      setRefetchShops(false);
      setRefetchCount((prev) => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataShops]);

  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <UpdateShopModal
        isOpen={isOpenUpdate}
        onOpenChange={onOpenUpdateChange}
        onClose={onCloseUpdate}
        user={user}
      />
      <Shops
        userId={userId}
        shops={shops}
        activeShopId={activeShopId}
        isLoadingShops={isLoadingShops}
        errorShops={errorShops}
        setRefetchShops={setRefetchShops}
      />
      <Showcases />
    </>
  );
}
