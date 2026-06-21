import React from 'react'

const OrbitLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="relative w-16 h-16">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-l-indigo-500 animate-spin blur-[2px]"></div>
        {/* Inner sharp ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-l-indigo-500 animate-spin"></div>
      </div>
    </div>
  )
}

export default OrbitLoader