'use client';
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "./ui/MultiSelect";
import useSWR from 'swr'
import { Prisma } from "@prisma/client";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultipleImageUploader } from "./images/ImageUploader";
import { useRouter } from "next/navigation";


const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    from: z.string(),
    to: z.string(),
    images: z.record(z.string()).optional(), // Assuming images are stored as key-value pairs of URLs
    positionId: z.string().transform(v => parseInt(v)), // Optional array of position IDs
    toolLanguageIds: z.array(z.any()).min(1).optional(), // Optional array of tool language IDs
});


export default function CreatePositionForm() {
    const router = useRouter()
    const { data: positions } = useSWR('/api/positions', async (url) => {
        let res = await fetch(url)
        return await res.json()
    })



    const closeRef = useRef()
    const form = useForm({
        resolver: zodResolver(schema),
        // defaultValues: {
        // }
    })

    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (values) => {
        setIsLoading(true)
        try {

            let res = await fetch('/api/employee', {
                method: "POST",
                body: JSON.stringify({
                    ...values,
                    toolLanguageIds: values?.toolLanguageIds?.map(item => item?.value)
                })
            })
            if (res.ok) {
                // closeRef.current?.click?.()
                // router.refresh()
                // form.reset(['name', 'description', 'positionId', 'toolLanguageIds', 'images'])
                toast({
                    title: 'Succesfully',
                })
                
            }
            

            let data = await res.json()
            console.log(data)

        }
        catch {
            toast({
                title: 'An error has occured',
                variant: "destructive"
            })
        }
        setIsLoading(false)
    }


    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (*)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (*)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="positionId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"> Position </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>

                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {positions?.map?.((item) => <SelectItem key={item?.id} value={`${item.id}`} >{item?.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch('positionId') && <>
                    <div className="grid grid-cols-2 gap-4">

                        <FormField
                            control={form.control}
                            name="from"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>From</FormLabel>
                                    <FormControl>
                                        <Input type='date' placeholder="Enter" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="to"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>to</FormLabel>
                                    <FormControl>
                                        <Input type='date' placeholder="Enter" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                    control={form.control}
                    name="toolLanguageIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tool Languages (*)</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    defaultValue={field.value}
                                    items={positions?.find(item => item?.id == form.watch('positionId'))?.toolLanguages?.map?.(item => ({
                                        value: item.id,
                                        label: item.name
                                    })) ?? []} placeholder="Select" max={20} onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>

                                    <MultipleImageUploader
                                        defaultValue={field.value}
                                        onChange={async (value) => {
                                            console.log(value)

                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                </>}

                <br />
                <Button size='lg' disabled={isLoading} className="max-w-[300px] mx-auto gap-2" type='submit'>
                    Confirm
                    {isLoading && <Loader2 className="animate-spin text-muted-foreground w-5 h-5" />}
                </Button>
            </form>
        </Form>
    </div>
}