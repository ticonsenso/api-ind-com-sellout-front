import fs from 'fs';
import path from 'path';

const svgPath = './src/assets/banner1.svg';
const outputPath = './src/assets/banner1_raw.png';

try {
  console.log('Reading SVG file...');
  const content = fs.readFileSync(svgPath, 'utf8');
  console.log('SVG read successfully. Size:', content.length, 'characters');

  const match = content.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
  if (!match) {
    console.error('Could not find base64 PNG data in the SVG file.');
    process.exit(1);
  }

  const base64Data = match[1];
  console.log('Base64 string found. Length:', base64Data.length);

  const buffer = Buffer.from(base64Data, 'base64');
  console.log('Buffer created. Decoded size:', buffer.length, 'bytes');

  fs.writeFileSync(outputPath, buffer);
  console.log('Saved raw PNG to:', outputPath);
} catch (err) {
  console.error('Error:', err);
}
