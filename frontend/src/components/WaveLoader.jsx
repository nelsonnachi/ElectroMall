import React from 'react'

const WaveLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-violet-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-violet-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}

export default WaveLoader