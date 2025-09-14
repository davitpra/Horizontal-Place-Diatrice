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
- **Headless UI** - Componentes accesibles sin estilos
- **Heroicons** - Iconografía SVG
- **Zustand** - Gestión de estado ligera

### Backend

- **Strapi CMS** - Sistema de gestión de contenido
- **API REST** - Comunicación con el backend

### Herramientas de Desarrollo

- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Procesador de CSS
- **Turbopack** - Bundler rápido para desarrollo

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
   STRAPI_TOKEN=tu_token_de_strapi_aqui

   # Para usar con REST Client (VS Code extension)
   # Estas variables se usan en el archivo api.rest
   STRAPI_HOST=http://localhost:1337
   STRAPI_TOKEN=tu_token_de_strapi_aqui
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
│   ├── globals.css        # Estilos globales
│   ├── layout.js          # Layout principal
│   ├── page.js            # Página principal (servicio de comidas)
│   ├── room/              # Página de gestión de residentes
│   └── trays/             # Página de bandejas
├── components/            # Componentes reutilizables
│   ├── Table.js           # Tabla de residentes
│   ├── MealBar.js         # Barra de navegación de comidas
│   ├── SelectionModal.js  # Modal de selección
│   └── ...
├── hooks/                 # Custom hooks
│   ├── useCreateMenus.js  # Hook para crear menús
│   ├── useTrays.js        # Hook para gestión de bandejas
│   └── ...
├── lib/                   # Utilidades y configuraciones
│   ├── strapi.js          # Cliente de Strapi
│   └── getAllResidents.js # Función para obtener residentes
├── data/                  # Datos estáticos
├── constants/             # Constantes de la aplicación
└── store/                 # Estado global con Zustand
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo con Turbopack (más rápido)
npm run dev

# Construcción para producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting del código
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
   STRAPI_TOKEN=tu_token_de_strapi_aqui
   ```
3. **Abre el archivo `api.rest`** y haz clic en "Send Request" sobre cualquier endpoint

## 🎨 Guías de Desarrollo

### Convenciones de Código

- Usar **const** en lugar de **function** para componentes
- Prefijos **handle** para funciones de eventos (ej: `handleClick`)
- Early returns para mejorar legibilidad
- TailwindCSS para todos los estilos
- Implementar características de accesibilidad

### Componentes

- Todos los componentes son funcionales
- Uso de hooks personalizados para lógica reutilizable
- Props tipadas cuando sea posible

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

---

Desarrollado con ❤️ para mejorar la gestión de centros de cuidado.
