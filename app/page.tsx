
import Link from "next/link";
import Header from "./header";
import SearchPage from "./SearchPage";



export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {

  return <main className="relative flex min-h-screen flex-col max-w-[100vw] overflow-hidden  gap-4 p-4">
    <Header/>
    
    <SearchPage/>
   
  </main>
}


