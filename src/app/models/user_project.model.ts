export class User_Project {
    id: number;
    user_id: number;
    project_id: number;

    constructor(data: Partial<User_Project>) {
        Object.assign(this, data);
    }
}