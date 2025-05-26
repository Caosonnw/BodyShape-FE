'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SVGICON } from '@/components/constants/theme'
import { ArrowRight, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  const update = new Date()

  return (
    <footer className='site-footer style-1 footer-action !bg-[#232323] bg-dark'>
      <div className='footer-top'>
        <div className='container'>
          <div className='row'>
            {/* Logo & Social */}
            <div className='col-xl-3 col-md-12'>
              <div className='widget widget_about'>
                <div className='footer-logo logo-white'>
                  <Link href='/'>
                    <Image
                      className='select_logo_white'
                      src={'/images/logo-footer.png'}
                      alt='Logo'
                      width={200}
                      height={50}
                    />
                  </Link>
                </div>
                <p>A Wonderful Serenity Has Taken Possession Of My Entire Soul, Like These.</p>
                <h6 className='mb-[15px]'>Our Socials</h6>
                <div className='dz-social-icon style-1'>
                  <ul>
                    <li>
                      <a href='https://www.facebook.com/' target='_blank' rel='noreferrer'>
                        <Facebook />
                      </a>
                    </li>
                    <li>
                      <a href='https://twitter.com/?lang=en' target='_blank' rel='noreferrer'>
                        <Twitter />
                      </a>
                    </li>
                    <li>
                      <a href='https://www.instagram.com/?hl=en' target='_blank' rel='noreferrer'>
                        <Instagram />
                      </a>
                    </li>
                    <li>
                      <a href='https://www.linkedin.com/feed/' target='_blank' rel='noreferrer'>
                        <Linkedin />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Blog Posts */}
            <div className='col-xl-3 col-md-4 wow fadeInUp'>
              <div className='widget recent-posts-entry'>
                <h4 className='footer-title'>Blog Posts</h4>
                <div className='widget-post-bx'>
                  <div className='widget-post clearfix'>
                    <div className='dz-info'>
                      <h6 className='title'>
                        <Link href='/blog-details'>The Philosophy Of Best Fitness.</Link>
                      </h6>
                      <span className='post-date'> JUNE 18, 2023</span>
                    </div>
                  </div>
                  <div className='post-separator'></div>
                  <div className='widget-post clearfix'>
                    <div className='dz-info'>
                      <h6 className='title'>
                        <Link href='/blog-details'>Best 50 Tips For Heavy Fitness.</Link>
                      </h6>
                      <span className='post-date'> AUGUST 22, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className='col-xl-3 col-md-4 wow fadeInUp'>
              <div className='widget widget_locations'>
                <h4 className='footer-title'>Locations</h4>
                <div className='clearfix'>
                  <h6 className='mb-2'>Washington</h6>
                  <p className='mb-2'>1559 Alabama Ave SE, DC 20032, Washington, USA</p>
                  {SVGICON.map}
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className='col-xl-3 col-md-4 wow fadeInUp'>
              <div className='widget widget_working'>
                <h4 className='footer-title'>Working Hours</h4>
                <ul>
                  <li>
                    <span className='days'>Monday – Friday:</span>
                    <span className='time'>
                      <Link href='/schedule'>07:00 – 21:00</Link>
                    </span>
                  </li>
                  <li>
                    <span className='days'>Saturday:</span>
                    <span className='time'>
                      <Link href='/schedule'>07:00 – 16:00</Link>
                    </span>
                  </li>
                  <li>
                    <span className='days'>Sunday Closed:</span>
                  </li>
                </ul>
                <Link href='/schedule' className='btn-link  flex items-center text-[#f7244f]'>
                  More Here <ArrowRight size={20} stroke='#f7244f' className='ml-[10px]' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='container'>
        <div className='footer-bottom'>
          <div className='text-center'>
            <span className='copyright-text'>
              Copyright © {update.getFullYear()}{' '}
              <a href='#' rel='noreferrer' target='_blank' className='text-[#f7244f]'>
                Huflit Student
              </a>
              . All rights reserved.
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Images */}
      <Image className='svg-shape-1 rotate-360' src={'/images/circle-big.svg'} alt='' width={650} height={500} />
      <Image className='svg-shape-2 rotate-360' src={'/images/circle-big.svg'} alt='' width={660} height={500} />
    </footer>
  )
}

export default Footer
