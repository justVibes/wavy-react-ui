#!/usr/bin/env node
import {upperFirst}from'@wavy/fn';import $ from'path';import {fileURLToPath}from'url';var I=fileURLToPath(import.meta.url),A=$.dirname(I),p=A.split($.sep).filter((r,t,e)=>t<e.length-2).join($.sep);var y="__",j=1e3;function w(r,t=1){let e=r.startsWith("#")?r.slice(1):r;e.length===3&&(e=e.split("").map(n=>n+n).join(""));let o=parseInt(e.substring(0,2),16),a=parseInt(e.substring(2,4),16),s=parseInt(e.substring(4,6),16);return `rgba(${o}, ${a}, ${s}, ${t})`}function k(r){return [...Array.from(Array(9)).flatMap((t,e)=>{let o=e+1;return [`${o}00`,`${o}50`].map(a=>`${r}${y}${a}`)}),r]}function _(r,t){let o=`--${(a=>a.split("").map(s=>s===s.toUpperCase()&&s!==s.toLowerCase()?`-${s.toLowerCase()}`:s).join(""))(r)}`;return t?.wrap?`var(${o})`:o}function F(r,t,e){let o=Object.entries(t);return e?.excludeSeed||o.push(["seed",r]),o}function L(...r){let t=F(...r).map(([o])=>k(o).map(a=>{let{1:s}=a.split(y),n="";return s&&(n=`[${parseInt(s)/j}]`),`"${o}${n}": "${_(a,{wrap:true})}"`})).flat(),e="CssColors";return {filename:e+".ts",content:`
    const ${e} = Object.freeze({
      ${t.join(`,
`)}  
    })

    export default ${e}
  `}}function R(r,t,e){let o=(s,n)=>{let g=t.light[s]||n,b=t.dark[s]||n;return k(s).map(i=>{let f=_(i),m=parseFloat(i.replace(/[^0\.0-9]/g,"")),d=m?m/j:1,h=w(g,d),l=w(b,d);return `${f}: light-dark(${h}, ${l})`})};return `
    @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

    :root {
      color-scheme: light dark;

      ${F(r,t.light).map(([s,n])=>o(s,n)).flat().join(";")}
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
`.replace(/\s+/g," ").trim()}async function N(r){let t=await import('fs/promises'),e=await import('path'),{styles:o}=JSON.parse((await t.readFile(e.join(p,"package.json"))).toString("utf-8"));try{let a=e.join(p,"./external/themes"),s=e.join(p,"./src/css"),n=await t.readdir(a),g=n.map(c=>"--"+c.match(/.*?(?=\.)/)?.[0]),b=process.argv.splice(2),i=r?.flag||b.find(c=>g.includes(c));if(!i)return console.log(`Please select a theme using one of these flags: [${g.join(", ")}]`);let f=n.find(c=>c.includes(i.replace(/[^a-zA-Z]/g,"")));if(!f)return console.log(`Failed to map ${i} to a filename in [${n.join(", ")}].`);let m=await t.readFile(e.join(a,f)),{schemes:d,seed:h}=JSON.parse(m.toString("utf-8")),{dark:l,light:u}=d;u.themelessSurface="#FFF",u.themelessOnSurface="#000",l.themelessSurface="#000",l.themelessOnSurface="#FFF";let{filename:x,content:z}=L(h,u);r?.loadCssRefInLocalPackage&&await t.writeFile(e.join(s,"resources",x),z),await t.writeFile(e.join(p,o),R(h,{light:u,dark:l},r?.injectStyles));let C={green:"\u{1F7E9}",purple:"\u{1F7EA}"},v=i.toLowerCase().replace(/[^a-z]/g,"");console.log(`${C[v]||""} ${upperFirst(v)} theme loaded! \u2728`.trim());}catch(a){console.error(a);}}export{N as buildWavyTheme};