
CREATE DATABASE IF NOT EXISTS `db_hackerthon` ;
USE `db_hackerthon`;

CREATE TABLE IF NOT EXISTS `account` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `user_uuid` text DEFAULT NULL,
  `registered_date` date DEFAULT NULL,
  `user_id` text DEFAULT NULL,
  `user_pw` text DEFAULT NULL,
  `user_nick` text DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `daegu_weather` (
  `nx` int(11) DEFAULT NULL,
  `ny` int(11) DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `image_table` (
  `image_uuid` text DEFAULT NULL,
  `board_uuid` text DEFAULT NULL,
  `content` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `public_data` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `item_type` text NOT NULL,
  `latitude` double NOT NULL DEFAULT 0,
  `longitude` double NOT NULL DEFAULT 0,
  `reserved1` text DEFAULT NULL,
  `reserved2` text DEFAULT NULL,
  `reserved3` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=4032 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `reaction_user` (
  `idx` int(11) DEFAULT NULL,
  `user_uuid` text DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `user_job` text DEFAULT NULL,
  `is_certificated` int(11) DEFAULT NULL,
  `category` text DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `thread_comment` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `category` text DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `comment_uuid` text DEFAULT NULL,
  `board_uuid` text DEFAULT NULL,
  `user_uuid` text DEFAULT NULL,
  `wrote_date` timestamp NULL DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `comment` text DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `threat_board` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `board_uuid` text DEFAULT NULL,
  `user_uuid` text DEFAULT NULL,
  `wrote_date` timestamp NULL DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `title` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `comment_size` int(11) DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=453 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `weather` (
  `Idx` int(11) NOT NULL,
  `baseDate` date DEFAULT NULL,
  `baseTime` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `fcstValue` text DEFAULT NULL,
  `nx` int(11) DEFAULT NULL,
  `ny` int(11) DEFAULT NULL,
  `start_latitude` double DEFAULT NULL,
  `start_longitude` double DEFAULT NULL,
  `end_latitude` double DEFAULT NULL,
  `end_longitude` double DEFAULT NULL,
  PRIMARY KEY (`Idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

