import { Navbar } from "@/app/components/Navbar";
import { Showcases } from "@/app/components/Showcases";
import PrivyAuthentication from "@/app/components/PrivyAuthentication";

export default function Home() {
  return (
    <>
      <PrivyAuthentication />
      <Navbar />
      <Showcases />
    </>
  );
}
