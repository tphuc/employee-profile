import { z } from 'zod';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';


const createPositionSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    displayOrder: z.number().int(),
    toolLanguageIds: z.array(z.number().int()).optional(), // Optional array of tool language IDs
});

export async function POST(req: NextRequest) {
    try {
        // Parse and validate the request body
        const json = await req.json();
        const body = createPositionSchema.parse(json);

        // Create the data object for Prisma create operation
        const data: any = {
            name: body.name,
            description: body.description,
            displayOrder: body.displayOrder,
        };

        // If toolLanguageIds are provided, include them in the data object
        if (body.toolLanguageIds) {
            data.toolLanguages = {
                connect: body.toolLanguageIds.map(id => ({ id })),
            };
        }

        // Create a new position in the database
        const createdPosition = await prisma.position.create({ data });

        // Return the created position as a response
        return new Response(JSON.stringify(createdPosition), { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.issues), { status: 422 });
        }

        return new Response(null, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        // Fetch all positions from the database
        const positions = await prisma.position.findMany({
            include: {
                toolLanguages: true
            },
            orderBy: {
                displayOrder: 'asc', // Optionally, order by displayOrder
            },
        });

        // Return the fetched positions as a response
        return new Response(JSON.stringify(positions), { status: 200 });
    } catch (error) {
        return new Response(null, { status: 500 });
    }
}