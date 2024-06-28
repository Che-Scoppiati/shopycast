import { Showcases } from "@/app/components/Showcases";
import PrivyAuthentication from "@/app/components/PrivyAuthentication";
import { Navbar } from "../components/Navbar";

export default function Home() {
  return (
    <>
      <PrivyAuthentication />
      <Navbar />
      <Showcases />
    </>
  );
}
