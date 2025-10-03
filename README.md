# Horizontal Place - Sistema de Gestión de Residentes

Un sistema completo de gestión de residentes para centros de cuidado, desarrollado con Next.js y Strapi CMS. La aplicación permite gestionar residentes, sus preferencias alimentarias, menús diarios y el servicio de comidas.

## 🚀 Características Principales

- **Gestión de Residentes**: Lista completa de residentes con información personal, habitación y preferencias
- **Sistema de Comidas**: Gestión de desayunos, almuerzos y cenas con preferencias personalizadas
- **Control de Bandejas**: Seguimiento de comidas servidas en bandeja
- **Menús Dinámicos**: Creación automática de menús basados en preferencias de residentes
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
   cd horizontal-place
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
│   ├── room/              # Página de gestión de residentes
│   ├── summary/           # Página de resumen
│   ├── table/             # Página de tabla
│   └── trays/             # Página de bandejas
├── components/            # Componentes reutilizables
│   ├── features/          # Componentes específicos de funcionalidades
│   │   ├── serving/       # Componentes de servicio
│   │   ├── servingModals/ # Modales de servicio
│   │   ├── tableInfo/     # Información de tabla
│   │   └── tableResident/ # Tabla de residentes
│   ├── providers/         # Proveedores de contexto
│   └── ui/                # Componentes de interfaz
│       ├── Footer.js      # Pie de página
│       ├── MealBar.js     # Barra de navegación de comidas
│       ├── Modal.js       # Modal base
│       ├── Sidebar.js     # Barra lateral
│       ├── Table.js       # Tabla base
│       ├── Title.js       # Título
│       └── Wraper.js      # Wrapper
├── hooks/                 # Custom hooks
│   ├── meals/             # Hooks relacionados con comidas
│   ├── ui/                # Hooks de interfaz
│   └── utils/             # Hooks utilitarios
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

### Gestión de Residentes

- Lista completa de residentes activos
- Información de habitación y ubicación
- Preferencias alimentarias personalizadas
- Filtrado y ordenamiento de datos

### Sistema de Comidas

- **Desayunos**: Huevos, tostadas, cereales, frutas, yogurt, muffins
- **Almuerzos**: Sopas, ensaladas, opciones principales, postres
- **Cenas**: Opciones principales, acompañamientos, postres
- Control de comidas servidas en bandeja

### Menús Automáticos

- Generación automática basada en preferencias
- Calendario de menús por fecha
- Personalización por residente

## 🔌 API Endpoints

El sistema se conecta con Strapi CMS a través de los siguientes endpoints principales:

- **Residentes**: `/api/residents`
- **Menús**: `/api/menus`
- **Desayunos**: `/api/breakfasts`
- **Almuerzos**: `/api/lunches`
- **Cenas**: `/api/dinners`
- **Horarios de Menú**: `/api/menu-schedules`

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
   
   **Nota**: Ahora el sistema usa autenticación JWT del usuario en lugar de un token fijo de Strapi. Para endpoints protegidos, primero debes autenticarte y obtener un JWT válido.

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
- **Feature Components**: Componentes específicos de funcionalidades (`src/components/features/`)
- **Providers**: Contextos y proveedores de estado (`src/components/providers/`)
- Todos los componentes son funcionales con hooks
- Uso de custom hooks para lógica reutilizable
- Props tipadas con TypeScript cuando sea posible

### Estructura de Hooks

- **Meals Hooks**: Lógica relacionada con comidas y menús
- **UI Hooks**: Hooks para manejo de interfaz y estado local
- **Utils Hooks**: Hooks utilitarios para operaciones comunes

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

## 🔄 Próximas Características

- [ ] Sistema de notificaciones
- [ ] Reportes de comidas
- [ ] Integración con sistemas de inventario
- [ ] Aplicación móvil
- [ ] Dashboard de administración
- [ ] Sistema de roles y permisos
- [ ] Exportación de datos
- [ ] Integración con sistemas de facturación
- [ ] Notificaciones push
- [ ] Modo offline

## 📊 Estado del Proyecto

- **Versión**: 0.1.0
- **Estado**: En desarrollo activo
- **Última actualización**: Diciembre 2024
- **Compatibilidad**: Node.js 18+, Next.js 15+

---

Desarrollado con ❤️ para mejorar la gestión de centros de cuidado.
