import React from 'react'
import { SidebarTrigger } from '../../sidebar'
import { UserButton } from '@clerk/nextjs'

const AppHeader = () => {
  return (
    <div className='w-full border-p p-4 flex justify-between items-center'>
        <SidebarTrigger />
        <UserButton />
    </div>
  )
}

export default AppHeader