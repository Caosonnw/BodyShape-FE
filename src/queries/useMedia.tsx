import { mediaServ } from '@/services/mediaServ'
import { useMutation } from '@tanstack/react-query'

export const useUploadAvatarMutation = () => {
  return useMutation({
    mutationFn: ({ user_id, formData }: { user_id: number; formData: FormData }) =>
      mediaServ.uploadAvatar(user_id, formData)
  })
}

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: mediaServ.uploadMedia
  })
}

export const useUploadVideoExerciseMutation = () => {
  return useMutation({
    mutationFn: mediaServ.uploadVideoExercise
  })
}
