'use client'

import React from 'react'
import Link from 'next/link'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import { Plus } from 'lucide-react'

const lightimg = [
  { title: 'Endurance', img: '/images/gallery-1.jpg' },
  { title: 'Conditioning', img: '/images/gallery-2.jpg' }
]
const lightimg2 = [
  { title: 'Yoga', img: '/images/gallery-3.jpg' },
  { title: 'Performance', img: '/images/gallery-4.jpg' }
]
const progressDetails = [
  { title: 'SPECIFIC PREPARATION', process: '40%' },
  { title: 'NUTRITION SKILLS', process: '80%' },
  { title: '75 CARDIO CONDITIONING', process: '60%' }
]
export default function Gallery() {
  return (
    <section className='content-inner relative overflow-hidden'>
      <div className='container'>
        <LightGallery
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          elementClassNames='row lightgallery'
          controls={true}
          selector='.lg-show'
        >
          {lightimg.map((item, ind) => (
            <a
              data-exthumbimage={item.img}
              data-src={item.img}
              className='col-lg-4 col-sm-6 mb-[30px] lg-show'
              key={ind}
            >
              <div className='ovarlay-box style-1 gallery'>
                <img src={item.img} alt={item.title} />
                <div className='content'>
                  <div className='ovarlay-info'>
                    <Link href={item.img}>
                      <span className='view-btn lightimg flex items-center justify-center'>
                        <Plus strokeWidth={2.5} size={35} stroke='#f7244f' fill='#f7244f' className='mb-[10px]' />
                      </span>
                    </Link>
                    <Link href='/services-motivation' className='title'>
                      <span>{item.title}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </a>
          ))}
          <div className='col-lg-4 col-sm-6 hidden d-lg-block relative '>
            <h2 className='bg-data-text style-3'>
              <span>F</span>
              <span>I</span>
              <span>T</span>
              <span>N</span>
              <span>E</span>
              <span>S</span>
              <span>S</span>
            </h2>
          </div>
          <div className='col-lg-4 col-sm-6 !self-center mb-[30px]'>
            <div className='content-box h-full'>
              <div className='section-head style-1 m-0'>
                <h2 className='title'>
                  My Fields Of<span> Expertise</span>
                </h2>
                <p className='p-big mb-[25px]'>Loren ipsum Dolor Sit Amet, Consectelur Adipiscing Elit. Suspendisse</p>
              </div>
              <Link href='/about-us' className='btn btn-skew btn-primary'>
                <span> About Us </span>
              </Link>
            </div>
          </div>
          {lightimg2.map((item, ind) => (
            <a
              href={item.img}
              data-src={item.img}
              data-exthumbimage={item.img}
              className='col-lg-4 col-sm-6 mb-[30px] overlay-content-box lg-show'
              key={ind}
            >
              <div className='ovarlay-box style-1'>
                <img src={item.img} alt={item.title} />
                <div className='content'>
                  <div className='ovarlay-info'>
                    <span className='view-btn lightimg flex items-center justify-center'>
                      <Plus strokeWidth={2.5} size={35} stroke='#f7244f' fill='#f7244f' className='mb-[10px]' />
                    </span>
                    <Link href='/services-health-coach' className='title'>
                      <span>{item.title}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </a>
          ))}
          <div className='col-lg-8 col-sm-12 mb-[30px] order-2 order-lg-0  '>
            <div className='progress-bar-wrapper1'>
              {progressDetails.map((item, indexKey) => (
                <div className='progress-bx style-1' key={indexKey}>
                  <div className='progress-head'>
                    <h6 className='title'>{item.title}</h6>
                    <span>{item.process}</span>
                  </div>
                  <div className='progress'>
                    <div className='progress-bar bg-primary' style={{ width: `${item.process}` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            data-exthumbimage={'/images/gallery-5.jpg'}
            data-src={'/images/gallery-5.jpg'}
            className='col-lg-4 col-sm-6 mb-[30px] lg-show'
          >
            <div className='ovarlay-box style-1'>
              <img src={'/images/gallery-5.jpg'} alt={'Strength'} />
              <div className='content'>
                <div className='ovarlay-info'>
                  <Link href='#'>
                    <span
                      data-exthumbimage={'/images/gallery-5.jpg'}
                      data-src={'/images/gallery-5.jpg'}
                      className='view-btn lightimg flex items-center justify-center'
                    >
                      <Plus strokeWidth={2.5} size={35} stroke='#f7244f' fill='#f7244f' className='mb-[10px]' />
                    </span>
                  </Link>
                  <Link href='/services-fat-loss' className='title'>
                    <span>Strength</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </LightGallery>
      </div>
    </section>
  )
}
