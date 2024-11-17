// types/hotel.ts
export interface Hotel {
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
    latitude: number;
    longitude: number;
    rooms: Array<{
        hotelSlug: string;
        roomSlug: string;
        roomImage: string;
        roomTitle: string;
        bedroomCount: number;
    }>;
}