import { z } from 'zod'

export const userSchema = z.object({
  user_id: z.number(),
  full_name: z.string(),
  email: z.string(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  avatar: z.string()
})

export const coachSchema = z.object({
  user_id: z.number(),
  specialization: z.string().nullable(),
  bio: z.string().nullable(),
  rating_avg: z.number().nullable(),
  users: userSchema
})

export const customerSchema = z.object({
  user_id: z.number(),
  health_info: z.string().nullable(),
  goals: z.string().nullable(),
  users: userSchema
})

export const trainingPlanSchema = z.object({
  plan_id: z.number().int().positive(),
  description: z.string().optional(),
  diet_plan: z.string().optional()
})

export const exerciseSchema = z.object({
  exercise_id: z.number().int().positive(),
  name: z.string(),
  description: z.string().optional(),
  muscleGroup: z.string().optional(),
  equipment: z.string().optional(),
  videoUrl: z.string().optional()
})

export const planExerciseSchema = z.object({
  plan_exercise_id: z.number().int().positive(),
  day_number: z.number().int().positive(),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().int().positive(),
  rest_time: z.number().int().positive(),
  coaches: coachSchema,
  customers: customerSchema,
  training_plans: trainingPlanSchema,
  exercises: exerciseSchema
})

export type PlanExerciseType = z.infer<typeof planExerciseSchema>

export const PlanExerciseListRes = z.object({
  data: z.array(planExerciseSchema),
  message: z.string()
})

export type PlanExerciseListResType = z.infer<typeof PlanExerciseListRes>

export const PlanExerciseRes = z.object({
  data: planExerciseSchema,
  message: z.string()
})

export type PlanExerciseResType = z.infer<typeof PlanExerciseRes>

export const CreatePlanExerciseSchema = z.object({
  day_number: z.number().int().positive(),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  weight: z.number().int().positive(),
  rest_time: z.number().int().positive(),
  exercise_id: z.number().int().positive(),
  plan_id: z.number().int().positive()
})

export type CreatePlanExerciseType = z.infer<typeof CreatePlanExerciseSchema>

export const UpdatePlanExerciseSchema = CreatePlanExerciseSchema

export type UpdatePlanExerciseType = z.infer<typeof UpdatePlanExerciseSchema>

export const DeletePlanExerciseSchema = z.object({
  plan_exercise_id: z.number().int().positive()
})

export type DeletePlanExerciseType = z.infer<typeof DeletePlanExerciseSchema>
