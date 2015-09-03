# ************************************************************
# Sequel Pro SQL dump
# Version 4135
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.34)
# Database: braiv-sails-fresh
# Generation Time: 2015-09-03 19:04:09 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table characters
# ------------------------------------------------------------

DROP TABLE IF EXISTS `characters`;

CREATE TABLE `characters` (
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `hp` int(11) DEFAULT NULL,
  `maxHp` int(11) DEFAULT NULL,
  `xp` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `guild` int(11) DEFAULT NULL,
  `prefix` varchar(255) DEFAULT NULL,
  `gm` tinyint(1) DEFAULT NULL,
  `lastRegen` int(11) DEFAULT NULL,
  `lastAttack` int(11) DEFAULT NULL,
  `target` int(11) DEFAULT NULL,
  `sprite` varchar(255) DEFAULT NULL,
  `mounted` int(11) DEFAULT NULL,
  `attributePoints` int(11) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;

INSERT INTO `characters` (`x`, `y`, `hp`, `maxHp`, `xp`, `level`, `guild`, `prefix`, `gm`, `lastRegen`, `lastAttack`, `target`, `sprite`, `mounted`, `attributePoints`, `map`, `id`, `createdAt`, `updatedAt`, `user`, `name`)
VALUES
	(73,143,40,40,0,1,-1,'',0,0,0,0,'warrior',0,0,'mainland',2,'2015-04-23 18:16:36','2015-09-03 17:20:51',2,'Jeezle'),
	(67,86,40,40,0,1,-1,'',0,0,0,0,'warrior',0,0,'mainland',3,'2014-12-14 02:28:52','2014-12-11 00:13:37',2,'Test2');

/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table encounter
# ------------------------------------------------------------

DROP TABLE IF EXISTS `encounter`;

CREATE TABLE `encounter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) DEFAULT NULL,
  `interval` int(11) DEFAULT NULL,
  `maxNpcs` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `alive` int(11) DEFAULT NULL,
  `spawnTime` int(11) DEFAULT NULL,
  `spawns` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `encounter` WRITE;
/*!40000 ALTER TABLE `encounter` DISABLE KEYS */;

INSERT INTO `encounter` (`id`, `active`, `interval`, `maxNpcs`, `name`, `x`, `y`, `width`, `height`, `map`, `createdAt`, `updatedAt`, `alive`, `spawnTime`, `spawns`)
VALUES
	(1,1,5000,16,'Unnamed Encounter',30,83,24,23,'mainland','2015-09-03 17:30:15','2015-09-03 17:30:15',0,0,NULL),
	(2,1,5000,16,'Unnamed Encounter',42,28,30,29,'mainland','2015-09-03 17:30:15','2015-09-03 17:30:15',0,0,NULL);

/*!40000 ALTER TABLE `encounter` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table encounterspawn
# ------------------------------------------------------------

DROP TABLE IF EXISTS `encounterspawn`;

CREATE TABLE `encounterspawn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `npc` int(11) DEFAULT NULL,
  `minCount` int(11) DEFAULT NULL,
  `maxCount` int(11) DEFAULT NULL,
  `chance` int(11) DEFAULT NULL,
  `encounter` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `encounterspawn` WRITE;
/*!40000 ALTER TABLE `encounterspawn` DISABLE KEYS */;

INSERT INTO `encounterspawn` (`id`, `createdAt`, `updatedAt`, `npc`, `minCount`, `maxCount`, `chance`, `encounter`)
VALUES
	(1,'2015-09-03 17:30:15','2014-12-10 20:44:46',1,4,10,100,1),
	(2,'2015-09-03 17:30:15','2014-12-10 20:44:46',3,2,10,100,1);

/*!40000 ALTER TABLE `encounterspawn` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table fixture
# ------------------------------------------------------------

DROP TABLE IF EXISTS `fixture`;

CREATE TABLE `fixture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `blocks_view` tinyint(1) DEFAULT NULL,
  `blocks_walk` tinyint(1) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `fixture` WRITE;
/*!40000 ALTER TABLE `fixture` DISABLE KEYS */;

INSERT INTO `fixture` (`id`, `createdAt`, `updatedAt`, `name`, `blocks_view`, `blocks_walk`, `visible`)
VALUES
	(1,'2014-12-10 20:44:46','2014-12-10 20:44:46','chair',0,1,1),
	(2,'2014-12-10 20:44:46','2014-12-10 20:44:46','door',1,1,1),
	(3,'2014-12-10 20:44:46','2014-12-10 20:44:46','sign',0,0,1);

/*!40000 ALTER TABLE `fixture` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table inventoryitem
# ------------------------------------------------------------

DROP TABLE IF EXISTS `inventoryitem`;

CREATE TABLE `inventoryitem` (
  `item` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `slot` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `character` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table item
# ------------------------------------------------------------

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `sprite` varchar(255) DEFAULT NULL,
  `animationType` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `quality` int(11) DEFAULT NULL,
  `stack` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;

INSERT INTO `item` (`id`, `name`, `type`, `sprite`, `animationType`, `createdAt`, `updatedAt`, `price`, `quality`, `stack`)
VALUES
	(1,'Gold','currency','gold','static','2014-12-10 20:22:06','2014-12-10 20:22:06',100,1,-1),
	(2,'Dagger','weapon','dagger','static',NULL,NULL,250,1,0);

/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table maptile
# ------------------------------------------------------------

DROP TABLE IF EXISTS `maptile`;

CREATE TABLE `maptile` (
  `id` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `block_walk` int(11) DEFAULT NULL,
  `block_view` int(11) DEFAULT NULL,
  `rgb` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `maptile` WRITE;
/*!40000 ALTER TABLE `maptile` DISABLE KEYS */;

INSERT INTO `maptile` (`id`, `createdAt`, `updatedAt`, `name`, `block_walk`, `block_view`, `rgb`)
VALUES
	(0,'2014-12-10 18:20:44','2014-12-10 18:20:44','null',1,1,'[0,0,0,0]'),
	(1,'2014-12-10 18:20:44','2014-12-10 18:20:44','water',1,0,'[6,44,87,255]'),
	(2,'2014-12-10 18:20:44','2014-12-10 18:20:44','wood',0,0,'[136,88,48,255]'),
	(3,'2014-12-10 18:20:44','2014-12-10 18:20:44','graybrick',1,1,'[0,0,0,0]'),
	(4,'2014-12-10 18:20:44','2014-12-10 18:20:44','graybrick fake',0,1,'[0,0,0,0]'),
	(5,'2014-12-10 18:20:44','2014-12-10 18:20:44','redbrick',0,0,'[0,0,0,0]'),
	(6,'2014-12-10 18:20:44','2014-12-10 18:20:44','bluebrick',0,0,'[0,0,0,0]'),
	(7,'2014-12-10 18:20:44','2014-12-10 18:20:44','wood 2',0,0,'[0,0,0,0]'),
	(8,'2014-12-10 18:20:44','2014-12-10 18:20:44','purple sheen',0,0,'[0,0,0,0]'),
	(9,'2014-12-10 18:20:44','2014-12-10 18:20:44','blue sheen',0,0,'[0,0,0,0]'),
	(10,'2014-12-10 18:20:44','2014-12-10 18:20:44','grass',0,0,'[11,66,21,255]'),
	(11,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(12,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(13,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(14,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(15,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(16,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(17,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(18,'2014-12-10 18:20:44','2014-12-10 18:20:44','shoreline',0,0,'[152,122,62,255]'),
	(19,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(20,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(21,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(22,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(23,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(24,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(25,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(26,'2014-12-10 18:20:44','2014-12-10 18:20:44','dirt',0,0,'[64,48,20,255]'),
	(27,'2014-12-10 18:20:44','2014-12-10 18:20:44','mountain low',1,0,'[0,0,0,0]'),
	(28,'2014-12-10 18:20:44','2014-12-10 18:20:44','unknown',0,0,'[0,0,0,0]'),
	(29,'2014-12-10 18:20:44','2014-12-10 18:20:44','unknown',0,0,'[0,0,0,0]'),
	(30,'2014-12-10 18:20:44','2014-12-10 18:20:44','unknown',0,0,'[0,0,0,0]'),
	(31,'2014-12-10 18:20:44','2014-12-10 18:20:44','mountain low',0,0,'[0,0,0,0]'),
	(32,'2014-12-10 18:20:44','2014-12-10 18:20:44','mountain mid',1,1,'[0,0,0,0]'),
	(33,'2014-12-10 18:20:44','2014-12-10 18:20:44','mountain mid',1,1,'[0,0,0,0]'),
	(34,'2014-12-10 18:20:44','2014-12-10 18:20:44','unknown',0,0,'[0,0,0,0]'),
	(35,'2014-12-10 18:20:44','2014-12-10 18:20:44','unknown',0,0,'[0,0,0,0]'),
	(36,'2014-12-10 18:20:44','2014-12-10 18:20:44','unknown',0,0,'[0,0,0,0]'),
	(37,'2014-12-10 18:20:44','2014-12-10 18:20:44','tree low',0,0,'[0,0,0,0]'),
	(38,'2014-12-10 18:20:44','2014-12-10 18:20:44','tree mid',0,1,'[0,0,0,0]'),
	(39,'2014-12-10 18:20:44','2014-12-10 18:20:44','tree high',1,1,'[0,0,0,0]'),
	(40,'2014-12-10 18:20:44','2014-12-10 18:20:44','rock wall fake',0,1,'[0,0,0,0]'),
	(41,'2014-12-10 18:20:44','2014-12-10 18:20:44','rock wall',1,1,'[0,0,0,0]'),
	(42,'2014-12-10 18:20:44','2014-12-10 18:20:44','unknown',0,0,'[0,0,0,0]');

/*!40000 ALTER TABLE `maptile` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table npc
# ------------------------------------------------------------

DROP TABLE IF EXISTS `npc`;

CREATE TABLE `npc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `banker` tinyint(1) DEFAULT NULL,
  `hostile` tinyint(1) DEFAULT NULL,
  `guard` tinyint(1) DEFAULT NULL,
  `merchent` tinyint(1) DEFAULT NULL,
  `friendly` tinyint(1) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `str` int(11) DEFAULT NULL,
  `dex` int(11) DEFAULT NULL,
  `int` int(11) DEFAULT NULL,
  `con` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `armor` int(11) DEFAULT NULL,
  `minHealth` int(11) DEFAULT NULL,
  `maxHealth` int(11) DEFAULT NULL,
  `sprite` varchar(255) DEFAULT NULL,
  `walkSpeed` int(11) DEFAULT NULL,
  `wanderRange` int(11) DEFAULT NULL,
  `minDamage` int(11) DEFAULT NULL,
  `maxDamage` int(11) DEFAULT NULL,
  `attackSpeed` int(11) DEFAULT NULL,
  `hitChance` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `npc` WRITE;
/*!40000 ALTER TABLE `npc` DISABLE KEYS */;

INSERT INTO `npc` (`id`, `name`, `banker`, `hostile`, `guard`, `merchent`, `friendly`, `level`, `str`, `dex`, `int`, `con`, `width`, `height`, `armor`, `minHealth`, `maxHealth`, `sprite`, `walkSpeed`, `wanderRange`, `minDamage`, `maxDamage`, `attackSpeed`, `hitChance`, `createdAt`, `updatedAt`)
VALUES
	(1,'Guard',0,0,1,0,0,0,0,0,0,0,1,1,0,1800,2000,'guard',200,0,40,60,300,80,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(2,'Merchant',0,0,0,1,1,0,0,0,0,0,1,1,0,180,200,'man',1500,4,20,50,400,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(3,'Snake',0,1,0,0,0,1,0,0,0,0,1,1,0,4,18,'snake',1200,0,1,4,4000,50,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(4,'Orc',0,1,0,0,0,4,3,5,1,5,1,1,0,90,112,'orc',500,0,8,18,1200,80,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(34,'Rat',0,1,0,0,0,2,1,2,1,1,1,1,1,6,18,'rat',200,0,2,8,1500,85,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(46,'Banker',1,0,0,0,1,1,1,1,1,1,1,1,0,100,200,'banker',1000,5,30,40,1000,80,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(47,'Black Ant',0,1,0,0,0,1,1,1,2,1,1,1,2,36,44,'ant_black',900,0,1,2,3500,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(48,'Beetle',0,1,0,0,0,2,0,0,0,0,1,1,3,45,56,'beatle_purple',1500,0,1,3,1100,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(50,'Bat',0,1,0,0,0,3,5,5,1,4,1,1,0,40,60,'bat',250,0,8,16,1150,90,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(52,'Skeleton',0,1,0,0,0,0,7,12,1,12,1,1,30,19000,22000,'skeleton',900,0,12,20,500,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(53,'Zombie',0,1,0,0,0,0,0,0,0,0,1,1,0,50000,21000,'zombie',1000,0,80,110,800,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(54,'Green Ghost',0,1,0,0,0,12,12,15,5,19,1,1,0,252,310,'greenghost',500,0,40,60,500,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(55,'Undead Mage',0,1,0,0,0,0,7,7,7,7,1,1,0,300,400,'undeadmage',450,0,30,48,500,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(56,'Orc Giant',0,1,0,0,0,0,10,10,10,10,1,1,10,325,450,'orcgiant',400,0,18,30,850,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(61,'Ogre',0,1,0,0,0,8,10,10,10,10,1,1,10,171,210,'ogre',500,0,23,40,800,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(64,'Bartender',0,0,0,1,0,6,2,3,2,4,1,1,40,113,139,'man',1500,0,20,40,500,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(68,'Ettin',0,1,0,0,0,10,14,10,2,6,1,1,0,250,425,'ettin',1400,0,30,55,600,100,'2014-12-10 18:21:15','2014-12-10 18:21:15'),
	(69,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `npc` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table permanentnpc
# ------------------------------------------------------------

DROP TABLE IF EXISTS `permanentnpc`;

CREATE TABLE `permanentnpc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `npc` int(11) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `runsShop` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `permanentnpc` WRITE;
/*!40000 ALTER TABLE `permanentnpc` DISABLE KEYS */;

INSERT INTO `permanentnpc` (`id`, `name`, `npc`, `x`, `y`, `runsShop`, `createdAt`, `updatedAt`, `map`)
VALUES
	(1,'Macli',2,61,68,1,NULL,NULL,'mainland');

/*!40000 ALTER TABLE `permanentnpc` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `activated` tinyint(1) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `email`, `password`, `activated`, `createdAt`, `updatedAt`, `username`, `name`, `admin`)
VALUES
	(2,NULL,'3b6eebc053affc3e',1,'2014-12-10 17:53:08','2014-12-10 17:53:08','a',NULL,1);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table worldfixture
# ------------------------------------------------------------

DROP TABLE IF EXISTS `worldfixture`;

CREATE TABLE `worldfixture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fixture` int(11) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `meta` varchar(255) DEFAULT NULL,
  `visible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table worlditem
# ------------------------------------------------------------

DROP TABLE IF EXISTS `worlditem`;

CREATE TABLE `worlditem` (
  `item` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table worldnpc
# ------------------------------------------------------------

DROP TABLE IF EXISTS `worldnpc`;

CREATE TABLE `worldnpc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `npc` int(11) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `encounter` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `lastMove` int(11) DEFAULT NULL,
  `permanent` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
