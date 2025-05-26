import React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

const serviceList = [
  { title: 'Personal Training' },
  { title: 'Body Building' },
  { title: 'Boxing Classess' },
  { title: 'Cardio And More' },
  { title: 'Personal Training' },
  { title: 'Body Building' },
  { title: 'Boxing Classess' },
  { title: 'Cardio And More' }
]

export default function About() {
  return (
    <section className='about-bx4 content-inner-2'>
      <div className='container'>
        <div className='row items-center'>
          <div className='col-lg-6'>
            <div className='dz-media pr-[20px]'>
              <div className='image-box'>
                <img src={'images/about-pics-1.jpg'} alt='' width={330} height={330} />
                <div className='tag'>
                  <h2>2 0</h2>
                  <h5>year experience</h5>
                </div>
              </div>
              <img src={'images/about-pics-2.jpg'} alt='' width={550} height={550} />
            </div>
          </div>

          <div className='col-lg-6 about-content max-lg:mt-[40px]'>
            <div className='section-head style-1 relative'>
              <h5 className='sub-title'>WAKE UP IT’S TIME</h5>
              <h2 className='title mb-0'>
                Take The <span> Action </span>
              </h2>
              <p className='description mb-[10px]'>Start your training with our Professional Trainers</p>
            </div>
            <p className='text-[#666]'>
              Nunc vulputate urna ut erat posuere accumsan. Curabitur ut commodo mauris, ac volutpat dui. Nullam eget
              enim ut mi bibendum ultrices. Pellentesque non feugia.
            </p>
            <ul className='pr-list list-italic mt-[30px] mb-[35px]'>
              {serviceList.map((item, ind) => (
                <li key={ind}>
                  <Check />
                  {item.title}
                </li>
              ))}
            </ul>
            <Link href='/about-us' className='btn btn-skew btn-lg btn-primary'>
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
