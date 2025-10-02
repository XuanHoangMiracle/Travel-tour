import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 bg-amber-100">
        <Link to='/admin'>
                <img src={assets.logo} alt="logo" className="h-14" />
        </Link>
        <UserButton/>
    </div>
  )
}

export default Navbar