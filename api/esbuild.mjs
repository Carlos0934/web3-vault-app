import * as esbuild from 'esbuild'

await esbuild.build({

  minify: true,
  outdir: './dist',
  platform: 'node',
  target: 'node20',
  entryPoints: ['./src/function.ts'],
  loader: {
      '.node' : 'binary'
  }
})