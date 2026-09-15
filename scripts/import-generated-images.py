from pathlib import Path
from PIL import Image, ImageOps

SOURCE = Path(r"C:\Users\pablo\.codex\generated_images\01a0a626-104c-7002-89b8-566aa95f90b0")
OUT = Path(__file__).resolve().parents[1] / "assets" / "images" / "recipes"
ICON = SOURCE / "exec-1e5ebc91-956e-402b-80e8-1820fc97a6a8.png"
FILES = {
"sofrito_mediterraneo":"d1cbf443-47e0-4ab1-aaf6-37790d5d06f6","pisto_grande":"ccda6e13-34ba-4868-ab3b-70df63060363","verduras_asadas":"9b2843a8-c19d-40cf-b722-5088ebf111c7","huevos_cocidos":"69444776-d26f-4cc3-afaf-1236cded2089","huevos_tomate":"9608e590-e2b1-428c-88cb-d54831f44931","revuelto_jamon":"bb3957b5-bfef-45fe-8bd0-73f3053e77c1","tortilla_queso":"06a90208-2227-4188-a4e6-0270722db089","tortilla_sobrasada":"76a80dfe-17af-4683-a643-70247c4e97cc","chistorra_huevo":"a8f94d37-8e78-4ecb-938f-155f9f748e24","panceta_huevo_tomate":"5afdcc47-35ea-4a44-ade0-396f09ad4d33","jamon_queso_tomate":"b64fb7aa-db5b-4679-ae1f-c0247feebff1","yogur_platano_nueces":"24751489-e417-43b5-bbb5-4377a37dd585","yogur_fruta_nueces":"7cc4d545-31c6-4085-ba46-fbf84af33982","tostada_tomate_huevo":"f844a3e4-a8bf-4324-b45c-2375013314a6","avena_nocturna":"d4b86faa-fb7b-41e9-87eb-3da231c245a6","tosta_sobrasada_queso":"18cf19f4-3b69-4e6e-8a81-1e6d3e907701","crema_calabacin":"32885ccc-8894-4a8b-a6a2-df8871d17443","crema_calabaza":"9109f4b9-50d6-4a37-98ac-708d1adf9cbd","sopa_rapida":"81fcff03-e4d8-4995-80d0-6adc3f9fcafe","ensalada_tomate":"893de374-7233-417e-b024-c8b5b2c9a565","judias_verdes_ajillo":"916a6db7-0684-4655-8ead-7cc36ae7d7fc","brocoli_sencillo":"7cd40e82-5d61-41e0-af0b-66897de9e652","champinones_ajillo":"c545c18a-0e5d-4517-bf17-fa573a7f585b","jamoncitos_limon":"0fcadf77-e3c0-4d60-9408-50ff4766204f","contramuslos_hierbas":"6af94bce-1f37-40cf-88c5-7e0d1d90ee3d","pollo_ajillo":"0601c000-cec8-4c84-864e-1e4e10cabe40","pollo_champinones":"e486543a-8c67-4e15-9b69-5ec2ce90ecec","lomo_encebollado":"ef96e3c0-73ae-4724-9e66-bcdc4891ebbf","lomo_plancha":"a9d731b6-341d-4aa7-9c5b-280bb51aa1ac","filetes_rusos":"3ca4efe0-5740-41ea-8798-d07959067146","albondigas_tomate":"1c13cc52-5369-4773-b84c-d465f4a53cd0","higaditos_encebollados":"a65fc673-3f85-4ad3-91b6-145627222c45","merluza_tomate":"f1d0b3b6-a74c-4dff-a7db-22387cf87cba","merluza_papillote":"7979efee-0626-46c1-8c01-819751644f2b","ensalada_caballa_tupper":"591710e7-ddf7-4615-840e-e69ee4ae45a6","berenjenas_rellenas":"52854f04-6c66-426c-a3ea-ceca3443b914","calabacines_atun":"5fc06f60-e3dd-4794-916c-db1384883fe4","tortilla_calabacin":"f6f78835-26a7-470c-afb5-6c93689f1e19","tortilla_jamon_queso":"67b1ea16-e348-416b-9e06-0727dce8a291","huevos_pisto":"ba25403a-7c8f-4530-a8d7-614276f1a993","judias_huevos":"8ca55e1b-3be6-48eb-a974-d2dc681cd07b","hamburguesa_plato":"ca474098-5bb8-49db-a9dc-22502904970a","salchicha_pimientos":"36172e71-4f58-4d27-8a34-195498d51a7f","champinones_huevos":"8bf83c37-3127-4780-8b72-6b5b6c1c32a0","empanada_atun":"507ed9e0-08c0-463a-9c74-b2c9fb598a90","empanada_pollo_setas":"4aa5f7e5-ebc1-421d-9ba3-3d0949c0bfee","empanada_lomo_sofrito":"c88f6099-98cd-4e73-9722-73dc963d5520","empanada_jamon_queso":"f48523a2-964e-4217-914d-af428ef806dd","empanada_sobrasada_tetilla":"af7069fe-7483-49ba-a2e0-7b46bbf2e9bb","cocido":"add95c6c-7228-4334-bc4d-8350d2518875","ropa_vieja":"9a252263-2caa-47dd-b1ef-72af9fdc1f15","fabada":"350ba464-9b80-447b-9c04-62d811d0ac69","judias_blancas_verduras":"71b3a082-6f4f-4763-8f2b-f0d899be3e14","lentejas_verduras":"443817ba-7dd7-49db-bf38-ec19958231b7","garbanzos_espinaca_huevo":"0d8e9037-5eca-44f7-8ff6-f0cb8799cfa9","arroz_pollo_verduras":"89d4727b-6b11-4160-8c7d-219df1138c5b","arroz_costilla":"0985c01f-01d1-43cd-80aa-921d6f4f507f","arroz_magro":"f428aeee-cd54-42f8-a66e-514e2c8352b4"
}

OUT.mkdir(parents=True, exist_ok=True)
for slug, token in FILES.items():
    source = SOURCE / f"exec-{token}.png"
    image = Image.open(source).convert("RGB")
    ImageOps.fit(image, (720, 540), Image.Resampling.LANCZOS).save(OUT / f"{slug}.webp", "WEBP", quality=82, method=6)

icon_dir = OUT.parents[1] / "icons"
icon_dir.mkdir(parents=True, exist_ok=True)
icon = Image.open(ICON).convert("RGBA")
for size in (192, 512):
    ImageOps.fit(icon, (size, size), Image.Resampling.LANCZOS).save(icon_dir / f"icon-{size}.png", optimize=True)
ImageOps.fit(icon, (64, 64), Image.Resampling.LANCZOS).save(OUT.parents[2] / "favicon.png", optimize=True)
print(f"Imported {len(FILES)} recipe images and app icons")
