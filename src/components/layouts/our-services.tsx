import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const serviceCards = [
  { icon: 'cardio-svgrepo-com.svg', title: 'Cardio' },
  { icon: 'chest-svgrepo-com.svg', title: 'Chest' }
]
const serviceCards2 = [
  { icon: 'muscle-svgrepo-com.svg', title: 'Muscles' },
  { icon: 'shoulder-svgrepo-com.svg', title: 'Shoulder' },
  { icon: 'run-svgrepo-com.svg', title: 'Full Body' }
]

export default function OurServices() {
  return (
    <section className='content-inner-2 service-wrapper1 relative'>
      <div className='container'>
        <div className='row items-end'>
          <div className='col-xl-4 left-grid'>
            <div className='row'>
              <div className='col-xl-12 col-lg-12'>
                <div className='section-head style-1'>
                  <h5 className='sub-title'>Our Services</h5>
                  <h2 className='title'>
                    Virtual <span> Training </span>
                  </h2>
                  <p className='pr-[50px]'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s
                  </p>
                </div>
              </div>
              {serviceCards.map((item, ind) => (
                <div className='col-xl-12 col-md-6' key={ind}>
                  <div className='icon-bx-wraper style-4 bg-white mb-[30px]'>
                    <div className='icon-bx icon-bg-white mb-[20px] items-center'>
                      <div className='icon-cell text-primary rounded-circle mr-[10px]'>
                        <img src={`/svg/${item.icon}`} alt={item.title} style={{ width: '30px', height: '30px' }} />
                      </div>
                      <h4 className='dz-title mb-[10px]'>
                        <Link href='/pricing'>{item.title}</Link>
                      </h4>
                    </div>
                    <div className='icon-content'>
                      <p className='mb-[15px]'>
                        Lorem Ipsum is simply dummy of the printing and typesetting industry. Lorem Ipsum has
                      </p>
                      <Link href='/pricing' className='read-more flex items-center'>
                        Read More <ArrowRight size={18} className='ml-[5px]' />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='col-xl-4 col-lg-6 col-md-6 mb-[30px] order-md-1 order-2'>
            <div className='trainer'>
              <img src={'/images/ourservices.png'} alt='' className='anm' data-speed-x='-2' data-speed-scale='-2' />
            </div>
          </div>
          <div className='col-xl-4 col-lg-6 col-md-6 right-grid order-md-2 order-1 pl-[50px]'>
            <div className='row'>
              {serviceCards2.map((item, index) => (
                <div className='col-xl-12 col-lg-12 ' key={index}>
                  <div className='icon-bx-wraper style-4 bg-white mb-[30px]'>
                    <div className='icon-bx icon-bg-white mb-[20px] items-center'>
                      <div className='icon-cell text-primary rounded-circle mr-[10px]'>
                        <img src={`/svg/${item.icon}`} alt={item.title} style={{ width: '30px', height: '30px' }} />
                      </div>
                      <h4 className='dz-title mb-[10px]'>
                        <Link href='/pricing'>{item.title}</Link>
                      </h4>
                    </div>
                    <div className='icon-content'>
                      <p className='mb-[15px]'>
                        Lorem Ipsum is simply dummy of the printing and typesetting industry. Lorem Ipsum has
                      </p>
                      <Link href='/pricing' className='read-more flex items-center'>
                        Read More <ArrowRight size={18} className='ml-[5px]' />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
