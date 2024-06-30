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

const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    toolLanguages: z.array(z.number()).optional(),
    displayOrder: z.string().transform(v => parseInt(v)),
});

export default function CreatePositionForm() {

    const { data: tools } = useSWR('/api/tools', async (url) => {
        let res = await fetch(url)
        return await res.json()
    })
    const closeRef = useRef()
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            toolLanguages: [],
            displayOrder: '1',
        }
    })

    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (values) => {
        setIsLoading(true)
        try {

            let res = await fetch('/api/positions', {
                method:"POST",
                body: JSON.stringify(values)
            })
            if(res.ok){
                // closeRef.current?.click?.()
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
                    name="toolLanguages"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tool Languages (*)</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    defaultValue={field.value}
                                    items={tools?.map?.(item => ({
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
                    name="displayOrder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Display order (*)</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder="Enter" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button size='lg' disabled={isLoading} className="max-w-[300px] gap-2" type='submit'>
                    Confirm
                    {isLoading && <Loader2 className="animate-spin text-muted-foreground w-5 h-5" />}
                </Button>
            </form>
        </Form>
    </div>
}