/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Class` table. All the data in the column will be lost.
  - Added the required column `room` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "public"."Class" DROP COLUMN "dayOfWeek",
DROP COLUMN "startTime",
ADD COLUMN     "room" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."ClassSchedule" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "weekday" "public"."Weekday" NOT NULL,
    "monitor" TEXT NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ClassSchedule" ADD CONSTRAINT "ClassSchedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
