import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  category: z.string().min(1),
  totalCopies: z.number().int().positive(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export function initializeBookInventory(book: CreateBookInput) {
  return {
    ...book,
    availableCopies: book.totalCopies,
  };
}
