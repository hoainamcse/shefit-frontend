import { Course } from "./course"

export type UserCourse = {
    id: number;
    user_id: number;
    course_id: number;
    created_at: string;
    updated_at: string;
    course: Course;
}