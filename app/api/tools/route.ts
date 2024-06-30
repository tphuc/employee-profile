import { z } from 'zod';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';


const createToolLanguageSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  positionIds: z.array(z.number().int()), // positionIds as an array of integers
  displayOrder: z.number().int(),
});

export async function POST(req, res) {
  try {
    // Parse and validate the request body using Zod schema
    const json = await req.json();
    const body = createToolLanguageSchema.parse(json);

    // Create a new tool language in the database
    const newToolLanguage = await prisma.toolLanguage.create({
      data: {
        name: body.name,
        description: body.description,
        displayOrder: body.displayOrder,
        positions: {
          connect: body.positionIds.map((id) => ({ id })),
        },
      },
    });

    // Return the created tool language as a response
    res.status(201).json(newToolLanguage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues);
      res.status(422).json({ error: 'Validation failed', details: error.issues });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Failed to create ToolLanguage' });
    }
  }
}


export async function GET(req: NextRequest) {
  try {
    // Fetch all tool languages from the database
    const toolLanguages = await prisma.toolLanguage.findMany({
      include: {
       
      },
      orderBy: {
        displayOrder: 'asc', // Optionally, order by displayOrder
      },
    });

    // Return the fetched tool languages as a response
    return new Response(JSON.stringify(toolLanguages), { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(null, { status: 500 });
  }
}