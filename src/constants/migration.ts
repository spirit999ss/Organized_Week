// Migración no destructiva: se conservan tareas y consumos compatibles.
// Las definiciones, opciones y metas antiguas no se convierten porque no tienen
// identificadores ni metadatos suficientes; las imágenes de public/ tampoco se importan.
export const MIGRATION_NOTE = "Datos antiguos incompatibles se dejan intactos.";
