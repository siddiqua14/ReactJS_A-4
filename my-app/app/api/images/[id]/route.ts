// app/api/images/[id]/route.ts
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
    const id = request.url.split('/').pop(); // Get hotel ID from URL

    const file = formData.get('file') as File; // Get the uploaded file

    if (!file) {
        return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer()); // Convert to buffer
    const newFilePath = path.join(dataPath, `${id}${path.extname(file.name)}`); // Create new file path

    fs.writeFileSync(newFilePath, buffer); // Write file to disk

    return NextResponse.json({ message: 'Hotel images uploaded successfully' });
}