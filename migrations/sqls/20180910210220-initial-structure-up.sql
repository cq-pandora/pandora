DROP TABLE IF EXISTS `aliases`;
CREATE TABLE `aliases` (
  `alias` varchar(50) NOT NULL,
  `for` varchar(45) NOT NULL,
  `status` bit(1) DEFAULT NULL,
  PRIMARY KEY (`alias`),
  UNIQUE KEY `alias_UNIQUE` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `stats`;
CREATE TABLE `stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `arguments` text,
  `user_id` varchar(25) NOT NULL,
  `channel_id` varchar(25) NOT NULL,
  `sent_to` varchar(10) NOT NULL,
  `content` text NOT NULL,
  `status_code` int(11) NOT NULL,
  `command` varchar(45) NOT NULL,
  `server` varchar(25) DEFAULT NULL,
  `target` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `translations`;
CREATE TABLE `translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `status` bit(1) DEFAULT NULL,
  `version` varchar(10) NOT NULL DEFAULT '0.0.0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;