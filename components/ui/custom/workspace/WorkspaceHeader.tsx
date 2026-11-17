"use client"

import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../../button";
import { DownloadIcon, Save, Share } from "lucide-react";

type Props = {
  selectedTab: any;
  onExport: any;
  projectName: string;
};



const WorkspaceHeader = ({selectedTab , onExport , projectName}:Props) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200" >
      <div className="flex items-center gap-2">
        <Image src={"/logo.png"} alt="Logo" width={35} height={35} />
        <h2>{projectName}</h2>
      </div>
      {/* switch */}
      <div className="">
        <Tabs defaultValue="account" className=""
            onValueChange={(value) => selectedTab(value)}
        >
          <TabsList>
            <TabsTrigger value="account">Whiteboard</TabsTrigger>
            <TabsTrigger value="password">Doc</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Extra Buttons */}
        <div className="flex items-center gap-2">
            <Button> <Save /> Save</Button>
            <Button variant="outline"> <Share /> Share</Button>
            <Button variant="outline" onClick={onExport}> <DownloadIcon /> export</Button>
        </div>

    </div>
  );
};

export default WorkspaceHeader;
