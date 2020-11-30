-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: etera_trade
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `database_stock`
--

DROP TABLE IF EXISTS `database_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `database_stock` (
  `idorder` int(11) NOT NULL AUTO_INCREMENT,
  `ordercode` varchar(45) NOT NULL,
  `idmarking` varchar(45) NOT NULL,
  `itemname` varchar(45) NOT NULL,
  `nomor_resi` varchar(45) NOT NULL,
  `jumlah_koli` int(11) NOT NULL,
  `weight_kg` int(11) NOT NULL,
  `cbm_volume` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `cont` int(11) NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'Processing',
  `note` varchar(45) DEFAULT NULL,
  `invetr` varchar(45) DEFAULT NULL,
  `jalur` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idorder`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `database_stock`
--

LOCK TABLES `database_stock` WRITE;
/*!40000 ALTER TABLE `database_stock` DISABLE KEYS */;
INSERT INTO `database_stock` VALUES (1,'ORDER-1','MRK-1','Kucing','RES-1',60,10,20,'2020-11-30 07:47:23',4,'Processing','Ini Kucing','Ga tau','resmi');
/*!40000 ALTER TABLE `database_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packing`
--

DROP TABLE IF EXISTS `packing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packing` (
  `idpacking` int(11) NOT NULL AUTO_INCREMENT,
  `ordercode` varchar(45) NOT NULL,
  `idmarking` varchar(45) NOT NULL,
  `itemname_eng` varchar(45) NOT NULL,
  `itemname_china` varchar(45) DEFAULT NULL,
  `spec` varchar(45) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `note` varchar(45) DEFAULT NULL,
  `supplier` varchar(45) NOT NULL DEFAULT 'no_supplier',
  `supplier_contact` varchar(45) DEFAULT NULL,
  `supplier_url` varchar(45) DEFAULT NULL,
  `total_carton` int(11) NOT NULL DEFAULT '0',
  `material` varchar(45) DEFAULT NULL,
  `brand` varchar(45) NOT NULL DEFAULT 'no_brand',
  `file` varchar(45) DEFAULT NULL,
  `type` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`idpacking`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packing`
--

LOCK TABLES `packing` WRITE;
/*!40000 ALTER TABLE `packing` DISABLE KEYS */;
INSERT INTO `packing` VALUES (1,'ORDER-1','MRK-1','Dragon Ball',NULL,'Super',10,100000,'Packing Yuk','ASUS',NULL,NULL,10,'Plastik','Asus','/pl_file/FILE1606711053502.docx','PL','Accepted');
/*!40000 ALTER TABLE `packing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packing_image`
--

DROP TABLE IF EXISTS `packing_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packing_image` (
  `idimage` int(11) NOT NULL AUTO_INCREMENT,
  `idpacking` int(11) NOT NULL,
  `image` varchar(45) NOT NULL,
  PRIMARY KEY (`idimage`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packing_image`
--

LOCK TABLES `packing_image` WRITE;
/*!40000 ALTER TABLE `packing_image` DISABLE KEYS */;
INSERT INTO `packing_image` VALUES (1,1,'/pl_image/IMG1606711053506.jpeg');
/*!40000 ALTER TABLE `packing_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `iduser` int(11) NOT NULL AUTO_INCREMENT,
  `idmarking` varchar(45) NOT NULL,
  `fullname` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `noWhatsapp` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `image_ktp` varchar(45) NOT NULL,
  `provinsi` varchar(45) NOT NULL,
  `kota` varchar(45) NOT NULL,
  `kecamatan` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'unverified',
  `role` varchar(45) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'MRK-Admin','Admin','admin@mail.com','6288902080000','$2a$10$tZnym4xi30e/pwUr/7tHiewHIkTaBo5wsv5CRhp4vgqM/2lLlgify','/ktp/IMG1606456942386.jpg','Jakarta','Jakarta Pusat','tanah abang','jl. merpati no 02','verified','admin'),(2,'MRK-1','Wowo','wowo@mail.com','6288299593943','$2a$10$FdmdE4o3RCCH9wqhBIt3hOa8mflYtBY/oAnP2mBffxhp5tdnAlO0S','/ktp/IMG1606708139188.jpg','Jawa Barat','Bandung','Buah Hati','jl. Buah Hati No 1945','verified','user'),(3,'MRK-2','Adel','adel@mail.com','6288902080834','$2a$10$Kd66idqB8BJ1R8dGpEzuMOGMU4AS4LzJrJtAwIm68qZw5ccOTA/CC','/ktp/IMG1606730814386.jpg','Jawa Barat','Bandung','Buah Batu','jl. Buah Batu No 1945','verified','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-30 18:46:30
