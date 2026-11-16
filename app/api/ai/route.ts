import { NextRequest } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(req: NextRequest) {
  const { userInput, type, systemPrompt } = await req.json();

  const ai = new GoogleGenAI({
    apiKey: process.env["GEMINI_API_KEY"],
  });

  const finalPrompt = `${systemPrompt} User Request: ${userInput}
        
        CANVAS GENERATION RULES:

        Create a professional ${type}.

        coordinate system starts from x = 0 , y = 0


        Every element must contain:
        -- unique id
        -- type
        -- x
        -- y

        And width and height whenever applicable.

        Use appropriate:
        -- backgroundColor
        -- strokeColor
        -- strokeWidth
        -- fillStyle
        -- roughness
        -- opacity
        -- fill settings

        Use hex colors.
        Avoid overlapping elements.
        keep enough spacing between elements.
        Connections must reference valid element IDs.
        Do not include markdown.
    
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: finalPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema
        }
    })

    const diagramResult = JSON.parse(response.text || '{}');
    return Response.json({
        success: true,
        diagramResult
    })
}


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING
        },
        width: {
            type: Type.NUMBER
        },
        height: {
            type: Type.NUMBER
        },
        elements: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: {
                        type: Type.STRING,
                    },
                    type: {
                        type: Type.STRING
                    },
                    x: {
                        type: Type.NUMBER
                    },
                    y: {
                        type: Type.NUMBER
                    },
                    width: {
                        type: Type.NUMBER
                    },
                    height: {
                        type: Type.NUMBER
                    },
                    text: {
                        type: Type.STRING
                    },
                    strokeColor: {
                        type: Type.STRING
                    },
                    backgruondColor: {
                        type: Type.STRING
                    },
                    strokeWidth: {
                      type: Type.NUMBER  
                    },
                    strokeStyle: {
                        type: Type.STRING
                    },
                    fillStyle: {
                        type: Type.STRING
                    },
                    roughness: {
                        type: Type.NUMBER
                    },
                    opacity: {
                        type: Type.NUMBER
                    },
                    fontSize: {
                        type: Type.NUMBER
                    },
                    fontFamily: {
                        type: Type.NUMBER
                    },
                    textAlign: {
                        type: Type.STRING
                    },
                    verticalAlign: {
                        type: Type.STRING
                    },
                    roundness: {
                        type: Type.NUMBER
                    }
                },

                required: [
                    "id",
                    "type",
                    "x",
                    "y",
                ]
            }
        },

        connections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: {
                        type: Type.STRING
                    },
                    from: {
                        type: Type.STRING
                    },
                    to: {
                        type: Type.STRING
                    },
                    label: {
                        type: Type.STRING
                    },
                    strokeColor: {
                        type: Type.STRING
                    },

                }
            }
        }



    }
}