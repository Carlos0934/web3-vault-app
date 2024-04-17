import * as esbuild from 'esbuild'

await esbuild.build({
  bundle: true,
  outdir: './dist',
  platform: 'node',
  target: 'node20',
  entryPoints: ['./src/function.ts'],
  loader: {
    '.node': 'file'
  },
  packages: 'external'
})