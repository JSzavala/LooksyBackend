-- MySQL Workbench Forward Engineering
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- drop database VentasDB;
-- -----------------------------------------------------
-- Schema mydbx
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema VentasDB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema VentasDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `VentasDB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `VentasDB` ;

-- -----------------------------------------------------
-- Table `VentasDB`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `rol` ENUM('cliente', 'tienda') NOT NULL default 'cliente',
  PRIMARY KEY (`idUsuario`),
  UNIQUE INDEX `correo` (`correo` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Articulo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Articulo` (
  `idArticulo` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`idArticulo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Cliente` (
  `idCliente` INT NOT NULL AUTO_INCREMENT,
  `preferencia` VARCHAR(100) NULL DEFAULT NULL,
  `listaDeDeseos` TEXT NULL DEFAULT NULL,
  `idUsuario` INT NOT NULL,
  PRIMARY KEY (`idCliente`),
  INDEX `idUsuario_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `idUsuario`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `VentasDB`.`Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Compra` (
  `idCompra` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `estado` VARCHAR(50) NOT NULL,
  `tiempoEntrega` INT NULL DEFAULT NULL,
  `cantidadArticulos` INT NOT NULL,
  `idCliente` INT NOT NULL,
  PRIMARY KEY (`idCompra`),
  INDEX `idCliente` (`idCliente` ASC) VISIBLE,
  CONSTRAINT `Compra_ibfk_1`
    FOREIGN KEY (`idCliente`)
    REFERENCES `VentasDB`.`Cliente` (`idCliente`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Tienda`
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Tienda` (
  `idTienda` INT NOT NULL AUTO_INCREMENT,
  `nombreTienda` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `contacto` VARCHAR(100) NOT NULL,
  `idAdministrador` INT NOT NULL,
  PRIMARY KEY (`idTienda`),
  INDEX `idAdministrador` (`idAdministrador` ASC) VISIBLE,
  CONSTRAINT `Tienda_ibfk_1`
    FOREIGN KEY (`idAdministrador`)
    REFERENCES `VentasDB`.`Usuario` (`idUsuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Venta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Venta` (
  `idVenta` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(50) NOT NULL,
  `fecha` DATETIME NOT NULL,
  `idTienda` INT NOT NULL,
  `idCliente` INT NOT NULL,
  PRIMARY KEY (`idVenta`),
  INDEX `idTienda` (`idTienda` ASC) VISIBLE,
  INDEX `idCliente` (`idCliente` ASC) VISIBLE,
  CONSTRAINT `Venta_ibfk_1`
    FOREIGN KEY (`idTienda`)
    REFERENCES `VentasDB`.`Tienda` (`idTienda`)
    ON DELETE CASCADE,
  CONSTRAINT `Venta_ibfk_2`
    FOREIGN KEY (`idCliente`)
    REFERENCES `VentasDB`.`Cliente` (`idCliente`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`DetalleVenta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`DetalleVenta` (
  `idVenta` INT NOT NULL,
  `idArticulo` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`idVenta`, `idArticulo`),
  INDEX `idArticulo` (`idArticulo` ASC) VISIBLE,
  CONSTRAINT `DetalleVenta_ibfk_1`
    FOREIGN KEY (`idVenta`)
    REFERENCES `VentasDB`.`Venta` (`idVenta`)
    ON DELETE CASCADE,
  CONSTRAINT `DetalleVenta_ibfk_2`
    FOREIGN KEY (`idArticulo`)
    REFERENCES `VentasDB`.`Articulo` (`idArticulo`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Pago` (
  `idPago` INT NOT NULL AUTO_INCREMENT,
  `metodo` VARCHAR(50) NOT NULL,
  `estado` VARCHAR(50) NOT NULL,
  `fechaAutorizacion` DATETIME NOT NULL,
  `idCompra` INT NOT NULL,
  PRIMARY KEY (`idPago`),
  INDEX `idCompra` (`idCompra` ASC) VISIBLE,
  CONSTRAINT `Pago_ibfk_1`
    FOREIGN KEY (`idCompra`)
    REFERENCES `VentasDB`.`Compra` (`idCompra`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Producto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Producto` (
  `idProducto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `disponible` TINYINT(1) NOT NULL DEFAULT 1,
  `idTienda` INT NOT NULL,
  PRIMARY KEY (`idProducto`),
  INDEX `idTienda` (`idTienda` ASC) VISIBLE,
  CONSTRAINT `Producto_ibfk_1`
    FOREIGN KEY (`idTienda`)
    REFERENCES `VentasDB`.`Tienda` (`idTienda`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`Etiqueta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`Etiqueta` (
  `idEtiqueta` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idEtiqueta`),
  UNIQUE INDEX `nombre` (`nombre` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `VentasDB`.`ProductoEtiqueta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `VentasDB`.`ProductoEtiqueta` (
  `idProducto` INT NOT NULL,
  `idEtiqueta` INT NOT NULL,
  PRIMARY KEY (`idProducto`, `idEtiqueta`),
  INDEX `idEtiqueta` (`idEtiqueta` ASC) VISIBLE,
  CONSTRAINT `ProductoEtiqueta_ibfk_1`
    FOREIGN KEY (`idProducto`)
    REFERENCES `VentasDB`.`Producto` (`idProducto`)
    ON DELETE CASCADE,
  CONSTRAINT `ProductoEtiqueta_ibfk_2`
    FOREIGN KEY (`idEtiqueta`)
    REFERENCES `VentasDB`.`Etiqueta` (`idEtiqueta`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
