# Frontend de Save Statistics

Este proyecto frontend está desarrollado con Next.js 15 y React 19, proporcionando una interfaz moderna y eficiente para gestionar y visualizar estadísticas de clicks.

## Características

- **Autenticación Segura**: Sistema completo de registro e inicio de sesión con protección JWT
- **Dashboard Interactivo**: Visualización de estadísticas en tiempo real
- **Gráficos Avanzados**: Representaciones visuales con Recharts para un análisis intuitivo
- **Filtros Temporales**: Análisis por día, semana, mes o periodos personalizados
- **Tema Oscuro/Claro**: Soporte para diferentes preferencias de visualización
- **Diseño Responsivo**: Experiencia óptima en todos los dispositivos
- **Componentes Reutilizables**: Biblioteca de UI personalizada con Shadcn UI

## Estructura del Proyecto

```
/
├── app/                   # Páginas y rutas de la aplicación
│   ├── dashboard/         # Panel principal de estadísticas
│   ├── signin/            # Página de inicio de sesión
│   └── register/          # Página de registro
├── components/            # Componentes reutilizables
│   ├── auth/              # Componentes de autenticación
│   ├── dashboard/         # Componentes del panel
│   └── ui/                # Componentes de interfaz genéricos
├── lib/                   # Utilidades y configuraciones
└── public/                # Archivos estáticos
```

## Tecnologías Principales

- **Next.js 15**: Framework React con renderizado híbrido
- **React 19**: Biblioteca para construcción de interfaces
- **Tailwind CSS 4**: Framework CSS utilitario
- **Shadcn UI**: Componentes de UI reutilizables
- **React Hook Form**: Manejo eficiente de formularios
- **Zod**: Validación de esquemas
- **Recharts**: Visualizaciones de datos
- **Axios**: Cliente HTTP para comunicación con el backend
- **Sonner**: Sistema de notificaciones elegante

## Inicio Rápido

1. Instala las dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Scripts Disponibles

- **dev**: Inicia el servidor de desarrollo con Turbopack para recarga rápida
- **build**: Genera la aplicación para producción
- **start**: Inicia la aplicación compilada
- **lint**: Ejecuta ESLint para verificar la calidad del código

## Conexión con el Backend

Por defecto, la aplicación se conecta a una API en `http://localhost:3001`. Puedes modificar esta configuración en las variables de entorno:

```
# .env.local
NEXT_PUBLIC_API_URL=http://tu-backend-url
```

## Despliegue

Para desplegar en Vercel:

```bash
vercel
```

O configura un despliegue automático desde GitHub.

## Desarrollo

### Agregar Nuevas Páginas

1. Crea un nuevo directorio en `app/`
2. Añade un archivo `page.tsx` con el componente de la página

### Componentes Personalizados

Usa los componentes de Shadcn UI como base y personalízalos según sea necesario:

```bash
npx shadcn-ui@latest add button
```

### Estilización

El proyecto utiliza Tailwind CSS para estilos. Configura tus propios estilos en:

- `app/globals.css` - Estilos globales
- `tailwind.config.ts` - Configuración de Tailwind

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Guía de Shadcn UI](https://ui.shadcn.com)

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).
