"use client";

import { Button } from "@base-ui/react";
import { Folder, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CreateNewBoardDialog from "./CreateNewBoardDialog";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { toast } from "../../toast";
import { useRouter } from "next/navigation";

type Project = {
  projectName: string;
  id: number;
  projectId: string;
  previewImage: string;
  updatedAt: string;
  userEmail: string;
};

const ProjectList = () => {
  const [projectList, setProjectList] = useState([]);
    const router = useRouter();
  useEffect(() => {
    getProjectList();
  }, []);

  const getProjectList = async () => {
    setProjectList([])
    const result = await axios.get("/api/projects");

    setProjectList(result.data);
  };

  const handleDeleteProject = async (projectId: string) => {
    const result = await axios.delete('/api/projects',{
        data: {
            projectId
        }
    })

    toast.add({
        type: 'Success',
        title: 'Move project to archived!'
    })
    getProjectList();
  }

  return (
    <div>
      {projectList.length === 0 ? (
        // empty state
        <div className="flex flex-col items-center p-10 border rounded-xl mt-10 gap-3">
          <Image src="./folder.png" alt="folder" width={70} height={70} />
          <h2 className="text-2xl font-bold ">No boards found</h2>
          <p className="text-muted-foreground">
            Create your board to start brainstorming, Planning!
          </p>
          <CreateNewBoardDialog />
        </div>
      ) : (
        <div className="mt-10">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Boards</h2>

              <p className="mt-1 text-sm text-gray-400">
                Create, organize and continue working on your ideas
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {projectList.length} boards
            </span>
          </div>

          {/* Boards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {projectList.map((project: Project, index: number) => (
              <div
                key={index}
                className="
          group
          hover:cursor-pointer
          overflow-hidden
          rounded-xl
          border border-gray-200
          bg-white
          shadow-sm
          transition-all duration-200
          hover:-translate-y-1
          hover:shadow-lg
          hover:border-gray-300
        "
              >
                {/* Preview */}
                <div onClick={() => router.push('/workspace/' + project?.projectId)} className="relative aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={project?.previewImage}
                    alt={project?.projectName}
                    fill
                    className="
              object-cover
              transition-transform duration-300
              group-hover:scale-105
            "
                  />
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm truncate">
                    {project?.projectName}
                  </h3>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      Edited {moment(project?.updatedAt).fromNow()}
                    </p>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        handleDeleteProject(project.projectId)
                      }}
                      className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                text-gray-400
                opacity-0
                transition-all duration-200
                group-hover:opacity-100
                hover:bg-red-50
                hover:text-red-500
              "
                      title="Delete board"
                    >
                      <Trash2 size={16} />
                    </button>   
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
