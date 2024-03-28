import members from "../data/members.json";
import books from "../data/books.json";
import prisma from "../src/config/prisma";

(async function () {
  try {
    const resBooks = await prisma.book.createMany({ data: books });
    const resMembers = await prisma.member.createMany({ data: members });

    console.log({ resBooks, resMembers });
    await prisma.$disconnect();
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
