/*
  Warnings:

  - You are about to drop the `MemberBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemberBooks" DROP CONSTRAINT "MemberBooks_BookId_fkey";

-- DropForeignKey
ALTER TABLE "MemberBooks" DROP CONSTRAINT "MemberBooks_MemberId_fkey";

-- DropTable
DROP TABLE "MemberBooks";
