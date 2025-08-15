import z from 'zod'

export const ExerciseSchema = z.object({
  exercise_id: z.number().int().positive(),
  exercise_name: z.string().min(1, { message: 'Exercise name is required' }),
  description: z.string().optional(),
  muscle_group: z.string().optional(),
  equipment_needed: z.string().optional(),
  video_url: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export type ExerciseType = z.infer<typeof ExerciseSchema>

export const ExerciseListRes = z.object({
  data: z.array(ExerciseSchema),
  message: z.string()
})

export type ExerciseListResType = z.infer<typeof ExerciseListRes>

export const ExerciseRes = z.object({
  data: ExerciseSchema,
  message: z.string()
})

export type ExerciseResType = z.infer<typeof ExerciseRes>

export const CreateExerciseSchema = z.object({
  exercise_name: z.string().min(1, { message: 'Exercise name is required' }),
  description: z.string().optional(),
  muscle_group: z.string().optional(),
  equipment_needed: z.string().optional(),
  video_url: z.string().optional()
})

export type CreateExerciseType = z.infer<typeof CreateExerciseSchema>

export const UpdateExerciseSchema = CreateExerciseSchema

export type UpdateExerciseType = z.infer<typeof UpdateExerciseSchema>

export const DeleteExerciseSchema = z.object({
  exercise_id: z.number().int().positive()
})

export type DeleteExerciseType = z.infer<typeof DeleteExerciseSchema>
