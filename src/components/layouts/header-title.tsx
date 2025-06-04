'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuListArray } from '@/common/MenuList'

const HeaderTitle = () => {
  const [headerFix, setHeaderFix] = useState(false)
  const [activeMenu, setActiveMenu] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState('')
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setHeaderFix(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const mainMenu = document.getElementById('OpenMenu')
    if (mainMenu) {
      mainMenu.classList.toggle('show', sidebarOpen)
    }
    if (!sidebarOpen) {
      // đóng menu con khi sidebar đóng
      setOpenSubMenu(null)
    }
  }, [sidebarOpen])

  const handleMenuHover = (menuTitle: string) => {
    if (!sidebarOpen) {
      setHoveredMenu(menuTitle)
    }
  }

  const handleMenuLeave = () => {
    if (!sidebarOpen) {
      setHoveredMenu('')
    }
  }

  const toggleSubMenu = (menuTitle: string) => {
    if (openSubMenu === menuTitle) {
      setOpenSubMenu(null)
    } else {
      setOpenSubMenu(menuTitle)
    }
  }

  useEffect(() => {
    MenuListArray.forEach((item) => {
      if (item.to === pathname) {
        setActiveMenu(item.title)
      }
      item.content?.forEach((sub) => {
        if (sub.to === pathname) {
          setActiveMenu(item.title)
        }
      })
    })
  }, [pathname])

  return (
    <header className='site-header mo-left header header-transparent style-1'>
      <div className={`sticky-header main-bar-wraper navbar-expand-lg ${headerFix ? 'is-fixed' : ''}`}>
        <div className='main-bar clearfix'>
          <div className='container clearfix'>
            <div className='box-header clearfix relative'>
              <div className='logo-header mostion logo-dark'>
                <Link href='/'>
                  <img src='/images/logo-color.png' alt='logo' />
                </Link>
              </div>

              <button
                className={`navbar-toggler navicon justify-content-end ${sidebarOpen ? 'open' : 'collapsed'}`}
                type='button'
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div className='extra-nav'>
                <div className='extra-cell'>
                  <button
                    id='quik-search-btn'
                    type='button'
                    className='header-search-btn !flex !justify-center !items-center'
                  >
                    <Search width={18} strokeWidth={3} />
                  </button>
                  <Link href='/appointment' className='btn btn-primary btn-skew appointment-btn !ml-[20px]'>
                    <span>Appointment</span>
                  </Link>
                </div>
              </div>

              <div
                id='navbarNavDropdown'
                className={`header-nav navbar-collapse justify-content-end ${sidebarOpen ? 'show' : ''}`}
              >
                <div className='logo-header mostion logo-dark'>
                  <Link href='/'>
                    <img src='/images/logo-color.png' alt='logo' />
                  </Link>
                </div>
                <ul className='nav navbar-nav navbar navbar-left'>
                  {MenuListArray.map((item, index) => {
                    const isActive = item.title === activeMenu
                    const hasSubmenu = item.content && item.content.length > 0
                    const isSubmenuOpen = openSubMenu === item.title

                    return (
                      <li
                        key={index}
                        className={`${item.classChange} ${isActive ? 'active' : ''} ${isSubmenuOpen ? 'open' : ''}`}
                        onMouseEnter={() => handleMenuHover(item.title)}
                        onMouseLeave={handleMenuLeave}
                      >
                        {hasSubmenu ? (
                          <>
                            <a
                              href='#'
                              className='item-drop-navbar !flex items-center justify-center'
                              onClick={(e) => {
                                e.preventDefault()
                                if (sidebarOpen) {
                                  toggleSubMenu(item.title)
                                }
                              }}
                            >
                              {item.title}
                              <ChevronDown width={17} strokeWidth={3} className='hidden xl:block' />
                            </a>

                            {(sidebarOpen ? isSubmenuOpen : hoveredMenu === item.title) && (
                              <ul className='sub-menu animate__animated animate__fadeInUp animate__faster'>
                                {item.content.map((sub, subIndex) => (
                                  <li key={subIndex}>
                                    <Link href={sub.to}>{sub.title}</Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link href={item.to || '/'}>{item.title}</Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderTitle
