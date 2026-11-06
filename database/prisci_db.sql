-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2026 a las 21:26:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prisci_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivo`
--

CREATE TABLE `archivo` (
  `IdArchivo` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Tipo` varchar(20) NOT NULL,
  `Ruta` varchar(255) NOT NULL,
  `IdInspeccion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `IdComentario` int(11) NOT NULL,
  `Comentario` text NOT NULL,
  `Fecha` date NOT NULL,
  `IdInspeccion` int(11) NOT NULL,
  `IdUsu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conservador`
--

CREATE TABLE `conservador` (
  `IdConservador` int(11) NOT NULL,
  `Matricula` varchar(50) NOT NULL,
  `Empresa` varchar(100) DEFAULT NULL,
  `IdUsu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `conservador`
--

INSERT INTO `conservador` (`IdConservador`, `Matricula`, `Empresa`, `IdUsu`) VALUES
(1, 'MAT-2024-88', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inmueble`
--

CREATE TABLE `inmueble` (
  `IdInmueble` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Domicilio` varchar(200) NOT NULL,
  `NomenclaturaCatastral` varchar(100) NOT NULL,
  `Superficie` decimal(10,2) DEFAULT NULL CHECK (`Superficie` > 0),
  `Actividad` varchar(100) DEFAULT NULL,
  `CantMatafuego` int(11) DEFAULT 0 CHECK (`CantMatafuego` >= 0),
  `RedAgua` tinyint(1) DEFAULT 0,
  `EstadoSistema` text DEFAULT NULL,
  `IdPropietario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inmueble`
--

INSERT INTO `inmueble` (`IdInmueble`, `Nombre`, `Domicilio`, `NomenclaturaCatastral`, `Superficie`, `Actividad`, `CantMatafuego`, `RedAgua`, `EstadoSistema`, `IdPropietario`) VALUES
(1, 'Edificio Torres del Limay', 'Av. Corrientes 1234', 'NC-001-A', 450.50, 'Comercial', 6, 1, 'Vigente', 1),
(2, 'Galería Comercial Centro', 'Av. Las Heras 4321', 'NC-002-B', 1200.00, 'Residencial', 12, 1, 'Vigente', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inspeccion`
--

CREATE TABLE `inspeccion` (
  `IdInspeccion` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Resultado` varchar(50) NOT NULL,
  `Observaciones` text DEFAULT NULL,
  `IdInmueble` int(11) NOT NULL,
  `IdConservador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inspeccion`
--

INSERT INTO `inspeccion` (`IdInspeccion`, `Fecha`, `Resultado`, `Observaciones`, `IdInmueble`, `IdConservador`) VALUES
(1, '2026-10-09', 'Aprobado', 'Revisión mensual de extintores y mangueras OK', 1, 1),
(2, '2026-10-14', 'Pendiente', 'Inspección de bomba contra incendios pendiente', 2, 1),
(3, '2024-03-15', 'Aprobado', 'Sin observaciones en la prueba de presión', 1, 1),
(4, '2026-10-08', 'Con observaciones', 'Rakata rakata', 1, 1),
(5, '2026-10-09', 'Aprobado', 'Parte N°: PR-2026-4239. Relevamiento completado.', 1, 1),
(6, '2026-10-09', 'Aprobado', 'Parte N°: PR-2026-8060. Relevamiento completado.', 2, 1),
(7, '2026-10-09', 'Pendiente', 'Parte N°: PR-2026-3666. Relevamiento completado.', 1, 1),
(8, '2026-10-09', 'Aprobado', 'Parte N°: PR-2026-8728. Relevamiento completado.', 1, 1),
(9, '2026-10-10', 'Aprobado', '{\"parteNro\":\"PR-2026-2582\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 1, 1),
(10, '2026-10-10', 'Aprobado', '{\"parteNro\":\"PR-2026-5958\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":true,\"tieneFirmaProf\":true}', 1, 1),
(11, '2026-10-10', 'Aprobado', '{\"parteNro\":\"PR-2026-9074\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 1, 1),
(12, '2026-10-11', 'Con observaciones', '{\"parteNro\":\"PR-2026-3720\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"Le falta extintor\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Con observaciones\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Con observaciones\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":true,\"tieneFirmaProf\":true}', 1, 1),
(13, '2026-10-11', 'Con observaciones', '{\"parteNro\":\"PR-2026-3442\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Galería Comercial Centro\",\"domicilio\":\"Gral. Las Heras 450, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Con observaciones\",\"obs\":\"lll\"},\"lucesEmergencia\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Con observaciones\",\"obs\":\"lllll\"},\"instalacionElectrica\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 2, 1),
(14, '2026-10-11', 'Aprobado', '{\"parteNro\":\"PR-2026-9135\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"No aplica\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 1, 1),
(15, '2026-10-11', 'Aprobado', '{\"parteNro\":\"Prueba\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Galería Comercial Centro\",\"domicilio\":\"Gral. Las Heras 450, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"No aplica\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 2, 1),
(16, '2026-10-11', 'Aprobado', '{\"parteNro\":\"PR-2026-8765\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Galería Comercial Centro\",\"domicilio\":\"Gral. Las Heras 450, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"Inspección vía de escape pendiente\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 2, 1),
(17, '2023-01-08', 'Aprobado', '{\"parteNro\":\"PR-2026-4285\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Galería Comercial Centro\",\"domicilio\":\"Gral. Las Heras 450, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"Inspección de luces de emergencia pendiente\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"No aplica\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 2, 1),
(18, '2026-10-16', 'Con observaciones', '{\"parteNro\":\"PR-2026-1142\",\"empresaCliente\":\"Juan Pérez\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Con observaciones\",\"obs\":\"mal hechas \"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Con observaciones\",\"obs\":\"no anda ninguno xd \"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipal`
--

CREATE TABLE `municipal` (
  `IdMunicipal` int(11) NOT NULL,
  `IdUsu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propietario`
--

CREATE TABLE `propietario` (
  `IdPropietario` int(11) NOT NULL,
  `IdUsu` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `propietario`
--

INSERT INTO `propietario` (`IdPropietario`, `IdUsu`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `IdRol` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`IdRol`, `Nombre`) VALUES
(4, 'Bombero'),
(2, 'Conservador'),
(1, 'Municipal'),
(3, 'Propietario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud`
--

CREATE TABLE `solicitud` (
  `IdSolicitud` int(11) NOT NULL,
  `Tipo` varchar(100) NOT NULL,
  `Estado` varchar(30) NOT NULL DEFAULT 'Pendiente',
  `Fecha` date NOT NULL,
  `IdMunicipal` int(11) NOT NULL,
  `IdConservador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudpropietario`
--

CREATE TABLE `solicitudpropietario` (
  `IdSolicitudPropietario` int(11) NOT NULL,
  `IdPropietario` int(11) NOT NULL,
  `IdInmueble` int(11) NOT NULL,
  `NombreInmueble` varchar(255) DEFAULT NULL,
  `Motivo` varchar(255) NOT NULL,
  `Detalle` text NOT NULL,
  `Estado` varchar(50) DEFAULT 'Pendiente',
  `Fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudpropietario`
--

INSERT INTO `solicitudpropietario` (`IdSolicitudPropietario`, `IdPropietario`, `IdInmueble`, `NombreInmueble`, `Motivo`, `Detalle`, `Estado`, `Fecha`) VALUES
(1, 1, 1, 'Edificio Torres del Limay', 'Actualización de la nomenclatura catastral', 'Cámbiame la nomenclatura catastral a 4F555G3', 'Pendiente', '2026-11-06 17:19:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `IdUsu` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Dni` varchar(15) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `IdRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`IdUsu`, `Nombre`, `Apellido`, `Dni`, `Email`, `Contrasena`, `Telefono`, `IdRol`) VALUES
(1, 'Juan', 'Pérez', '30111222', 'juan.perez@email.com', '123456', '1144332211', 3),
(2, 'Profesional', 'Conservador', '30111223', 'profesional@prisci.com', '1234', '2994000001', 2),
(3, 'Oficial', 'Bomberos', '30111224', 'bomberos@prisci.com', '1234', '2994000002', 4),
(4, 'Propietario', 'Edificio', '30111225', 'propietario@prisci.com', '1234', '2994000003', 3),
(5, 'Agente', 'Municipal', '30111226', 'municipal@prisci.com', 'PrisciPrueba2026!', '2994000004', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `archivo`
--
ALTER TABLE `archivo`
  ADD PRIMARY KEY (`IdArchivo`),
  ADD KEY `IdInspeccion` (`IdInspeccion`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`IdComentario`),
  ADD KEY `IdInspeccion` (`IdInspeccion`),
  ADD KEY `IdUsu` (`IdUsu`);

--
-- Indices de la tabla `conservador`
--
ALTER TABLE `conservador`
  ADD PRIMARY KEY (`IdConservador`),
  ADD UNIQUE KEY `IdUsu` (`IdUsu`);

--
-- Indices de la tabla `inmueble`
--
ALTER TABLE `inmueble`
  ADD PRIMARY KEY (`IdInmueble`),
  ADD UNIQUE KEY `NomenclaturaCatastral` (`NomenclaturaCatastral`),
  ADD KEY `IdPropietario` (`IdPropietario`);

--
-- Indices de la tabla `inspeccion`
--
ALTER TABLE `inspeccion`
  ADD PRIMARY KEY (`IdInspeccion`),
  ADD KEY `IdInmueble` (`IdInmueble`),
  ADD KEY `IdConservador` (`IdConservador`);

--
-- Indices de la tabla `municipal`
--
ALTER TABLE `municipal`
  ADD PRIMARY KEY (`IdMunicipal`),
  ADD UNIQUE KEY `IdUsu` (`IdUsu`);

--
-- Indices de la tabla `propietario`
--
ALTER TABLE `propietario`
  ADD PRIMARY KEY (`IdPropietario`),
  ADD UNIQUE KEY `IdUsu` (`IdUsu`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`IdRol`),
  ADD UNIQUE KEY `Nombre` (`Nombre`);

--
-- Indices de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  ADD PRIMARY KEY (`IdSolicitud`),
  ADD KEY `IdMunicipal` (`IdMunicipal`),
  ADD KEY `IdConservador` (`IdConservador`);

--
-- Indices de la tabla `solicitudpropietario`
--
ALTER TABLE `solicitudpropietario`
  ADD PRIMARY KEY (`IdSolicitudPropietario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`IdUsu`),
  ADD UNIQUE KEY `Dni` (`Dni`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `IdRol` (`IdRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `archivo`
--
ALTER TABLE `archivo`
  MODIFY `IdArchivo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `IdComentario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `conservador`
--
ALTER TABLE `conservador`
  MODIFY `IdConservador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `inmueble`
--
ALTER TABLE `inmueble`
  MODIFY `IdInmueble` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inspeccion`
--
ALTER TABLE `inspeccion`
  MODIFY `IdInspeccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `municipal`
--
ALTER TABLE `municipal`
  MODIFY `IdMunicipal` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `propietario`
--
ALTER TABLE `propietario`
  MODIFY `IdPropietario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `IdRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `solicitud`
--
ALTER TABLE `solicitud`
  MODIFY `IdSolicitud` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudpropietario`
--
ALTER TABLE `solicitudpropietario`
  MODIFY `IdSolicitudPropietario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IdUsu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `archivo`
--
ALTER TABLE `archivo`
  ADD CONSTRAINT `archivo_ibfk_1` FOREIGN KEY (`IdInspeccion`) REFERENCES `inspeccion` (`IdInspeccion`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`IdInspeccion`) REFERENCES `inspeccion` (`IdInspeccion`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`IdUsu`) REFERENCES `usuarios` (`IdUsu`);

--
-- Filtros para la tabla `conservador`
--
ALTER TABLE `conservador`
  ADD CONSTRAINT `conservador_ibfk_1` FOREIGN KEY (`IdUsu`) REFERENCES `usuarios` (`IdUsu`);

--
-- Filtros para la tabla `inmueble`
--
ALTER TABLE `inmueble`
  ADD CONSTRAINT `inmueble_ibfk_1` FOREIGN KEY (`IdPropietario`) REFERENCES `propietario` (`IdPropietario`);

--
-- Filtros para la tabla `inspeccion`
--
ALTER TABLE `inspeccion`
  ADD CONSTRAINT `inspeccion_ibfk_1` FOREIGN KEY (`IdInmueble`) REFERENCES `inmueble` (`IdInmueble`),
  ADD CONSTRAINT `inspeccion_ibfk_2` FOREIGN KEY (`IdConservador`) REFERENCES `conservador` (`IdConservador`);

--
-- Filtros para la tabla `municipal`
--
ALTER TABLE `municipal`
  ADD CONSTRAINT `municipal_ibfk_1` FOREIGN KEY (`IdUsu`) REFERENCES `usuarios` (`IdUsu`);

--
-- Filtros para la tabla `propietario`
--
ALTER TABLE `propietario`
  ADD CONSTRAINT `propietario_ibfk_1` FOREIGN KEY (`IdUsu`) REFERENCES `usuarios` (`IdUsu`);

--
-- Filtros para la tabla `solicitud`
--
ALTER TABLE `solicitud`
  ADD CONSTRAINT `solicitud_ibfk_1` FOREIGN KEY (`IdMunicipal`) REFERENCES `municipal` (`IdMunicipal`),
  ADD CONSTRAINT `solicitud_ibfk_2` FOREIGN KEY (`IdConservador`) REFERENCES `conservador` (`IdConservador`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`IdRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
