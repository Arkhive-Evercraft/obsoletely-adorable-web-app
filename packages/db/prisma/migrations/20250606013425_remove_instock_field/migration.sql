-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Product_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ProductSale" (
    "saleId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "priceAtSale" INTEGER NOT NULL,

    PRIMARY KEY ("saleId", "itemId"),
    CONSTRAINT "ProductSale_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductSale_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
