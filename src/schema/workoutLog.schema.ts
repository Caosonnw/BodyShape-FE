import { z } from 'zod'

export const userSchema = z.object({
  full_name: z.string(),
  email: z.string(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  avatar: z.string()
})

export const coachSchema = z.object({
  coach_id: z.number(),
  full_name: z.string(),
  email: z.string(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  avatar: z.string()
})

export const customerSchema = z.object({
  customer_id: z.number(),
  full_name: z.string(),
  email: z.string(),
  date_of_birth: z.string(),
  phone_number: z.string(),
  avatar: z.string()
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

export const workoutLogSchema = z.object({
  log_id: z.number().int().positive(),
  actual_sets: z.number().int().positive(),
  actual_reps: z.number().int().positive(),
  actual_weight: z.number().int().positive(),
  notes: z.string().optional(),
  workout_date: z.string(),

  coaches: coachSchema,
  customer: customerSchema,
  training_plans: trainingPlanSchema,
  exercise: exerciseSchema
})

export type WorkoutLogType = z.infer<typeof workoutLogSchema>

export const WorkoutLogListRes = z.object({
  data: z.array(workoutLogSchema),
  message: z.string(),
  statusCode: z.number().optional(),
  date: z.string().optional()
})

export type WorkoutLogListResType = z.infer<typeof WorkoutLogListRes>

export const CreateWorkoutLogSchema = z.object({
  actual_sets: z.number().int().positive(),
  actual_reps: z.number().int().positive(),
  actual_weight: z.number().int().positive(),
  notes: z.string().optional(),
  workout_date: z.string(),
  exercise_id: z.number().int().positive(),
  plan_exercise_id: z.number().int().positive(),
  customer_id: z.number().int().positive()
})

export type CreateWorkoutLogType = z.infer<typeof CreateWorkoutLogSchema>

export const UpdateWorkoutLogSchema = CreateWorkoutLogSchema

export type UpdateWorkoutLogType = z.infer<typeof UpdateWorkoutLogSchema>

export const DeleteWorkoutLogSchema = z.object({
  log_id: z.number().int().positive()
})

export type DeleteWorkoutLogType = z.infer<typeof DeleteWorkoutLogSchema>
