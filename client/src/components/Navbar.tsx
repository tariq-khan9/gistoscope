import React from 'react'

const Navbar = () => {
  return (
    <div className='fixed top-0 left-0 w-full flex text-white flex-row justify-between items-center bg-sky-700 p-4 px-20 text-[18px] font-semibold z-50'>
      <h1>Logo</h1>
      <div className='flex flex-row space-x-6'>
        <a href='/'>Home</a>
        <a href='#'>Node</a>
        <a href='#'>Tree Page</a>
      </div>
      <div>
        <button>Register</button>
      </div>
    </div>
  )
}

export default Navbar;
