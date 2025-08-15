import { z } from "zod";

export const userSchema = z.object({
  user_id: z.number(),
  full_name: z.string(),
  email: z.string(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  avatar: z.string(),
});

export const coachSchema = z.object({
  user_id: z.number(),
  specialization: z.string().nullable(),
  bio: z.string().nullable(),
  rating_avg: z.number().nullable(),
  users: userSchema,
});

export const customerSchema = z.object({
  user_id: z.number(),
  health_info: z.string().nullable(),
  goals: z.string().nullable(),
  users: userSchema,
});

export const trainingPlanSchema = z.object({
  plan_id: z.number().int().positive(),
  coach_id: z.number().int().positive(),
  customer_id: z.number().int().positive(),
  description: z.string().optional(),
  diet_plan: z.string().optional(),
  coaches: coachSchema,
  customers: customerSchema,
});

export type TrainingPlanType = z.infer<typeof trainingPlanSchema>;

export const TrainingPlanListRes = z.object({
  data: z.array(trainingPlanSchema),
  message: z.string(),
});

export type TrainingPlanListResType = z.infer<typeof TrainingPlanListRes>;

export const TrainingPlanRes = z.object({
  data: trainingPlanSchema,
  message: z.string(),
});

export type TrainingPlanResType = z.infer<typeof TrainingPlanRes>;

export const CreateTrainingPlanSchema = z.object({
  coach_id: z.number().int().positive(),
  customer_id: z.number().int().positive(),
  description: z.string().optional(),
  diet_plan: z.string().optional(),
});

export type CreateTrainingPlanType = z.infer<typeof CreateTrainingPlanSchema>;

export const UpdateTrainingPlanSchema = CreateTrainingPlanSchema;

export type UpdateTrainingPlanType = z.infer<typeof UpdateTrainingPlanSchema>;

export const DeleteTrainingPlanSchema = z.object({
  plan_id: z.number().int().positive(),
});

export type DeleteTrainingPlanType = z.infer<typeof DeleteTrainingPlanSchema>;
