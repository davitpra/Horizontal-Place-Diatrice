# Horizon Place - Sistema de Gestión de Residentes

Un sistema completo de gestión de residentes para centros de cuidado, desarrollado con Next.js y Strapi CMS. La aplicación permite gestionar residentes, sus preferencias alimentarias, menús diarios y el servicio de comidas.

## 🚀 Características Principales

- **Sistema de Autenticación**: Login y registro de usuarios con JWT y protección de rutas
- **Gestión de Residentes**: Lista completa de residentes con información personal, habitación y preferencias
- **Sistema de Comidas**: Gestión de desayunos, almuerzos y cenas con preferencias personalizadas
- **Control de Bandejas**: Seguimiento de comidas servidas en bandeja
- **Menús Dinámicos**: Creación automática de menús basados en preferencias de residentes
- **Menús Semanales**: Visualización y gestión de menús planificados por semana
- **Sincronización**: Sistema de sincronización con el backend
- **Notificaciones**: Sistema de notificaciones en tiempo real con react-hot-toast
- **Interfaz Responsiva**: Diseño moderno con TailwindCSS y componentes accesibles
- **Integración con Strapi**: Backend CMS para gestión de contenido

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 15.0.2** - Framework React con App Router
- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TailwindCSS 3.4.1** - Framework de CSS utilitario
- **@headlessui/react 2.2.0** - Componentes accesibles sin estilos
- **@heroicons/react 2.1.5** - Iconografía SVG
- **@tailwindcss/forms 0.5.9** - Estilos de formularios
- **Zustand 5.0.1** - Gestión de estado ligera
- **react-hot-toast 2.6.0** - Sistema de notificaciones toast

### Autenticación y Seguridad

- **jsonwebtoken 9.0.2** - Manejo de tokens JWT
- **js-cookie 3.0.5** - Gestión de cookies del navegador
- **@types/jsonwebtoken 9.0.10** - Tipos TypeScript para JWT
- **@types/js-cookie 3.0.6** - Tipos TypeScript para js-cookie

### Backend

- **Strapi CMS** - Sistema de gestión de contenido
- **API REST** - Comunicación con el backend

### Herramientas de Desarrollo

- **TypeScript 5.9.2** - Superset tipado de JavaScript
- **ESLint 8.x** - Linter para JavaScript/TypeScript
- **PostCSS 8.x** - Procesador de CSS
- **Turbopack** - Bundler rápido para desarrollo (habilitado por defecto)
- **@types/node 24.6.0** - Tipos para Node.js
- **@types/react 19.1.16** - Tipos para React

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Strapi CMS** ejecutándose en `http://localhost:1337`

## 🔧 Instalación

1. **Clona el repositorio**

   ```bash
   git clone <repository-url>
   cd horizon-place
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto:

   ```env
   # Strapi CMS Configuration
   NEXT_PUBLIC_STRAPI_HOST=http://localhost:1337
   STRAPI_HOST=http://localhost:1337

   # JWT Secret for token verification (same as Strapi JWT_SECRET)
   JWT_SECRET=your-super-secret-jwt-key-here

   # Auth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

4. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Abre tu navegador**

   Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── fonts/             # Fuentes personalizadas
│   ├── globals.css        # Estilos globales
│   ├── layout.js          # Layout principal
│   ├── page.js            # Página principal (servicio de comidas)
│   ├── login/             # Página de inicio de sesión
│   ├── register/          # Página de registro de usuarios
│   ├── summary/           # Página de resumen
│   ├── table/             # Página de tabla
│   ├── trays/             # Página de bandejas
│   └── weekly-menu/       # Página de menú semanal
├── components/            # Componentes reutilizables
│   ├── auth/              # Componentes de autenticación
│   │   ├── AuthGuard.js   # Guardia de autenticación
│   │   ├── LoginForm.js   # Formulario de login
│   │   ├── RegisterForm.js # Formulario de registro
│   │   └── ProtectedRoute.js # Componente de ruta protegida
│   ├── features/          # Componentes específicos de funcionalidades
│   │   ├── search/        # Componentes de búsqueda
│   │   ├── serving/       # Componentes de servicio
│   │   ├── servingModals/ # Modales de servicio
│   │   ├── tableInfo/     # Información de tabla
│   │   ├── tableResident/ # Tabla de residentes
│   │   └── weeklyMenu/    # Componentes de menú semanal
│   ├── providers/         # Proveedores de contexto
│   └── ui/                # Componentes de interfaz
│       ├── Footer.js      # Pie de página
│       ├── Loading.js     # Componente de carga
│       ├── MealBar.js     # Barra de navegación de comidas
│       ├── Modal.js       # Modal base
│       ├── Sidebar.js     # Barra lateral
│       ├── SyncIndicator.js # Indicador de sincronización
│       ├── SyncSettings.js # Configuración de sincronización
│       ├── Table.js       # Tabla base
│       ├── Title.js       # Título
│       └── Wraper.js      # Wrapper
├── contexts/              # Contextos de React
│   └── AuthContext.js     # Contexto de autenticación
├── hooks/                 # Custom hooks
│   ├── auth/              # Hooks de autenticación
│   ├── meals/             # Hooks relacionados con comidas
│   ├── sync/              # Hooks de sincronización
│   ├── ui/                # Hooks de interfaz
│   └── utils/             # Hooks utilitarios
├── config/                # Configuraciones
│   └── sync.config.js     # Configuración de sincronización
├── strapi/                # Cliente y utilidades de Strapi
├── utils/                 # Utilidades generales
├── data/                  # Datos estáticos
├── constants/             # Constantes de la aplicación
└── store/                 # Estado global con Zustand
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo con Turbopack (más rápido) - habilitado por defecto
npm run dev

# Construcción para producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting del código con ESLint
npm run lint
```

## 🍽️ Funcionalidades del Sistema

### Sistema de Autenticación

- **Login de Usuarios**: Inicio de sesión seguro con JWT
- **Registro de Usuarios**: Creación de nuevas cuentas
- **Protección de Rutas**: Rutas protegidas con AuthGuard
- **Gestión de Sesiones**: Manejo de tokens y cookies
- **Middleware de Autenticación**: Verificación automática de sesiones

### Gestión de Residentes

- Lista completa de residentes activos
- Información de habitación y ubicación
- Preferencias alimentarias personalizadas
- Filtrado y ordenamiento de datos
- Búsqueda avanzada de residentes

### Sistema de Comidas

- **Desayunos**: Huevos, tostadas, cereales, frutas, yogurt, muffins
- **Almuerzos**: Sopas, ensaladas, opciones principales, postres
- **Cenas**: Opciones principales, acompañamientos, postres
- Control de comidas servidas en bandeja
- Seguimiento de preferencias alimentarias

### Menús Automáticos

- Generación automática basada en preferencias
- Calendario de menús por fecha
- Personalización por residente
- **Menú Semanal**: Vista y gestión de menús planificados por semana

### Sistema de Sincronización

- Sincronización automática con el backend
- Indicador visual de estado de sincronización
- Configuración de intervalos de sincronización
- Manejo de conflictos y errores

### Notificaciones

- Sistema de notificaciones toast en tiempo real
- Alertas de éxito, error y advertencia
- Feedback visual de acciones del usuario

## 🔌 API Endpoints

El sistema se conecta con Strapi CMS a través de los siguientes endpoints principales:

### Autenticación

- **Login**: `/api/auth/local`
- **Registro**: `/api/auth/local/register`
- **Verificación**: `/api/users/me`

### Datos del Sistema

- **Residentes**: `/api/residents`
- **Menús**: `/api/menus`
- **Desayunos**: `/api/breakfasts`
- **Almuerzos**: `/api/lunches`
- **Cenas**: `/api/dinners`
- **Horarios de Menú**: `/api/menu-schedules`

### Endpoints Internos (Next.js)

- **Proxy de Strapi**: `/api/strapi` - Proxy para comunicación con Strapi

Consulta el archivo `api.rest` para ver todos los endpoints disponibles.

### Uso del archivo api.rest

El archivo `api.rest` contiene todas las peticiones HTTP para probar la API de Strapi. Para usarlo:

1. **Instala la extensión REST Client** en VS Code
2. **Configura las variables de entorno** en tu archivo `.env.local`:
   ```env
   STRAPI_HOST=http://localhost:1337
   JWT_SECRET=your-super-secret-jwt-key-here
   ```
3. **Abre el archivo `api.rest`** y haz clic en "Send Request" sobre cualquier endpoint
   
   **Nota**: El sistema usa autenticación JWT. Para endpoints protegidos, primero debes autenticarte y obtener un JWT válido que se almacena automáticamente en cookies.

## 🎨 Guías de Desarrollo

### Convenciones de Código

- Usar **const** en lugar de **function** para componentes
- Prefijos **handle** para funciones de eventos (ej: `handleClick`)
- Early returns para mejorar legibilidad
- TailwindCSS para todos los estilos
- Implementar características de accesibilidad
- TypeScript para tipado estático
- Estructura modular con componentes separados por funcionalidad

### Arquitectura de Componentes

- **UI Components**: Componentes base reutilizables (`src/components/ui/`)
  - Footer, Loading, MealBar, Modal, Sidebar, SyncIndicator, SyncSettings, Table, Title, Wraper
- **Feature Components**: Componentes específicos de funcionalidades (`src/components/features/`)
  - search, serving, servingModals, tableInfo, tableResident, weeklyMenu
- **Auth Components**: Componentes de autenticación (`src/components/auth/`)
  - AuthGuard, LoginForm, RegisterForm, ProtectedRoute
- **Providers**: Contextos y proveedores de estado (`src/components/providers/`)
- Todos los componentes son funcionales con hooks
- Uso de custom hooks para lógica reutilizable
- Props tipadas con TypeScript cuando sea posible

### Estructura de Hooks

- **Auth Hooks**: Lógica de autenticación y sesiones
- **Meals Hooks**: Lógica relacionada con comidas y menús
- **Sync Hooks**: Hooks para sincronización con el backend
- **UI Hooks**: Hooks para manejo de interfaz y estado local
- **Utils Hooks**: Hooks utilitarios para operaciones comunes

### Contextos

- **AuthContext**: Gestión global de autenticación y sesiones de usuario

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Next.js](https://nextjs.org/docs)
2. Consulta la documentación de [Strapi](https://docs.strapi.io/)
3. Abre un issue en el repositorio

## 🔄 Características Implementadas y Futuras

### ✅ Implementado

- [x] Sistema de autenticación JWT
- [x] Registro y login de usuarios
- [x] Sistema de notificaciones toast
- [x] Sincronización automática con backend
- [x] Menú semanal
- [x] Búsqueda de residentes
- [x] Protección de rutas
- [x] Middleware de autenticación

### 🚧 En Desarrollo

- [ ] Dashboard de administración avanzado
- [ ] Sistema de roles y permisos granulares
- [ ] Reportes de comidas detallados
- [ ] Exportación de datos (PDF, Excel)

### 📅 Planificado

- [ ] Integración con sistemas de inventario
- [ ] Aplicación móvil (React Native)
- [ ] Integración con sistemas de facturación
- [ ] Notificaciones push
- [ ] Modo offline con sincronización
- [ ] Análisis y estadísticas avanzadas
- [ ] Sistema de auditoría completo

## 📊 Estado del Proyecto

- **Versión**: 0.1.0
- **Estado**: En desarrollo activo
- **Última actualización**: Octubre 2025
- **Compatibilidad**: Node.js 18+, Next.js 15+

### Características Principales Activas

- ✅ Sistema de autenticación completo
- ✅ Gestión de residentes y preferencias
- ✅ Sistema de comidas (desayuno, almuerzo, cena)
- ✅ Menús automáticos y semanales
- ✅ Sincronización automática
- ✅ Notificaciones en tiempo real
- ✅ Interfaz responsiva y accesible

### Tecnologías Core

- **Frontend**: Next.js 15.0.2 + React 18.3.1
- **Estilos**: TailwindCSS 3.4.1
- **Estado**: Zustand 5.0.1
- **Backend**: Strapi CMS
- **Autenticación**: JWT + js-cookie
- **Notificaciones**: react-hot-toast

---

Desarrollado con ❤️ para mejorar la gestión de centros de cuidado.
