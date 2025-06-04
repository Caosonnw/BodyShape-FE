'use client'
import React, { useState, useEffect } from 'react'
import { ChevronDown, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuListArray } from '@/common/MenuList'
import { useAppContext } from '@/context/AppProvider'

const Header = () => {
  const [headerFix, setHeaderFix] = useState(false)
  const [activeMenu, setActiveMenu] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState('')
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  // State mới cho phần User menu dropdown
  const [hasAccessToken, setHasAccessToken] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const [userMenuMobileOpen, setUserMenuMobileOpen] = useState(false)

  const pathname = usePathname()

  const { role } = useAppContext()

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

  // Kiểm tra accessToken lúc component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setHasAccessToken(!!token)
  }, [])

  // Xử lý hover để hiện menu user dropdown
  const handleUserMouseEnter = () => setUserMenuOpen(true)
  const handleUserMouseLeave = () => setUserMenuOpen(false)

  return (
    <header className='site-header mo-left header header-transparent style-2'>
      <div className={`sticky-header main-bar-wraper navbar-expand-lg ${headerFix ? 'is-fixed' : ''}`}>
        <div className='main-bar clearfix'>
          <div className='container clearfix'>
            <div className='logo-header mostion logo-light'>
              <Link href='/'>
                <img src='/images/logo.png' alt='logo' />
              </Link>
            </div>
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

            {/* User icon với dropdown menu */}
            <div
              className='user-dropdown-menu extra-nav pl-[25px] relative'
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
            >
              <div className='extra-cell cursor-pointer flex items-center bg-[#fff] w-[42px] h-[42px] px-3 py-3 hover:bg-[#f7244f] hover:text-white transition-colors duration-300'>
                <User />
              </div>
              {userMenuOpen && (
                <ul className='user-dropdown animate__animated animate__fadeInUp animate__faster text-white text-left'>
                  {hasAccessToken ? (
                    <>
                      {['OWNER', 'ADMIN', 'COACH'].includes(role ?? '') && (
                        <li>
                          <Link href='/dashboard'>Dashboard</Link>
                        </li>
                      )}
                      {role === 'CUSTOMER' && (
                        <li>
                          <Link href='/profile'>Profile</Link>
                        </li>
                      )}
                      <li>
                        <Link href='/logout'>Logout</Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href='/login'>Login</Link>
                      </li>
                      <li>
                        <Link href='/register'>Register</Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>

            <div className='extra-nav'>
              <div className='extra-cell'>
                <Link href='/appointment' className='btn btn-skew appointment-btn'>
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
                {/* User menu mobile nên nằm ở đây */}
                <li className={`sm:hidden block nav-item ${userMenuMobileOpen ? 'active' : ''}`}>
                  <a
                    href='#'
                    className='nav-link !flex items-center'
                    onClick={(e) => {
                      e.preventDefault()
                      setUserMenuMobileOpen(!userMenuMobileOpen)
                    }}
                  >
                    <User className='mr-2' />
                    <ChevronDown
                      width={17}
                      strokeWidth={3}
                      className={`transition-transform duration-300 ${userMenuMobileOpen ? 'rotate-180' : ''}`}
                    />
                  </a>
                  {userMenuMobileOpen && (
                    <ul className='sub-menu pl-4 mt-2'>
                      {hasAccessToken ? (
                        <>
                          {['OWNER', 'ADMIN', 'COACH'].includes(role ?? '') && (
                            <li>
                              <Link href='/dashboard'>Dashboard</Link>
                            </li>
                          )}
                          {role === 'CUSTOMER' && (
                            <li>
                              <Link href='/profile'>Profile</Link>
                            </li>
                          )}
                          <li>
                            <Link href='/logout'>Logout</Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link href='/login'>Login</Link>
                          </li>
                          <li>
                            <Link href='/register'>Register</Link>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </li>

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
    </header>
  )
}

export default Header
