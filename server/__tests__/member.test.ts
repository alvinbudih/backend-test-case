import supertest from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import app from "../src/app";
import { PrismaClient } from "@prisma/client";
import { afterEach } from "node:test";

const prisma = new PrismaClient();
let memberId: string;

beforeAll(async () => {
  memberId = (
    await prisma.member.create({ data: { name: "Test", code: "M000" } })
  ).id;
});

afterAll(async () => {
  await prisma.member.delete({ where: { id: memberId } });
});

afterEach(async () => {
  await prisma.memberBook.deleteMany({ where: { MemberId: memberId } });
});

describe("Member Entity", () => {
  describe("GET /members", () => {
    it("should success get all members and return status 200", async () => {
      const response = await supertest(app).get("/members");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("GET /members/:id", () => {
    it("should success get one member by id and return status 200", async () => {
      const response = await supertest(app).get(`/members/${memberId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", memberId);
    });

    it("should failed get one member by id and return status 404", async () => {
      const bookId = "50758bf1-eae1-4307-872d-4aac80777b84";
      const response = await supertest(app).get(`/members/${bookId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No Member found");
    });
  });

  describe("PATCH /members/:id/borrow/:bookId", () => {
    it("should success to member borrow book and return status 201", async () => {
      const book = await prisma.book.findFirst();

      const response = await supertest(app).patch(
        `/members/${memberId}/borrow/${book?.id}`
      );

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id", book?.id);
      await supertest(app).patch(`/members/${memberId}/return/${book?.id}`);
    });

    it("should failed to member borrow book more than 2 and return status 400", async () => {
      const harryPotter = await prisma.book.findFirstOrThrow({
        where: { title: "Harry Potter" },
      });
      const twilight = await prisma.book.findFirstOrThrow({
        where: { title: "Twilight" },
      });
      const book = await prisma.book.findFirst();

      await supertest(app).patch(
        `/members/${memberId}/borrow/${harryPotter?.id}`
      );
      await supertest(app).patch(`/members/${memberId}/borrow/${twilight?.id}`);

      const response = await supertest(app).patch(
        `/members/${memberId}/borrow/${book?.id}`
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Member may not borrow more than 2 books"
      );

      await supertest(app).patch(
        `/members/${memberId}/return/${harryPotter.id}`
      );
      await supertest(app).patch(`/members/${memberId}/return/${twilight.id}`);
    });

    it("should failed to member who got penalty borrow book and return status 400", async () => {
      await prisma.member.update({
        where: { id: memberId },
        data: { isPenalty: true, penaltyDate: new Date() },
      });
      const book = await prisma.book.findFirst();

      const response = await supertest(app).patch(
        `/members/${memberId}/borrow/${book?.id}`
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Member with penalty are not able to borrow book for 3 days"
      );

      await prisma.member.update({
        where: { id: memberId },
        data: { isPenalty: false, penaltyDate: null },
      });
    });

    it("should failed to member borrow book if book doesn't exist and return status 404", async () => {
      const bookId = "50758bf1-eae1-4307-872d-4aac80777b84";

      const response = await supertest(app).patch(
        `/members/${memberId}/borrow/${bookId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No Book found");
    });

    it("should failed to member borrow book if member doesn't exist and return status 404", async () => {
      const book = await prisma.book.findFirst();
      const wrongId = "50758bf1-eae1-4307-872d-4aac80777b84";

      const response = await supertest(app).patch(
        `/members/${wrongId}/borrow/${book?.id}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No Member found");
    });
  });

  describe("PATCH /members/:id/return/:bookId", () => {
    it("should success to member return book and return status 200", async () => {
      const book = await prisma.book.findFirst();

      await supertest(app).patch(`/members/${memberId}/borrow/${book?.id}`);

      const response = await supertest(app).patch(
        `/members/${memberId}/return/${book?.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("book");
      expect(response.body).toHaveProperty("isPenalty", false);
    });

    it("should success to member return book with penalty and return status 200", async () => {
      const book = await prisma.book.findFirst();

      await supertest(app).patch(`/members/${memberId}/borrow/${book?.id}`);

      const eightDaysAgo = new Date(new Date().getDate() - 8);
      await prisma.memberBook.updateMany({
        data: { borrowedDate: eightDaysAgo },
        where: { MemberId: memberId, BookId: book?.id },
      });

      const response = await supertest(app).patch(
        `/members/${memberId}/return/${book?.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("book");
      expect(response.body).toHaveProperty("isPenalty", true);

      await prisma.member.update({
        where: { id: memberId },
        data: { isPenalty: false, penaltyDate: null },
      });
    });

    it("should failed to member return book if book doesn't exist and return status 404", async () => {
      const bookId = "50758bf1-eae1-4307-872d-4aac80777b84";

      const response = await supertest(app).patch(
        `/members/${memberId}/return/${bookId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No MemberBook found");
    });

    it("should failed to member borrow book if member doesn't exist and return status 404", async () => {
      const book = await prisma.book.findFirst();
      const wrongId = "50758bf1-eae1-4307-872d-4aac80777b84";

      const response = await supertest(app).patch(
        `/members/${wrongId}/return/${book?.id}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No Member found");
    });
  });
});
