"use client"

import { Button } from '@base-ui/react'
import { Folder } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import CreateNewBoardDialog from './CreateNewBoardDialog'

const ProjectList = () => {

    const [projectList,setProjectList] = useState([])
  return (
    <div>
        {projectList.length === 0 ? (
            // empty state
            <div className='flex flex-col items-center p-10 border rounded-xl mt-10 gap-3'>
                <Image src="./folder.png" alt="folder" width={70} height={70} />
                <h2 className='text-2xl font-bold '>No boards found</h2>
                <p className='text-muted-foreground'>Create your board to start brainstorming, Planning!</p>
                <CreateNewBoardDialog />
            </div>

        ) : <div>

        </div>}
    </div>
  )
}

export default ProjectList