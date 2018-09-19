ALTER TABLE `cqdata`.`stats` ADD COLUMN `timestamp` DATETIME NULL DEFAULT NOW() AFTER `target`;
