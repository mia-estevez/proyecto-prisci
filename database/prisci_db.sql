-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-10-2026 a las 00:24:21
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
(1, 'MAT-PRUEBA-001', 'Empresa de prueba', 3);

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
(1, 'Edificio Torres del Limay', 'Av. Argentina 1234, Neuquén', 'PRUEBA-001', 500.00, 'Residencial', 10, 1, 'Pendiente de inspección', 1);

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
(2, '2026-10-09', 'Con observaciones', '{\"parteNro\":\"PR-2026-8875\",\"empresaCliente\":\"Martín López\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"probando guardado en la bd\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Con observaciones\",\"obs\":\"proximos a vencer\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 1, 1),
(3, '2026-10-09', 'Con observaciones', '{\"parteNro\":\"PR-2026-4368\",\"empresaCliente\":\"Martín López\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Con observaciones\",\"obs\":\"proximo a vencer\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 1, 1),
(4, '2026-10-09', 'Aprobado', '{\"parteNro\":\"PR-2026-8858\",\"empresaCliente\":\"Martín López\",\"establecimiento\":\"Edificio Torres del Limay\",\"domicilio\":\"Av. Argentina 1234, Neuquén\",\"localidad\":\"Neuquén\",\"observacionesGenerales\":\"probandooo\",\"relevamiento\":{\"viasEscape\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"lucesEmergencia\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"deteccionIncendios\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionFijaAgua\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"matafuegos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionElectrica\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"instalacionGas\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"productosQuimicos\":{\"estado\":\"Correcto\",\"obs\":\"\"},\"ordenLimpia\":{\"estado\":\"Correcto\",\"obs\":\"\"}},\"archivosAdjuntos\":[],\"tieneFirmaCliente\":false,\"tieneFirmaProf\":false}', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instalacioninmueble`
--

CREATE TABLE `instalacioninmueble` (
  `IdInstalacion` int(11) NOT NULL,
  `IdInmueble` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Estado` varchar(50) NOT NULL,
  `Vencimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `instalacioninmueble`
--

INSERT INTO `instalacioninmueble` (`IdInstalacion`, `IdInmueble`, `Nombre`, `Estado`, `Vencimiento`) VALUES
(1, 1, 'Extintores', 'Vigente', '2026-12-15'),
(2, 1, 'Hidrantes', 'Pendiente de revisión', NULL),
(3, 1, 'Detectores de humo', 'Vencido', '2027-02-10'),
(4, 1, 'Señalización de emergencia', 'Vigente', NULL);

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
-- Estructura de tabla para la tabla `observacionesficha`
--

CREATE TABLE `observacionesficha` (
  `IdObservacion` int(11) NOT NULL,
  `IdInmueble` int(11) NOT NULL,
  `Observaciones` text DEFAULT NULL,
  `FechaActualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `observacionesficha`
--

INSERT INTO `observacionesficha` (`IdObservacion`, `IdInmueble`, `Observaciones`, `FechaActualizacion`) VALUES
(1, 1, 'Probando guardar datos', '2026-10-09 21:19:55');

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
(1, 4);

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
(2, 'Bomberos'),
(1, 'Municipal'),
(3, 'Profesional'),
(4, 'Propietario');

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
(1, 'Usuario', 'Prueba', '12345678', 'municipal@prisci.com', '$2b$10$cpiDpok8vJkJ6p3gLKmS1.AUbPrlZNUeij4A3V4p0HqczKItQU3F6', '2991234567', 1),
(2, 'Carlos', 'Gómez', '40000001', 'bomberos@prisci.com', '$2b$10$RE/noaZyFCLjAPWQRdTY5uLwyHWdY1l5hkd.a1iS4suB8ImTLvjcO', '2994000001', 2),
(3, 'Laura', 'Pérez', '40000002', 'profesional@prisci.com', '$2b$10$RE/noaZyFCLjAPWQRdTY5uLwyHWdY1l5hkd.a1iS4suB8ImTLvjcO', '2994000002', 3),
(4, 'Martín', 'López', '40000003', 'propietario@prisci.com', '$2b$10$RE/noaZyFCLjAPWQRdTY5uLwyHWdY1l5hkd.a1iS4suB8ImTLvjcO', '2994000003', 4);

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
-- Indices de la tabla `instalacioninmueble`
--
ALTER TABLE `instalacioninmueble`
  ADD PRIMARY KEY (`IdInstalacion`),
  ADD KEY `fk_instalacion_inmueble` (`IdInmueble`);

--
-- Indices de la tabla `municipal`
--
ALTER TABLE `municipal`
  ADD PRIMARY KEY (`IdMunicipal`),
  ADD UNIQUE KEY `IdUsu` (`IdUsu`);

--
-- Indices de la tabla `observacionesficha`
--
ALTER TABLE `observacionesficha`
  ADD PRIMARY KEY (`IdObservacion`),
  ADD UNIQUE KEY `IdInmueble` (`IdInmueble`);

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
  MODIFY `IdInmueble` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `inspeccion`
--
ALTER TABLE `inspeccion`
  MODIFY `IdInspeccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `instalacioninmueble`
--
ALTER TABLE `instalacioninmueble`
  MODIFY `IdInstalacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `municipal`
--
ALTER TABLE `municipal`
  MODIFY `IdMunicipal` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `observacionesficha`
--
ALTER TABLE `observacionesficha`
  MODIFY `IdObservacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IdUsu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- Filtros para la tabla `instalacioninmueble`
--
ALTER TABLE `instalacioninmueble`
  ADD CONSTRAINT `fk_instalacion_inmueble` FOREIGN KEY (`IdInmueble`) REFERENCES `inmueble` (`IdInmueble`) ON DELETE CASCADE;

--
-- Filtros para la tabla `municipal`
--
ALTER TABLE `municipal`
  ADD CONSTRAINT `municipal_ibfk_1` FOREIGN KEY (`IdUsu`) REFERENCES `usuarios` (`IdUsu`);

--
-- Filtros para la tabla `observacionesficha`
--
ALTER TABLE `observacionesficha`
  ADD CONSTRAINT `fk_observaciones_inmueble` FOREIGN KEY (`IdInmueble`) REFERENCES `inmueble` (`IdInmueble`) ON DELETE CASCADE;

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
