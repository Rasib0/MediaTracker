-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "book_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserJoinBook" (
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Rating" INTEGER NOT NULL,
    "Review" TEXT,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "bookId"),
    CONSTRAINT "UserJoinBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserJoinBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_book_url_key" ON "Book"("book_url");
