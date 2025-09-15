import React from 'react'

export function Wraper({children}) {
  return (
    <div className='px-4 sm:px-6 lg:px-8 xl:px-32'>
        {children}
    </div>
  )
}
