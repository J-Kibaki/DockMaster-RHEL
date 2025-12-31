import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const checkAnswerWithGemini = async (
  question: string,
  userAnswer: string,
  context: string
): Promise<{ correct: boolean; explanation: string }> => {
  if (!apiKey) {
    // If no API key, we rely on the caller (Terminal) to handle exact matches.
    // If we reach here, it means exact match failed and we can't do semantic check.
    return { correct: false, explanation: "API Key missing. Cannot validate semantic answer. Please try the exact expected command." };
  }

  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are a strict RHEL9 Docker instructor.
      
      Task: Validate if the user's command correctly answers the question in an RHEL9 environment.
      
      Question: ${question}
      RHEL/Docker Context: ${context}
      User Answer: ${userAnswer}
      
      Criteria:
      1. Syntax must be valid for 'docker' or 'podman' CLI.
      2. It must achieve the specific goal asked.
      3. Be strict about RHEL nuances (e.g. using :Z for volumes if mentioned in context).
      4. Allow valid aliases (e.g. 'docker container ls' == 'docker ps').
      
      Return a JSON object: { "correct": boolean, "explanation": "short concise explanation" }
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
     
     // Construct chat contents manually
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