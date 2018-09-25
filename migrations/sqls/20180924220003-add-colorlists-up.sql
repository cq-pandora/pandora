CREATE TABLE `cqdata`.`color_lists` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `server_id` VARCHAR(25) NOT NULL,
  `target_id` VARCHAR(25) NOT NULL,
  `mode` BIT NOT NULL COMMENT '1 for whitelist\n0 for whitelist',
  `commands` TEXT NOT NULL COMMENT 'comma-separated commands list\n',
  `target_type` VARCHAR(10) NOT NULL COMMENT 'channel, user or group',
  `priority` INT NULL,
  PRIMARY KEY (`id`));