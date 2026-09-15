# Mesa 21

Webapp estática y responsive para operar un plan doméstico de alimentación de 21 días: planificar, comprar, cocinar, conservar, reutilizar y controlar existencias.

## Abrir en local

Necesita un servidor HTTP porque los datos están separados en JSON:

```powershell
python -m http.server 4173
```

Después abre `http://localhost:4173`.

## Publicar con GitHub Desktop y GitHub Pages

1. En GitHub Desktop: **File → Add local repository** y elige esta carpeta. Si aún no es repositorio, crea uno desde GitHub Desktop.
2. Publica el repositorio en GitHub.
3. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Selecciona la rama principal y la carpeta `/ (root)`.

No hay compilación, backend ni dependencias npm. `index.html` está listo para Pages, incluso si el repositorio se publica bajo una subruta.

## Datos y validación

Regenerar las semillas:

```powershell
node scripts/generate-data.mjs
node scripts/validate-data.mjs
```

Consulta [el modelo](docs/data-model.md) y [el informe de validación](docs/validation-report.md).

## Precios de Ahorramás

Ahorramás no ofrece una API pública documentada pensada para ser llamada directamente desde una página estática. Mesa 21 funciona siempre con el último catálogo válido y admite dos vías:

- Feed JSON con CORS, configurable desde la propia app.
- GitHub Action incluida, dos veces al día y también manual, que intenta actualizar únicamente páginas de producto con datos estructurados inequívocos y valida los datos antes de guardar.

Para activar el cron, el repositorio debe permitir a GitHub Actions escribir contenido. Las páginas de categoría o productos no verificables se omiten y mantienen el último precio conocido. El código postal `45122` se conserva en la configuración para un futuro proveedor por tienda, pero no se envía a servicios no documentados.
