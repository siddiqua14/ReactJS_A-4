// pages/api/hotel/[idOrSlug].ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data');

export async function GET(req: NextRequest, { params }: { params: { idOrSlug: string } }) {
    try {
        const { idOrSlug } = params;

        // Try to find hotel by ID first
        const hotelById = getHotelById(idOrSlug);
        if (hotelById) {
            return NextResponse.json(hotelById, { status: 200 });
        }

        // If not found by ID, try to find by slug
        const hotelBySlug = getHotelBySlug(idOrSlug);
        if (hotelBySlug) {
            return NextResponse.json(hotelBySlug, { status: 200 });
        }

        // If neither ID nor slug found, return a 404 response
        return NextResponse.json({ message: `Hotel not found for ID/slug: ${idOrSlug}` }, { status: 404 });
        
    } catch (error) {
        console.error('Error fetching hotel:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// Helper function to get hotel by ID
function getHotelById(id: string): any | null {
    const filePath = path.join(dataPath, `${id}.json`);
    
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }
    
    return null; // Return null if not found
}

// Helper function to get hotel by slug
function getHotelBySlug(slug: string): any | null {
    const hotels = getAllHotels();
    
    return hotels.find(hotel => hotel.slug === slug) || null; // Return hotel or null if not found
}

// Helper function to get all hotels (reused)
function getAllHotels(): any[] {
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