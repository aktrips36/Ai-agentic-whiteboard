import { db, projects, whiteboardData } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectName, projectId } = await req.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (projectName === undefined || projectId === undefined) {
    return NextResponse.json(
      { error: "Projext information missing" },
      { status: 400 },
    );
  }

  const result = await db
    .insert(projects)
    .values({
      projectId: projectId,
      projectName: projectName ?? "",
      userEmail: user?.primaryEmailAddress?.emailAddress ?? ("" as string),
    })
    .returning();

  return NextResponse.json(result[0]);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  const user = await currentUser();

  if (!projectId && !user)
    return NextResponse.json({ error: "Unauthorized user" });

  if (!projectId && user) {
    const projectList = await db
      .select({
        id: projects.id,
        projectId: projects.projectId,
        projectName: projects.projectName,
        userEmail: projects.userEmail,
        createdAt: projects.createdAt,
        previewImage: whiteboardData.previewImage,
        updatedAt: whiteboardData.updatedAt,
      })
      .from(projects)
      .leftJoin(
        whiteboardData,
        eq(projects.projectId, whiteboardData.projectId),
      )
      .where(
        and(
          eq(projects.userEmail, user?.primaryEmailAddress?.emailAddress ?? ""),
          eq(projects.isDeleted, false),
        ),
      );
    return NextResponse.json(projectList);
  }

  const userProject = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.projectId, projectId ?? ""),
        eq(projects.userEmail, user?.primaryEmailAddress?.emailAddress ?? ""),
      ),
    );

  if (userProject.length == 0) {
    return NextResponse.json({ error: "Unauthorized User" });
  }

  const result = await db
    .select()
    .from(whiteboardData)
    .where(eq(whiteboardData.projectId, projectId ?? ""));

  return NextResponse.json({
    ...result[0],
    projectName: userProject[0].projectName,
  });
}

export async function DELETE(req: NextRequest) {
  const { projectId } = await req.json();

  const result = await db
    .update(projects)
    .set({
      isDeleted: true,
    })
    .where(eq(projects.projectId, projectId));

  return NextResponse.json({ message: "Deleted" });
}
