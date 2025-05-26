import About from '@/components/layouts/about'
import Banner from '@/components/layouts/banner'
import Certificate from '@/components/layouts/certificate'
import Gallery from '@/components/layouts/gallery'
import OurServices from '@/components/layouts/our-services'
import Subscribe from '@/components/layouts/subscribe'
import VideoBox from '@/components/layouts/videobox'

export default function Home() {
  return (
    <div className='page-content bg-white'>
      <Banner />
      <Certificate />
      <About />
      <OurServices />
      <VideoBox />
      <Gallery />
      <Subscribe />
    </div>
  )
}
