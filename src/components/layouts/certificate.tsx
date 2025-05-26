'use client'

import React from 'react'
import CountUp from 'react-countup'

export default function Certificate() {
  return (
    <section className='certificate relative'>
      <div className='container max-w-[1200px]'>
        <div className='row items-start'>
          <div className='md:w-10/12 lg:w-8/12 w-full'>
            <div className='row counter-inner-3 wow fadeInUp' data-wow-delay='0.6s'>
              <div className='col-4 text-center'>
                <div className='counter-box'>
                  <h3 className='title counter'>
                    <CountUp start={0} end={3} duration={7} />
                  </h3>
                  <p>
                    Certificate
                    <br />
                    Trainers
                  </p>
                </div>
              </div>
              <div className='col-4 text-center'>
                <div className='counter-box'>
                  <h3 className='title counter'>
                    <CountUp start={0} end={8} duration={6} />
                  </h3>
                  <p>
                    Years
                    <br />
                    Experience
                  </p>
                </div>
              </div>
              <div className='col-4 text-center'>
                <div className='counter-box'>
                  <h3 className='title counter'>
                    <CountUp start={0} end={47} duration={5} />
                  </h3>
                  <p>
                    Local
                    <br />
                    Clients
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full hidden md:block md:w-2/12 lg:w-4/12 pt-2'>
            <div className='counter-media move-1'>
              <img src='/images/certificate-effect.png' />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
