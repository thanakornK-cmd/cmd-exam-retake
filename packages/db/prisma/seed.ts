import { PrismaClient } from "@prisma/client";
import { pathToFileURL } from "node:url";

const prisma = new PrismaClient();

export async function main() {
  await prisma.book.createMany({
    data: seededBooks,
    skipDuplicates: true,
  });
}

export const seededBooks = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "textbook",
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "textbook",
    totalCopies: 2,
    availableCopies: 2,
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "general",
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "general",
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "general",
    totalCopies: 5,
    availableCopies: 5,
  },
  {
    title: "One Piece Vol. 1",
    author: "Eiichiro Oda",
    category: "novel",
    totalCopies: 6,
    availableCopies: 6,
  },
  {
    title: "Kafka on the Shore",
    author: "Haruki Murakami",
    category: "novel",
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: "Spy x Family Vol. 1",
    author: "Tatsuya Endo",
    category: "novel",
    totalCopies: 4,
    availableCopies: 4,
  },
] as const;

const isDirectExecution = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;

if (isDirectExecution) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
