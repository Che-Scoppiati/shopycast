"use client";

import { Suspense, useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Showcases } from "@/app/components/Showcases";
import { Shops } from "../components/Shops";
import PrivyAuthentication from "@/app/components/PrivyAuthentication";
import { Shop } from "@/lib/mongodb";
import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { AppContext } from "../providers";

export default function Dashboard() {
  const { user } = usePrivy();
  const context = useContext(AppContext);

  const activeShopId = context?.activeShopId || "";
  const userId = user?.id || "";

  const [refetchShops, setRefetchShops] = useState(false);
  const [shops, setShops] = useState<Shop[] | null>(null);

  const {
    isLoading: isLoadingShops,
    error: errorShops,
    data: dataShops,
  } = useQuery({
    queryKey: ["getAllShops", userId],
    queryFn: () =>
      fetch(`/api/shops/user?user_id=${userId}`).then((res) => res.json()),
    select: (data) => data.shops,
    enabled: refetchShops,
  });

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataShops]);

  return (
    <>
      <Suspense>
        <PrivyAuthentication />
      </Suspense>
      <Suspense>
        <Navbar />
      </Suspense>
      <Shops
        userId={userId}
        shops={shops}
        activeShopId={activeShopId}
        isLoadingShops={isLoadingShops}
        errorShops={errorShops}
      />
      <Showcases />
    </>
  );
}
