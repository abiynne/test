export class Holidays {
    id: number;
    date: string; // Assuming you are using a string for date representation
    description: string;

    constructor(data: Partial<Holidays>) {
        Object.assign(this, data);
    }
}