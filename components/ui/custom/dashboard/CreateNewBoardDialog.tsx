import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../../input";
import { toast } from "../../toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateNewBoardDialog = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState(false);

  const route = useRouter();

  const handleCreateBoard = async () => {
    if (workspaceName.trim() === "" || workspaceName?.length > 30) {
      toast.add({
        type: "error",
        title: "Invalid Workspace Name",
        description: "Please enter a valid workspace name (1-30 characters).",
      });
      return;
    }

    setLoading(true);
    const projectId = crypto.randomUUID(); // Generate a unique ID for the new board

    const result = await axios.post("/api/projects", {
      projectName: workspaceName,
      projectId,
    });

    if (result.data?.error) {
      setLoading(false);
      setDialog(false);

      toast.add({
        type: "Failed",
        title: "Insufficient Credits",
      });
      return;
    }

    console.log(result?.data);
    toast.add({
      type: "success",
      title: "New Workspace Created",
      description: `Workspace "${workspaceName}" has been created successfully.`,
    });

    setLoading(false);
    setDialog(false);

    route.push("/workspace/" + projectId);
    // Logic to create a new board with the workspaceName
    console.log("Creating new board with name:", workspaceName);
    // Reset the input field after creation
    setWorkspaceName("");
  };

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger>
        <Button className="w-full">
          <Plus /> Create New Board
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Whiteboard workspace Name
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <label className="text-gray-500">
            Enter whiteboard workspace Name
          </label>
          <Input
            placeholder="Workspace Name"
            className="mt-1"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              workspaceName.trim() === "" ||
              workspaceName?.length > 30 ||
              loading
            }
            onClick={handleCreateBoard}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewBoardDialog;
