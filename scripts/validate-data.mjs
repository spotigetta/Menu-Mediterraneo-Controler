import { readFile } from 'node:fs/promises';
const base=new URL('../data/',import.meta.url);
const load=async n=>JSON.parse(await readFile(new URL(n,base),'utf8'));
const [ings,recs,menu,shopping,products,util]=await Promise.all(['ingredients.json','recipes.json','menu.json','shopping-plans.json','products.json','utilization.json'].map(load));
const errors=[],warnings=[];
const unique=(items,label)=>{const seen=new Set();for(const x of items){if(seen.has(x.id))errors.push(`ID duplicado en ${label}: ${x.id}`);seen.add(x.id)}return seen};
const ingIds=unique(ings.ingredients,'ingredientes'); const recipeIds=unique(recs.recipes,'recetas'); unique(menu.days,'menú');
for(const r of recs.recipes){for(const i of r.ingredients)if(!ingIds.has(i.ingredient_id))errors.push(`${r.id} refiere ingrediente inexistente ${i.ingredient_id}`);if(r.active_time_minutes>r.total_time_minutes)errors.push(`${r.id}: activo > total`);if(r.time_confidence==='estimated')warnings.push(`${r.id}: tiempo activo estimado`)}
for(const d of menu.days){for(const slot of Object.values(d.meals))for(const id of slot.recipe_ids)if(!recipeIds.has(id))errors.push(`${d.id}/${slot.id} refiere receta inexistente ${id}`)}
for(const p of shopping.plans)for(const i of p.items)if(!ingIds.has(i.ingredient_id))errors.push(`${p.id} refiere ingrediente inexistente ${i.ingredient_id}`);
for(const p of products.products)if(!ingIds.has(p.ingredient_id))errors.push(`${p.product_id} refiere ingrediente inexistente ${p.ingredient_id}`);
for(const f of util.flows){if(!recipeIds.has(f.from_recipe_id))errors.push(`${f.id}: origen inexistente`);if(f.to_recipe_id&&!recipeIds.has(f.to_recipe_id))errors.push(`${f.id}: destino inexistente`)}
const outputIds=new Set(recs.recipes.flatMap(r=>r.leftover_outputs.map(o=>o.output_id)));
for(const d of menu.days){for(const id of [...d.leftover_outputs,...d.leftover_consumptions])if(!outputIds.has(id))errors.push(`${d.id} refiere salida inexistente ${id}`)}
for(const f of util.flows)if(!outputIds.has(f.output_id))errors.push(`${f.id}: salida inexistente ${f.output_id}`);
if(menu.days.length!==21)errors.push(`El menú tiene ${menu.days.length} días, se esperaban 21`);
console.log(JSON.stringify({valid:errors.length===0,counts:{ingredients:ings.ingredients.length,recipes:recs.recipes.length,days:menu.days.length,shopping_plans:shopping.plans.length,products:products.products.length,flows:util.flows.length},errors,warnings_count:warnings.length,warnings},null,2));
if(errors.length)process.exitCode=1;
