# StockPro — TIF Full-Stack

Sistema de gestión de productos con roles, autenticación JWT y dashboard diferencial.

## 🏗️ Arquitectura

```
tif-project/
├── backend/               # Node.js + Express + TypeScript + Prisma
│   ├── prisma/
│   │   ├── schema.prisma  # 4 tablas: User, Category, Product, Order
│   │   └── seed.ts        # Datos de prueba
│   └── src/
│       ├── controllers/   # Lógica de cada endpoint
│       ├── routes/        # Definición de rutas
│       ├── middlewares/   # JWT auth + Zod validation
│       ├── services/      # Lógica de negocio + queries Prisma
│       ├── types/         # Interfaces TypeScript
│       └── index.ts       # Entry point Express
└── frontend/              # React + TypeScript + Vite
    └── src/
        ├── api/           # Cliente Axios + funciones de API
        ├── components/    # Layout, Sidebar, Skeleton, ProtectedRoute
        ├── context/       # AuthContext (estado global)
        ├── pages/         # Login, Register, Dashboard, Products, Categories, Users, Profile
        └── types/         # Interfaces compartidas
```

## 🚀 Instalación y arranque

### 1. Backend

```bash
cd backend

# Copiar variables de entorno
cp .env.example .env

# Instalar dependencias
npm install

# Generar cliente Prisma y crear la base de datos
npx prisma migrate dev --name init

# Generar tipos de Prisma
npx prisma generate

# Cargar datos de prueba
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:3001
```

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

## 🔑 Credenciales de demo

| Rol   | Email            | Contraseña |
|-------|-----------------|------------|
| Admin | admin@tif.com   | admin123   |
| User  | user@tif.com    | user123    |

## 📋 Funcionalidades

### Para todos los usuarios autenticados:
- Ver catálogo de productos con filtros y búsqueda
- Ver categorías disponibles
- Ver su perfil con descripción de permisos

### Solo ADMIN:
- Dashboard con estadísticas completas (stock, productos, usuarios)
- CRUD completo de productos (crear, editar, eliminar)
- CRUD de categorías
- Gestión de usuarios (ver todos, cambiar roles, eliminar)
- Vista de productos con/sin stock bajo ⚠️

## 📡 API Endpoints

```
POST   /api/auth/register        → Registro
POST   /api/auth/login           → Login
GET    /api/auth/profile         → Mi perfil (auth)

GET    /api/products             → Listar (auth)
GET    /api/products/:id         → Ver uno (auth)
GET    /api/products/stats       → Estadísticas (admin)
POST   /api/products             → Crear (admin)
PUT    /api/products/:id         → Actualizar (admin)
DELETE /api/products/:id         → Eliminar (admin)

GET    /api/categories           → Listar (auth)
POST   /api/categories           → Crear (admin)
PUT    /api/categories/:id       → Actualizar (admin)
DELETE /api/categories/:id       → Eliminar (admin)

GET    /api/users                → Listar (admin)
GET    /api/users/stats          → Stats (admin)
PATCH  /api/users/:id/role       → Cambiar rol (admin)
DELETE /api/users/:id            → Eliminar (admin)
```

## 🔒 Seguridad implementada

- **Bcrypt**: contraseñas hasheadas con salt rounds 10
- **JWT**: tokens con expiración de 7 días
- **Zod**: validación estricta de todos los inputs del backend
- **Roles**: middleware `requireAdmin` protege rutas sensibles
- **Axios interceptor**: manejo automático de 401 en frontend

## 🌐 Deploy (Render + Vercel)

### Backend en Render:
1. Crear nuevo Web Service → conectar repositorio
2. Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
3. Start Command: `npm run build && npm start`
4. Variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend en Vercel:
1. Importar repositorio → seleccionar carpeta `frontend`
2. Variable: `VITE_API_URL=https://tu-backend.onrender.com`
3. En `vite.config.ts`, cambiar proxy a producción

## 🛠️ Tecnologías

| Capa      | Stack                                       |
|-----------|---------------------------------------------|
| Backend   | Node.js, Express, TypeScript, Prisma, SQLite |
| Auth      | JWT, Bcrypt, Zod                            |
| Frontend  | React 18, TypeScript, Vite, Axios           |
| Estado    | Context API (AuthContext)                   |
| UI        | CSS custom (Dark theme, Google Fonts)       |
| DB        | SQLite (dev) / PostgreSQL (prod)            |
