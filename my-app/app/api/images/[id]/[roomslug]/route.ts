// app/api/images/[id]/[roomSlug]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'uploads'); // Directory to save images

// Ensure the directory exists
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}

export async function POST(request: Request) {
    const formData = await request.formData(); // Get form data
    const urlParts = request.url.split('/');
    const id = urlParts[urlParts.length - 2]; // Get hotel ID from URL
    const roomSlug = urlParts[urlParts.length - 1]; // Get room slug from URL

    const file = formData.get('file') as File; // Get the uploaded file

    if (!file) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer()); // Convert to buffer
    const roomDir = path.join(dataPath, id); // Create room directory if it doesn't exist
    fs.mkdirSync(roomDir, { recursive: true }); // Ensure room slug directory exists

    const newFilePath = path.join(roomDir, `${roomSlug}${path.extname(file.name)}`); // Create new file path

    fs.writeFileSync(newFilePath, buffer); // Write file to disk

    return NextResponse.json({ message: 'Room images uploaded successfully' });
}