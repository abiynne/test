export class Project {
    id: number;
    name: string;

    constructor(data: Partial<Project>) {
        Object.assign(this, data);
    }
}