import { z } from "zod";
import { BOOK_CATEGORIES } from "./contracts";

export const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  category: z.enum(BOOK_CATEGORIES),
  totalCopies: z.number().int().positive(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export function initializeBookInventory(book: CreateBookInput) {
  return {
    ...book,
    availableCopies: book.totalCopies,
  };
}
