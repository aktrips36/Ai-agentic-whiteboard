import React from "react";
import { UserButton } from "@clerk/nextjs";
import WelcomeBanner from "@/components/ui/custom/dashboard/WelcomeBanner";
import ProjectList from "@/components/ui/custom/dashboard/ProjectList";

const DashboardPage = () => {
  return (
    <div>
      {/* welcome banner */}
      <WelcomeBanner />

      {/* project list/ empty State */}
      <ProjectList />
    </div>
  );
};

export default DashboardPage;
