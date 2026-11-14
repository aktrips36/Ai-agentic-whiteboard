"use client"
import { } from '@base-ui/react';
import { useUser } from '@clerk/nextjs';
import { Sparkle } from 'lucide-react';
import React from 'react'
import { Button } from '../../button';
import CreateNewBoardDialog from './CreateNewBoardDialog';

const WelcomeBanner = () => {
    const {user} = useUser();

  return (
    <div>
        <div className='p-10 border rounded-xl bg-gradient-to-r from-blue-200 from-purple-200'>
            <h2 className='text-2xl font-bold'>Welcome Back, {user?.fullName}</h2>
            <p>Bring your ideas to life on Infinite canvas</p>

            <div className='mt-5 flex items-center gap-2 mt-5'>
                <CreateNewBoardDialog />
                <Button variant="outline" size="lg"> <Sparkle /> AI helper</Button>
            </div>
        </div>
    </div>
  )
}

export default WelcomeBanner