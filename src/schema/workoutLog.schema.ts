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

export const workoutLogSchema = z.object({
  log_id: z.number().int().positive(),
  actual_sets: z.number().int().positive(),
  actual_reps: z.number().int().positive(),
  actual_weight: z.number().int().positive(),
  notes: z.string().optional(),
  workout_date: z.string(),
  coaches: coachSchema,
  customers: customerSchema,
  training_plans: trainingPlanSchema,
  exercises: exerciseSchema
})

export type WorkoutLogType = z.infer<typeof workoutLogSchema>

export const WorkoutLogListRes = z.object({
  data: z.array(workoutLogSchema),
  message: z.string()
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
