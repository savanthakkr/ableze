-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 23, 2024 at 11:38 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ablaze`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `quantity` varchar(50) NOT NULL,
  `status` varchar(10) DEFAULT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `status`, `order_id`, `created_at`, `updated_at`) VALUES
(1, '1', '1', '4', '1', NULL, '2024-08-07 06:51:31', '2024-08-09 06:54:11'),
(2, '1', '1', '1', '1', NULL, '2024-08-09 07:12:08', '2024-08-09 07:12:19'),
(3, '1', '2', '1', '1', NULL, '2024-08-09 07:12:09', '2024-08-09 07:12:19'),
(4, '1', '1', '1', '1', '4', '2024-08-09 10:17:14', '2024-08-09 10:17:52'),
(5, '1', '2', '1', '1', '4', '2024-08-09 10:17:15', '2024-08-09 10:17:52'),
(6, '1', '1', '2', '1', '5', '2024-08-09 11:13:39', '2024-08-09 11:29:21'),
(7, '1', '2', '2', '1', '5', '2024-08-09 11:14:48', '2024-08-09 11:29:21'),
(15, '1', '19', '1', '1', '6', '2024-08-13 17:29:26', '2024-08-13 17:31:04'),
(16, '1', '1', '1', '1', '6', '2024-08-13 17:29:27', '2024-08-13 17:31:04'),
(17, '1', '20', '1', '1', '6', '2024-08-13 17:30:45', '2024-08-13 17:31:04'),
(18, '1', '19', '1', '1', '7', '2024-08-14 15:06:01', '2024-08-14 15:06:59'),
(19, '1', '20', '1', '1', '7', '2024-08-14 15:06:18', '2024-08-14 15:06:59');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `title` varchar(250) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `title`, `created_at`, `updated_at`) VALUES
(1, 'first', '2024-07-31 09:37:17', '2024-07-31 09:37:17'),
(2, 'second', '2024-08-13 17:28:01', '2024-08-13 17:28:01'),
(3, 'third', '2024-08-13 17:29:47', '2024-08-13 17:29:47');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `table_number` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `product_id`, `quantity`, `table_number`, `order_date`) VALUES
(1, 1, 1, 4, 2, '2024-08-09 06:54:11'),
(2, 1, 1, 1, 2, '2024-08-09 07:12:19'),
(3, 1, 2, 1, 2, '2024-08-09 07:12:19'),
(4, 1, NULL, NULL, 5, '2024-08-09 10:17:52'),
(5, 1, NULL, NULL, 2, '2024-08-09 11:29:21'),
(6, 1, NULL, NULL, 3, '2024-08-13 17:31:04'),
(7, 1, NULL, NULL, 3, '2024-08-14 15:06:59');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `category_id` varchar(50) DEFAULT NULL,
  `sub_category_id` varchar(50) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(250) NOT NULL,
  `price` varchar(150) DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `sub_category_id`, `title`, `description`, `price`, `image`, `status`, `created_at`, `updated_at`) VALUES
(1, '1', '1', 'product', 'product description', '399', NULL, NULL, '2024-07-31 10:22:03', '2024-07-31 10:22:03'),
(19, '2', '2', 'sdsd', 'sdsd', NULL, 'uploads/1723555446363.png', NULL, '2024-08-13 13:24:06', '2024-08-13 13:24:06'),
(20, '3', '3', 'third', 'third category item', NULL, 'uploads/1723570234717.png', NULL, '2024-08-13 17:30:34', '2024-08-13 17:30:34');

-- --------------------------------------------------------

--
-- Table structure for table `subCategory`
--

CREATE TABLE `subCategory` (
  `id` int(11) NOT NULL,
  `category_id` varchar(150) DEFAULT NULL,
  `title` varchar(250) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subCategory`
--

INSERT INTO `subCategory` (`id`, `category_id`, `title`, `created_at`, `updated_at`) VALUES
(1, '1', 'Sub First', '2024-08-06 07:10:33', '0000-00-00 00:00:00'),
(2, '2', 'second', '2024-08-13 17:28:59', '0000-00-00 00:00:00'),
(3, '3', 'third', '2024-08-13 17:30:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(250) NOT NULL,
  `phone` varchar(150) NOT NULL,
  `tableNumber` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `phone`, `tableNumber`, `created_at`, `updated_at`) VALUES
(1, 'savan', 'savan11@gmail.com', '84602169', '3', '2024-07-17 08:32:04', '2024-07-17 08:32:04'),
(2, 'savan thakkr', 'savanthakkr11@gmail.com', '8460216961', NULL, '2024-08-08 06:53:19', '2024-08-08 06:53:19'),
(3, 'savan', 'savanthakkr2003@gmail.com', '8000919579', '3', '2024-08-10 13:39:02', '2024-08-10 13:39:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subCategory`
--
ALTER TABLE `subCategory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `subCategory`
--
ALTER TABLE `subCategory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
