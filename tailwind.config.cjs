module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-black': '#0b0b0b',
        'brand-black-2': '#0f0f0f',
        'brand-gold': '#D4AF37',
        'muted-gray': '#9CA3AF'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 6px 30px rgba(212,175,55,0.08), inset 0 1px 0 rgba(255,255,255,0.02)'
      }
    }
  },
  plugins: [],
}
