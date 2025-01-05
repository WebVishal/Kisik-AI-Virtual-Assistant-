import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { response_id, assistant_name, response_text, image_url } = await request.json();

    try {
        // Begin a transaction
        await sql`BEGIN`;

        // Insert each topic
        await sql`
            INSERT INTO public.ai_responses (response_id, assistant_name, response_text, image_url) 
            VALUES (${response_id}, ${assistant_name}, ${response_text}, ${image_url})
        `;

        // Commit the transaction
        await sql`COMMIT`;
        console.log("Data inserted successfully!");

        return new Response(JSON.stringify({ message: "Data inserted successfully!" }), { status: 200 });
    } catch (error) {
        // Rollback the transaction in case of an error
        await sql`ROLLBACK`;
        console.error("Error inserting data:", error);
        return new Response(JSON.stringify({ error: "Error inserting data" }), { status: 500 });
    }
}