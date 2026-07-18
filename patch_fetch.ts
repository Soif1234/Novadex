import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');
const script = `<script>
  try {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      get: () => originalFetch,
      set: () => { console.warn('Ignored fetch override'); }
    });
  } catch (e) {
    console.warn('Could not patch fetch:', e);
  }
</script>`;
content = content.replace('<head>', '<head>\n    ' + script);
fs.writeFileSync('index.html', content);
