'use client'

import { Play } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function VideoBox() {
  const [open, setOpen] = React.useState(false)
  return (
    <section className='content-inner-1 video-bx6 overlay-black-dark bg-img-fix relative'>
      <div className='container'>
        <div className='row'>
          <div className='col-xl-6 col-lg-7 col-md-8'>
            <h2 className='text-white title mb-[4px]'>
              It's Not <br /> <span className='text-primary'>Fitness</span> it's Life
            </h2>
            <Link href='/contact-us' className='btn btn-primary btn-skew'>
              <span>Join Now</span>
            </Link>
          </div>
          <div className='col-xl-6 col-lg-5 col-md-4 flex justify-center items-center'>
            <Link
              href='#'
              className='popup-youtube'
              onClick={(e) => {
                e.preventDefault()
                setOpen(true)
              }}
            >
              <span className='video-btn style-2 static popup-youtube'>
                <Play stroke='#f7244f' fill='#f7244f' />
              </span>
            </Link>
          </div>
        </div>
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
