// model/hotel.types.ts
export interface Room {
    hotelSlug: string;
    roomSlug: string;
    roomImage: string[];
    roomTitle: string;
    bedroomCount: number;
}

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
    rooms: Room[];
}