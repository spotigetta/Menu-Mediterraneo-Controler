import { readFile, writeFile } from 'node:fs/promises';
const path=new URL('../data/products.json',import.meta.url);
const data=JSON.parse(await readFile(path,'utf8'));
const decode=s=>s.replaceAll('&quot;','"').replaceAll('&#34;','"').replaceAll('&amp;','&');
function productNodes(value,out=[]){if(!value)return out;if(Array.isArray(value))for(const x of value)productNodes(x,out);else if(typeof value==='object'){const type=value['@type'];if(type==='Product'||(Array.isArray(type)&&type.includes('Product')))out.push(value);for(const v of Object.values(value))productNodes(v,out)}return out}
function readOffer(node){const offer=Array.isArray(node.offers)?node.offers[0]:node.offers;if(!offer)return null;const raw=offer.price??offer.lowPrice??offer.highPrice;const price=Number(String(raw).replace(',','.'));return Number.isFinite(price)&&price>0?price:null}
async function inspect(product){
  const response=await fetch(product.catalog_url,{headers:{'user-agent':'Mesa21 catalog updater (+GitHub Actions)','accept-language':'es-ES,es;q=0.9'}});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);const html=await response.text(),scripts=[...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes=[];for(const m of scripts){try{productNodes(JSON.parse(decode(m[1].trim())),nodes)}catch{}}
  const expected=product.name.toLowerCase().split(/\s+/).filter(x=>x.length>3);const node=nodes.find(n=>{const name=String(n.name||'').toLowerCase();return expected.filter(x=>name.includes(x)).length>=Math.min(2,expected.length)})||((nodes.length===1)?nodes[0]:null);
  const price=node&&readOffer(node);if(!price)throw new Error('sin oferta inequívoca en JSON-LD');return price;
}
let updated=0;const failures=[];
for(const product of data.products){try{const price=await inspect(product);product.current_price=price;product.price_date=new Date().toISOString().slice(0,10);product.price_status='current';product.source='ahorramas_catalog_page';updated++}catch(error){failures.push(`${product.product_id}: ${error.message}`)}}
if(updated){data.last_updated=new Date().toISOString();await writeFile(path,JSON.stringify(data,null,2)+'\n','utf8')}
console.log(JSON.stringify({updated,skipped:failures.length,failures},null,2));
if(!updated)process.exitCode=2;
