"use client";

import { forwardRef, useCallback, useEffect, useState, useTransition } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Filter, Loader2, Plus } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type QueryParams = {
    take?: number;
    lastCursor?: number;
    text?: string
};

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
}

const EmployeeCard = forwardRef(({ data }: any, ref: any) => {
    return (
        <div ref={ref} className="relative bg-stone-200 space-y-1 p-4 rounded-lg w-full aspect-square">
            <p className="pl-2 font-bold">{data?.name} #{data?.id}</p>
            <p className="pl-2">{data?.position?.name} </p>
            <p className="pl-2">{data?.position?.name} </p>
            <Carousel className="w-full">
                <CarouselContent className="relative w-full">
                    {data?.images?.map(item => <CarouselItem className="w-full flex items-center justify-center" key={item?.url}>
                        <Image key={item?.url} width={300} height={300} alt='' style={{width:"100%", height:'100%', objectFit:"cover"}} src={item?.url} />
                    </CarouselItem>)}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
});

EmployeeCard.displayName = 'EmployeeCard'


const fetchData = async ({ take, lastCursor, text }: QueryParams) => {
    let searchQuery = new URLSearchParams();
    if (take) {
        searchQuery.append('take', `${take}`)
    }

    if (lastCursor) {
        searchQuery.append('cursor', `${lastCursor}`)
    }

    if (text) {
        searchQuery.append('text', `${text}`)
    }

    const response = await fetch(`/api/employee?${searchQuery?.toString()}`, {
        method: "GET"
    });
    let data = await response.json()
    return data;
};





const SearchPage = () => {
    // to know when the last element is in view
    const { ref, inView } = useInView();
    const router = useRouter();
    const pathname = usePathname()
    const [text, setText] = useState('')
    const debounceText = useDebounce(text, 200);
    const params = useSearchParams()



    // useInfiniteQuery is a hook that accepts a queryFn and queryKey and returns the result of the queryFn
    const {
        data,
        error,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isSuccess,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        initialPageParam: null,
        queryFn: ({ pageParam }) => {
            return fetchData({ take: 5, lastCursor: pageParam, text: debounceText })
        },
        staleTime: 100,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        queryKey: ["employee", text],
        getNextPageParam: (lastPage) => {
            return lastPage?.metaData?.lastCursor;
            // if (lastPage?.metaData?.hasNextPage)
            //     return lastPage?.metaData?.lastCursor;
            // else {
            //     return undefined
            // }

        },

    });


    useEffect(() => {
        // if the last element is in view and there is a next page, fetch the next page
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, inView, fetchNextPage]);

    if (error as any)
        return (
            <div className="mt-10">
                {"An error has occurred: " + (error as any).message}
            </div>
        );



    return (
        <div className={cn("relative ",
            // "mx-auto max-w-screen-xl"
        )}>


            


            <div className="relative  max-w-screen-xl mx-auto  space-y-2 pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Input placeholder="debounce search..." value={text} onChange={(e) => setText(e?.target?.value)} />
                </div>

                <Link href='/employee' className="bg-stone-200 px-4 py-2 flex items-center gap-2 rounded-md">Create Employee <Plus className="w-4 h-4"/></Link>
            </div>
            <br/>
                {(isLoading || isFetchingNextPage) && <Loader2 className="animate-spin text-muted-foreground w-5 h-5" />}
                {data?.pages?.[0]?.length === 0 && <p className="text-muted-foreground opacity-60">Not found</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >

                    {isSuccess &&
                        data?.pages?.map((page: any) =>
                            page?.data?.map((item: any, index: number) => {
                                // if the last element in the page is in view, add a ref to it
                                if (page?.data?.length === index + 1) {
                                    return (
                                        <EmployeeCard
                                            ref={ref}
                                            key={item.id}
                                            data={item}
                                        />

                                    );
                                } else {
                                    return (
                                        <EmployeeCard

                                            key={item.id}
                                            data={item}
                                        />
                                    );
                                }
                            })
                        )}


                </div>

            </div>
        </div>

    );
};

export default SearchPage;