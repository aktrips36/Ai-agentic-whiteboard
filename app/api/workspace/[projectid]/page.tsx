"use client";

import SmartDoc from "@/components/ui/custom/workspace/SmartDoc";
import Whiteboard from "@/components/ui/custom/workspace/Whiteboard";
import WorkspaceHeader from "@/components/ui/custom/workspace/WorkspaceHeader";
import React from "react";

const Workspace = () => {
    const [activeTab, setActiveTab] = React.useState("whilteboard");    
  return (
    <div>

      <WorkspaceHeader selectedTab={(value: string) => console.log(value)} />
        {
            activeTab === "whilteboard" ? (
                <Whiteboard />
            ) : (
                <SmartDoc />
            )
        }
    </div>
  );
};

export default Workspace;
