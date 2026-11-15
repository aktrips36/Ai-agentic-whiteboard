"use client"

import React, { useRef, useState } from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from '../../toast';
import "./whiteboard.css"
import { ArrowRight, Circle, Diamond, Eraser, Hand, Image, Minus, MousePointer2, Pencil, Square, Type } from 'lucide-react';
import { Button } from '../../button';

const tools = [
    {
        name: 'selection',
        icon: MousePointer2,
        color: "text-blue-600"
    },
    {
        name: 'hand',
        icon: Hand,
        color: "text-cyan-600"
    },
    {
        name: 'rectangle',
        icon: Square,
        color: "text-green-600"
    },
    {
        name: 'diamond',
        icon: Diamond,
        color: "text-emrald-600"
    },
    {
        name: 'ellipse',
        icon: Circle,
        color: "text-amber-600"
    },
    {
        name: 'arrow',
        icon: ArrowRight,
        color: "text-violet-600"
    },
    {
        name: 'line',
        icon: Minus,
        color: "text-pink-600"
    },
    {
        name: 'freeDraw',
        icon: Pencil,
        color: "text-orange-600"
    },
    {
        name: 'text',
        icon: Type,
        color: "text-indigo-600"
    },
    {
        name: 'image',
        icon: Image,
        color: "text-gray-600"
    },
    {
        name: 'eraser',
        icon: Eraser,
        color: "text-black-600"
    }
]

const whiteboard = () => {
    
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

    const saveTimeRef = useRef<any>(null);
    const projectid = useParams();

    const [activeTool,setActiveTool] = useState();

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

    const changeTool = (tool: any) => {
        if(!excalidrawAPI) return;
        setActiveTool(tool);
        excalidrawAPI.setActiveTool({
            type: tool,
        })
    }

  return (
    <div style={{ height: "90vh" }}>
        <Excalidraw 
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleCanvasChange}
        />
        
        <div className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-2
        rounded-2xl bg-white border p-1.5 shadow-xl">
            {
                tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <button className={`flex h-10 w-10 items-center justify-center rounded-xl transition
                        hover:bg-primary/10 hove:cursor-pointer
                        ${activeTool === tool.name ? "bg-primary/10" : ""}`}
                        onClick={() => changeTool(tool.name)}
                        >
                            <Icon size={19} className={tool.color} />
                        </button>
                    )
                })
            }
        </div>

    </div>
  )
}

export default whiteboard