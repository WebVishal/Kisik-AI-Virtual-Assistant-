
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

declare type ResponseData = {
    params: Promise<{ id: string; }>;
}

export async function GET(request: Request, { params }: ResponseData) {
    try {
        const id = (await params)?.id
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`SELECT * FROM ai_responses where response_id=${id}`;
        return Response.json({ data: response });
    } catch (error) {
        console.error("Error fetching recent rides:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function OPTIONS() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}