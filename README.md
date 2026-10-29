# UNA Chat - Laboratorio 6

> **Curso:** Paradigmas de Programación  
> **Institución:** Universidad Nacional (UNA) - Campus Nicoya  
> **Profesor:** Ing. Alex Villegas Carranza, M.Sc.  
> **Estudiante:** Aarón Solano  

---

## 📌 Descripción del Proyecto

**UNA Chat** es una aplicación de mensajería en tiempo real desarrollada con **Node.js**, **Express** y **Socket.IO**. En este Laboratorio 6 se implementa la historia de usuario **US-01: Autenticación social con Auth0**, permitiendo a los usuarios acceder al chat mediante inicio de sesión social seguro con OAuth (Google) sin necesidad de registrar ni recordar contraseñas adicionales.

---

## 🚀 Criterios de Aceptación Implementados (US-01)

- [x] **Configuración de Auth0:** Aplicación creada en Auth0 con proveedor de identidad social (Google).
- [x] **Gestión de URLs:** Callbacks, Logout y Orígenes permitidos configurados para local (`http://localhost:3000`) y producción en Vercel.
- [x] **Autenticación Local:** Flujo completo de login social y redirección autenticada a UNA Chat.
- [x] **Identidad y Cierre de Sesión:** El chat muestra la identidad del usuario (nombre, correo y foto de perfil) y permite cerrar sesión (`/logout`).
- [x] **Acceso Restringido:** El chat exige autenticación obligatoria; los usuarios anónimos son redirigidos a la pantalla de bienvenida para iniciar sesión.
- [x] **Manejo de Errores / Cancelación:** Si el usuario cancela el login o se produce un error, se presenta un mensaje claro con botón de reintento.
- [x] **Seguridad y Variables de Entorno:** Ningún secreto expuesto en el repositorio ni en el cliente (`.env.example` documentado).
- [x] **Despliegue en Vercel:** Soporte para ejecución en la nube mediante configuración serverless en `vercel.json`.

---

## ⚙️ Configuración de Auth0

1. Regístrate o inicia sesión en [Auth0 Dashboard](https://manage.auth0.com/).
2. Crea una nueva aplicación:
   - **Nombre:** `UNA Chat`
   - **Tipo:** `Regular Web Applications`
3. En **Authentication > Social**, verifica que el proveedor **Google** esté activo.
4. En **Settings > Application URIs**, configura:
   - **Allowed Callback URLs:**
     ```
     http://localhost:3000/callback, https://<tu-app>.vercel.app/callback
     ```
   - **Allowed Logout URLs:**
     ```
     http://localhost:3000, https://<tu-app>.vercel.app
     ```
   - **Allowed Web Origins:**
     ```
     http://localhost:3000, https://<tu-app>.vercel.app
     ```
5. Guarda los cambios y copia el **Domain**, **Client ID** y **Client Secret**.

---

## 🛠️ Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/AaronSolano/lab5_paradigmas.git
cd lab5_paradigmas
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia la plantilla `.env.example` a un archivo `.env`:
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales de Auth0:
```env
PORT=3000
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://TU_DOMINIO.auth0.com
AUTH0_CLIENT_ID=TU_CLIENT_ID
AUTH0_CLIENT_SECRET=TU_CLIENT_SECRET
AUTH0_SECRET=clave_segura_de_al_menos_32_caracteres_aleatorios
```

### 4. Ejecutar el proyecto
```bash
npm start
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### 5. Ejecutar pruebas unitarias
```bash
npm test
```

---

## ☁️ Despliegue en Vercel

1. Sube tu código a GitHub.
2. Ingresa a [Vercel](https://vercel.com/) e importa tu repositorio.
3. En la sección **Environment Variables** del proyecto en Vercel, agrega las mismas variables de tu `.env`:
   - `AUTH0_BASE_URL`: `https://tu-proyecto.vercel.app` (la URL que Vercel asigne).
   - `AUTH0_ISSUER_BASE_URL`: `https://TU_DOMINIO.auth0.com`
   - `AUTH0_CLIENT_ID`: Tu Client ID
   - `AUTH0_CLIENT_SECRET`: Tu Client Secret
   - `AUTH0_SECRET`: Tu clave de sesión
4. Despliega la aplicación.
5. Copia el dominio de producción generado por Vercel y agrégalo en Auth0 (Callback URLs, Logout URLs y Allowed Origins).
