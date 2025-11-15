import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getAIAnswer(scrapedContent: string, question: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // Validate scraped content
    if (!scrapedContent || scrapedContent.trim().length < 20) {
      throw new Error('Insufficient website content to analyze. The website may not have loaded properly.');
    }

    const prompt = `You are a helpful assistant that answers questions based on the provided website content. Be concise, accurate, and descriptive.

Based on the following website content, please answer this question: "${question}"

Website Content:
${scrapedContent}

Important: 
- Answer the question directly using the provided content
- If the content doesn't contain enough information to answer fully, mention what information is available
- Do NOT ask the user to provide content - the content is already provided above
- Be descriptive and informative

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    if (!answer) {
      throw new Error('No answer received from Gemini API');
    }

    return answer.trim();
  } catch (error) {
    console.error('Error getting AI answer:', error);
    throw new Error(`Failed to get AI answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
