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
    'dsfr.module.js'
  );
  const dsfrNoModuleFileSource = path.join(
    process.cwd(),
    'node_modules',
    '@gouvfr',
    'dsfr',
    'dist',
    'js',
    'dsfr.nomodule.js'
  );
  const dsfrFileDest = path.join(folder, 'dsfr.module.js');
  const dsfrNoModuleFileDest = path.join(folder, 'dsfr.nomodule.js');
  await fs.mkdir(folder, { recursive: true });
  await fs.copyFile(dsfrFileSource, dsfrFileDest);
  await fs.copyFile(dsfrNoModuleFileSource, dsfrNoModuleFileDest);
  console.info(`Copied ${dsfrFileSource} to ${dsfrFileDest}`);
  console.info(`Copied ${dsfrNoModuleFileSource} to ${dsfrNoModuleFileDest}`);
})();
