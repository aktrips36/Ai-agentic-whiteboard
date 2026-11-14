import { db, projects } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {projectName,projectId} = await req.json();
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (projectName === undefined || projectId === undefined) {
        return NextResponse.json({ error: "Projext information missing" }, { status: 400 });
    }


    const result = await db.insert(projects).values({
        projectId: projectId,
        projectName: projectName ?? "",
        userEmail: user?.primaryEmailAddress?.emailAddress ?? "" as string,
    }).returning(); 

    return NextResponse.json(result[0]);
}