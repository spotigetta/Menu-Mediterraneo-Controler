# Informe de normalización y validación

Validación ejecutada con `node scripts/validate-data.mjs`.

- 69 ingredientes canónicos.
- 58 recetas y bases.
- 21 días, con desayuno, comida y cena.
- 6 planes de compra.
- 14 referencias iniciales de producto.
- 11 flujos explícitos de aprovechamiento.
- 0 IDs duplicados.
- 0 referencias rotas entre menú, recetas, ingredientes, compras, productos y salidas.

## Decisiones e inconsistencias conservadas

1. Veintisiete recetas no indicaban tiempo activo. Se añadió una estimación operativa y se marcó `time_confidence: "estimated"`.
2. Expresiones como “verdura”, “compango” o “ensalada” no siempre traían desglose. Se mantuvieron como ingrediente agregado o nota; no se inventó una composición exacta.
3. Algunos aprovechamientos indicaban “una ración” sin peso. Se normalizaron en raciones y la cantidad quedó nula cuando no era inferible.
4. El pisto, el sofrito y el relleno son preparaciones, no compras. Sus dependencias se modelan en `leftover_outputs` y `utilization.json`.
5. En el arroz de pollo y el de costilla, la reserva se crea antes de añadir arroz. Esto está explícito en pasos, salida y flujo, conservando la preferencia baja en hidratos del trabajador.
6. La ensalada C04 permite atún o queso. Ambos aparecen como opcionales y una nota aclara que son alternativas.
7. La fuente proponía precios con fecha 15/09/2026. Se guardaron como `last_known`; nunca como garantía permanente.
8. La documentación citaba un “texto en ResultadosMenu.md”, pero el archivo recibido estaba vacío. La fuente normalizada real fue el adjunto de 39.720 bytes.

Las advertencias de tiempo no invalidan el grafo. El validador devuelve estado válido y mantiene visibles estas incertidumbres.
