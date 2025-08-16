import type { THEMES_VALUES } from '@/constants/theme.const'

export type TTheme = (typeof THEMES_VALUES)[number]

export type ApiExercise = {
  exercise_id: number
  name: string
  description?: string | null
  muscleGroup?: string | null
  equipment?: string | null
  videoUrl?: string | null
}

export type ApiItem = {
  plan_exercise_id: number
  day_number: number
  sets: number
  reps: number
  weight: number
  rest_time: number
  training_plans?: { plan_id: number; description?: string | null; diet_plan?: string | null }
  exercises?: ApiExercise
  exercise?: ApiExercise
}

export type UIItem = {
  planExc_id: number
  day_number: number
  sets: number
  reps: number
  weight: number
  rest_time: number
  plan_id?: number
  customer_id?: number
  exercise: {
    exercise_id: number
    exercise_name: string
    muscle_group: string | null
    video_url: string | null
    equipment: string | null
    description: string | null
  }
}

export type WorkoutLog = {
  log_id: number
  actual_sets: number
  actual_reps: number
  actual_weight: number
  notes?: string
  workout_date: string
  training_plans?: { plan_id: number }
  exercises?: { exercise_id: number }
  customers?: { users?: { full_name: string; email: string } }
}
