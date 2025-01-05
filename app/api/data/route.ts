import { neon } from '@neondatabase/serverless';
export async function GET() {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`SELECT * FROM ai_responses order by created_at desc`;
        return Response.json({ data: response });
    } catch (error) {
        console.error("Error fetching recent rides:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}