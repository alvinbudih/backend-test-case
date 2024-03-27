import prisma from "../config/prisma";

export default class Book {
  static async getAll() {
    return prisma.book.findMany({
      where: { stock: { gt: 0 } },
      select: { id: true, title: true, code: true, author: true, stock: true },
    });
  }

  static async sumBook() {
    return (await prisma.book.aggregate({ _sum: { stock: true } }))._sum.stock;
  }

  static async getOne(id: string) {
    return prisma.book.findUniqueOrThrow({
      where: { id },
      select: { id: true, title: true, code: true, author: true, stock: true },
    });
  }
}
