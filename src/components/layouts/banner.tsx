'use client'

import { Play } from 'lucide-react'
import React from 'react'

export default function Banner() {
  const [open, setOpen] = React.useState(false)

  return (
    <section className='main-bnr-three'>
      <div className='banner-inner'>
        <h2 className='data-text'>
          <span>F</span>
          <span>I</span>
          <span>T</span>
          <span>N</span>
          <span>E</span>
          <span>S</span>
          <span>S</span>
        </h2>
        <div className='container'>
          <div className='banner-content'>
            <h1 className='title'>
              <span className='left anm wow fadeInUp'>KEEP</span>
              <span className='right anm wow fadeInUp'>TRAINING</span>
            </h1>
            <div className='row wow fadeInUp' data-wow-delay='0.4s'>
              <div className='col-4'>
                <div className='bottom-content'>
                  <p>
                    Whether your aim is to loose weight, tone up, gain weight we can put together Link gym programe or
                    recommend.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='banner-media media1 anm wow fadeInUp'>
            <img src='/images/human-banner.png' />
          </div>
        </div>
        <div className='video-bx5'>
          <a
            className='popup-youtube'
            href='/'
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            <img src='/images/banner-video.jpg' />
            <span className='video-btn popup-youtube'>
              <Play />
            </span>
          </a>
        </div>
        <img src='/images/background-banner-effect.png' className='move-1' />
      </div>

      {/* Modal popup video */}
      {open && (
        <div
          className='fixed inset-0 bg-black opacity-90 flex justify-center items-center z-50'
          onClick={() => setOpen(false)}
        >
          <div className='relative w-[90vw] max-w-3xl aspect-video z-30' onClick={(e) => e.stopPropagation()}>
            <iframe
              width='100%'
              height='100%'
              src='https://www.youtube.com/embed/klFfQVhA0n8?si=rAxXwSKCXFqTOhKz?autoplay=1'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>

            <button
              className='absolute -top-[10px] -right-[20px] text-white text-4xl font-bold cursor-pointer hover:text-[#f7244f] transition-all duration-300'
              onClick={() => setOpen(false)}
              aria-label='Close video popup'
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
