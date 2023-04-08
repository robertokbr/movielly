/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_users" ("id", "password", "username") SELECT "id", "password", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE TABLE "new_reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movie" TEXT NOT NULL,
    CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reviews" ("comment", "id", "imageUrl", "movie", "rating", "userId") SELECT "comment", "id", "imageUrl", "movie", "rating", "userId" FROM "reviews";
DROP TABLE "reviews";
ALTER TABLE "new_reviews" RENAME TO "reviews";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
