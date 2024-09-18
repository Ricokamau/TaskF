import React from 'react'
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <div className='relative bg-purple-100 h-screen w-screen overflow-x-hidden '>
        <Navbar />
        {children}
      </div>
    </>
  )
}

export default MainLayout;