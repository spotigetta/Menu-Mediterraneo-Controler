from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
image_dir = root / 'assets' / 'images'
recipe_dir = image_dir / 'recipes'
icon_dir = root / 'assets' / 'icons'
recipe_dir.mkdir(parents=True, exist_ok=True)
icon_dir.mkdir(parents=True, exist_ok=True)

atlas = Image.open(image_dir / 'recipe-atlas-source.png').convert('RGB')
hero = Image.open(image_dir / 'hero-kitchen.png').convert('RGB')
hero.thumbnail((1800, 1200), Image.Resampling.LANCZOS)
hero.save(image_dir / 'hero-kitchen.webp', 'WEBP', quality=84, method=6)
cols = [(0, 307), (314, 622), (629, 938), (945, 1254)]
rows = [(0, 373), (380, 758), (765, 1149)]
names = ['huevos-tomate','yogur-fruta','crema-calabacin','crema-calabaza','pollo-horno','lomo-cebolla','merluza-tomate','empanada','cocido','fabada','arroz','ensalada-tomate']
for name, (x0, x1, y0, y1) in zip(names, [(x0,x1,y0,y1) for y0,y1 in rows for x0,x1 in cols]):
    crop = atlas.crop((x0, y0, x1, y1))
    crop.thumbnail((720, 540), Image.Resampling.LANCZOS)
    crop.save(recipe_dir / f'{name}.webp', 'WEBP', quality=82, method=6)

for size in (192, 512):
    im = Image.new('RGB', (size, size), '#A33A2B')
    draw = ImageDraw.Draw(im)
    margin = size * .18
    draw.ellipse((margin, margin, size-margin, size-margin), fill='#FFF8E8')
    draw.ellipse((size*.31, size*.31, size*.69, size*.69), fill='#F1B24A')
    w = max(6, size//38)
    draw.line((size*.25,size*.18,size*.25,size*.82), fill='#26463D', width=w)
    draw.line((size*.19,size*.18,size*.19,size*.38), fill='#26463D', width=w)
    draw.line((size*.31,size*.18,size*.31,size*.38), fill='#26463D', width=w)
    draw.line((size*.76,size*.18,size*.76,size*.82), fill='#26463D', width=w)
    draw.ellipse((size*.72,size*.18,size*.80,size*.42), fill='#26463D')
    im.save(icon_dir / f'icon-{size}.png', optimize=True)
print('Prepared 12 recipe images and 2 PWA icons.')
