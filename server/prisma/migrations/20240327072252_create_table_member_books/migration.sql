-- CreateTable
CREATE TABLE "MemberBooks" (
    "id" TEXT NOT NULL,
    "MemberId" TEXT NOT NULL,
    "BookId" TEXT NOT NULL,
    "borrowedDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberBooks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberBooks" ADD CONSTRAINT "MemberBooks_MemberId_fkey" FOREIGN KEY ("MemberId") REFERENCES "Members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberBooks" ADD CONSTRAINT "MemberBooks_BookId_fkey" FOREIGN KEY ("BookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
