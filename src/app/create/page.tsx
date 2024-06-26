import CreateFrame from "@/app/components/CreateFrame/CreateFrame";
import { Navbar } from "@/app/components/Navbar";
import PrivyAuthentication from "@/app/components/PrivyAuthentication";

export default function Home() {
  return (
    <>
      <PrivyAuthentication />
      <Navbar />
      <CreateFrame />
    </>
  );
}
