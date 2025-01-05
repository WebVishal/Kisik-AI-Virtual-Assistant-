import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function POST(req: Request) {
    const { image } = await req.json();
    try {
        let ResponseData: object = {}
        // Upload image to Cloudinary
        await cloudinary.uploader
            .upload(image)
            .then(result => {
                ResponseData = result
            });
        return NextResponse.json({ message: 'Image uploaded successfully', data: ResponseData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}