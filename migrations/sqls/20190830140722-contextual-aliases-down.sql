ALTER TABLE `cqdata`.`aliases` DROP `context`;
ALTER TABLE `cqdata`.`aliases` DROP PRIMARY KEY, ADD PRIMARY KEY (`alias`);
ALTER TABLE `cqdata`.`aliases` ADD KEY `alias_UNIQUE` (`alias`);
