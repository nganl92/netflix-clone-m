import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authUser'

const SignUpPage = () => {
    const { searchParams } = new URL(document.location)
    const emailValue = searchParams.get('email')
    
    const [email, setEmail]  = useState("")
    const [userName, setUserName] =useState("")
    const [password, setPassword] = useState("")

    const { signup } = useAuthStore();

    const handlerSignUp = (e) => {
      e.preventDefault();
      signup({ email, username: userName, password });
    };



  return (
    <div className='h-screen w-full hero-bg'>
      <header className='max-w-6xl mx-auto fkex items-center justify-between p-4'>
         <Link to="/">
         <img src="/netflix-logo.png" alt="logo" className='w-52' />
         </Link>

         <div className='flex justify-center items-center mt-20 mx-3'>
            <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
                <h1 className='text-center text-white text-2xl font-bold mb-4'>Sign Up</h1>
                          
                <form className='space-y-4' onSubmit={handlerSignUp}>
                    <div>
                        <label htmlFor="email" className='text-sm font-medium text-gray-300 block'>
                            Email
                        </label>
                        <input 
                            onChange={(e) =>  setEmail(e.target.value)} 
                            type="email"
                            className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white
                            focus:outline-none focus:ring'
                            placeholder='you@example.com'
                            id='email' 
                            value={emailValue ? emailValue : email}
                            />
                            
                    </div>

                    <div>
                        <label htmlFor="username" className='text-sm font-medium text-gray-300 block'>
                            Name
                        </label>
                        <input type="text"
                            className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white
                            focus:outline-none focus:ring'
                            placeholder='johndoe'
                            id='username' 
                            onChange={(e) =>  setUserName(e.target.value)} 
                            value={userName}

                            />

                    </div>

                    <div>
                        <label htmlFor="password" className='text-sm font-medium text-gray-300 block'>
                            Password
                        </label>
                        <input type="password"
                            className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white
                            focus:outline-none focus:ring'
                            placeholder='•••••••••••••'
                            id='password' 
                            onChange={(e) =>  setPassword(e.target.value)} 
                            value={password}

                            />
                    </div>

                    <button type="submit" className='w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700'>
                        Sign Up
                    </button>
                </form>
                <div className="text-center text-gray-400">
                    Already a member? {" "}
                    <Link to={'/login'} className='text-red-500 hover:underline'>
                        Sign In
                    </Link>
                </div>
            </div>
         </div>
      </header>
    </div>
  )
}

export default SignUpPage
