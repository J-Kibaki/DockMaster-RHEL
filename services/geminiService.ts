import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const checkAnswerWithGemini = async (
  question: string,
  userAnswer: string,
  context: string
): Promise<{ correct: boolean; explanation: string }> => {
  if (!apiKey) {
    return { correct: false, explanation: "API Key missing. Cannot validate." };
  }

  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Context: Teaching Docker on RHEL9.
      Question: ${question}
      RHEL/Docker Context: ${context}
      User Answer: ${userAnswer}
      
      Is the user's answer correct or effectively correct (e.g. valid syntax)? 
      Return a JSON object: { "correct": boolean, "explanation": "short explanation" }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini validation error:", error);
    return { correct: false, explanation: "Error validating answer." };
  }
};

export const askTutor = async (history: {role: 'user' | 'model', text: string}[], userMessage: string): Promise<string> => {
   if (!apiKey) return "Please configure your API Key to use the AI Tutor.";

   try {
     const model = "gemini-3-flash-preview";
     
     // Construct chat contents manually as the simple Chat helper isn't used here for statelessness or we use generateContent with history
     const contents = [
       {
         role: 'user',
         parts: [{ text: "You are an expert DevOps engineer and instructor specializing in RHEL9 and Docker. Keep answers concise, technical, and helpful. Use markdown for code." }]
       },
       ...history.map(h => ({
         role: h.role,
         parts: [{ text: h.text }]
       })),
       {
         role: 'user',
         parts: [{ text: userMessage }]
       }
     ];

     const response = await ai.models.generateContent({
        model,
        contents: contents as any
     });

     return response.text || "I couldn't generate a response.";
   } catch (error) {
     console.error("Tutor error:", error);
     return "Sorry, I encountered an error connecting to the AI service.";
   }
};