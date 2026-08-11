import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';
const m = JSON.parse(readFileSync('mark.json','utf8'));
const { w:W, h:H, transform:TR, white:DW, blue:DB } = m;
const BLUE = '#0163FA';
const MOBILE='/home/user/new-manager-success/apps/mobile/assets';
const WEB='/home/user/new-manager-success/apps/web/public';
const BRAND='/home/user/new-manager-success/packages/brand/assets';
const mark = (n='#FFFFFF', b=BLUE) =>
  `<g transform="${TR}"><path d="${DW}" fill="${n}"/><path d="${DB}" fill="${b}"/></g>`;
// Fit the traced artwork (W x H) into `canvas`, occupying `frac` of it, centred.
const fit = (canvas, frac) => {
  const s = (canvas * frac) / Math.max(W, H);
  return `translate(${(canvas - W*s)/2} ${(canvas - H*s)/2}) scale(${s.toFixed(5)})`;
};
const icon     = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><rect width="1024" height="1024" fill="#000"/><g transform="${fit(1024,0.70)}">${mark()}</g></svg>`;
const adaptive = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><g transform="${fit(1024,0.50)}">${mark()}</g></svg>`;
const splash   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><g transform="${fit(1024,0.56)}">${mark()}</g></svg>`;
const favicon  = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="#000"/><g transform="${fit(64,0.80)}">${mark()}</g></svg>`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs><radialGradient id="g" cx="0.84" cy="0.1" r="0.7"><stop offset="0%" stop-color="${BLUE}" stop-opacity="0.30"/><stop offset="100%" stop-color="${BLUE}" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="#000"/><rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(64 30) scale(${(96/H).toFixed(4)})">${mark()}</g>
  <g font-family="'Archivo','Helvetica Neue',Impact,system-ui,sans-serif" font-weight="800">
    <text x="196" y="82" font-size="34" letter-spacing="-0.6" fill="#FFF">NEW MANAGER</text>
    <text x="197" y="118" font-size="27" letter-spacing="9.2" fill="${BLUE}">SUCCESS</text></g>
  <g font-family="system-ui,sans-serif" font-size="56" font-weight="800" letter-spacing="-2.2">
    <text x="72" y="300" fill="#FFF">You got promoted because</text>
    <text x="72" y="364" fill="#FFF">you were great at your job.</text>
    <text x="72" y="428" fill="${BLUE}">Nobody trained you</text>
    <text x="72" y="492" fill="${BLUE}">for the new one.</text></g>
  <text x="72" y="565" font-family="system-ui,sans-serif" font-size="24" font-weight="500" fill="rgba(255,255,255,0.55)">Social-style management training · 7-minute lessons · Any profession</text>
</svg>`;
const NOTE = `<!--\n  AUTO-GENERATED from the traced artwork by packages/brand/scripts/gen-icons.mjs.\n  Do not hand-edit — regenerate instead.\n-->\n`;
writeFileSync(`${BRAND}/app-icon.svg`, NOTE+icon+'\n');
writeFileSync(`${BRAND}/favicon.svg`, NOTE+favicon+'\n');
writeFileSync(`${WEB}/favicon.svg`, favicon+'\n');
writeFileSync(`${WEB}/app-icon.svg`, icon+'\n');
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
for (const [svg,w,h,out,omit] of [
  [icon,1024,1024,`${MOBILE}/icon.png`,false],[adaptive,1024,1024,`${MOBILE}/adaptive-icon.png`,true],
  [splash,1024,1024,`${MOBILE}/splash.png`,true],[icon,1024,1024,`${MOBILE}/favicon.png`,false],
  [og,1200,630,`${WEB}/og-image.png`,false]]) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  await p.setContent(`<body style="margin:0;${omit?'':'background:#000;'}">${svg}</body>`,{waitUntil:'load'});
  writeFileSync(out, await p.screenshot({ omitBackground:omit, type:'png' }));
  await p.close(); console.log('wrote', out.split('/').pop());
}
await b.close();
