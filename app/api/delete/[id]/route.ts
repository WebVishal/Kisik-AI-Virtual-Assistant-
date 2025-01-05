import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

declare type ResponseData = {
    params: Promise<{ id: string; }>;
}
export async function DELETE(request: Request, { params }: ResponseData) {
    try {
        const id = (await params)?.id
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`DELETE FROM public.ai_responses WHERE response_id = ${id}`;
        console.log(response);
        return NextResponse.json({ data: response });
    } catch (error) {
        console.error("Error deleting response:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}