const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconDir)) fs.mkdirSync(iconDir, { recursive: true });

// 正式アイコン：サーフベース姉妹デザイン「白単色P（3-B3 Slim）＋ 右下JPゴールドメダル」
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="shadowFlat1" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="2" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- 背景（サーフベース完全同色 #0284c7） -->
  <rect width="512" height="512" rx="108" fill="#0284c7"/>

  <!-- Pマーク（白単色・3-B3 Slim） -->
  <g transform="translate(-8, -8)">
    <!-- 前傾スウォッシュ軸（細身＆シャープ） -->
    <path d="M 64 436
             C 122 382, 166 232, 206 110
             C 222 86, 274 80, 348 86
             C 418 92, 456 124, 462 164
             C 432 134, 390 116, 336 116
             C 278 116, 244 136, 232 178
             C 214 242, 194 316, 166 372
             C 140 404, 102 426, 64 436 Z" fill="#ffffff" />
    <!-- ループ後半 -->
    <path d="M 398 116
             C 444 136, 456 184, 436 236
             C 412 292, 344 318, 256 306
             C 224 302, 198 292, 180 278
             C 214 278, 250 274, 286 266
             C 348 252, 386 226, 396 188
             C 404 156, 390 132, 360 118 Z" fill="#ffffff" />
  </g>

  <!-- 右下：ゴールド単色ラウンドバッジ × 黒文字JP（サーフベース完全同一仕様） -->
  <g transform="translate(390, 390)" filter="url(#shadowFlat1)">
    <circle cx="0" cy="0" r="70" fill="#d4af37"/>
    <circle cx="0" cy="0" r="62" fill="none" stroke="#0f172a" stroke-width="2" stroke-opacity="0.25" stroke-dasharray="5 3"/>
    <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Arial Black', sans-serif" font-size="46" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="2">JP</text>
    <polygon points="0,-36 3,-28 11,-28 5,-23 7,-15 0,-19 -7,-15 -5,-23 -11,-28 -3,-28" fill="#0f172a"/>
  </g>
</svg>`;

const svgPath = path.join(iconDir, 'icon.svg');
fs.writeFileSync(svgPath, svgContent, 'utf8');
fs.writeFileSync(path.join(iconDir, 'icon-192.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(iconDir, 'icon-512.svg'), svgContent, 'utf8');

// sharp で各サイズの PNG を自動生成
const sharp = require('sharp');
const svgBuffer = Buffer.from(svgContent);

Promise.all([
  sharp(svgBuffer).resize(180, 180).png().toFile(path.join(iconDir, 'apple-touch-icon-180.png')),
  sharp(svgBuffer).resize(192, 192).png().toFile(path.join(iconDir, 'icon-192.png')),
  sharp(svgBuffer).resize(512, 512).png().toFile(path.join(iconDir, 'icon-512.png'))
]).then(() => {
  console.log('✅ Official SVG and PNG icons (180, 192, 512) generated successfully!');
}).catch(err => {
  console.error('❌ Error generating PNGs with sharp:', err);
  process.exit(1);
});
