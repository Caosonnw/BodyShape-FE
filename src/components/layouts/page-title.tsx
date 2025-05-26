import Link from 'next/link'
import React from 'react'

interface PageTitleProps {
  parentTitle: string
  activePage: string
}

export default function PageTitle({ parentTitle, activePage }: PageTitleProps) {
  return (
    <>
      <div className='dz-bnr-inr style-1 !text-center' style={{ backgroundImage: 'url(images/background-title.png)' }}>
        <div className='container'>
          <div className='dz-bnr-inr-entry'>
            <h1>{activePage}</h1>
            <nav aria-label='breadcrumb' className='breadcrumb-row'>
              <ul className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link href={'/'}>{parentTitle}</Link>
                </li>{' '}
                <li className='breadcrumb-item active' aria-current='page'>
                  {activePage}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
