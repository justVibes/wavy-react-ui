#!/usr/bin/env node
import $ from'fs/promises';import b from'path';import {fileURLToPath}from'url';import {upperFirst}from'@wavy/fn';var O=fileURLToPath(import.meta.url),D=b.dirname(O),l=D.split(b.sep).filter((t,r,e)=>r<e.length-2).join(b.sep);var S="__",F=1e3;function j(t,r=1){let e=t.startsWith("#")?t.slice(1):t;e.length===3&&(e=e.split("").map(i=>i+i).join(""));let s=parseInt(e.substring(0,2),16),n=parseInt(e.substring(2,4),16),o=parseInt(e.substring(4,6),16);return `rgba(${s}, ${n}, ${o}, ${r})`}function k(t){return [...Array.from(Array(9)).flatMap((r,e)=>{let s=e+1;return [`${s}00`,`${s}50`].map(n=>`${t}${S}${n}`)}),t]}function _(t,r){let s=`--${(n=>n.split("").map(o=>o===o.toUpperCase()&&o!==o.toLowerCase()?`-${o.toLowerCase()}`:o).join(""))(t)}`;return r?.wrap?`var(${s})`:s}function C(t,r,e){let s=Object.entries(r);return e?.excludeSeed||s.push(["seed",t]),s}function W(...t){let r=C(...t).map(([s])=>k(s).map(n=>{let{1:o}=n.split(S),i="";return o&&(i=`[${parseInt(o)/F}]`),`"${s}${i}": "${_(n,{wrap:true})}"`})).flat(),e="CssColors";return {filename:e+".ts",content:`
    const ${e} = Object.freeze({
      ${r.join(`,
`)}  
    })

    export default ${e}
  `}}function H(t,r,e){let s=(o,i)=>{let f=r.light[o]||i,v=r.dark[o]||i;return k(o).map(a=>{let p=_(a),d=parseFloat(a.replace(/[^0\.0-9]/g,"")),m=d?d/F:1,u=j(f,m),c=j(v,m);return `${p}: light-dark(${u}, ${c})`})};return `
    @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

    :root {
      color-scheme: light dark;

      ${C(t,r.light).map(([o,i])=>s(o,i)).flat().join(";")}
    }

    *,
    *::before,
    *::after {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: inherit;
    }

    body {
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--surface);
      color: var(--on-surface);
      scrollbar-color: var(--on-surface__750) transparent;
    }

    #root {
      --size: 100%;
      height: var(--size);
      width: var(--size);
      overflow: hidden;
    }

    ${e?.()||""}
`.replace(/\s+/g," ").trim()}async function x(t){let r=await import('fs/promises'),e=await import('path'),{styles:s}=JSON.parse((await r.readFile(e.join(l,"package.json"))).toString("utf-8"));try{let n=e.join(l,"./external/themes"),o=e.join(l,"./src/css"),i=await r.readdir(n),f=i.map(g=>"--"+g.match(/.*?(?=\.)/)?.[0]),v=process.argv.splice(2),a=t?.flag||v.find(g=>f.includes(g));if(!a)return console.log(`Please select a theme using one of these flags: [${f.join(", ")}]`);let p=i.find(g=>g.includes(a.replace(/[^a-zA-Z]/g,"")));if(!p)return console.log(`Failed to map ${a} to a filename in [${i.join(", ")}].`);let d=await r.readFile(e.join(n,p)),{schemes:m,seed:u}=JSON.parse(d.toString("utf-8")),{dark:c,light:h}=m;h.themelessSurface="#FFF",h.themelessOnSurface="#000",c.themelessSurface="#000",c.themelessOnSurface="#FFF";let{filename:I,content:R}=W(u,h);t?.loadCssRefInLocalPackage&&await r.writeFile(e.join(o,"resources",I),R),await r.writeFile(e.join(l,s),H(u,{light:h,dark:c},t?.injectStyles));let T={green:"\u{1F7E9}",purple:"\u{1F7EA}"},y=a.toLowerCase().replace(/[^a-z]/g,"");console.log(`${T[y]||""} ${upperFirst(y)} theme loaded! \u2728`.trim());}catch(n){console.error(n);}}var A=(t,r)=>t.map(e=>b.join(r,e)),z=(t,r)=>{let e=t.filter(s=>!b.extname(s));return r?A(e,r):e},P=(t,r)=>{let e=t.filter(s=>s.includes(".css"));return r?A(e,r):e};async function J(t){console.log("\u{1F916} Preparing CSS file scan...");let e=await $.readdir(t),s=z(e,t),n=P(e,t);try{for(let o of s)e=await $.readdir(o),s.push(...z(e,o)),n.push(...P(e,o));}catch(o){throw console.log("Failed to resolve the items found: ",{folders:s,cssFiles:n,items:e}),o}console.log("\u26A1 CSS file scan complete!"),n.length===0?console.log("0 CSS files found...",`
Aborting bundler...`):(console.log("\u{1F916} Resolving file contents..."),n=await Promise.all(n.map(async o=>(await $.readFile(o)).toString("utf-8").trim())),console.log("\u26A1 File contents resolved!",`
\u{1F916} Preparing bundler...`),await x({injectStyles:()=>n.join(" ")}),console.log("\u2728 Successfully bundled css files! \u2728"));}J(b.join(l,"src"));