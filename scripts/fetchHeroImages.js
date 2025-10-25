// Simple script to download 8 themed hero images into public/assets/hero1.jpg..hero8.jpg
// Run: node scripts/fetchHeroImages.js
const https = require('https')
const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'public', 'assets')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const queries = [
  'butter-tea',
  'herbal-supplement',
  'wooden-spoon',
  'organic-herbs',
  'tea-leaves',
  'natural-skincare',
  'apothecary',
  'essential-oil'
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow redirect
        return download(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed to fetch ' + url + ' - Status ' + res.statusCode))
      }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

async function run() {
  console.log('Downloading hero images to', outDir)
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i]
    const url = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(q)}`
    const dest = path.join(outDir, `hero${i+1}.jpg`)
    try {
      console.log(`Downloading ${url} -> ${dest}`)
      await download(url, dest)
      console.log('Saved', dest)
    } catch (err) {
      console.error('Failed to download', url, err.message)
    }
  }
  console.log('Done')
}

run().catch(e=>{ console.error(e); process.exit(1) })
