/** Tailwind theme — soft indigo + teal palette. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',
          500:'#6366f1',600:'#4f46e5',700:'#4338ca',900:'#312e81',
        },
        accent: { 500:'#14b8a6', 600:'#0d9488' },
        ink: { 900:'#0f172a', 700:'#334155', 500:'#64748b' },
      },
      boxShadow: { soft: '0 4px 20px -8px rgba(15,23,42,.15)' },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
};
