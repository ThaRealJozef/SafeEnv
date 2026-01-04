const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

esbuild.build({
    entryPoints: [path.join(__dirname, 'src/content/content_script.ts')],
    bundle: true,
    outfile: path.join(__dirname, 'dist/content_script.js'),
    format: 'iife',
    platform: 'browser',
    target: ['chrome100'],
    minify: !isWatch,
    sourcemap: isWatch,
}).then(() => {
    console.log('Build complete');
    if (isWatch) {
        console.log('Watching for changes...');
    }
}).catch(() => process.exit(1));
