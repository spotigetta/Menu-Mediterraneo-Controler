# Mesa 21 — resultado del desarrollo

La documentación fuente se ha transformado en una aplicación estática operativa y en ocho JSON normalizados dentro de `data/`.

Resumen: 69 ingredientes canónicos, 58 recetas/bases, 21 días, 6 compras, 14 productos de referencia y 11 flujos de aprovechamiento. La validación automática no encuentra IDs duplicados ni referencias rotas.

La aplicación incluye Inicio, Hoy, Calendario, Recetas, Inventario, Nevera/congelador, compras, aprovechamiento y configuración; persiste el estado local, crea y consume sobras, incorpora compras al inventario y permite importar/exportar copias.

Para detalles técnicos e inconsistencias conservadas, consultar `docs/data-model.md` y `docs/validation-report.md`.
