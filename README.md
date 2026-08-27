# Laboratorio 1: ABM de Productos con Next.js

**Materia:** Programación Web Frontend  
**Docente:** Ing. Gustavo Sosa Cataldo  
**Facultad:** Facultad Politécnica - Universidad Nacional de Asunción (FP-UNA)  
**Estudiante:** Christian Daniel Yegros Cabañas (CI: 5.554.545)  
**Carrera:** Ingeniería Informática - 7mo Semestre  

---

## 📌 Descripción del Proyecto

Aplicación web desarrollada con **Next.js (App Router)**, **TypeScript** y **Tailwind CSS** que consume una API REST en tiempo real (`http://localhost:4001`) para realizar la gestión completa (ABM) de un inventario de productos.

### ✨ Funcionalidades Principales
- **Ruteo y Navegación SPA:** Rutas `/` (Inicio), `/productos` (ABM) y `/estudiante` (Perfil) navegables sin recarga completa mediante el componente `<Link>`.
- **Listado Dinámico con Filtros (`GET /productos`):** Carga inicial con `useEffect` y filtrado reactivo por nombre y categoría consumiendo los query parameters de la API.
- **Alta de Productos (`POST /productos`):** Formulario controlado con `useState` y validación de campos obligatorios.
- **Modificación de Productos (`PUT /productos/:codigo`):** Reutilización del formulario en modo edición, con bloqueo del código identificador único y botón para cancelar.
- **Baja de Productos (`DELETE /productos/:codigo`):** Eliminación por fila con modal/popup de confirmación personalizado.
- **Componentes Reutilizables y Props:** Componentes modulares tipados como `FilaProducto.tsx` y `Navbar.tsx`.

---

## 🚀 Requisitos Previos

- **Node.js:** Versión 20 LTS o superior.
- **npm:** Versión 10 o superior.

---

## 🛠️ Cómo Ejecutar el Proyecto

### 1. Iniciar la API Backend
En una primera terminal:
```bash
cd productos-api
node server.js
```
> La API estará corriendo en `http://localhost:4001`.

### 2. Iniciar el Frontend (Next.js)
En una segunda terminal:
```bash
cd abm-productos
npm run dev
```
> Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 📁 Estructura del Proyecto

```text
abm-productos/
 ├── app/
 │    ├── components/
 │    │    ├── FilaProducto.tsx   # Componente reutilizable para cada fila de la tabla
 │    │    └── Navbar.tsx         # Barra de navegación global
 │    ├── estudiante/
 │    │    └── page.tsx           # Ruta /estudiante con información del alumno
 │    ├── productos/
 │    │    └── page.tsx           # Ruta /productos con la lógica completa del ABM
 │    ├── types/
 │    │    └── Producto.ts        # Tipado TypeScript de la entidad Producto
 │    ├── globals.css             # Estilos globales y Tailwind CSS
 │    ├── layout.tsx              # Layout raíz con Navbar y contenedor responsive
 │    └── page.tsx                # Ruta / (Inicio y presentación)
 ├── package.json
 ├── tsconfig.json
 └── README.md
```
