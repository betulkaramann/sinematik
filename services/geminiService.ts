import { GoogleGenAI, Type } from "@google/genai";
import { Movie, SearchFilters, BattleResult } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize specific Gemini client
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates movie data based on a search query or category using Gemini 3 Flash.
 * Uses a dynamic thumbnail proxy to fetch REAL posters based on title+year.
 */
export const searchMoviesAI = async (filters: SearchFilters): Promise<Movie[]> => {
  if (!API_KEY) {
    console.warn("API Key missing");
    return getMockMovies(); // Fallback if no key
  }

  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Act as a movie database expert. Generate a list of 8 movies/series based on:
    Query: "${filters.query}"
    Genre: "${filters.genre || 'Any'}"
    Type: "${filters.type || 'Any'}"
    Min Rating: ${filters.minRating || 0}
    Year Range: ${filters.yearFrom || 1900} - ${filters.yearTo || 2025}
    Language: Turkish (Return descriptions/titles in Turkish where appropriate).
    
    Return pure JSON data containing id, title, year, rating, genre, director, plot, cast, type, duration.
    Do NOT generate a 'posterUrl' field in the JSON, we will handle images client-side.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              year: { type: Type.INTEGER },
              rating: { type: Type.NUMBER },
              genre: { type: Type.ARRAY, items: { type: Type.STRING } },
              director: { type: Type.STRING },
              plot: { type: Type.STRING },
              cast: { type: Type.ARRAY, items: { type: Type.STRING } },
              type: { type: Type.STRING, enum: ["movie", "series"] },
              duration: { type: Type.STRING }
            },
            required: ["id", "title", "year", "rating", "genre", "plot", "type"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Post-process to add VALID REAL image URLs using a search proxy
    return data.map((m: any, index: number) => {
      // We use a high-quality thumbnail proxy that searches for "{Title} {Year} movie poster"
      // This guarantees a real image related to the movie.
      // c=7 ensures smart cropping to vertical aspect ratio.
      const searchQuery = encodeURIComponent(`${m.title} ${m.year} poster vertical`);
      const realPosterUrl = `https://tse2.mm.bing.net/th?q=${searchQuery}&w=500&h=750&c=7&rs=1&p=0`;

      return {
        ...m,
        id: m.id || `gen-${Date.now()}-${index}`,
        posterUrl: realPosterUrl
      };
    });

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return getMockMovies();
  }
};

/**
 * Generates specific recommendation details or analysis
 */
export const getMovieAnalysis = async (movieTitle: string): Promise<string> => {
    if (!API_KEY) return "API Anahtarı eksik. Analiz yapılamadı.";
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a short, engaging, critical analysis (2 sentences) for the movie/series "${movieTitle}" in Turkish. Focus on why someone should watch it.`
        });
        return response.text || "Analiz bulunamadı.";
    } catch (e) {
        return "Analiz yüklenemedi.";
    }
}

/**
 * Analyzes the user's watched list to generate a persona and insights
 */
export const getUserPersona = async (watchedMovies: Movie[]): Promise<{ title: string, description: string }> => {
    if (!API_KEY || watchedMovies.length === 0) {
        return { 
            title: "Henüz Veri Yok", 
            description: "Sinema karakterini keşfetmek için biraz daha film izlemelisin." 
        };
    }

    const movieTitles = watchedMovies.map(m => m.title).join(", ");
    
    try {
        const prompt = `
            Analyze this list of movies a user has watched: ${movieTitles}.
            Based on this, generate a "Cinematic Persona" for them in Turkish.
            
            Return JSON with:
            - title: A cool, creative title for the user (e.g., "Karanlık Atmosfer Avcısı", "Bilim Kurgu Gezgini", "Romantik Hayalperest").
            - description: A 2-sentence psychological analysis of their taste.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    }
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error) {
        return { title: "Sinema Sever", description: "Çeşitli türlerden hoşlanan genel bir izleyicisin." };
    }
}

/**
 * Compares two movies and declares a winner based on criteria
 */
export const compareMoviesAI = async (movie1: string, movie2: string): Promise<BattleResult> => {
    if (!API_KEY) throw new Error("API Key missing");
    
    const prompt = `
        Act as a tough but fair film critic referee. Compare "${movie1}" (left) vs "${movie2}" (right).
        Analyze them in 4 categories: "Senaryo" (Script), "Oyunculuk" (Acting), "Görsellik" (Visuals), "Etki" (Impact).
        
        Decide a winner for each category and an overall winner.
        Language: Turkish.
        
        Return pure JSON:
        {
            "winner": "left" or "right" (overall winner),
            "summary": "Short 2-sentence summary of why the winner won.",
            "categories": [
                { "name": "Senaryo", "winner": "left"|"right"|"tie", "scoreLeft": 85, "scoreRight": 90, "reason": "Short reason" },
                ... (repeat for all 4 categories)
            ]
        }
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        winner: { type: Type.STRING, enum: ["left", "right"] },
                        summary: { type: Type.STRING },
                        categories: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    winner: { type: Type.STRING, enum: ["left", "right", "tie"] },
                                    scoreLeft: { type: Type.NUMBER },
                                    scoreRight: { type: Type.NUMBER },
                                    reason: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Compare Error", error);
        throw error;
    }
}

// Fallback Mock Data with Real Image Logic
const getMockMovies = (): Movie[] => [
  {
    id: "1",
    title: "Inception",
    year: 2010,
    rating: 8.8,
    posterUrl: "https://tse2.mm.bing.net/th?q=Inception%202010%20poster&w=500&h=750&c=7",
    genre: ["Sci-Fi", "Action"],
    director: "Christopher Nolan",
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology...",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    type: "movie",
    duration: "2h 28m"
  },
  {
    id: "2",
    title: "Breaking Bad",
    year: 2008,
    rating: 9.5,
    posterUrl: "https://tse2.mm.bing.net/th?q=Breaking%20Bad%20season%201%20poster&w=500&h=750&c=7",
    genre: ["Crime", "Drama"],
    director: "Vince Gilligan",
    plot: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine...",
    cast: ["Bryan Cranston", "Aaron Paul"],
    type: "series",
    duration: "5 Seasons"
  },
  {
    id: "3",
    title: "The Grand Budapest Hotel",
    year: 2014,
    rating: 8.1,
    posterUrl: "https://tse2.mm.bing.net/th?q=The%20Grand%20Budapest%20Hotel%20poster&w=500&h=750&c=7",
    genre: ["Comedy", "Adventure"],
    director: "Wes Anderson",
    plot: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy...",
    cast: ["Ralph Fiennes", "F. Murray Abraham"],
    type: "movie",
    duration: "1h 39m"
  }
];