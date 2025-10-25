// Lazy-loads the 'country-region-data' package and returns a map of ISO2 -> regions array
export async function loadRegionMap() {
  try {
    // Avoid using a string literal in import() so Vite won't pre-resolve the module during build.
    // Build the package name at runtime and import dynamically. This keeps the package optional
    // and prevents Vite's import-analysis from throwing when the package isn't installed.
    const pkg = 'country-region-data'
    const mod = await import(pkg)
    const data = mod.default || mod
    // data is an array of { countryName, countryShortCode, regions: [{ name, shortCode }, ...] }
    const map = {}
    for (const c of data) {
      const key = (c.countryShortCode || '').toUpperCase()
      map[key] = (c.regions || []).map(r => r.name).filter(Boolean)
    }
    const loadedCount = Object.keys(map).length
    if (loadedCount > 0) console.info(`country-region-data loaded: ${loadedCount} countries with regions`)
    return map
  } catch (err) {
    console.warn('country-region-data not available:', err)
    return {}
  }
}
