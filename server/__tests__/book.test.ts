import supertest from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Book Entity", () => {
  describe("GET /books", () => {
    it("should success get all books and return status 200", async () => {
      const response = await supertest(app).get("/books");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("books", expect.any(Array));
      expect(response.body).toHaveProperty("quantity", expect.any(Number));
    });
  });

  describe("GET /books/:id", () => {
    it("should success get one book by id and return status 200", async () => {
      const bookId = (await prisma.book.findFirst())?.id;
      const response = await supertest(app).get(`/books/${bookId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", bookId);
    });

    it("should failed get one book by id and return status 404", async () => {
      const bookId = "50758bf1-eae1-4307-872d-4aac80777b84";
      const response = await supertest(app).get(`/books/${bookId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No Book found");
    });
  });
});
