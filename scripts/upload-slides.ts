/**
 * Upload slide images to Supabase slides table.
 * Run: cd /home/z/my-project/C.P.C.M.T.Q.L.S--LABOCHECK && npx tsx scripts/upload-slides.ts
 *
 * Prerequisites:
 * 1. Run scripts/slides-setup.sql in Supabase Dashboard > SQL Editor
 * 2. slides table must exist with data
 */

const SUPABASE_URL = 'https://bxfblegcbvdpshwhdxlt.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZmJsZWdjYnZkcHNod2hkeGx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA3NDQxMiwiZXhwIjoyMDkwNjUwNDEyfQ.bkJsEX-Z27UT-2b6HllunV_v_uc-usk8XVnM64uKR7w';

import { readFileSync } from 'fs';
import { join } from 'path';

const slideFiles = [
  { file: 'slide1.png', tipo: 'image/png', ordem: 1 },
  { file: 'slide2.png', tipo: 'image/png', ordem: 2 },
  { file: 'slide3.png', tipo: 'image/png', ordem: 3 },
  { file: 'slide4.png', tipo: 'image/png', ordem: 4 },
  { file: 'slide5.png', tipo: 'image/png', ordem: 5 },
  { file: 'slide6.png', tipo: 'image/png', ordem: 6 },
];

async function uploadSlides() {
  console.log('Uploading slide images to Supabase...');

  for (const slide of slideFiles) {
    const filePath = join(process.cwd(), 'public', slide.file);
    try {
      const fileBuffer = readFileSync(filePath);
      const base64 = fileBuffer.toString('base64');
      console.log(`  ${slide.file}: ${base64.length} chars (base64)`);

      // Find the slide with matching ordem
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/slides?ordem=eq.${slide.ordem}&select=id`,
        {
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
        }
      );

      if (!res.ok) {
        console.error(`  ERRO finding slide ${slide.ordem}: ${await res.text()}`);
        continue;
      }

      const slides = await res.json();
      if (slides.length === 0) {
        console.error(`  ERRO: No slide found with ordem=${slide.ordem}`);
        continue;
      }

      const slideId = slides[0].id;

      // Update the slide with the image
      const updateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/slides?id=eq.${slideId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            imagem_base64: base64,
            imagem_tipo: slide.tipo,
          }),
        }
      );

      if (updateRes.ok) {
        console.log(`  OK: ${slide.file} -> slide ordem=${slide.ordem}`);
      } else {
        console.error(`  ERRO updating slide ${slide.ordem}: ${await updateRes.text()}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ERRO reading ${slide.file}: ${msg}`);
    }
  }

  console.log('\nUpload complete!');
}

uploadSlides().catch(console.error);
