export class User {
    id: number;
    username: string;
    password: string;
    name: string;
    mobileno: string;
    workno: string;
    email: string;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}