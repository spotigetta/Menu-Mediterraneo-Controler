import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url),dist=new URL('../dist/',import.meta.url);
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const entry of ['index.html','favicon.svg','manifest.webmanifest','service-worker.js','README.md','assets','css','data','docs','js'])await cp(new URL(entry,root),new URL(entry,dist),{recursive:true});
await rm(new URL('assets/images/hero-kitchen.png',dist),{force:true});
await rm(new URL('assets/images/recipe-atlas-source.png',dist),{force:true});
await writeFile(new URL('.nojekyll',dist),'','utf8');
await writeFile(new URL('build-info.json',dist),JSON.stringify({built_at:new Date().toISOString(),commit:process.env.GITHUB_SHA||'local'},null,2)+'\n','utf8');
console.log('Mesa 21 compiled into dist/');
