import { z } from 'zod';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';


const routeContextSchema = z.object({
    params: z.object({
        id: z.number(),
    }),
})



export async function DELETE(
    req: NextRequest,
    context: z.infer<typeof routeContextSchema>
) {

    try {
        // Validate the route params.
        const { params } = routeContextSchema.parse(context)
        await prisma.employee.delete({
            where: {
                id: params.id
            }
        })
  
        return new Response(null, { status: 204 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 })
        }
        return new Response(null, { status: 500 })
    }


}
