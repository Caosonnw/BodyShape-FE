'use client'
import { useEffect } from 'react'

import About from '@/components/layouts/about'
import Banner from '@/components/layouts/banner'
import Certificate from '@/components/layouts/certificate'
import Gallery from '@/components/layouts/gallery'
import Header from '@/components/layouts/header'
import OurServices from '@/components/layouts/our-services'
import Subscribe from '@/components/layouts/subscribe'
import VideoBox from '@/components/layouts/videobox'
import { useLoadingStore } from '@/store/useLoadingStore'
import LoadingAnimation from '@/app/loading'

export default function Home() {
  useEffect(() => {
    useLoadingStore.getState().show()
    const timeout = setTimeout(() => {
      useLoadingStore.getState().hide()
    }, 1750)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <LoadingAnimation />
      <div className='page-content bg-white'>
        <Header />
        <Banner />
        <Certificate />
        <About />
        <OurServices />
        <VideoBox />
        <Gallery />
        <Subscribe />
      </div>
    </>
  )
}
