import {
  Monitor,
  Network,
  PencilRuler,
  Smartphone,
  Sparkles,
  Workflow,
  X,
  ArrowUp,
  Loader2Icon,
} from "lucide-react";

import React, { useState } from "react";
import { Textarea } from "../../textarea";
import { Button } from "../../button";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw/index";
import axios from "axios";

const getSafeText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "text" in value) {
    return String((value as any).text ?? "");
  }
  return "";
};

// const AITools = [
//     {
//       name: "Generate Diagrams",
//       description: "Generate diagrams in seconds",
//       icon: PencilRuler,
//       color: "text-blue-600",
//       bgColor: "bg-blue-50",
//     },
//     {
//       name: "FlowChart",
//       description: "Turn ideas into visual workflows",
//       icon: Workflow,
//       color: "text-purple-600",
//       bgColor: "bg-purple-50",
//     },
//     {
//       name: "Architecture",
//       description: "Generate system architecture",
//       icon: Network,
//       color: "text-orange-600",
//       bgColor: "bg-orange-50",
//     },
//     {
//       name: "Web Mockup",
//       description: "Generate website wireframes",
//       icon: Monitor,
//       color: "text-cyan-600",
//       bgColor: "bg-cyan-50",
//     },
//     {
//       name: "Mobile Mockup",
//       description: "Generate mobile app wireframes",
//       icon: Smartphone,
//       color: "text-pink-600",
//       bgColor: "bg-pink-50",
//     },
//   ];

const AITools = [
  {
    name: "Generate Diagrams",

    desc: "Create visual diagrams",

    icon: PencilRuler,

    color: "text-blue-600",

    bgColor: "bg-blue-50",

    prompt: `

You are an expert visual diagram generation agent.

Your task is to convert the user's idea into a clear, structured, professional diagram.

Instructions:

Understand the user's intent before generating.

Identify the main entities, concepts, steps, and relationships.

Create a clean visual hierarchy.

Use rectangles for main concepts or processes.

Use diamonds only for decisions.

Use arrows to show relationships or direction.

Keep labels short and readable.

Avoid overlapping elements.

Maintain consistent spacing between elements.

Organize the diagram from left-to-right or top-to-bottom depending on what is easiest to understand.

Add groups or sections when the diagram contains multiple categories.

Prefer simple layouts over overly complex diagrams.

Output only valid Excalidraw-compatible JSON elements.

Do not include markdown, explanations, or additional text outside the JSON.

`,
  },
  {
    name: "Flowchart",

    desc: "Visualize workflows",

    icon: Workflow,

    color: "text-violet-600",

    bgColor: "bg-violet-50",

    prompt: `

You are an expert flowchart generation agent.

Convert the user's description into a professional flowchart.

Instructions:

Identify the starting point, actions, decisions, branches, and ending points.

Use rounded rectangles for start and end nodes.

Use rectangles for actions or processes.

Use diamonds for decisions.

Use arrows to connect nodes in the correct logical order.

Label decision arrows clearly, such as "Yes" and "No".

Keep the primary workflow flowing from top to bottom.

Branch secondary flows to the left or right.

Keep node labels concise.

Avoid crossing arrows whenever possible.

Maintain consistent node dimensions and spacing.

Make the flowchart understandable without additional explanation.

If the user's description is incomplete, infer the most logical workflow.

Output only valid Excalidraw-compatible JSON elements.

Do not return markdown or explanatory text.

`,
  },
  {
    name: "Architecture",

    desc: "Design system architecture",

    icon: Network,

    color: "text-orange-600",

    bgColor: "bg-orange-50",

    prompt: `

You are a senior software architect and system design visualization agent.

Convert the user's application or system description into a clear system architecture diagram.

Instructions:

Identify clients, frontend applications, backend services, APIs, databases, queues, storage, authentication systems, external services, and infrastructure.

Group related components into logical sections.

Show the direction of data flow using arrows.

Clearly label important connections when useful.

Place users or client applications on the left or top.

Place application services in the center.

Place databases, storage, and infrastructure on the right or bottom.

Place third-party APIs or external services in a separate section.

Use consistent component sizes.

Keep architecture readable and avoid unnecessary implementation details.

Include technologies mentioned by the user as labels.

Infer standard architectural components only when necessary.

Do not invent unnecessary technologies.

Use containers or background sections for Frontend, Backend, Data Layer, AI Services, and External Services when appropriate.

Output only valid Excalidraw-compatible JSON elements.

Do not return markdown, commentary, or explanations.

`,
  },
  {
    name: "Web Mockup",

    desc: "Generate web wireframes",

    icon: Monitor,

    color: "text-cyan-600",

    bgColor: "bg-cyan-50",

    prompt: `

You are an expert product designer and web UI wireframe generation agent.

Convert the user's description into a professional desktop web application wireframe.

Instructions:

Create the interface using simple wireframe-style Excalidraw elements.

Assume a desktop viewport unless the user specifies otherwise.

Identify the main page structure and user goals.

Include relevant UI sections such as:

Navbar or header

Sidebar

Page title

Search

Filters

Cards

Tables

Forms

Buttons

Content panels

Footer

Use rectangles for containers, cards, buttons, images, and input fields.

Use text elements for labels and content.

Maintain strong spacing, alignment, and visual hierarchy.

Use realistic dashboard or SaaS layout conventions.

Keep the design low-fidelity and wireframe oriented.

Do not create decorative artwork unless specifically requested.

Keep the page within a reasonable desktop canvas size.

Group related UI sections visually.

Make important primary actions easy to identify.

Output only valid Excalidraw-compatible JSON elements.

Do not return markdown or explanations.

`,
  },
  {
    name: "Mobile Mockup",

    desc: "Generate app wireframes",

    icon: Smartphone,

    color: "text-pink-600",

    bgColor: "bg-pink-50",

    prompt: `

You are an expert mobile product designer and mobile wireframe generation agent.

Convert the user's app idea into a professional mobile app wireframe.

Instructions:

Design for a standard mobile screen size.

Create a phone frame or clear screen boundary.

Focus on the primary user experience described by the user.

Include relevant mobile UI patterns such as:

App header

Search

Cards

Lists

Forms

Bottom navigation

Floating action buttons

Tabs

Profile sections

Modals or sheets when necessary

Use rectangles for UI containers and controls.

Use text elements for labels.

Maintain consistent padding and spacing.

Use a vertical layout optimized for mobile interaction.

Keep buttons large enough to represent touch-friendly controls.

Keep the design low-fidelity and wireframe focused.

If multiple screens are needed, arrange them horizontally with clear spacing.

Label each screen clearly.

Prioritize usability and simple navigation.

Output only valid Excalidraw-compatible JSON elements.

Do not return markdown, explanations, or commentary.

`,
  },
];

type Props = {
  excalidrawApi: ExcalidrawImperativeAPI | null;
};

const AI_PLACEHOLDER_IDS = {
  container: "ai-placeholder-container",
  title: "ai-placeholder-title",
  subtitle: "ai-placeholder-subtitle",
  skeleton1: "ai-placeholder-skeleton-1",
  skeleton2: "ai-placeholder-skeleton-2",
  skeleton3: "ai-placeholder-skeleton-3",
};

const AIFloatingSidebar = ({ excalidrawApi }: Props) => {
  const [selectedTool, setSelectedTool] = useState<any>(AITools[0]);
  const [prompt, setPrompt] = useState("");

  const [userInput, setUserInput] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);
  const AI_PLACEHOLDER_ID = "ai-generation-placeholder";

  const handleGenerate = () => {
    console.log({
      tool: selectedTool,
      prompt,
    });
  };

  const getEmptyCanvasPosition = () => {
    if (!excalidrawApi) {
      return { x: 100, y: 100 };
    }

    const elements = excalidrawApi
      .getSceneElements()
      .filter((ele) => !ele.isDeleted);

    if (elements.length == 0) {
      return { x: 100, y: 100 };
    }

    //find right most element
    const maxRight = Math.max(
      ...elements.map((element) => element.x + element.width),
    );

    const minTop = Math.min(...elements.map((element) => element.y));

    return {
      x: maxRight + 150,
      y: minTop,
    };
  };

  const addAIPlaceholder = () => {
    if (!excalidrawApi) return;

    const position = getEmptyCanvasPosition();

    const placeholderElements = convertToExcalidrawElements([
      {
        type: "rectangle",
        id: AI_PLACEHOLDER_IDS.container,
        x: position.x,
        y: position.y,
        width: 420,
        height: 250,
        backgroundColor: "#f5f3ff",
        strokeColor: "#8b5cf6",
        fillStyle: "solid",
        strokeWidth: 2,
        roughness: 0,
        roundness: {
          type: 3,
        },
      },
      {
        type: "text",
        id: AI_PLACEHOLDER_IDS.title,
        x: position.x + 28,
        y: position.y + 28,
        text: "generated with AI",
        fontSize: 22,
        strokeColor: "#6d28d9",
      },
      {
        type: "text",
        id: AI_PLACEHOLDER_IDS.subtitle,
        x: position.x + 28,
        y: position.y + 65,
        text: "Preparing your diagram...",
        fontSize: 15,
        strokeColor: "#6b7280",
      },
      {
        type: "rectangle",
        id: AI_PLACEHOLDER_IDS.skeleton1,
        x: position.x + 28,
        y: position.y + 115,
        width: 250,
        height: 18,
        backgroundColor: "#ddd6fe",
        strokeColor: "#ddd6fe",
        fillStyle: "solid",
        roughness: 0,
        roundness: {
          type: 3,
        },
      },
      {
        type: "rectangle",
        id: AI_PLACEHOLDER_IDS.skeleton2,
        x: position.x + 28,
        y: position.y + 150,
        width: 330,
        height: 18,
        backgroundColor: "#ddd6fe",
        strokeColor: "#ddd6fe",
        fillStyle: "solid",
        roughness: 0,
        roundness: {
          type: 3,
        },
      },
      {
        type: "rectangle",
        id: AI_PLACEHOLDER_IDS.skeleton3,
        x: position.x + 28,
        y: position.y + 185,
        width: 190,
        height: 18,
        backgroundColor: "#ddd6fe",
        strokeColor: "#ddd6fe",
        fillStyle: "solid",
        roughness: 0,
        roundness: {
          type: 3,
        },
      },
    ]);

    const currentElements = excalidrawApi.getSceneElements();

    excalidrawApi.updateScene({
      elements: [...currentElements, ...placeholderElements],
    });
  };

  const getConnectionPoints = (
    fromNode: any,

    toNode: any,

    origin: {
      x: number;

      y: number;
    },
  ) => {
    const fromX = origin.x + Number(fromNode.x || 0);

    const fromY = origin.y + Number(fromNode.y || 0);

    const fromWidth = Number(fromNode.width || 200);

    const fromHeight = Number(fromNode.height || 80);

    const toX = origin.x + Number(toNode.x || 0);

    const toY = origin.y + Number(toNode.y || 0);

    const toWidth = Number(toNode.width || 200);

    const toHeight = Number(toNode.height || 80);

    const fromCenterX = fromX + fromWidth / 2;

    const fromCenterY = fromY + fromHeight / 2;

    const toCenterX = toX + toWidth / 2;

    const toCenterY = toY + toHeight / 2;

    const dx = toCenterX - fromCenterX;

    const dy = toCenterY - fromCenterY;

    // --------------------------------

    // Vertical connection

    // --------------------------------

    if (Math.abs(dy) >= Math.abs(dx)) {
      // Target below source

      if (dy > 0) {
        return {
          startX: fromCenterX,

          startY: fromY + fromHeight,

          endX: toCenterX,

          endY: toY,
        };
      }

      // Target above source

      return {
        startX: fromCenterX,

        startY: fromY,

        endX: toCenterX,

        endY: toY + toHeight,
      };
    }

    // --------------------------------

    // Horizontal connection

    // --------------------------------

    // Target right

    if (dx > 0) {
      return {
        startX: fromX + fromWidth,

        startY: fromCenterY,

        endX: toX,

        endY: toCenterY,
      };
    }

    // Target left

    return {
      startX: fromX,

      startY: fromCenterY,

      endX: toX + toWidth,

      endY: toCenterY,
    };
  };

  const renderAIDiagram = (diagram: any) => {
    if (!excalidrawApi) {
      return;
    }

    // ----------------------------------------

    // DIAGRAM ORIGIN

    // ----------------------------------------

    const origin = getEmptyCanvasPosition();

    const aiElements = diagram?.elements || [];

    const connections = diagram?.connections || [];

    if (!aiElements.length) {
      return;
    }

    // ----------------------------------------

    // HELPER - FIND AI NODE

    // ----------------------------------------

    const getNode = (id: string) => {
      return aiElements.find((element: any) => element.id === id);
    };

    // ----------------------------------------

    // CREATE SHAPES

    // ----------------------------------------

    const shapeElements = aiElements.flatMap((element: any) => {
      if (!element?.type || !element?.id) {
        return [];
      }

      const x = origin.x + (Number(element.x) || 0);

      const y = origin.y + (Number(element.y) || 0);

      const width = Number(element.width) || 200;

      const height = Number(element.height) || 80;

      const baseElement = {
        // VERY IMPORTANT

        id: element.id,

        type: element.type,

        x,

        y,

        width,

        height,

        strokeColor: element.strokeColor || "#1e1e1e",

        backgroundColor: element.backgroundColor || "transparent",

        strokeWidth: Number(element.strokeWidth) || 2,

        strokeStyle: element.strokeStyle || "solid",

        fillStyle: element.fillStyle || "solid",

        roughness: element.roughness ?? 1,

        opacity: element.opacity ?? 100,
      };

      // --------------------------------

      // TEXT ELEMENT

      // --------------------------------

      if (element.type === "text") {
        return [
          {
            ...baseElement,

            text: getSafeText(element.text || element.label),

            fontSize: Number(element.fontSize) || 18,
          },
        ];
      }

      // --------------------------------

      // SHAPE LABEL

      // --------------------------------

      const labelText = getSafeText(
        typeof element.label === "object" && element.label !== null
          ? element.label.text
          : (element.label ?? element.text),
      );

      return [
        {
          ...baseElement,

          ...(labelText && {
            label: {
              text: labelText,

              fontSize: Number(element.fontSize) || 18,
            },
          }),
        },
      ];
    });

    // ----------------------------------------

    // CREATE CONNECTIONS

    // ----------------------------------------

    const connectionElements = connections

      .map(
        (
          connection: any,

          index: number,
        ) => {
          const fromNode = getNode(connection.from);

          const toNode = getNode(connection.to);

          if (!fromNode || !toNode) {
            console.warn(
              "Unable to create connection",

              connection,
            );

            return null;
          }

          const {
            startX,

            startY,

            endX,

            endY,
          } = getConnectionPoints(
            fromNode,

            toNode,

            origin,
          );

          return {
            id: connection.id || `connection-${index}`,

            type: "arrow",

            // ------------------------

            // Physical arrow position

            // ------------------------

            x: startX,

            y: startY,

            width: endX - startX,

            height: endY - startY,

            // ------------------------

            // Excalidraw binding

            // ------------------------

            start: {
              id: connection.from,
            },

            end: {
              id: connection.to,
            },

            // ------------------------

            // Styling

            // ------------------------

            strokeColor: connection.strokeColor || "#1e1e1e",

            strokeWidth: Number(connection.strokeWidth) || 2,

            strokeStyle: connection.strokeStyle || "solid",

            roughness: connection.roughness ?? 1,

            opacity: connection.opacity ?? 100,

            startArrowhead: null,

            endArrowhead: connection.endArrowhead || "arrow",

            // ------------------------

            // Connection label

            // ------------------------

            ...(connection.label && {
              label: {
                text: getSafeText(connection.label),

                fontSize: Number(connection.fontSize) || 16,
              },
            }),
          };
        },
      )

      .filter(Boolean);

    // ----------------------------------------

    // IMPORTANT:

    // CONVERT SHAPES + CONNECTIONS TOGETHER

    // ----------------------------------------

    const elementsToConvert = [...shapeElements, ...connectionElements];

    const newElements = convertToExcalidrawElements(
      elementsToConvert as any,

      {
        // VERY IMPORTANT

        regenerateIds: false,
      },
    );

    // ----------------------------------------

    // EXISTING ELEMENTS

    // ----------------------------------------

    const currentElements = excalidrawApi.getSceneElements();

    // ----------------------------------------

    // UPDATE SCENE

    // ----------------------------------------

    excalidrawApi.updateScene({
      elements: [...currentElements, ...newElements],
    });

    // ----------------------------------------

    // OPTIONAL

    // Scroll generated diagram into view

    // ----------------------------------------

    /*

    excalidrawApi.scrollToContent(

        newElements,

        {

            fitToViewport: true,

            viewportZoomFactor: 0.8

        }

    );

    */
  };

  const onClickGenerate = async () => {
    addAIPlaceholder();
    setLoading(true);
    const currentAITool = AITools.find((tool) => tool.name === selectedTool);
    const result = await axios.post("/api/ai", {
      userInput,
      type: currentAITool?.name,
      systemPrompt: currentAITool?.prompt,
    });
    setLoading(false);
    removeAIPlaceholder();
  };

  const removeAIPlaceholder = () => {
    if (!excalidrawApi) return;
    const placeholderIds = Object.values(AI_PLACEHOLDER_IDS);
    const elements = excalidrawApi.getSceneElements();
    const updateElements = elements.filter(
      (element) => !placeholderIds.includes(element.id),
    );

    excalidrawApi.updateScene({ elements: updateElements });
  };

  return (
    <div
      className="
        absolute right-6 bottom-6 z-50
        w-[420px]
        max-h-[calc(100vh-48px)]
        overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-[0_20px_70px_rgba(0,0,0,0.15)]
      "
    >
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-indigo-500 to-purple-600
                text-white
                shadow-sm
              "
            >
              <Sparkles size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                AI Assistant
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Turn ideas into visuals
              </p>
            </div>
          </div>

          <button
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(100vh-150px)] overflow-y-auto p-5">
        {/* Section heading */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Choose a tool
            </h3>

            <span className="text-[11px] text-gray-400">
              {AITools.length} tools
            </span>
          </div>
        </div>

        {/* AI Tools */}
        <div className="grid grid-cols-2 gap-2.5">
          {AITools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.name;

            return (
              <button
                key={tool.name}
                onClick={() => setSelectedTool(tool.name)}
                className={`
                  group relative
                  rounded-xl
                  border
                  p-3
                  text-left
                  transition-all
                  duration-200
                  ${
                    isSelected
                      ? "border-indigo-200 bg-indigo-50/60 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                )}

                <div
                  className={`
                    mb-2.5
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    ${tool.bgColor}
                    ${tool.color}
                    transition-transform
                    group-hover:scale-105
                  `}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>

                <h4
                  className={`
                    text-xs font-semibold
                    ${isSelected ? "text-indigo-900" : "text-gray-800"}
                  `}
                >
                  {tool.name}
                </h4>

                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-400">
                  {tool.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gray-100" />

        {/* Prompt section */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Describe your idea
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                Tell AI what you want to create
              </p>
            </div>
          </div>

          {/* Prompt box */}
          <div
            className="
              rounded-xl
              border border-gray-200
              bg-gray-50
              p-3
              transition
              focus-within:border-indigo-300
              focus-within:bg-white
              focus-within:ring-4
              focus-within:ring-indigo-50
            "
          >
            <Textarea
              value={prompt}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g. Customer onboarding flow with decision points..."
              className="
                min-h-[110px]
                resize-none
                border-0
                bg-transparent
                p-0
                text-sm
                leading-6
                shadow-none
                outline-none
                focus-visible:ring-0
              "
            />

            <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="text-[10px] text-gray-400">
                {prompt.length}/500
              </span>

              <span className="text-[10px] text-gray-400">{selectedTool}</span>
            </div>
          </div>
        </div>

        {/* Generate button */}
        <Button
          onClick={onClickGenerate}
          disabled={!prompt.trim() && loading}
          className="
            mt-3
            h-11
            w-full
            rounded-xl
            border-0
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            hover:from-indigo-700
            hover:to-purple-700
            hover:shadow-md
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <span className="flex items-center justify-center gap-2">
            {loading && <Loader2Icon className="animate-spin" />}
            <Sparkles size={16} />
            Generate
            <ArrowUp size={15} />
          </span>
        </Button>

        {/* Footer hint */}
        <p className="mt-3 text-center text-[10px] text-gray-400">
          AI-generated diagrams can be edited after creation
        </p>
      </div>
    </div>
  );
};

export default AIFloatingSidebar;
