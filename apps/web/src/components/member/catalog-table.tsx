import React from "react";

type BookRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
};

type CatalogTableProps = {
  books: BookRow[];
};

export function CatalogTable({ books }: CatalogTableProps) {
  if (books.length === 0) {
    return <p>No books available yet.</p>;
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          <th className="border-b py-2">Title</th>
          <th className="border-b py-2">Author</th>
          <th className="border-b py-2">Category</th>
          <th className="border-b py-2">Available</th>
          <th className="border-b py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td className="border-b py-2">{book.title}</td>
            <td className="border-b py-2">{book.author}</td>
            <td className="border-b py-2">{book.category}</td>
            <td className="border-b py-2">{book.availableCopies}</td>
            <td className="border-b py-2">{book.totalCopies}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
