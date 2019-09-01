ALTER TABLE `cqdata`.`aliases` ADD COLUMN `context` VARCHAR(25) NULL DEFAULT NULL;
ALTER TABLE `cqdata`.`aliases` DROP PRIMARY KEY, ADD PRIMARY KEY(`alias`, `context`);
ALTER TABLE `cqdata`.`aliases` DROP KEY `alias_UNIQUE`;
