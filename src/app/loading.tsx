'use client'
import Lottie from 'lottie-react'
import LoadingAnimationBodyShape from '../../public/animations/Loading-Animation.json'
import { useLoadingStore } from '@/store/useLoadingStore'

export default function LoadingAnimation() {
  const isLoading = useLoadingStore((state) => state.isLoading)

  if (!isLoading) return null
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white z-[9999]'>
      <div className='flex items-center justify-center h-full'>
        <Lottie loop animationData={LoadingAnimationBodyShape} style={{ width: 300, height: 300 }} />
      </div>
    </div>
  )
}
