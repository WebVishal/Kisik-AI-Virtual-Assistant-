'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { navLinks} from '@/constants'
import { usePathname } from 'next/navigation'

const Sidebar = () => {

    const pathname = usePathname()

    return (
        <aside className='sidebar'>
            <div className='flex size-full flex-col gap-4'>
                <Link href="/" className='sidebar-logo'>
                    {/* <Image src={logo} alt='logo' width={180} height={80} /> */}
                </Link>
                <nav className='sidebar-nav'>
                    <ul className='sidebar-nav_elements'>
                        {
                            navLinks.slice(0, 6).map((link, index) => {
                                const isActive = link.route === pathname
                                return (
                                    <li key={index}
                                        className={`sidebar-nav_elements group 
                                        ${isActive ? 'bg-purple-gradient text-white'
                                                : 'text-gray-700'
                                            }`
                                        }>
                                        <Link href={link.route} className='sidebar-link'>
                                            <Image
                                                src={link.icon}
                                                alt='logo'
                                                width={24}
                                                height={24}
                                                className={`${isActive && 'brightness-200'}`}
                                            />
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>


                    <ul className='sidebar-nav_elements'>
                        {
                            navLinks.slice(6).map((link, index) => {
                                const isActive = link.route === pathname
                                return (
                                    <li key={index}
                                        className={`sidebar-nav_elements group 
                                        ${isActive ? 'bg-purple-gradient text-white'
                                                : 'text-gray-700'
                                            }`
                                        }>
                                        <Link href={link.route} className='sidebar-link'>
                                            <Image
                                                src={link.icon}
                                                alt='logo'
                                                width={24}
                                                height={24}
                                                className={`${isActive && 'brightness-200'}`}
                                            />
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </aside>
    )
}

export default Sidebar