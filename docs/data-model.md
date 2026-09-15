# Modelo de datos de Mesa 21

Los archivos de `data/` son la semilla inmutable. El estado de uso se guarda en `localStorage` bajo `mesa21_state_v1` y puede exportarse desde la aplicación.

## Entidades

- `ingredients.json`: ingrediente canónico, aliases, categoría y unidad base.
- `recipes.json`: receta, raciones, ingredientes referenciados, pasos, tiempos, conservación, equipo, sustituciones y salidas aprovechables.
- `menu.json`: 21 días; tres comidas por día, comensales, estados iniciales, preparación, descongelación, salidas y consumos de sobras.
- `inventory.json`: stock semilla con ubicación, cantidad, mínimo, lote y fechas.
- `shopping-plans.json`: seis compras, cada artículo con ID propio, condición, cantidad y referencia de ingrediente.
- `products.json`: catálogo de referencia separado del ingrediente; distingue precio, fecha, estado y precio objetivo.
- `utilization.json`: aristas explícitas entre receta productora, salida y receta/día consumidor.
- `settings.json`: perfiles, multiplicadores, código postal y configuración del proveedor de precios.

## Estado mutable

`meal_statuses`, `meal_replacements`, `inventory`, `prepared_food`, `shopping_checks`, `purchased_items`, `price_overrides` y preferencias se guardan por separado. Marcar una preparación como preparada crea sus salidas; marcar su consumo resta una ración. Marcar una compra incorpora el artículo al inventario una sola vez.

## Precios

El navegador consume siempre el último catálogo local válido. Opcionalmente puede leer un feed JSON con CORS desde Configuración. El actualizador externo de `scripts/update-prices.mjs` es conservador: solo modifica un precio cuando encuentra un producto inequívoco con oferta estructurada; nunca intenta adivinar a partir de una página de categoría.
