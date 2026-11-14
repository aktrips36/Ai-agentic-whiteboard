import { db, whiteboardData } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, elements, appState, files } = await req.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!projectId || !elements || !appState || !files) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const result = await db
      .insert(whiteboardData)
      .values({
        projectId,
        elements,
        appState,
        files,
      })
      .onConflictDoUpdate({
        target: whiteboardData.projectId,
        set: {
          elements,
          appState,
          files,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
