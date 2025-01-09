import axios from "axios";
import { parseStringPromise } from "xml2js";
import { KRDICT_API_KEY } from "../configurations/config";

interface Translation {
  word: string;
  translations: { senseOrder: number; translationWord: string; translationDefinition: string }[];
}

export const searchKoreanWord = async (word: string): Promise<Translation[]> => {
  const apiUrl = "https://krdict.korean.go.kr/api/search";

  try {
    // Make the API request
    const response = await axios.get(apiUrl, {
      params: {
        key: KRDICT_API_KEY,
        q: word,
        translated: "y",
        trans_lang: "1", // English translation
      },
    });

    // Parse XML response to JSON
    const jsonData = await parseStringPromise(response.data, { explicitArray: false });

    const items = jsonData.channel.item;
    const result: Translation[] = [];

    if (!items) return result; // No results found

    // If only one item is present, xml2js won't create an array
    const itemsArray = Array.isArray(items) ? items : [items];

    for (const item of itemsArray) {
      const word = item.word || "";
      const senses = item.sense ? (Array.isArray(item.sense) ? item.sense : [item.sense]) : [];
      const translations = senses
        .filter((sense) => sense.translation)
        .map((sense) => {
          const translation = sense.translation;
          return {
            senseOrder: parseInt(sense.sense_order, 10) || 0,
            translationWord: translation.trans_word || "",
            translationDefinition: translation.trans_dfn || "",
          };
        });

      result.push({ word, translations });
    }

    return result;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw new Error("Failed to fetch translations.");
  }
};