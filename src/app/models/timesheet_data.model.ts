export class Timesheet_Data {
    id: number;
    project_id: number;
    user_id: number;
    hours_1: number;
    hours_2: number;
    hours_3: number;
    hours_4: number;
    hours_5: number;
    hours_6: number;
    hours_7: number;

    constructor(data: Partial<Timesheet_Data>) {
        Object.assign(this, data);
    }
}