import CreatePositionForm from "@/components/CreatePositionForm";


export default function Page(){
    return <div className="bg-stone-100 container min-h-48 p-4 md:p-8 space-y-8 rounded-md">
        <h1 className="text-xl font-bold">Create New Position</h1>
        <CreatePositionForm/>
    </div>
}