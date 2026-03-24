-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('CUSTOMER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerficationCode` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,
    `UserId` VARCHAR(191) NOT NULL,
    `CreateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VerficationCode_UserId_idx`(`UserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seller` (
    `id` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `bussType` ENUM('ELECTRONICS', 'CLOTH', 'FURNITURE') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Seller_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    UNIQUE INDEX `Category_parentId_key`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `images` JSON NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discountPrice` DECIMAL(10, 2) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `tags` JSON NOT NULL,
    `sellerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Product_categoryId_key`(`categoryId`),
    UNIQUE INDEX `Product_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Variant` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `attributes` JSON NOT NULL,
    `stock` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discountPrice` DECIMAL(10, 2) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Variant_sku_key`(`sku`),
    UNIQUE INDEX `Variant_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Order_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItems` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'PENDING',
    `CreateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrderItems_orderId_key`(`orderId`),
    UNIQUE INDEX `OrderItems_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VerficationCode` ADD CONSTRAINT `VerficationCode_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seller` ADD CONSTRAINT `Seller_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Variant` ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItems` ADD CONSTRAINT `OrderItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
