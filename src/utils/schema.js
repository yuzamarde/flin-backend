import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5)
})
export const signInSchema = signUpSchema.omit({ name: true })


// Doctor Schema
export const doctorSchema = z.object({
    name: z.string().min(3, "Doctor name must be at least 3 characters long"),
});

// Schedule Schema
export const scheduleSchema = z.object({
    doctor: z.string().min(24, "Invalid doctor ID"),
    day: z.enum(["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]),
    time_start: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    time_finish: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    quota: z
        .preprocess((val) => Number(val), z.number().min(1, "Quota must be at least 1")),
    status: z
        .preprocess((val) => val === "true" || val === true, z.boolean())
        .default(true),
    date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2} s\/d \d{4}-\d{2}-\d{2}$/,
            "Invalid date range format (YYYY-MM-DD s/d YYYY-MM-DD)"
        )
        .refine((value) => {
            const [startDate, endDate] = value.split(" s/d ");
            return new Date(startDate) <= new Date(endDate);
        }, "End date must be after start date"),
});


export const singleScheduleSchema = z.object({
    doctor: z.string().min(24, "Invalid doctor ID"),
    day: z.enum(["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    time_start: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    time_finish: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    quota: z
        .preprocess((val) => Number(val), z.number().min(1, "Quota must be at least 1")),
    status: z
        .preprocess((val) => val === "true" || val === true, z.boolean())
        .default(true),
});