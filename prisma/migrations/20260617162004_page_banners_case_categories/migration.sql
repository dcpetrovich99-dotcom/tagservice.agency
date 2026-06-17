-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'white';

-- CreateTable
CREATE TABLE "PageBanner" (
    "id" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageBanner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageBanner_slot_key" ON "PageBanner"("slot");

-- CreateIndex
CREATE INDEX "Case_category_order_idx" ON "Case"("category", "order");
