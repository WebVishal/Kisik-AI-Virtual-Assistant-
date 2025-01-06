import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string> {
  try {

    console.log(sourceLanguage)
    const prompt = `As a highly skilled and experienced translator, your task is to create a prompt that will allow users to effectively translate content between languages. 
    Your prompt should guide the user through the translation process in a clear and intuitive manner. Here is the format you will use to provide a comprehensive translation prompt:
your task is that ${text} in ${targetLanguage} language.
`


    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCTI2-kz_0rhwUceeOvica6qWW3O7Qpfl8`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              },
            ],
          },
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );
    const translatedText = response.data.candidates[0].content.parts[0].text;
    return translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Translation failed');
  }
}

