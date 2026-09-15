# Mesa 21

Webapp estática y responsive para operar un plan doméstico de alimentación de 21 días: planificar, comprar, cocinar, conservar, reutilizar y controlar existencias.

## Abrir en local

Necesita un servidor HTTP porque los datos están separados en JSON:

```powershell
python -m http.server 4173
```

Después abre `http://localhost:4173`.

## Publicar con GitHub Desktop y GitHub Pages

El repositorio ya contiene `.github/workflows/deploy-pages.yml`.

1. En GitHub Desktop, revisa los cambios, escribe el resumen y pulsa **Commit to main**.
2. Pulsa **Push origin**. Un `Fetch origin` solo consulta/descarga cambios y no puede iniciar una Action remota.
3. Una sola vez, en GitHub abre **Settings → Pages → Build and deployment** y elige **GitHub Actions**.
4. Cada `push` a `main` valida los datos, compila `dist/` y publica la nueva versión.

No hay dependencias npm ni backend obligatorio. La compilación usa Node incluido en GitHub Actions.

## Instalar en el móvil

La web es una PWA con iconos de 192/512 px, manifest, service worker, navegación táctil y soporte offline. Tras publicarla mediante HTTPS:

1. Ábrela en Chrome para Android.
2. Usa **⋮ → Instalar aplicación** o el botón de Configuración cuando Chrome lo muestre.
3. La aplicación aparecerá en la pantalla de inicio y podrá abrirse sin conexión después de la primera carga.

## Datos y validación

Regenerar las semillas y compilar:

```powershell
node scripts/generate-data.mjs
node scripts/validate-data.mjs
node scripts/build.mjs
```

Consulta [el modelo](docs/data-model.md) y [el informe de validación](docs/validation-report.md).

## Precios de Ahorramás

Ahorramás no ofrece una API pública documentada pensada para ser llamada directamente desde una página estática. Mesa 21 funciona siempre con el último catálogo válido y admite dos vías:

- Feed JSON con CORS, configurable desde la propia app.
- GitHub Action incluida, dos veces al día y también manual, que intenta actualizar únicamente páginas de producto con datos estructurados inequívocos y valida los datos antes de guardar.

Para activar el cron, el repositorio debe permitir a GitHub Actions escribir contenido. Las páginas de categoría o productos no verificables se omiten y mantienen el último precio conocido. El código postal `45122` se conserva en la configuración para un futuro proveedor por tienda, pero no se envía a servicios no documentados.
