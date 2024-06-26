import * as esbuild from 'esbuild'

await esbuild.build({
  bundle: true,
  minify: true,
  outdir: './dist',
  platform: 'node',
  target: 'node20',
  entryPoints: ['./src/function.ts'],

  packages: 'external'
})