"use client";

import SmartDoc from "@/components/ui/custom/workspace/SmartDoc";
import Whiteboard from "@/components/ui/custom/workspace/Whiteboard";
import WorkspaceHeader from "@/components/ui/custom/workspace/WorkspaceHeader";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw/index";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Workspace = () => {
    const [activeTab, setActiveTab] = useState("whilteboard");   
    const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null); 
    const {projectId} = useParams();
    const [projectName,setProjectName] = useState("");

    useEffect(() => {
      projectId && api && getWhiteboardData();
    },[projectId,api])



    const getWhiteboardData = async () => {

      try {
        const result = await axios.get('/api/projects?projectId='+projectId);
        
        setProjectName(result?.data?.projectName);
        api?.updateScene({
            elements: result.data.elements || [],
            appState: normalizeAppState(result.data.appState),
        })

        if (result.data.files) [
          api?.addFiles(
            Object.values(result.data.files)
          )
        ]
        
      } catch (error) {
        console.error("Failed to load whiteboard: ",error);
      }



    }

    const handleExportImage = async () => {
      if(!api) return;
      const blob = await exportToBlob({
        elements: api.getSceneElements(),
        appState: {
          ...api.getAppState(),
          exportBackground: true
        },
        files: api.getFiles(),
        mimeType: "image/png",
        quality: 1,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'whiteboard.png';
      link.click();

      URL.revokeObjectURL(url);
    }

  return (
    <div>

      <WorkspaceHeader 
      selectedTab={(value: string) => console.log(value)} 
      onExport={() => handleExportImage()} 
      projectName={projectName}
      />
        {
            activeTab === "whilteboard" ? (
                <Whiteboard 
                  onApiReady={setApi}
                />
            ) : (
                <SmartDoc />
            )
        }
    </div>
  );
};

export default Workspace;
