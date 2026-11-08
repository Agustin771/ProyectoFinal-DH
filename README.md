# 🏨 ReservaYa

**Aplicación web de reservas y gestión de productos**, desarrollada como proyecto final de formación. Permite a los usuarios explorar productos, consultar disponibilidad, gestionar favoritos y realizar reservas, mientras que los administradores pueden administrar el contenido de la plataforma.

El proyecto integra un frontend desarrollado con React y una API REST construida con Java y Spring Boot, utilizando MySQL como sistema de persistencia.

---

## ✨ Funcionalidades

### 👤 Usuarios y autenticación
- Registro e inicio de sesión.
- Autenticación mediante JWT.
- Renovación de tokens y gestión de sesiones.
- Verificación de correo electrónico.
- Recuperación y restablecimiento de contraseña.
- Control de acceso según roles y permisos.
- Cierre de sesión.

### 🔎 Catálogo y búsqueda
- Visualización de productos.
- Navegación por categorías.
- Búsqueda y filtros.
- Paginación de resultados.
- Visualización del detalle de cada producto.
- Consulta de disponibilidad según un rango de fechas.

### ❤️ Favoritos
- Agregar y quitar productos de favoritos.
- Persistencia de favoritos en la base de datos.
- Recuperación de favoritos al iniciar sesión nuevamente.

### 📅 Reservas
- Selección de fechas de inicio y finalización.
- Validación de disponibilidad.
- Identificación de fechas no disponibles.
- Vista previa de la reserva antes de confirmarla.
- Registro de reservas asociadas al usuario autenticado.
- Validación de superposición de reservas.
- Historial de reservas personales.
- Confirmación de reserva mediante correo electrónico.

### ⭐ Otras funcionalidades
- Gestión de productos y contenido mediante permisos administrativos.
- Gestión de categorías y características.
- Sistema de reseñas y valoraciones de productos.
- Contacto mediante WhatsApp.

---

## 🛠️ Tecnologías utilizadas

### Frontend
- React 19
- JavaScript
- Vite
- React Router
- React Calendar
- CSS
- Vitest
- React Testing Library
- Jest DOM
- jsdom

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT (JSON Web Tokens)
- BCrypt
- Jakarta Validation
- Spring Mail
- Maven

### Base de datos
- MySQL

---

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura cliente-servidor:

```text
                 RESERVAYA
                     |
          +----------+----------+
          |                     |
       FRONTEND              BACKEND
       React + Vite        Spring Boot
          |                     |
          |    HTTP / REST      |
          +---------------------+
                                |
                         Spring Security
                                |
                         Spring Data JPA
                                |
                             MySQL
```

### Organización del backend

El backend está organizado por responsabilidades:

- **controller:** recibe las solicitudes HTTP y expone los endpoints.
- **service:** contiene la lógica de negocio.
- **repository:** administra el acceso a los datos mediante JPA.
- **model:** contiene las entidades del sistema.
- **dto:** define los objetos utilizados para transferir información.
- **security:** configuración de seguridad, autenticación y autorización.
- **exception:** manejo centralizado de excepciones.

### Seguridad

La API implementa autenticación y autorización utilizando Spring Security y JWT.

También incorpora:
- Contraseñas protegidas mediante BCrypt.
- Roles para diferenciar permisos.
- Endpoints protegidos.
- Sesiones sin estado para la autenticación mediante JWT.
- Refresh tokens y renovación de credenciales.
- Verificación de correo electrónico.

---

## ⚙️ Instalación y ejecución

### Requisitos previos

Para ejecutar el proyecto necesitás:

- Java 17 o superior.
- Maven.
- Node.js y npm.
- MySQL.
- Un entorno de desarrollo como IntelliJ IDEA y Visual Studio Code.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Agustin771/ProyectoFinal-DH
```

### 2. Configurar la base de datos

Crear una base de datos en MySQL y configurar las variables de entorno necesarias para la conexión.

El backend utiliza variables de entorno para evitar guardar credenciales y claves privadas directamente en el código.

### 3. Configurar variables de entorno del backend

Configurar las siguientes variables en el entorno de ejecución de IntelliJ IDEA o en el sistema operativo:

| Variable | Descripción |
|---|---|
| `URL_BD` | URL de conexión a MySQL |
| `USERNAME_BD` | Usuario de MySQL |
| `PASSWORD_BD` | Contraseña de MySQL |
| `JWT_SECRET_KEY` | Clave secreta para firmar los JWT |
| `JWT_EXPIRATION` | Tiempo de expiración del token |
| `EMAIL_USERNAME` | Cuenta de correo utilizada para enviar emails |
| `EMAIL_PASSWORD` | Credencial de la cuenta de correo |
| `ADMIN_EMAIL` | Email del administrador inicial |
| `ADMIN_PASSWORD` | Contraseña del administrador inicial |

**Importante:** no compartir ni subir los valores reales de estas variables al repositorio.

### 4. Ejecutar el backend

Desde la carpeta del backend:

```bash
mvn spring-boot:run
```

La API se ejecuta por defecto en:

```text
http://localhost:8080
```

### 5. Ejecutar el frontend

Desde la carpeta del frontend:

```bash
npm install
npm run dev
```

Vite iniciará el servidor de desarrollo e indicará la dirección local para acceder a la aplicación.

---

## 🧪 Pruebas

El proyecto cuenta con pruebas automatizadas tanto en backend como en frontend.

### Backend

Las pruebas se desarrollaron utilizando las herramientas de testing del ecosistema Spring Boot.

Para ejecutarlas:

```bash
mvn test
```

### Frontend

Se utiliza Vitest junto con React Testing Library y jsdom.

Las pruebas actuales cubren servicios de:

- Autenticación.
- Favoritos.
- Reservas.
- Productos y disponibilidad.

Ejecutar todas las pruebas:

```bash
npm run test:run
```

Ejecutar Vitest en modo interactivo:

```bash
npm run test
```

**Estado de las pruebas frontend:** 15 tests aprobados.

---

## 📌 Objetivo del proyecto

ReservaYa fue desarrollado como proyecto integrador, aplicando conocimientos de desarrollo frontend y backend, diseño de API REST, persistencia de datos, autenticación, autorización, validaciones y pruebas automatizadas.

El objetivo principal fue construir una aplicación funcional de reservas, integrando diferentes tecnologías y resolviendo las necesidades planteadas a lo largo de los sprints de desarrollo.

---

## 👨‍💻 Autor

**Agustín Pérez**

Proyecto desarrollado con Java, Spring Boot, React y MySQL.

