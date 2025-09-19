import { query } from "../strapi";

// Types for the function parameters
interface CreateMenuParams {
  date: string;
  full_name: string;
  documentId?: string | null;
  table: string;
  Seating: string;
  slug: string;
}

// Custom error class for menu creation errors
class MenuCreationError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'MenuCreationError';
  }
}

/**
 * Creates a new menu entry in Strapi CMS
 * @param {CreateMenuParams} params - The parameters for creating a menu
 * @returns {Promise<any>} The created menu data
 * @throws {MenuCreationError} When menu creation fails
 */
export async function createMenus({
  date,
  full_name,
  documentId = null,
  table,
  Seating,
  slug,
}: CreateMenuParams): Promise<any> {
  // Input validation
  if (!date || !full_name || !table || !Seating || !slug) {
    throw new MenuCreationError('Missing required fields');
  }

  try {
    // Create the base menu data structure
    const menuData = {
      Date: date,
      Title: `${full_name}-${date}`,
      slug: `${slug}-${date}`,
      table,
      Seating,
      ...(documentId && { resident: documentId }),
    };

    const body = { data: menuData };

    const response = await query("menus", 'POST', body);

    if (!response || response.error) {
      throw new MenuCreationError(
        'Failed to create menu',
        response?.error
      );
    }

    return response;
  } catch (error) {
    // Log the error with more context
    console.error("Error creating menu:", {
      error,
      params: { date, full_name, table, Seating, slug },
    });

    // Throw a custom error with the original error attached
    throw new MenuCreationError(
      error instanceof Error ? error.message : 'Unknown error creating menu',
      error
    );
  }
}
