# Organized Week

Organized Week es un planificador semanal personal para organizar tareas,
hábitos, recompensas y metas visuales desde una sola interfaz. La aplicación
funciona completamente en el navegador y conserva la información en el
dispositivo local.

## Funcionalidades

- Selección de los siete días de la semana, de domingo a sábado.
- Creación, edición y eliminación de hábitos.
- Registro del progreso diario de hábitos de lunes a sábado.
- Resumen semanal de hábitos completados y horas de premio ganadas.
- Creación, edición, marcado y eliminación de tareas por día.
- Limpieza de todas las tareas del día seleccionado.
- Configuración de opciones de premios con título y categoría.
- Acumulación de una hora de premio por cada día de lunes a sábado en el que
  se cumplen los hábitos definidos.
- Registro de consumos de premios en minutos, disponible los domingos.
- Edición y eliminación de consumos registrados.
- Vision Board con metas, descripción, estado e imagen opcional.
- Estados de meta: `pendiente`, `en progreso` y `conseguida`.
- Persistencia local de la información mediante `localStorage` e IndexedDB.

## Tecnologías utilizadas

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4 mediante `@tailwindcss/vite`
- ESLint 10
- IndexedDB y `localStorage` del navegador

## Requisitos previos

- Node.js compatible con las versiones utilizadas por el proyecto.
- npm.

No se requiere backend, base de datos remota ni servicio externo para ejecutar
la aplicación.

## Instalación

Desde la carpeta del proyecto:

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Vite mostrará la dirección local, normalmente
`http://localhost:5173`.

## Verificación

Los siguientes comandos están definidos en `package.json`:

```bash
npm run lint
npm run typecheck
npm run build
```

- `npm run lint` ejecuta ESLint.
- `npm run typecheck` ejecuta la comprobación de tipos de TypeScript.
- `npm run build` genera la compilación de producción con Vite.

## Vista previa local

Después de generar la compilación, puede visualizarse localmente con:

```bash
npm run preview
```

## Estructura principal

```text
Organized_Week/
├── public/                 # Favicon, iconos e imágenes del Vision Board
├── src/
│   ├── components/         # Interfaz de días, hábitos, tareas, premios y metas
│   ├── constants/          # Días, claves de almacenamiento y límites
│   ├── hooks/              # Estado y persistencia de la aplicación
│   ├── services/           # Acceso a IndexedDB para imágenes
│   ├── types/              # Tipos TypeScript del dominio
│   ├── utils/              # Fechas, formato, identificadores y progreso
│   ├── App.tsx             # Composición principal de la aplicación
│   ├── App.css             # Estilos específicos de la aplicación
│   └── index.css           # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── eslint.config.js
```

## Vision Board

El Vision Board permite crear metas personales con un título, una descripción,
un estado y una imagen opcional. Las metas se muestran como tarjetas y pueden
editarse, cambiar de estado, cambiar o eliminar su imagen y eliminarse.

El Vision Board tiene un límite real de **9 metas**. Al alcanzar ese límite no
se pueden agregar nuevas metas hasta eliminar una existente.

## Almacenamiento y privacidad local

- `localStorage` guarda las tareas, hábitos, definiciones de hábitos, progreso
  diario, opciones de premios, consumos, metas del Vision Board y la versión
  del esquema.
- IndexedDB guarda los archivos de imagen asociados a las metas del Vision
  Board. Las metas almacenadas en `localStorage` conservan la referencia a
  cada imagen.

La información permanece en el navegador y en el dispositivo donde se utiliza
la aplicación. No se sincroniza entre dispositivos ni se envía a la nube.
Borrar los datos del sitio o utilizar otro navegador o dispositivo puede hacer
que la información deje de estar disponible.

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Selecciona **Vite** como framework, si Vercel no lo detecta
   automáticamente.
3. Usa `npm install` como instalación de dependencias.
4. Usa `npm run build` como comando de compilación.
5. Usa `dist` como directorio de salida.
6. Despliega el proyecto.

También puede realizarse el despliegue desde la CLI de Vercel después de
autenticarse, ejecutando `vercel` en la carpeta del proyecto.

## Limitaciones reales

- No incluye autenticación ni cuentas de usuario.
- No tiene backend, API ni base de datos remota.
- No ofrece sincronización, copias de seguridad ni colaboración entre
  dispositivos.
- Los datos dependen del almacenamiento local disponible en el navegador.
- El consumo de premios solo puede registrarse el domingo y está limitado a
  los minutos disponibles.
- Los hábitos del domingo no suman progreso ni horas de premio.
- El Vision Board admite como máximo 9 metas.
- El proyecto no incluye pruebas automatizadas.

## Versión

**1.0.0**

Proyecto personal.
