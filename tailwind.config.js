const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
        './resources/**/*.tsx',
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                '16': 'repeat(16, minmax(0, 1fr))',
            },
            screens: {
                // 'xs': '425px',
                sp: '399px',
                // => @media (min-width: 390px)

                xs: '576px',
                // => @media (min-width: 576px)
                sm: '640px',
                // => @media (min-width: 640px)
                md: '768px',
                // => @media (min-width: 768px)
                tb: '820px',
                // => @media (min-width: 820px)

                lg: '1024px',
                // => @media (min-width: 1024px)

                xl: '1280px',
                // => @media (min-width: 1280px)

                '2xl': '1536px',
                // => @media (min-width: 1536px)

                '3xl': '1730px'
                // => @media (min-width: 1730px)

            },
            colors: {
                orange: {
                    450: '#FF8D26',
                },
                neutral: {
                    750: '#474747'
                }
            }
        },
        zIndex: {
            '0': 0,
            '10': 10,
            '20': 20,
            '30': 30,
            '40': 40,
            '50': 50,
            '100': 100,
            '200': 200,
            '500': 500,
            '1000': 1000,
        },
    },
    variants: {
        extend: {
            opacity: ['disabled'],
            cursor: ['disabled'],
            backgroundColor: ['disabled'],
            borderColor: ['checked', 'disabled'],
            textColor: ['disabled'],
        },
    },
    plugins: [
    ],
}
