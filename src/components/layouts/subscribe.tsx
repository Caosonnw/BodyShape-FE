import React from 'react'

export default function Subscribe() {
  return (
    <section className='call-action style-1 footer-action relative'>
      <div className='container'>
        <div className='inner-content'>
          <div className='row justify-between items-center'>
            <div className='text-center text-lg-start col-xl-6 m-lg-b20'>
              <h2 className='title mb-[6px]'>Subscribe To Our Newsletter</h2>
              <p>It is a long established fact that a reader will distracted.</p>
            </div>
            <div className='text-center text-lg-end col-xl-6'>
              <form className='dzSubscribe'>
                <div className='dzSubscribeMsg'></div>
                <div className='form-group mb-0'>
                  <div className='input-group mb-0'>
                    <div className='input-skew '>
                      <input
                        name='dzEmail'
                        // required='required'
                        type='email'
                        className='form-control'
                        placeholder='Your Email Address'
                      />
                    </div>
                    <div className='input-group-addon'>
                      <button
                        name='submit'
                        // value='Submit'
                        // type='submit'
                        // onClick={(e) => e.preventDefault()}
                        className='btn btn-secondary btn-lg btn-skew'
                      >
                        <span>Subscribe Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
