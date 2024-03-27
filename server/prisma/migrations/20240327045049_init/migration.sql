-- CreateTable
CREATE TABLE "Members" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isPenalty" BOOLEAN NOT NULL DEFAULT false,
    "penaltyDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Books" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

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
