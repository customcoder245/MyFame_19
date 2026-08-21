// ─────────────────────────────────────────────
//  stickerApi.ts  –  Sticker fetch & search
// ─────────────────────────────────────────────

const BASE_URL = "https://myfame.com/wp-json/stickers/v1";

export interface Sticker {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  asset_url: string;
  thumbnail_url: string;
  width: string;
  height: string;
  file_size: string;
  mime_type: string;
  is_featured: string;
}

export interface StickersResponse {
  status: boolean;
  count: number;
  data: Sticker[];
}

/**
 * Fetch all stickers (default, no filter)
 */
export const fetchAllStickers = async (): Promise<Sticker[]> => {
  try {
    const response = await fetch(`${BASE_URL}/stickers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: StickersResponse = await response.json();

    if (!json.status) {
      throw new Error("API returned status false");
    }

    return json.data;
  } catch (error) {
    console.error("fetchAllStickers error:", error);
    throw error;
  }
};

/**
 * Fetch stickers filtered by category name (case-insensitive)
 * Searches via query param if API supports it, otherwise filters client-side
 */
export const fetchStickersByCategory = async (
  categoryName: string
): Promise<Sticker[]> => {
  try {
    // Try fetching with category param first
    const encodedCategory = encodeURIComponent(categoryName.trim());
    const url = `${BASE_URL}/stickers?category=${encodedCategory}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: StickersResponse = await response.json();

    if (!json.status) {
      return [];
    }

    // Also do a client-side filter as fallback in case the API ignores the param
    const filtered = json.data.filter((sticker) =>
      sticker.category_name
        .toLowerCase()
        .includes(categoryName.toLowerCase().trim())
    );

    return filtered;
  } catch (error) {
    console.error("fetchStickersByCategory error:", error);
    throw error;
  }
};

/**
 * Get unique categories from a list of stickers
 */
export const getUniqueCategories = (stickers: Sticker[]): string[] => {
  const seen = new Set<string>();
  const categories: string[] = [];

  for (const sticker of stickers) {
    if (!seen.has(sticker.category_name)) {
      seen.add(sticker.category_name);
      categories.push(sticker.category_name);
    }
  }

  return categories;
};