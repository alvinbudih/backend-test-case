import prisma from "../config/prisma";
import CustomError from "../helpers/errors/CustomError";

export default class Member {
  static async getAll() {
    return prisma.member.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        _count: { select: { MemberBook: true } },
      },
    });
  }

  static async getOne(id: string) {
    return prisma.member.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        _count: { select: { MemberBook: true } },
      },
    });
  }

  static async borrowBook(id: string, bookId: string) {
    return prisma.$transaction(async (tx) => {
      const member = await tx.member.findUniqueOrThrow({
        where: { id },
        include: { MemberBook: true },
      });

      if (member.MemberBook.length >= 2) {
        throw new CustomError("Member may not borrow more than 2 books", 400);
      }

      if (member.isPenalty) {
        let isPenalty = this.getPenalty(member.penaltyDate!, 3);

        if (isPenalty) {
          await tx.member.update({
            where: { id },
            data: { isPenalty: false, penaltyDate: null },
          });
        } else {
          throw new CustomError(
            `Member with penalty are not able to borrow book for 3 days`,
            400
          );
        }
      }

      const book = await tx.book.findUniqueOrThrow({
        where: { id: bookId, stock: { gt: 0 } },
      });

      await tx.memberBook.create({
        data: {
          MemberId: member.id,
          BookId: book.id,
          borrowedDate: new Date(),
        },
      });

      const result = await tx.book.update({
        where: { id: book.id },
        data: { stock: { decrement: 1 } },
      });

      return result;
    });
  }

  static async returnBook(id: string, bookId: string) {
    return prisma.$transaction(async (tx) => {
      const member = await tx.member.findUniqueOrThrow({
        where: { id },
        include: { MemberBook: true },
      });

      const memberBook = await tx.memberBook.findFirstOrThrow({
        where: {
          AND: { MemberId: member.id, BookId: bookId },
        },
      });

      let isPenalty = this.getPenalty(memberBook.borrowedDate, 7);

      const book = await tx.book.findUniqueOrThrow({ where: { id: bookId } });

      await tx.memberBook.deleteMany({
        where: { MemberId: member.id, BookId: book.id },
      });

      await tx.member.update({
        where: { id: member.id },
        data: { isPenalty: true, penaltyDate: new Date() },
      });

      const result = await tx.book.update({
        where: { id: book.id },
        data: { stock: { increment: 1 } },
      });

      return { result, isPenalty };
    });
  }

  static getPenalty(date: Date, days: number) {
    const borrowedDate = new Date(date);
    const today = new Date();

    borrowedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let quarrel = Math.abs(borrowedDate.getTime() - today.getTime());

    let dayInMillisecond = 1000 * 60 * 60 * 24;

    let dateDifference = Math.round(quarrel / dayInMillisecond);

    const isPenalty = dateDifference > days;

    return isPenalty;
  }
}
