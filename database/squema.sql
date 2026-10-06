CREATE TABLE Rol (
    IdRol INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Usuarios (
    IdUsu INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Dni VARCHAR(15) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    Telefono VARCHAR(20),
    IdRol INT NOT NULL,
    FOREIGN KEY (IdRol) REFERENCES Rol(IdRol)
);

CREATE TABLE Municipal (
    IdMunicipal INT AUTO_INCREMENT PRIMARY KEY,
    IdUsu INT NOT NULL UNIQUE,
    FOREIGN KEY (IdUsu) REFERENCES Usuarios(IdUsu)
);

CREATE TABLE Propietario (
    IdPropietario INT AUTO_INCREMENT PRIMARY KEY,
    IdUsu INT NOT NULL UNIQUE,
    FOREIGN KEY (IdUsu) REFERENCES Usuarios(IdUsu)
);

CREATE TABLE Conservador (
    IdConservador INT AUTO_INCREMENT PRIMARY KEY,
    Matricula VARCHAR(50) NOT NULL,
    Empresa VARCHAR(100),
    IdUsu INT NOT NULL UNIQUE,
    FOREIGN KEY (IdUsu) REFERENCES Usuarios(IdUsu)
);

CREATE TABLE Inmueble (
    IdInmueble INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Domicilio VARCHAR(200) NOT NULL,
    NomenclaturaCatastral VARCHAR(100) NOT NULL UNIQUE,
    Superficie DECIMAL(10,2) CHECK (Superficie > 0),
    Actividad VARCHAR(100),
    CantMatafuego INT DEFAULT 0 CHECK (CantMatafuego >= 0),
    RedAgua BOOLEAN DEFAULT FALSE,
    EstadoSistema TEXT,
    IdPropietario INT NOT NULL,
    FOREIGN KEY (IdPropietario) REFERENCES Propietario(IdPropietario)
);

CREATE TABLE Inspeccion (
    IdInspeccion INT AUTO_INCREMENT PRIMARY KEY,
    Fecha DATE NOT NULL,
    Resultado VARCHAR(50) NOT NULL,
    Observaciones TEXT,
    IdInmueble INT NOT NULL,
    IdConservador INT NOT NULL,
    FOREIGN KEY (IdInmueble) REFERENCES Inmueble(IdInmueble),
    FOREIGN KEY (IdConservador) REFERENCES Conservador(IdConservador)
);

-- planos, fotos, PDF
CREATE TABLE Archivo (
    IdArchivo INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Tipo VARCHAR(20) NOT NULL, -- jpg, png, pdf
    Ruta VARCHAR(255) NOT NULL,
    IdInspeccion INT NOT NULL,
    FOREIGN KEY (IdInspeccion) REFERENCES Inspeccion(IdInspeccion) ON DELETE CASCADE
);

-- Comentarios
CREATE TABLE Comentario (
    IdComentario INT AUTO_INCREMENT PRIMARY KEY,
    Comentario TEXT NOT NULL,
    Fecha DATE NOT NULL,
    IdInspeccion INT NOT NULL,
    IdUsu INT NOT NULL,
    FOREIGN KEY (IdInspeccion) REFERENCES Inspeccion(IdInspeccion) ON DELETE CASCADE,
    FOREIGN KEY (IdUsu) REFERENCES Usuarios(IdUsu)
);

-- Solicitudes
CREATE TABLE Solicitud (
    IdSolicitud INT AUTO_INCREMENT PRIMARY KEY,
    Tipo VARCHAR(100) NOT NULL,
    Estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
    Fecha DATE NOT NULL,
    IdMunicipal INT NOT NULL,
    IdConservador INT NOT NULL,
    FOREIGN KEY (IdMunicipal) REFERENCES Municipal(IdMunicipal),
    FOREIGN KEY (IdConservador) REFERENCES Conservador(IdConservador)
);