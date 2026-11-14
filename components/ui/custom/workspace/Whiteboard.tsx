"use client"

import React, { useRef, useState } from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from '../../toast';
const whiteboard = () => {
    
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

    const saveTimeRef = useRef<any>(null);
    const projectid = useParams();

    const handleCanvasChange = (elements: readonly any[], appState: any,files: any) => {
        console.log("Canvas changed:", elements, appState);
        //cancel the previous timeout if it exists
        if (saveTimeRef?.current) {
            clearTimeout(saveTimeRef.current);
        }
        //start New 10 second timer
        saveTimeRef.current = setTimeout(() => {
            //save method 
            saveCanvasChanges(elements, appState, files);
            toast.add({
                title: "Changes Saved",
                type: "success",
            })
        },10000)
      }

    const saveCanvasChanges = async(elements: readonly any[],appState: any,files: any) => {
        const result = await axios.post("/api/whiteboard", {
            projectId: projectid?.projectid,
            elements,   
            appState,
            files
        });
    }

  return (
    <div style={{ height: "90vh" }}>
        <Excalidraw 
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleCanvasChange}
        />
      </div>
  )
}

export default whiteboard