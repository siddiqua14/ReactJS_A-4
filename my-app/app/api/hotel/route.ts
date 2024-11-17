import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

interface Room {
    hotelSlug: string;
    roomSlug: string;
    roomImage: string[];
    roomTitle: string;
    bedroomCount: number;
}

interface RoomInput {
    hotelSlug: string;
    roomSlug: string;
    roomImage?: string | string[];
    roomTitle: string;
    bedroomCount: number;
}

interface Hotel {
    id: string;
    slug: string;
    title: string;
    description: string;
    images: string[];
    guestCount: number;
    bedroomCount: number;
    bathroomCount: number;
    amenities: string[];
    host: string;
    address: string;
    latitude?: number;
    longitude?: number;
    rooms: Room[];
}

const dataPath = path.join(process.cwd(), 'data');

export async function POST(req: NextRequest) {
    try {
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const body = await req.json();
        const {
            title,
            description,
            guestCount,
            bedroomCount,
            bathroomCount,
            images,
            amenities,
            host,
            address,
            rooms,
        } = body;

        if (!title || !description || !guestCount || !bedroomCount || !bathroomCount || !host || !address) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const newHotel: Hotel = {
            id: new Date().getTime().toString(),
            slug: slugify(title, { lower: true }),
            title,
            description,
            guestCount,
            bedroomCount,
            bathroomCount,
            images: Array.isArray(images) ? images : [],
            amenities: amenities || [],
            host,
            address,
            rooms: (rooms as RoomInput[] || []).map((room) => ({
                hotelSlug: room.hotelSlug,
                roomSlug: room.roomSlug,
                roomTitle: room.roomTitle,
                bedroomCount: room.bedroomCount,
                roomImage: Array.isArray(room.roomImage) ? room.roomImage : room.roomImage ? [room.roomImage] : []
            })),
        };

        const filePath = path.join(dataPath, `${newHotel.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(newHotel, null, 2));

        return NextResponse.json({ message: 'Hotel created successfully', hotel: newHotel }, { status: 201 });
    } catch (error) {
        console.error('Error creating hotel:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const hotels = getAllHotels();
        return NextResponse.json({ hotels }, { status: 200 });
    } catch (error) {
        console.error('Error fetching hotels:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// Helper function to get all hotels
function getAllHotels(): Hotel[] {
    if (!fs.existsSync(dataPath)) {
        return [];
    }

    const files = fs.readdirSync(dataPath);
    
    return files
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const content = fs.readFileSync(path.join(dataPath, file), 'utf-8');
            return JSON.parse(content);
        });
}



/*


// Define the Hotel interface with additional fields
interface Room {
    hotelSlug: string;
    roomSlug: string;
    roomImage: string;
    roomTitle: string;
    bedroomCount: number;
}

interface Hotel {
    id: string;
    slug: string;
    title: string;
    description: string;
    images?: string[];
    guestCount: number;
    bedroomCount: number;
    bathroomCount: number;
    amenities: string[];
    host: string;
    address: string;
    latitude?: number;  // Optional
    longitude?: number; // Optional
    rooms: Room[];
}

const dataPath = path.join(process.cwd(), 'data');

// Handle POST and GET requests
export async function POST(req: NextRequest) {
    try {
        // Ensure the data directory exists
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const body = await req.json();
        const {
            title,
            description,
            guestCount,
            bedroomCount,
            bathroomCount,
            images,
            amenities,
            host,
            address,
            rooms,
        } = body;

        // Validate required fields
        if (!title || !description || !guestCount || !bedroomCount || !bathroomCount || !host || !address) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Create a new hotel object
        const newHotel: Hotel = {
            id: new Date().getTime().toString(),
            slug: slugify(title, { lower: true }),
            title,
            description,
            guestCount,
            bedroomCount,
            bathroomCount,
            images: images || [],
            amenities: amenities || [],
            host,
            address,
            rooms: rooms || [],
        };

        // Write hotel data to a JSON file
        const filePath = path.join(dataPath, `${newHotel.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(newHotel, null, 2));

        return NextResponse.json({ message: 'Hotel created successfully', hotel: newHotel }, { status: 201 });
    } catch (error) {
        console.error('Error creating hotel:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params?: { idOrSlug?: string } }) {
    try {
        const { idOrSlug } = params || {};

        if (!idOrSlug) {
            return NextResponse.json({ message: 'Invalid ID or Slug' }, { status: 400 });
        }

        // Check by ID first
        const filePathById = path.join(dataPath, `${idOrSlug}.json`);
        if (fs.existsSync(filePathById)) {
            const hotelData = fs.readFileSync(filePathById, 'utf-8');
            const hotel = JSON.parse(hotelData);
            return NextResponse.json(hotel, { status: 200 });
        }

        // Check by slug if not found by ID
        const files = fs.readdirSync(dataPath);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const hotelData = fs.readFileSync(path.join(dataPath, file), 'utf-8');
                const hotel = JSON.parse(hotelData);
                if (hotel.slug === idOrSlug) {
                    return NextResponse.json(hotel, { status: 200 });
                }
            }
        }

        return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    } catch (error) {
        console.error('Error fetching hotels:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

*/