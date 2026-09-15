import { mkdir, writeFile } from 'node:fs/promises';

const out = new URL('../data/', import.meta.url);
await mkdir(out, { recursive: true });

const ingredientDefs = [
  ['aceite_oliva','Aceite de oliva virgen extra','despensa','ml'],['aceitunas','Aceitunas','conservas','g'],['agua','Agua','despensa','ml'],
  ['ajo','Ajo','verduras','g'],['alubia_cocida','Alubia blanca cocida','conservas','g'],['alubia_seca','Alubia blanca seca','despensa','g'],
  ['arroz_redondo','Arroz redondo','despensa','g'],['atun','Atún al natural','conservas','g'],['avena','Avena','despensa','g'],
  ['berenjena','Berenjena','verduras','g'],['brocoli','Brócoli','verduras','g'],['caballa','Caballa en conserva','conservas','g'],
  ['calabacin','Calabacín','verduras','g'],['calabaza','Calabaza','verduras','g'],['caldo','Caldo','despensa','ml'],
  ['carne_cocido','Morcillo/carne para cocido','carnes','g'],['carne_picada','Carne picada','carnes','g'],['cebolla','Cebolla','verduras','g'],
  ['champiñon','Champiñón','verduras','g'],['chistorra','Chistorra','carnes','g'],['chorizo','Chorizo','carnes','g'],
  ['coliflor','Coliflor','verduras','g'],['contramuslo_pollo','Contramuslo de pollo','carnes','g'],['costilla_cerdo','Costilla de cerdo','carnes','g'],
  ['espinaca','Espinaca','verduras','g'],['fabes','Fabes','despensa','g'],['fideo','Fideo','despensa','g'],
  ['fruta_variada','Fruta variada','frutas','g'],['garbanzo_cocido','Garbanzo cocido','conservas','g'],['garbanzo_seco','Garbanzo seco','despensa','g'],
  ['harina_pan_rallado','Pan rallado','despensa','g'],['higaditos_pollo','Higaditos de pollo','carnes','g'],['huesos_cocido','Huesos para cocido','carnes','g'],
  ['huevo','Huevo','huevos','ud'],['jamon','Jamón','carnes','g'],['jamoncito_pollo','Jamoncito de pollo','carnes','g'],
  ['judia_verde','Judía verde','verduras','g'],['leche','Leche','lácteos','ml'],['lenteja_pardina','Lenteja pardina','despensa','g'],
  ['limon','Limón','frutas','ud'],['lomo_cerdo','Cinta de lomo','carnes','g'],['magro_cerdo','Magro de cerdo','carnes','g'],
  ['manzana','Manzana','frutas','g'],['masa_hojaldre','Masa de hojaldre/empanada','nevera','ud'],['merluza','Merluza','pescados','g'],
  ['morcilla','Morcilla','carnes','g'],['mostaza','Mostaza','despensa','g'],['nueces','Nueces','despensa','g'],
  ['panceta','Panceta','carnes','g'],['pan_integral','Pan integral','despensa','g'],['patata','Patata','verduras','g'],
  ['pepino','Pepino','verduras','g'],['pera','Pera','frutas','g'],['pimiento','Pimiento','verduras','g'],
  ['platano','Plátano o banana','frutas','g'],['pollo','Pollo troceado','carnes','g'],['puerro','Puerro','verduras','g'],
  ['queso','Queso semicurado o tierno','lácteos','g'],['queso_tetilla','Queso de tetilla','lácteos','g'],['salchicha_fresca','Salchicha fresca/longaniza','carnes','g'],
  ['sobrasada','Sobrasada','carnes','g'],['tocino','Tocino','carnes','g'],['tomate_fresco','Tomate fresco','verduras','g'],
  ['tomate_triturado','Tomate triturado','conservas','g'],['verdura_asada','Verdura asada preparada','comida_preparada','g'],['zanahoria','Zanahoria','verduras','g'],
  ['verdura_variada','Verdura variada','verduras','g'],['vino_blanco','Vino blanco','despensa','ml'],['yogur','Yogur natural','lácteos','g']
];
const ingredients = ingredientDefs.map(([slug,name,category,default_unit]) => ({id:`ingredient_${slug}`,name,category,default_unit,aliases:[]}));
const I = (slug, quantity, unit='g', optional=false, note='') => ({ingredient_id:`ingredient_${slug}`,quantity,unit,optional,note});
const R = (code, slug, name, category, servings, total, active, ingredients, steps, extra={}) => ({
  id:`recipe_${slug}`, source_code:code, name, category, servings, ingredients, steps, total_time_minutes:total,
  active_time_minutes:active, equipment:extra.equipment||['sartén'], storage_days:extra.storage_days??3,
  freezable:extra.freezable??false, tags:extra.tags||[], estimated_cost:null, cost_status:'calculated_from_catalog',
  leftover_outputs:extra.leftover_outputs||[], possible_substitutions:extra.possible_substitutions||[],
  time_confidence:extra.time_confidence||'documented', notes:extra.notes||''
});

const recipes = [
R('B01','sofrito_mediterraneo','Sofrito mediterráneo','base',6,50,15,[I('cebolla',500),I('pimiento',300),I('tomate_triturado',800),I('ajo',4,'diente'),I('aceite_oliva',60,'ml')],['Picar cebolla, pimiento y ajo.','Pochar 15 minutos.','Añadir tomate y reducir 30–35 minutos.'],{equipment:['cuchillo','sartén'],freezable:true,storage_days:4,tags:['batch-cooking','base'],leftover_outputs:[{output_id:'prepared_sofrito',name:'Sofrito preparado',quantity:1400,unit:'g',recommended_portions:[250,400]}]}),
R('B02','pisto_grande','Pisto grande','base',6,50,18,[I('calabacin',600),I('berenjena',500),I('pimiento',400),I('cebolla',400),I('tomate_triturado',800),I('aceite_oliva',60,'ml')],['Pochar cebolla y pimiento.','Incorporar berenjena y calabacín.','Añadir tomate y reducir.'],{equipment:['cuchillo','cazuela'],freezable:true,storage_days:4,tags:['batch-cooking','guarnición'],leftover_outputs:[{output_id:'prepared_pisto',name:'Pisto preparado',servings:6}]}),
R('B03','verduras_asadas','Bandeja de verduras asadas','base',6,50,10,[I('calabacin',600),I('berenjena',500),I('pimiento',500),I('cebolla',400),I('aceite_oliva',50,'ml')],['Cortar grande y aliñar.','Hornear a 200 °C durante 35–40 minutos.'],{equipment:['horno','bandeja'],freezable:true,storage_days:4,tags:['batch-cooking','horno'],leftover_outputs:[{output_id:'prepared_verduras_asadas',name:'Verduras asadas',servings:6}]}),
R('B04','huevos_cocidos','Huevos cocidos por tandas','base',8,15,4,[I('huevo',8,'ud')],['Cocer 10 minutos desde que hierva el agua.','Enfriar y refrigerar.'],{equipment:['cazo'],storage_days:5,tags:['batch-cooking']}),
R('D01','huevos_tomate','Huevos con tomate','desayuno',1,8,8,[I('huevo',2,'ud'),I('tomate_fresco',150),I('aceite_oliva',5,'ml')],['Cocinar los huevos y servir con tomate aliñado.'],{tags:['rápida','bajo-hidrato']}),
R('D02','revuelto_jamon','Revuelto de jamón','desayuno',1,7,7,[I('huevo',2,'ud'),I('jamon',35)],['Batir y cuajar brevemente con el jamón.'],{tags:['rápida','bajo-hidrato']}),
R('D03','tortilla_queso','Tortilla de queso','desayuno',1,8,8,[I('huevo',2,'ud'),I('queso',30)],['Cuajar la tortilla con el queso.'],{tags:['rápida','bajo-hidrato']}),
R('D04','tortilla_sobrasada','Tortilla de sobrasada','desayuno',1,8,8,[I('huevo',2,'ud'),I('sobrasada',25),I('tomate_fresco',100,'g',true)],['Cuajar la tortilla usando poca sobrasada.'],{tags:['rápida']}),
R('D05','chistorra_huevo','Chistorra con huevo','desayuno',1,12,10,[I('huevo',2,'ud'),I('chistorra',50)],['Dorar la chistorra.','Cuajar los huevos.'],{tags:['ocasional']}),
R('D06','panceta_huevo_tomate','Panceta con huevo y tomate','desayuno',1,15,12,[I('panceta',55),I('huevo',2,'ud'),I('tomate_fresco',125)],['Dorar la panceta sin aceite.','Cocinar el huevo en la misma sartén y servir con tomate.'],{tags:['ocasional']}),
R('D07','jamon_queso_tomate','Jamón, queso y tomate','desayuno',1,5,5,[I('jamon',50),I('queso',40),I('tomate_fresco',150),I('aceite_oliva',5,'ml')],['Cortar y servir aliñado.'],{equipment:['cuchillo'],tags:['sin-cocción','bajo-hidrato']}),
R('D08','yogur_platano_nueces','Yogur, plátano y nueces','desayuno',1,2,2,[I('yogur',200),I('platano',110),I('nueces',15)],['Mezclar y servir.'],{equipment:['bol'],tags:['sin-cocción'],notes:'Perfil gimnasio: 250 g de yogur y avena si entrena.'}),
R('D09','yogur_fruta_nueces','Yogur, manzana o pera y nueces','desayuno',1,3,3,[I('yogur',200),I('manzana',150),I('nueces',15)],['Trocear la fruta y mezclar.'],{equipment:['bol'],tags:['sin-cocción'],possible_substitutions:['recipe_yogur_platano_nueces']}),
R('D10','tostada_tomate_huevo','Tostada de tomate y huevo','desayuno',1,8,8,[I('pan_integral',50),I('tomate_fresco',100),I('huevo',1,'ud'),I('aceite_oliva',5,'ml')],['Tostar el pan y preparar el huevo.','Montar con tomate.'],{equipment:['tostador','sartén'],notes:'Perfil gimnasio: dos tostadas y dos huevos.'}),
R('D11','avena_nocturna','Avena nocturna','desayuno',1,5,5,[I('avena',50),I('yogur',200),I('platano',100),I('nueces',10)],['Mezclar la noche anterior y refrigerar.'],{equipment:['tarro'],storage_days:2,tags:['preparación-previa']}),
R('D12','tosta_sobrasada_queso','Tosta de sobrasada y queso','desayuno',1,5,5,[I('pan_integral',50),I('sobrasada',20),I('queso',30)],['Montar y tostar brevemente.'],{equipment:['tostador'],tags:['ocasional']}),
R('C01','crema_calabacin','Crema de calabacín','crema',6,35,10,[I('calabacin',1200),I('puerro',300),I('cebolla',200),I('patata',175,'g',true),I('aceite_oliva',30,'ml'),I('agua',1000,'ml')],['Rehogar la verdura.','Cubrir de agua y cocer.','Triturar.'],{equipment:['olla','batidora'],freezable:true,storage_days:4,leftover_outputs:[{output_id:'prepared_crema_calabacin',name:'Crema de calabacín',servings:6}]}),
R('C02','crema_calabaza','Crema de calabaza','crema',6,40,12,[I('calabaza',1200),I('zanahoria',300),I('puerro',250),I('aceite_oliva',30,'ml'),I('agua',1000,'ml')],['Rehogar.','Cubrir de agua y cocer.','Triturar.'],{equipment:['olla','batidora'],freezable:true,storage_days:4,leftover_outputs:[{output_id:'prepared_crema_calabaza',name:'Crema de calabaza',servings:6}],time_confidence:'estimated'}),
R('C03','sopa_rapida','Sopa rápida','sopa',3,15,8,[I('caldo',1000,'ml'),I('verdura_variada',175),I('fideo',50,'g',true)],['Cocer la verdura en el caldo 10 minutos.','Añadir fideo solo a quien lo quiera.'],{equipment:['olla'],tags:['aprovechamiento']}),
R('C04','ensalada_tomate','Ensalada de tomate con atún o queso','ensalada',3,8,8,[I('tomate_fresco',650),I('cebolla',100),I('atun',160,'g',true),I('queso',165,'g',true),I('aceitunas',40),I('aceite_oliva',25,'ml')],['Cortar, elegir atún o queso y aliñar.'],{equipment:['cuchillo','bol'],tags:['sin-cocción','bajo-hidrato'],notes:'Atún y queso son alternativas, no ingredientes acumulativos.'}),
R('C05','judias_verdes_ajillo','Judías verdes al ajillo','guarnición',3,20,10,[I('judia_verde',600),I('ajo',3,'diente'),I('aceite_oliva',20,'ml')],['Cocer o cocinar al vapor.','Terminar al ajillo en sartén.'],{equipment:['olla','sartén'],possible_substitutions:['recipe_brocoli_sencillo']}),
R('C06','brocoli_sencillo','Brócoli sencillo','guarnición',3,15,6,[I('brocoli',600),I('aceite_oliva',15,'ml'),I('ajo',1,'diente',true)],['Cocer brevemente o hacer al vapor y aliñar.'],{equipment:['olla'],possible_substitutions:['recipe_judias_verdes_ajillo']}),
R('C07','champinones_ajillo','Champiñones al ajillo','guarnición',3,15,12,[I('champiñon',500),I('ajo',3,'diente'),I('aceite_oliva',20,'ml')],['Saltear a fuego fuerte 10–12 minutos.'],{tags:['rápida']}),
R('P01','jamoncitos_limon','Jamoncitos de pollo al limón','principal',4,60,10,[I('jamoncito_pollo',1200),I('cebolla',300),I('pimiento',300),I('limon',1,'ud'),I('ajo',4,'diente'),I('aceite_oliva',35,'ml')],['Colocar todo en una fuente.','Hornear a 190–200 °C.'],{equipment:['horno','fuente'],freezable:true,leftover_outputs:[{output_id:'leftover_p01_tupper',name:'Pollo y verduras para tupper',servings:1}],possible_substitutions:['recipe_contramuslos_hierbas']}),
R('P02','contramuslos_hierbas','Contramuslos con hierbas','principal',4,55,10,[I('contramuslo_pollo',1000),I('verdura_variada',600),I('aceite_oliva',30,'ml'),I('ajo',2,'diente'),I('mostaza',15,'g',true)],['Aliñar y hornear todo junto.'],{equipment:['horno','fuente'],freezable:true,leftover_outputs:[{output_id:'leftover_p02_tupper',name:'Contramuslo y verduras',servings:1}],possible_substitutions:['recipe_jamoncitos_limon'],time_confidence:'estimated'}),
R('P03','pollo_ajillo','Pollo al ajillo','principal',4,30,18,[I('pollo',800),I('ajo',6,'diente'),I('vino_blanco',100,'ml'),I('aceite_oliva',30,'ml')],['Dorar pollo y ajo.','Añadir vino y cocinar parcialmente tapado.'],{freezable:true,leftover_outputs:[{output_id:'leftover_p03_tupper',name:'Pollo al ajillo',servings:1}],possible_substitutions:['recipe_pollo_champinones'],time_confidence:'estimated'}),
R('P04','pollo_champinones','Pollo con champiñones','principal',4,35,20,[I('pollo',800),I('champiñon',500),I('cebolla',250),I('ajo',2,'diente'),I('aceite_oliva',30,'ml')],['Dorar y retirar el pollo.','Cocinar cebolla y champiñón.','Reincorporar el pollo.'],{freezable:true,possible_substitutions:['recipe_pollo_ajillo'],time_confidence:'estimated'}),
R('P05','lomo_encebollado','Lomo encebollado','principal',4,30,18,[I('lomo_cerdo',800),I('cebolla',500),I('vino_blanco',100,'ml'),I('aceite_oliva',30,'ml')],['Pochar cebolla.','Marcar el lomo y terminar conjuntamente.'],{leftover_outputs:[{output_id:'leftover_p05_tupper',name:'Lomo encebollado',servings:1}],possible_substitutions:['recipe_hamburguesa_plato','recipe_filetes_rusos'],time_confidence:'estimated'}),
R('P06','lomo_plancha','Lomo a la plancha','principal',3,15,12,[I('lomo_cerdo',600),I('ajo',2,'diente'),I('limon',1,'ud'),I('aceite_oliva',15,'ml')],['Marinar brevemente y cocinar a la plancha.'],{tags:['rápida','bajo-hidrato']}),
R('P07','filetes_rusos','Filetes rusos','principal',4,30,22,[I('carne_picada',700),I('huevo',1,'ud'),I('ajo',2,'diente'),I('harina_pan_rallado',25,'g',true)],['Mezclar y formar 6–8 filetes.','Cocinar a la sartén o al horno.'],{freezable:true,leftover_outputs:[{output_id:'leftover_p07_tupper',name:'Filetes rusos para tupper',servings:1},{output_id:'leftover_p07_freezer',name:'Filetes rusos congelados',servings:1,location:'congelador'}],time_confidence:'estimated'}),
R('P08','albondigas_tomate','Albóndigas con tomate','principal',6,50,30,[I('carne_picada',1000),I('huevo',1,'ud'),I('ajo',2,'diente'),I('harina_pan_rallado',40),I('tomate_triturado',750)],['Formar y dorar u hornear.','Terminar dentro de la salsa.'],{equipment:['sartén','cazuela'],freezable:true,time_confidence:'estimated'}),
R('P09','higaditos_encebollados','Higaditos encebollados','principal',4,25,18,[I('higaditos_pollo',600),I('cebolla',500),I('ajo',2,'diente'),I('vino_blanco',100,'ml'),I('aceite_oliva',25,'ml')],['Pochar cebolla.','Marcar hígado y terminar con vino.'],{leftover_outputs:[{output_id:'leftover_p09_tupper',name:'Higaditos encebollados',servings:1}],time_confidence:'estimated'}),
R('P10','merluza_tomate','Merluza con tomate','principal',3,25,15,[I('merluza',600),I('tomate_triturado',400),I('cebolla',200),I('pimiento',200),I('aceite_oliva',20,'ml')],['Preparar salsa rápida.','Cocinar la merluza dentro 7–10 minutos.'],{storage_days:1,freezable:false,tags:['pescado','bajo-hidrato']}),
R('P11','merluza_papillote','Merluza en papillote','principal',3,25,12,[I('merluza',600),I('calabacin',300),I('cebolla',200),I('limon',1,'ud'),I('aceite_oliva',20,'ml')],['Preparar tres paquetes.','Hornear hasta que el pescado esté hecho.'],{equipment:['horno'],storage_days:1,tags:['pescado','bajo-hidrato'],possible_substitutions:['recipe_merluza_tomate'],time_confidence:'estimated'}),
R('P12','ensalada_caballa_tupper','Ensalada de caballa para tupper','principal',1,8,8,[I('caballa',90),I('huevo',2,'ud'),I('tomate_fresco',200),I('pepino',100),I('aceitunas',30),I('aceite_oliva',10,'ml')],['Mezclar todo con los huevos ya cocidos.'],{equipment:['bol'],storage_days:1,tags:['tupper','sin-cocción','bajo-hidrato']}),
R('P13','berenjenas_rellenas','Berenjenas rellenas','principal',4,65,20,[I('berenjena',700),I('carne_picada',600),I('tomate_triturado',300),I('queso',90)],['Asar y vaciar berenjenas.','Mezclar pulpa, carne y sofrito.','Rellenar y gratinar.'],{equipment:['horno','sartén'],freezable:true,leftover_outputs:[{output_id:'leftover_p13_tupper',name:'Berenjena rellena',servings:1}]}),
R('P14','calabacines_atun','Calabacines rellenos de atún','principal',3,50,20,[I('calabacin',900),I('atun',240),I('tomate_triturado',250),I('queso',70)],['Vaciar y hornear parcialmente.','Rellenar y gratinar.'],{equipment:['horno'],freezable:true,time_confidence:'estimated'}),
R('P15','tortilla_calabacin','Tortilla de calabacín','principal',3,30,20,[I('huevo',6,'ud'),I('calabacin',600),I('cebolla',250),I('aceite_oliva',25,'ml')],['Pochar verdura y cuajar.'],{tags:['vegetariana'],time_confidence:'estimated'}),
R('P16','tortilla_jamon_queso','Tortilla de jamón y queso','principal',3,15,12,[I('huevo',6,'ud'),I('jamon',100),I('queso',90)],['Cuajar la tortilla con jamón y queso.'],{tags:['rápida','bajo-hidrato'],time_confidence:'estimated'}),
R('P17','huevos_pisto','Huevos con pisto','principal',3,12,8,[I('tomate_triturado',600),I('huevo',6,'ud')],['Calentar el pisto preparado y cuajar los huevos encima.'],{tags:['aprovechamiento','rápida'],notes:'El tomate triturado representa 600 g de pisto preparado en la fuente; la app lo enlaza como dependencia.'}),
R('P18','judias_huevos','Judías verdes con huevos','principal',3,20,14,[I('judia_verde',600),I('huevo',6,'ud'),I('ajo',2,'diente'),I('aceite_oliva',20,'ml')],['Preparar las judías.','Añadir huevo frito, cocido o pochado.'],{tags:['bajo-hidrato'],time_confidence:'estimated'}),
R('P19','hamburguesa_plato','Hamburguesa al plato','principal',4,25,18,[I('carne_picada',700),I('verdura_variada',700)],['Formar hamburguesas.','Cocinar y servir con pisto o verduras.'],{leftover_outputs:[{output_id:'leftover_p19_tupper',name:'Hamburguesa y pisto',servings:1}],possible_substitutions:['recipe_filetes_rusos'],time_confidence:'estimated'}),
R('P20','salchicha_pimientos','Salchicha fresca con pimientos','principal',3,30,20,[I('salchicha_fresca',600),I('pimiento',350),I('cebolla',200)],['Pochar verdura y cocinar la salchicha.'],{time_confidence:'estimated'}),
R('P21','champinones_huevos','Champiñones con huevos','principal',3,20,15,[I('champiñon',500),I('huevo',6,'ud'),I('ajo',3,'diente'),I('aceite_oliva',20,'ml')],['Saltear champiñones.','Añadir huevos revueltos o fritos.'],{tags:['bajo-hidrato'],time_confidence:'estimated'}),
R('E01','empanada_atun','Empanada de atún','empanada',5,45,15,[I('masa_hojaldre',2,'ud'),I('atun',240),I('tomate_triturado',400),I('huevo',2,'ud')],['Mezclar relleno y reservar la porción indicada.','Montar entre masas y hornear a 190–200 °C.'],{equipment:['horno'],storage_days:3,leftover_outputs:[{output_id:'leftover_e01_relleno',name:'Relleno de atún reservado',quantity:250,unit:'g',servings:1}]}),
R('E02','empanada_pollo_setas','Empanada de pollo y setas','empanada',5,50,22,[I('masa_hojaldre',2,'ud'),I('pollo',400),I('champiñon',350),I('cebolla',250),I('queso',70,'g',true)],['Cocinar champiñón y cebolla.','Mezclar con pollo reservando una ración de relleno.','Montar y hornear.'],{equipment:['horno','sartén'],leftover_outputs:[{output_id:'leftover_e02_relleno',name:'Pollo y setas reservado',servings:1}],time_confidence:'estimated'}),
R('E03','empanada_lomo_sofrito','Empanada de lomo y sofrito','empanada',5,45,18,[I('masa_hojaldre',2,'ud'),I('lomo_cerdo',450),I('tomate_triturado',450)],['Marcar el lomo.','Mezclar con sofrito reservando una ración.','Montar y hornear.'],{equipment:['horno','sartén'],leftover_outputs:[{output_id:'leftover_e03_relleno',name:'Lomo y sofrito reservado',servings:1}],time_confidence:'estimated'}),
R('E04','empanada_jamon_queso','Empanada de jamón y queso','empanada',5,35,12,[I('masa_hojaldre',2,'ud'),I('jamon',200),I('queso',250)],['Montar y hornear.'],{equipment:['horno'],time_confidence:'estimated'}),
R('E05','empanada_sobrasada_tetilla','Empanada de sobrasada y tetilla','empanada',5,40,12,[I('masa_hojaldre',2,'ud'),I('sobrasada',150),I('queso_tetilla',250),I('cebolla',125,'g',true)],['Distribuir el relleno en pequeñas cantidades.','Montar y hornear.'],{equipment:['horno'],tags:['ocasional'],time_confidence:'estimated'}),
R('G01','cocido','Cocido','guiso',6,85,25,[I('garbanzo_seco',350),I('carne_cocido',500),I('pollo',450),I('chorizo',125),I('tocino',100,'g',true),I('huesos_cocido',1,'ud'),I('zanahoria',300),I('puerro',300),I('agua',3000,'ml')],['Remojar garbanzos.','Cocer carnes, garbanzos y verduras en olla rápida.','Separar caldo y restos.'],{equipment:['olla rápida'],freezable:true,leftover_outputs:[{output_id:'leftover_caldo_cocido',name:'Caldo de cocido',quantity:1000,unit:'ml',servings:3},{output_id:'leftover_cocido_ropa_vieja',name:'Carne, garbanzos y verdura de cocido',quantity:550,unit:'g',servings:3}]}),
R('G02','ropa_vieja','Ropa vieja','guiso',3,20,15,[I('carne_cocido',550),I('cebolla',200),I('ajo',2,'diente'),I('tomate_triturado',200)],['Pochar cebolla y ajo.','Incorporar restos desmenuzados.'],{tags:['aprovechamiento'],time_confidence:'estimated'}),
R('G03','fabada','Fabada','guiso',6,65,20,[I('fabes',500),I('chorizo',150),I('morcilla',150),I('panceta',120),I('cebolla',150)],['Remojar las fabes.','Cocinar con el compango en olla rápida.'],{equipment:['olla rápida'],freezable:true,leftover_outputs:[{output_id:'leftover_g03_freezer',name:'Fabada congelada',servings:2,location:'congelador'}],time_confidence:'estimated'}),
R('G04','judias_blancas_verduras','Judías blancas con verduras','guiso',6,60,20,[I('alubia_seca',500),I('zanahoria',300),I('cebolla',250),I('pimiento',200),I('tomate_triturado',300),I('ajo',2,'diente'),I('aceite_oliva',25,'ml')],['Cocinar en olla rápida hasta que la legumbre esté tierna.'],{equipment:['olla rápida'],freezable:true,leftover_outputs:[{output_id:'leftover_g04_freezer',name:'Judías con verduras congeladas',servings:2,location:'congelador'}],time_confidence:'estimated'}),
R('G05','lentejas_verduras','Lentejas con verduras','guiso',6,50,18,[I('lenteja_pardina',450),I('cebolla',250),I('zanahoria',250),I('pimiento',200),I('tomate_triturado',300),I('espinaca',200)],['Cocer todo 35–40 minutos.'],{equipment:['olla'],freezable:true,time_confidence:'estimated'}),
R('G06','garbanzos_espinaca_huevo','Garbanzos con espinacas y huevo','guiso',4,30,15,[I('garbanzo_cocido',800),I('espinaca',300),I('tomate_triturado',250),I('huevo',4,'ud')],['Calentar garbanzos con sofrito y espinaca.','Terminar con huevo.'],{time_confidence:'estimated'}),
R('A01','arroz_pollo_verduras','Arroz de pollo y verduras','arroz',3,45,25,[I('arroz_redondo',320),I('pollo',700),I('judia_verde',300),I('pimiento',200),I('tomate_triturado',250),I('agua',900,'ml')],['Dorar pollo y añadir verdura y sofrito.','Reservar 200 g de pollo y 250 g de verduras antes del arroz.','Añadir agua y arroz.'],{equipment:['paellera'],leftover_outputs:[{output_id:'leftover_a01_tupper',name:'Pollo y verduras sin arroz',quantity:450,unit:'g',servings:1}],tags:['domingo']}),
R('A02','arroz_costilla','Arroz de costilla','arroz',3,50,28,[I('arroz_redondo',320),I('costilla_cerdo',800),I('verdura_variada',500),I('tomate_triturado',250),I('agua',950,'ml')],['Dorar la costilla y verdura.','Reservar carne y verduras antes del arroz.','Añadir agua y arroz.'],{equipment:['paellera'],leftover_outputs:[{output_id:'leftover_a02_tupper',name:'Costilla y verduras sin arroz',servings:1}],tags:['domingo'],time_confidence:'estimated'}),
R('A03','arroz_magro','Arroz de magro','arroz',3,50,28,[I('arroz_redondo',320),I('magro_cerdo',700),I('verdura_variada',500),I('tomate_triturado',250),I('agua',900,'ml')],['Dorar magro y verdura.','Añadir sofrito, agua y arroz.'],{equipment:['paellera'],tags:['domingo'],time_confidence:'estimated'})
];
const imageForCode=code=>{
  if(['D08','D09','D11'].includes(code))return 'yogur-fruta';
  if(code.startsWith('D')||['B04','P15','P16','P17','P18','P21'].includes(code))return 'huevos-tomate';
  if(code==='C01')return 'crema-calabacin'; if(code==='C02'||code==='C03')return 'crema-calabaza';
  if(['P01','P02','P03','P04'].includes(code))return 'pollo-horno';
  if(['P05','P06','P07','P08','P09','P13','P19','P20'].includes(code))return 'lomo-cebolla';
  if(['P10','P11'].includes(code))return 'merluza-tomate'; if(['P12','P14','C04'].includes(code))return 'ensalada-tomate';
  if(code.startsWith('E'))return 'empanada'; if(code==='G03')return 'fabada'; if(code.startsWith('G'))return 'cocido';
  if(code.startsWith('A'))return 'arroz'; return 'ensalada-tomate';
};
for(const r of recipes)r.image_path=`assets/images/recipes/${imageForCode(r.source_code)}.webp`;

const meal = (id, label, refs, servings, source='cook') => ({id,label,recipe_ids:refs,servings,source,status:'pending'});
const daysRaw = [
['w1_mon','Lunes','D01',['P12'],['C01','P01'],'Crema y pollo al horno; hornear B03 en paralelo.',20,60],
['w1_tue','Martes','D08',['P01','B03'],['P05','C05'],'Reservar una ración de lomo.',28,30],
['w1_wed','Miércoles','D03',['P05','C05'],['C01','P03'],'Usar crema sobrante y preparar 4 raciones de pollo.',26,30],
['w1_thu','Jueves','D07',['P03','B03'],['E01','C04'],'Separar 250 g de relleno antes de montar.',23,45],
['w1_fri','Viernes','D04',['E01'],['P10','C06'],'Comida con relleno reservado, 2 huevos y tomate.',23,25],
['w1_sat','Sábado','D06',['G01'],['C03','D07'],'Preparar B02 mientras trabaja la olla.',45,135],
['w1_sun','Domingo','D10',['A01'],['P17'],'Reservar pollo y verdura antes de añadir arroz.',33,45],
['w2_mon','Lunes','D02',['A01','B02'],['P02','B03'],'Usar reserva sin arroz; aprovechar el horno.',20,55],
['w2_tue','Martes','D09',['P02','B03'],['P09','C04'],'Preparar una ración adicional de higaditos.',26,25],
['w2_wed','Miércoles','D03',['P09','C04'],['C02','P19'],'Crema para dos cenas y una hamburguesa adicional.',30,40],
['w2_thu','Jueves','D07',['P19','B02'],['E02','C04'],'Reservar relleno sin masa para el viernes.',30,50],
['w2_fri','Viernes','D04',['E02','B03'],['P11','C05'],'Usar relleno reservado; cocina mínima.',22,25],
['w2_sat','Sábado','D05',['G03'],['P15','C04'],'Congelar 2 raciones de fabada si sobran.',40,65],
['w2_sun','Domingo','D08',['A02'],['C02','P16'],'Reservar costilla y verduras antes del arroz.',40,50],
['w3_mon','Lunes','D01',['A02'],['P03','C05'],'Usar la reserva sin arroz y hacer 4 raciones de pollo.',28,30],
['w3_tue','Martes','D09',['P03','C05'],['P13','C04'],'Una berenjena rellena será el tupper.',28,65],
['w3_wed','Miércoles','D02',['P13'],['C01','P07'],'Preparar 6–8 filetes: cena, tupper y congelador.',32,35],
['w3_thu','Jueves','D07',['P07','B02'],['E03','C04'],'Reservar relleno de lomo antes de montar.',26,45],
['w3_fri','Viernes','D04',['E03'],['P10','C06'],'Usar lomo y sofrito reservado con 2 huevos.',23,25],
['w3_sat','Sábado','D06',['G04'],['P21','C04'],'Congelar dos raciones de judías si quedan.',35,60],
['w3_sun','Domingo','D10',['A03'],['C04'],'Arroz final y vaciado de nevera.',36,50]
];
const leftoversByDay = {
 w1_mon:['leftover_p01_tupper','prepared_crema_calabacin','prepared_verduras_asadas'],w1_tue:['leftover_p05_tupper'],w1_thu:['leftover_e01_relleno'],w1_sat:['leftover_caldo_cocido','leftover_cocido_ropa_vieja','prepared_pisto'],w1_sun:['leftover_a01_tupper'],
 w2_mon:['leftover_p02_tupper','prepared_verduras_asadas'],w2_tue:['leftover_p09_tupper'],w2_wed:['prepared_crema_calabaza','leftover_p19_tupper'],w2_thu:['leftover_e02_relleno'],w2_sat:['leftover_g03_freezer'],w2_sun:['leftover_a02_tupper'],
 w3_mon:['leftover_p03_tupper'],w3_tue:['leftover_p13_tupper'],w3_wed:['leftover_p07_tupper','leftover_p07_freezer'],w3_thu:['leftover_e03_relleno'],w3_sat:['leftover_g04_freezer']
};
const consumeMap = {w1_tue:['leftover_p01_tupper'],w1_wed:['leftover_p05_tupper'],w1_fri:['leftover_e01_relleno'],w2_mon:['leftover_a01_tupper'],w2_tue:['leftover_p02_tupper'],w2_wed:['leftover_p09_tupper'],w2_thu:['leftover_p19_tupper'],w2_fri:['leftover_e02_relleno'],w2_sun:['prepared_crema_calabaza'],w3_mon:['leftover_a02_tupper'],w3_tue:['leftover_p03_tupper'],w3_wed:['leftover_p13_tupper'],w3_thu:['leftover_p07_tupper'],w3_fri:['leftover_e03_relleno']};
const menu = daysRaw.map((d,index)=>{const [slug,weekday,breakfast,lunch,dinner,prep,active,total]=d;const week=Math.floor(index/7)+1; const lunchSource=(consumeMap[slug]?.length?'leftover':'cook');return {
 id:`day_${slug}`,day_number:index+1,week,weekday,date_offset_days:index,
 meals:{breakfast:meal(`meal_${slug}_breakfast`,'Desayuno',[`recipe_${codeToSlug(breakfast)}`],3),lunch:meal(`meal_${slug}_lunch`,'Comida',lunch.map(x=>`recipe_${codeToSlug(x)}`),index%7<5?1:3,lunchSource),dinner:meal(`meal_${slug}_dinner`,'Cena',dinner.map(x=>`recipe_${codeToSlug(x)}`),3)},
 preparations:[prep],leftover_outputs:leftoversByDay[slug]||[],leftover_consumptions:consumeMap[slug]||[],tuppers_generated:(leftoversByDay[slug]||[]).filter(x=>x.includes('tupper')||x.includes('relleno')),
 thaw_items:(leftoversByDay[slug]||[]).filter(x=>x.includes('freezer')),active_time_minutes:active,total_time_minutes:total
};});
function codeToSlug(code){const found=recipes.find(r=>r.source_code===code);if(!found) throw new Error(`Unknown recipe code ${code}`);return found.id.replace('recipe_','');}

const profiles = [
 {id:'persona_mayor',name:'Persona mayor',portion_multiplier:0.78,protein_grams_range:[120,150],preferences:[]},
 {id:'joven_gimnasio',name:'Joven gimnasio',portion_multiplier:1.25,protein_grams_range:[200,250],preferences:['extra_protein'],add_ons:[{ingredient_id:'ingredient_avena',quantity:30,unit:'g'},{ingredient_id:'ingredient_arroz_redondo',quantity:30,unit:'g'},{ingredient_id:'ingredient_huevo',quantity:1,unit:'ud'}]},
 {id:'trabajador',name:'Trabajador',portion_multiplier:1,protein_grams_range:[180,220],preferences:['low_concentrated_carbs']}
];

const shoppingDefs = [
['w1_a',1,'Lunes · semana 1','Despensa de 21 días y frescos de semana 1', [['arroz_redondo',2000,'g'],['lenteja_pardina',1000,'g'],['garbanzo_seco',1000,'g'],['alubia_seca',1000,'g'],['garbanzo_cocido',800,'g'],['alubia_cocida',800,'g'],['tomate_triturado',4800,'g'],['atun',12,'lata'],['caballa',6,'lata'],['aceitunas',2,'frasco'],['caldo',2000,'ml'],['pan_integral',1,'paquete'],['nueces',500,'g'],['avena',500,'g'],['huevo',24,'ud'],['yogur',1500,'g'],['queso',300,'g'],['jamon',250,'g'],['sobrasada',150,'g'],['panceta',300,'g'],['jamoncito_pollo',1200,'g'],['lomo_cerdo',800,'g'],['pollo',1500,'g'],['merluza',600,'g'],['carne_cocido',1000,'g'],['masa_hojaldre',2,'ud'],['calabacin',2500,'g'],['berenjena',1000,'g'],['pimiento',1500,'g'],['cebolla',2000,'g'],['tomate_fresco',2500,'g'],['judia_verde',1200,'g'],['brocoli',600,'g'],['puerro',800,'g'],['zanahoria',1000,'g'],['patata',1000,'g'],['pepino',2,'ud'],['manzana',1500,'g'],['pera',1000,'g'],['platano',1200,'g'],['fruta_variada',1000,'g']]],
['w1_b',1,'Jueves/viernes · semana 1','Reposición corta', [['huevo',12,'ud'],['yogur',750,'g'],['tomate_fresco',1000,'g'],['pepino',1,'ud'],['fruta_variada',1000,'g'],['judia_verde',600,'g']]],
['w2_a',2,'Lunes · semana 2','Frescos y proteínas', [['huevo',24,'ud'],['yogur',1500,'g'],['contramuslo_pollo',1000,'g'],['higaditos_pollo',600,'g'],['carne_picada',700,'g'],['pollo',400,'g'],['merluza',600,'g'],['fabes',500,'g'],['chorizo',150,'g'],['morcilla',150,'g'],['panceta',120,'g'],['costilla_cerdo',800,'g'],['masa_hojaldre',2,'ud'],['champiñon',600,'g'],['calabacin',2000,'g'],['calabaza',1000,'g'],['pimiento',1000,'g'],['cebolla',1500,'g'],['tomate_fresco',2000,'g'],['judia_verde',1000,'g'],['zanahoria',1000,'g'],['fruta_variada',3000,'g']]],
['w2_b',2,'Jueves/viernes · semana 2','Reposición condicional', [['huevo',12,'ud'],['yogur',750,'g'],['fruta_variada',1750,'g'],['tomate_fresco',1000,'g'],['pepino',1,'ud']]],
['w3_a',3,'Lunes · semana 3','Frescos y proteínas', [['huevo',24,'ud'],['yogur',1500,'g'],['pollo',800,'g'],['carne_picada',1400,'g'],['lomo_cerdo',450,'g'],['merluza',600,'g'],['magro_cerdo',700,'g'],['masa_hojaldre',2,'ud'],['berenjena',700,'g'],['calabacin',1750,'g'],['champiñon',1000,'g'],['judia_verde',1000,'g'],['brocoli',600,'g'],['pimiento',1000,'g'],['cebolla',1500,'g'],['tomate_fresco',2000,'g'],['zanahoria',1000,'g'],['fruta_variada',3000,'g']]],
['w3_b',3,'Jueves/viernes · semana 3','Compra de cierre; no reponer despensa', [['huevo',12,'ud'],['yogur',750,'g'],['fruta_variada',1500,'g'],['tomate_fresco',1000,'g'],['judia_verde',600,'g']]]
];
const shoppingPlans=shoppingDefs.map(([slug,week,label,notes,items],i)=>({id:`shopping_${slug}`,sequence:i+1,week,label,notes,status:'planned',items:items.map(([s,quantity,unit],j)=>({id:`shopping_${slug}_item_${j+1}`,ingredient_id:`ingredient_${s}`,quantity,unit,conditional:slug.endsWith('_b')&&['huevo','yogur','judia_verde'].includes(s),checked:false,ordered:false}))}));

const products = [
['huevos_alipende_24','huevo','Alipende','Huevos M de gallinas sueltas',24,'ud',5.25,2.63,'docena','https://www.ahorramas.com/huevos-de-gallinas-sueltas-en-el-gallinero-alipende-24u-clase-m-31201.html'],
['arroz_alipende_1kg','arroz_redondo','Alipende','Arroz redondo',1,'kg',1.15,1.15,'kg','https://www.ahorramas.com/alimentacion/arroces-pastas-y-legumbres/arroz/grano-redondo/'],
['tomate_triturado_alipende_800','tomate_triturado','Alipende','Tomate natural triturado',800,'g',1,1.25,'kg','https://www.ahorramas.com/alimentacion/conservas-vegetales/tomate/tomate-natural-triturado/'],
['lenteja_alipende_1kg','lenteja_pardina','Alipende','Lenteja pardina',1,'kg',1.85,1.85,'kg','https://www.ahorramas.com/lenteja-alipende-1kg-pardina-77272.html'],
['garbanzo_cocido_alipende_400','garbanzo_cocido','Alipende','Garbanzo cocido',400,'g',0.8,2,'kg','https://www.ahorramas.com/alimentacion/platos-preparados/legumbres/garbanzos-cocidos/'],
['alubia_cocida_alipende_400','alubia_cocida','Alipende','Alubia blanca cocida',400,'g',0.75,1.88,'kg','https://www.ahorramas.com/alubia-blanca-cocida-alipende-400g-60127.html'],
['atun_alipende_pack6','atun','Alipende','Atún al natural pack 6',6,'lata',4.2,0.7,'lata','https://www.ahorramas.com/alimentacion/conservas-de-pescado/atun/atun-natural/'],
['yogur_griego_alipende_750','yogur','Alipende','Yogur griego natural',750,'g',1.45,1.93,'kg','https://www.ahorramas.com/marcas/alipende/'],
['queso_semicurado_alipende_300','queso','Alipende','Queso semicurado cuña',300,'g',2.91,9.7,'kg','https://www.ahorramas.com/queso-semicurado-cuna-alipende-300g-52952.html'],
['masa_hojaldre_alipende_pack2','masa_hojaldre','Alipende','Masa de hojaldre rectangular pack 2',2,'ud',2.12,1.06,'ud','https://www.ahorramas.com/alimentacion/platos-preparados/pizzas-y-masas/'],
['merluza_congelada_600','merluza','Referencia Ahorramás','Merluza congelada sin piel',600,'g',5.5,9.17,'kg','https://www.ahorramas.com/congelados/pescado-y-marisco-congelado/merluza/'],
['jamoncitos_pollo','jamoncito_pollo','Referencia Ahorramás','Jamoncitos de pollo',1,'kg',5.14,5.14,'kg','https://www.ahorramas.com/ofertas-destacadas/aves-de-espana/'],
['contramuslo_alipende','contramuslo_pollo','Alipende','Contramuslo de pollo',1,'kg',4.21,4.21,'kg','https://www.ahorramas.com/ofertas-destacadas/aves-de-espana/'],
['higaditos_pollo','higaditos_pollo','Referencia Ahorramás','Higaditos de pollo',1,'kg',4,4,'kg','https://www.ahorramas.com/higaditos-de-pollo-470g-aproximadamente-60800.html']
].map(([slug,ing,brand,name,package_size,package_unit,current_price,unit_price,unit_price_unit,catalog_url])=>({product_id:`product_${slug}`,ingredient_id:`ingredient_${ing}`,brand,name,package_size,package_unit,current_price,unit_price,unit_price_unit,catalog_url,price_date:'2026-09-15',price_status:'last_known',target_price:unit_price,promotion:null,promotion_end_date:null,source:'document_snapshot'}));

const inventory = [
['huevo',24,'ud','nevera',8],['tomate_triturado',3,'ud','despensa',1],['arroz_redondo',1500,'g','despensa',500],['lenteja_pardina',1000,'g','despensa',300],['garbanzo_seco',1000,'g','despensa',300],['atun',8,'lata','despensa',4],['caballa',4,'lata','despensa',4],['yogur',1500,'g','nevera',500],['queso',300,'g','nevera',100],['cebolla',1500,'g','despensa',500],['tomate_fresco',1500,'g','nevera',500],['calabacin',1500,'g','nevera',500],['fruta_variada',3000,'g','frutas',1500],['merluza',600,'g','congelador',600]
].map(([s,quantity,unit,location,minimum],i)=>({id:`inventory_${i+1}`,ingredient_id:`ingredient_${s}`,quantity,unit,purchase_date:null,opened_date:null,best_before_date:null,location,minimum_stock:minimum,cost:null,batch:null}));

const leftoverMealNames={w1_tue:'Jamoncitos y verduras reservados',w1_wed:'Lomo encebollado y judías',w1_fri:'Relleno de atún, huevos y tomate',w2_mon:'Pollo y verduras sin arroz con pisto',w2_tue:'Contramuslo y verduras reservados',w2_wed:'Higaditos y ensalada',w2_thu:'Hamburguesa y pisto reservados',w2_fri:'Pollo y setas reservados con verdura',w3_mon:'Costilla y verduras sin arroz',w3_tue:'Pollo al ajillo y judías',w3_wed:'Berenjena rellena reservada',w3_thu:'Filetes rusos y pisto',w3_fri:'Lomo y sofrito reservados con huevos'};
for(const d of menu){const slug=d.id.replace('day_','');if(leftoverMealNames[slug])d.meals.lunch.display_name=leftoverMealNames[slug];}

const settings={schema_version:1,plan_start_date:'2026-09-14',postal_code:'45122',currency:'EUR',locale:'es-ES',auto_price_refresh:true,price_refresh_hours:12,remote_price_feed_url:'',profiles,serving_rules:{weekday_lunch_profiles:['trabajador'],dinner_profiles:['persona_mayor','joven_gimnasio','trabajador'],weekend_lunch_profiles:['persona_mayor','joven_gimnasio','trabajador']},storage:{fridge_max_unassigned_days:3,prioritize_expiring:true},price_provider:{mode:'static_fallback',supports:['local_catalog','remote_json_feed'],note:'GitHub Pages no puede depender de endpoints privados o sin CORS. Configure remote_price_feed_url para un feed actualizado por GitHub Actions o proxy propio.'}};

const utilization = [
{id:'flow_cocido_sopa',from_recipe_id:'recipe_cocido',output_id:'leftover_caldo_cocido',to_recipe_id:'recipe_sopa_rapida',reason:'El caldo del cocido sustituye caldo comprado.'},
{id:'flow_cocido_ropa_vieja',from_recipe_id:'recipe_cocido',output_id:'leftover_cocido_ropa_vieja',to_recipe_id:'recipe_ropa_vieja',reason:'Carne, garbanzos y verdura se transforman.'},
{id:'flow_sofrito_empanada',from_recipe_id:'recipe_sofrito_mediterraneo',output_id:'prepared_sofrito',to_recipe_id:'recipe_empanada_atun',reason:'Base común que ahorra trabajo activo.'},
{id:'flow_sofrito_arroz',from_recipe_id:'recipe_sofrito_mediterraneo',output_id:'prepared_sofrito',to_recipe_id:'recipe_arroz_pollo_verduras',reason:'Base común para el arroz.'},
{id:'flow_sofrito_merluza',from_recipe_id:'recipe_sofrito_mediterraneo',output_id:'prepared_sofrito',to_recipe_id:'recipe_merluza_tomate',reason:'Base de la salsa de pescado.'},
{id:'flow_pisto_huevos',from_recipe_id:'recipe_pisto_grande',output_id:'prepared_pisto',to_recipe_id:'recipe_huevos_pisto',reason:'Guarnición transformada en cena.'},
{id:'flow_arroz_pollo_tupper',from_recipe_id:'recipe_arroz_pollo_verduras',output_id:'leftover_a01_tupper',to_day_id:'day_w2_mon',reason:'Se reserva antes de añadir arroz para mantener bajo el hidrato del tupper.'},
{id:'flow_arroz_costilla_tupper',from_recipe_id:'recipe_arroz_costilla',output_id:'leftover_a02_tupper',to_day_id:'day_w3_mon',reason:'Carne y verduras se reservan antes del arroz.'},
{id:'flow_empanada_atun_relleno',from_recipe_id:'recipe_empanada_atun',output_id:'leftover_e01_relleno',to_day_id:'day_w1_fri',reason:'Relleno reservado antes de añadir la masa.'},
{id:'flow_empanada_pollo_relleno',from_recipe_id:'recipe_empanada_pollo_setas',output_id:'leftover_e02_relleno',to_day_id:'day_w2_fri',reason:'Relleno sin masa reutilizado como tupper.'},
{id:'flow_empanada_lomo_relleno',from_recipe_id:'recipe_empanada_lomo_sofrito',output_id:'leftover_e03_relleno',to_day_id:'day_w3_fri',reason:'Lomo y sofrito reservados antes de montar.'}
];

const files={
 'ingredients.json':{schema_version:1,ingredients},'recipes.json':{schema_version:1,recipes},'menu.json':{schema_version:1,days:menu},
 'inventory.json':{schema_version:1,items:inventory},'shopping-plans.json':{schema_version:1,plans:shoppingPlans},
 'products.json':{schema_version:1,last_updated:'2026-09-15T00:00:00+02:00',products},'settings.json':settings,
 'utilization.json':{schema_version:1,flows:utilization}
};
for(const [name,data] of Object.entries(files)) await writeFile(new URL(name,out),JSON.stringify(data,null,2)+'\n','utf8');
console.log(`Generated ${Object.keys(files).length} data files, ${recipes.length} recipes, ${ingredients.length} ingredients, ${menu.length} days.`);
