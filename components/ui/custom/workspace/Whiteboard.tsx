"use client";

import React, { useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "../../toast";
import "./whiteboard.css";
import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Minus,
  MousePointer2,
  Pencil,
  Sparkle,
  Sparkles,
  Square,
  Type,
} from "lucide-react";
import { Button } from "../../button";
import FloatingProperties from "./FloatingProperties";
import AIFloatingSidebar from "./AIFloatingSidebar";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

const tools = [
  {
    name: "selection",
    icon: MousePointer2,
    color: "text-blue-600",
  },
  {
    name: "hand",
    icon: Hand,
    color: "text-cyan-600",
  },
  {
    name: "rectangle",
    icon: Square,
    color: "text-green-600",
  },
  {
    name: "diamond",
    icon: Diamond,
    color: "text-emrald-600",
  },
  {
    name: "ellipse",
    icon: Circle,
    color: "text-amber-600",
  },
  {
    name: "arrow",
    icon: ArrowRight,
    color: "text-violet-600",
  },
  {
    name: "line",
    icon: Minus,
    color: "text-pink-600",
  },
  {
    name: "freeDraw",
    icon: Pencil,
    color: "text-orange-600",
  },
  {
    name: "text",
    icon: Type,
    color: "text-indigo-600",
  },
  {
    name: "image",
    icon: Image,
    color: "text-gray-600",
  },
  {
    name: "eraser",
    icon: Eraser,
    color: "text-black-600",
  },
];

type Props = {
  onApiReady: (api:ExcalidrawImperativeAPI) => void
}

const whiteboard = ({onApiReady}: Props) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const saveTimeRef = useRef<any>(null);
  const projectid = useParams();

  const [activeTool, setActiveTool] = useState();
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [canvasState, setCanvasState] = useState<any>(null);

  const [showAISidebar, setShowAISidebar] = useState<any>(false);

  const handleCanvasChange = (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    console.log("Canvas changed:", elements, appState);

    setCanvasState(appState);

    const selectedIds = Object.keys(appState.selectedElementIds || {});

    if (selectedIds?.length == 1) {
      const element = elements.find((el) => el.id === selectedIds[0]);
      setSelectedElement(element);
    } else {
      setSelectedElement(null);
    }

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
      });
    }, 10000);
  };

  const saveCanvasChanges = async (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    const result = await axios.post("/api/whiteboard", {
      projectId: projectid?.projectid,
      elements,
      appState,
      files,
    });
  };

  const changeTool = (tool: any) => {
    if (!excalidrawAPI) return;
    setActiveTool(tool);
    excalidrawAPI.setActiveTool({
      type: tool,
    });
  };

  const getFloatingPosition = () => {
    if (!selectedElement || !canvasState) return { left: 0, top: 0 };

    const zoom = canvasState.zoom?.value ?? 1;

    const scrollX = canvasState.scrollX ?? 0;
    const scrollY = canvasState.scrollY ?? 0;

    //center of selected element
    const centerX = selectedElement.x + selectedElement.width / 2;

    //convert Exacalidraw coordinated to browser coordinates
    const screenX = (centerX + scrollX) * zoom;
    const screenY = (selectedElement.y + scrollY) * zoom;

    return {
      left: screenX,
      top: screenY - 60, //offset above the element
    };
  };

  const floatingPosition = getFloatingPosition();

  const handlePropertyChange = (propertyName: string, value: any) => {
    if (!excalidrawAPI || !selectedElement) return;

    const elements = excalidrawAPI.getSceneElements();

    const updatedElements = elements.map((el: any) => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          [propertyName]: value,
          version: elements.version + 1,
          updatedAt: Date.now(),
        };
      }
      return el;
    });

    excalidrawAPI.updateScene({
      elements: updatedElements,
    });
  };

  const handleDeleteElement = () => {
    if (!excalidrawAPI || !selectedElement) return;
    const elements = excalidrawAPI.getSceneElements();

    const updatedElements = elements.map((el: any) => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          isDeleted: true,
          version: elements.version + 1,
          updatedAt: Date.now(),
        };
      }
      return el;
    });

    excalidrawAPI.updateScene({
      elements: updatedElements,
    });

    setSelectedElement(null);
  };


  const handleOnDuplicate = () => {
    if (!excalidrawAPI || !selectedElement) return;
    const elements = excalidrawAPI.getSceneElements();
    const duplicateElements = {
        ...selectedElement,
        id:crypto.randomUUID(),
        x: selectedElement.x + 20,
        y: selectedElement.y + 20,
        seed: Math.floor(Math.random() * 1000000),
        version: 1,
        updated: Date.now(),
        isDeleted: false,
    }

    excalidrawAPI.updateScene({
        elements: [
            ...elements,
            duplicateElements,
        ]
    })
  }

  const handleBringFrontBack = (type: string) => {
    if (!excalidrawAPI || !selectedElement) return;
    const elements = excalidrawAPI.getSceneElements();

    const selected = elements.find((ele: any) => ele.id === selectedElement.id)
    if (!selected) {
        return;
    }

    const remainingElements = elements.filter((ele: any) => ele.id !== selectedElement.id)

    if (type === 'front') {
        excalidrawAPI.updateScene({
            elements: [
                ...remainingElements,
                selected
            ]
        })
    } else{
        excalidrawAPI.updateScene({
            elements: [
                selected,
                ...remainingElements,
            ]
        })
    }


  }

  return (
    <div style={{ height: "90vh" }}>
      <Excalidraw
        excalidrawAPI={(api) => {setExcalidrawAPI(api);onApiReady(api)}}
        onChange={handleCanvasChange}
      />

      <div
        className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-2
        rounded-2xl bg-white border p-1.5 shadow-xl"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition
                        hover:bg-primary/10 hove:cursor-pointer
                        ${activeTool === tool.name ? "bg-primary/10" : ""}`}
              onClick={() => changeTool(tool.name)}
            >
              <Icon size={19} className={tool.color} />
            </button>
          );
        })}
      </div>

      <FloatingProperties
        selectedElement={selectedElement}
        position={floatingPosition}
        onPropertyChange={(propertyName: string, value: any) =>
          handlePropertyChange(propertyName, value)
        }
        onDelete={() => handleDeleteElement()}
        onDuplicate={() => handleOnDuplicate()}
        onBringToFront={() => handleBringFrontBack('front')}
        onSendToBack={() => handleBringFrontBack('back')}
      />

        <div className="absolute right-50 bottom-2 z-50">
            <Button size={'lg'} onClick={() => setShowAISidebar(!showAISidebar)}>
                <Sparkles /> AI
            </Button>

            {showAISidebar && <AIFloatingSidebar excalidrawApi={excalidrawAPI}/>}

        </div>
    </div>


  );
};

export default whiteboard;
