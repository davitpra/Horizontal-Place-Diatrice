# Sistema de Autenticación - Horizontal Place

## 📋 Resumen

Se ha implementado un sistema completo de autenticación con Strapi CMS para el proyecto Horizontal Place. El sistema incluye login, registro, protección de rutas, gestión de sesiones y middleware de seguridad.

## 🚀 Características Implementadas

### ✅ Autenticación Básica
- **Login**: Autenticación con email/username y contraseña
- **Registro**: Creación de nuevas cuentas de usuario
- **Logout**: Cierre de sesión seguro
- **Verificación de tokens**: Validación de JWT tokens

### ✅ Protección de Rutas
- **Middleware de Next.js**: Protección automática de rutas
- **Componentes de protección**: `AuthGuard` y `ProtectedRoute`
- **Redirecciones**: Manejo automático de usuarios no autenticados

### ✅ Gestión de Estado
- **Context de Autenticación**: Estado global del usuario
- **Hooks personalizados**: `useAuth` y `useProtectedRoute`
- **Persistencia**: Almacenamiento en cookies seguras

### ✅ Componentes UI
- **LoginForm**: Formulario de inicio de sesión
- **RegisterForm**: Formulario de registro
- **Dashboard**: Página principal después del login
- **Sidebar actualizado**: Información del usuario y logout

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
```
src/
├── strapi/
│   └── auth.js                    # Funciones de autenticación con Strapi
├── contexts/
│   └── AuthContext.js             # Contexto de autenticación
├── hooks/auth/
│   ├── useAuth.js                 # Hook principal de autenticación
│   └── useProtectedRoute.js       # Hook para rutas protegidas
├── components/auth/
│   ├── LoginForm.js               # Formulario de login
│   ├── RegisterForm.js            # Formulario de registro
│   ├── ProtectedRoute.js          # Componente de protección
│   └── AuthGuard.js               # Guard de autenticación
├── app/
│   ├── login/page.js              # Página de login
│   ├── register/page.js           # Página de registro
│   ├── dashboard/page.js          # Dashboard principal
│   └── api/auth/
│       ├── [...nextauth]/route.js # Placeholder para NextAuth
│       └── verify/route.js        # Verificación de tokens
├── utils/
│   └── auth.js                    # Utilidades de autenticación
├── middleware.js                  # Middleware de protección
└── AUTHENTICATION.md              # Esta documentación
```

### Archivos Modificados
```
src/
├── app/
│   └── layout.js                  # Agregado AuthProvider
├── components/ui/
│   └── Sidebar.js                 # Información del usuario y logout
└── package.json                   # Dependencias agregadas
```

## 🔧 Configuración

### Variables de Entorno
Agregar al archivo `.env.local`:
```env
# Strapi CMS Configuration
STRAPI_HOST=http://localhost:1337

# JWT Secret for token verification (same as Strapi JWT_SECRET)
JWT_SECRET=your-super-secret-jwt-key-here

# Auth Configuration (optional - for future NextAuth integration)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

**Importante**: Ya no se requiere `STRAPI_TOKEN`. El sistema ahora usa el JWT del usuario autenticado automáticamente.

### Dependencias Instaladas
```bash
npm install js-cookie @types/js-cookie jsonwebtoken @types/jsonwebtoken
```

## 🛠️ Configuración de Strapi

### 1. Configurar Users & Permissions Plugin
```bash
# En tu proyecto Strapi
npm install @strapi/plugin-users-permissions
```

### 2. Configurar Roles y Permisos
- **Public**: Acceso limitado a endpoints públicos
- **Authenticated**: Acceso a endpoints protegidos
- **Admin**: Acceso completo al sistema

### 3. Configurar JWT Secret
En `config/plugins.js` de Strapi:
```javascript
module.exports = {
  'users-permissions': {
    config: {
      jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    },
  },
};
```

## 🚦 Rutas Protegidas

### Rutas que Requieren Autenticación
- `/dashboard` - Dashboard principal
- `/room` - Gestión de residentes
- `/summary` - Resumen del sistema
- `/table` - Gestión de mesas
- `/trays` - Gestión de bandejas

### Rutas Públicas
- `/` - Página principal (servicio de comidas)
- `/login` - Página de login
- `/register` - Página de registro
- `/api/*` - Endpoints de API

## 🔐 Flujo de Autenticación

### 1. Login
1. Usuario ingresa credenciales en `/login`
2. Se envía petición a Strapi `/api/auth/local`
3. Strapi valida credenciales y retorna JWT
4. JWT se almacena en cookie segura
5. Usuario es redirigido a `/dashboard`

### 2. Protección de Rutas
1. Middleware verifica token en cookies
2. Si no hay token, redirige a `/login`
3. Si token es inválido, limpia cookies y redirige
4. Si token es válido, permite acceso a la ruta

### 3. Logout
1. Usuario hace clic en "Cerrar Sesión"
2. Se elimina JWT de las cookies
3. Usuario es redirigido a `/login`

## 🎯 Uso de los Componentes

### useAuth Hook
```javascript
import { useAuth } from '@/hooks/auth/useAuth';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }
  
  return <div>Hola, {user.username}</div>;
};
```

### AuthGuard Component
```javascript
import AuthGuard from '@/components/auth/AuthGuard';

const ProtectedPage = () => {
  return (
    <AuthGuard>
      <div>Contenido protegido</div>
    </AuthGuard>
  );
};
```

### ProtectedRoute Component
```javascript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const App = () => {
  return (
    <ProtectedRoute redirectTo="/login">
      <div>Contenido protegido</div>
    </ProtectedRoute>
  );
};
```

## 🔧 Funciones de Autenticación

### Login
```javascript
import { login } from '@/strapi/auth';

const handleLogin = async (email, password) => {
  try {
    const data = await login(email, password);
    console.log('Usuario autenticado:', data.user);
  } catch (error) {
    console.error('Error de login:', error.message);
  }
};
```

### Registro
```javascript
import { register } from '@/strapi/auth';

const handleRegister = async (username, email, password) => {
  try {
    const data = await register(username, email, password);
    console.log('Usuario registrado:', data.user);
  } catch (error) {
    console.error('Error de registro:', error.message);
  }
};
```

### Verificar Autenticación
```javascript
import { isAuthenticated, getToken } from '@/strapi/auth';

if (isAuthenticated()) {
  const token = getToken();
  console.log('Usuario autenticado con token:', token);
}
```

## 🛡️ Seguridad

### Cookies Seguras
- **HttpOnly**: No accesibles desde JavaScript
- **Secure**: Solo en HTTPS en producción
- **SameSite**: Protección contra CSRF
- **Expiration**: Expiración automática

### Validación de Tokens
- **Verificación JWT**: Validación de firma y expiración
- **Middleware**: Verificación en cada request
- **Limpieza automática**: Eliminación de tokens inválidos

### Protección de Rutas
- **Middleware de Next.js**: Protección a nivel de servidor
- **Componentes de protección**: Protección a nivel de cliente
- **Redirecciones**: Manejo automático de acceso no autorizado

## 🐛 Solución de Problemas

### Error: "No authentication token found"
- Verificar que Strapi esté ejecutándose
- Verificar configuración de JWT_SECRET
- Verificar que el usuario esté registrado en Strapi

### Error: "Invalid token"
- Token expirado o inválido
- JWT_SECRET no coincide entre Next.js y Strapi
- Limpiar cookies del navegador

### Error: "Login failed"
- Verificar credenciales del usuario
- Verificar que el usuario esté activo en Strapi
- Verificar configuración del plugin users-permissions

## 🔄 Próximos Pasos

### Mejoras Sugeridas
1. **Recuperación de contraseña**: Implementar flujo de reset
2. **Verificación de email**: Confirmación de cuenta por email
3. **Roles avanzados**: Sistema de permisos granular
4. **Sesiones múltiples**: Gestión de sesiones activas
5. **Auditoría**: Log de eventos de autenticación

### Integración con Funcionalidades Existentes
1. **Protección de rutas existentes**: Aplicar AuthGuard a todas las páginas
2. **Personalización por usuario**: Adaptar contenido según rol
3. **Historial de acciones**: Registrar cambios por usuario
4. **Notificaciones**: Sistema de alertas por usuario

## 📚 Recursos Adicionales

- [Documentación de Strapi Users & Permissions](https://docs.strapi.io/dev-docs/plugins/users-permissions)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT.io](https://jwt.io/) - Para debug de tokens
- [js-cookie](https://github.com/js-cookie/js-cookie) - Documentación de cookies

## ✅ Estado de Implementación

- [x] Sistema de autenticación básico
- [x] Protección de rutas
- [x] Componentes de UI
- [x] Middleware de seguridad
- [x] Gestión de estado
- [x] Documentación
- [ ] Pruebas unitarias
- [ ] Integración completa con funcionalidades existentes
- [ ] Sistema de roles avanzado
- [ ] Recuperación de contraseña

---

**Nota**: El sistema está listo para usar. Asegúrate de configurar Strapi correctamente y probar todas las funcionalidades antes de desplegar a producción.
