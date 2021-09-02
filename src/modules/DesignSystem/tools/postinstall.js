const fs = require('fs/promises');
const path = require('path');

(async () => {
  const folder = path.join(process.cwd(), 'public', '@gouvfr', 'dsfr', 'dist', 'js');
  const dsfrFileSource = path.join(
    process.cwd(),
    'node_modules',
    '@gouvfr',
    'dsfr',
    'dist',
    'js',
    'dsfr.module.min.js'
  );
  const dsfrFileDest = path.join(folder, 'dsfr.module.min.js');
  await fs.mkdir(folder, { recursive: true });
  await fs.copyFile(dsfrFileSource, dsfrFileDest);
  console.info(`Copied ${dsfrFileSource} to ${dsfrFileDest}`);
})();
