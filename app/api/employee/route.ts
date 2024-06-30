import { z } from 'zod';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getRandomIntInRange } from '@/lib/utils';

const randomImages = (minLength, maxLength) => {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const array = [];

  for (let i = 0; i < length; i++) {
    const id = getRandomIntInRange(15, 50);
    const url = `https://picsum.photos/id/${id}/400/400`;
    array.push({
      id: `${id}`,
      url: url,
    });
  }

  return array;
};

const createEmployeeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  from: z.string(),
  to: z.string(),
  images: z.any().optional(), // Assuming images are stored as key-value pairs of URLs
  positionId: z.number().int(), // Optional array of position IDs
  toolLanguageIds: z.array(z.number().int()).optional(), // Optional array of tool language IDs
});

export async function POST(req, res) {
  try {
    // Parse and validate the request body using Zod schema
    const json = await req.json();
    const body = createEmployeeSchema.parse(json);

    // Create a new employee in the database
    const newEmployee = await prisma.employee.create({
      data: {
        name: body.name,
        description: body.description,
        from: new Date(body.from),
        to: new Date(body.to),
        images: JSON.parse(JSON.stringify(body.images)) ?? [],
        position: {
          connect: { id: body.positionId }, // Connect employee to position by ID
        },
        toolLanguages: {
          connect: body.toolLanguageIds?.map?.((id) => ({ id })), // Connect employee to tool languages by IDs
        },
      },
    });


    return new Response(JSON.stringify(newEmployee), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}





export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const take = url.searchParams.get("take") ? parseInt(url.searchParams.get("take")!, 10) : 10;
    const cursor = url.searchParams.get("cursor") ? { id: parseInt(url.searchParams.get("cursor")!, 10) } : undefined;
    const text = url.searchParams.get("text") || '';

    // Validate parsed parameters
    if (isNaN(take) || (cursor && isNaN(cursor.id))) {
      return new Response(JSON.stringify({ error: 'Invalid query parameters' }), { status: 400 });
    }

    // Construct where clause based on search params
    const where: Prisma.EmployeeWhereInput = {
      OR: [
        { name: { contains: text, mode: 'insensitive' } },
        { description: { contains: text, mode: 'insensitive' } },
        // Add more fields to search here based on your schema
      ]
    };

    // Fetch employees with pagination and where conditions
    const employees = await prisma.employee.findMany({
      take,
      skip: cursor ? 1 : 0, // Skip the current cursor if provided
      cursor,
      where,
      include: {
        position: true
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Determine if there's a next page
    const nextPage = await prisma.employee.findMany({
      take: 1,
      skip: 1, // Skip the last employee of the current page
      cursor: employees.length > 0 ? { id: employees[employees.length - 1].id } : undefined,
      where,
      orderBy: {
        id: 'desc',
      },
    });

    // Prepare response data with metadata
    const data = {
      data: employees,
      metaData: {
        lastCursor: employees.length > 0 ? employees[employees.length - 1].id.toString() : null,
        hasNextPage: nextPage.length > 0,
      }
    };

    // Return response
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}