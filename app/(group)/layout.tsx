
import Link from "next/link";
import Header from "../header";



export default async function Layout({
  children,
}) {

  return <main className="relative flex min-h-screen flex-col max-w-[100vw] overflow-hidden  gap-4 p-4">
    <Header/>
    {children}
  </main>
}


