import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The base path is the one thing that differs between the two places this site
// can live. On the custom domain it is '/'. On the github.io preview URL it is
// '/t-portfolio-website/', because Pages serves project sites from a subpath.
// Getting it wrong loads a white page with 404s for every asset, which is the
// single most common way a Vite site fails on Pages.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
