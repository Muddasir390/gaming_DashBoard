/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
  	extend: {
      animation: {
        wave: "wave 2.5s infinite",
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
  		colors: {
  			gray: {
          "100": "#131313",
          "200": "rgba(19, 19, 19, 0.8)",
          "300": "rgba(255, 255, 255, 0)",
          "400": "rgba(19, 19, 19, 0.6)",
  			},
  			whitesmoke: {
          "100": "#ededed",
          "200": "rgba(237, 237, 237, 0.1)",
          "300": "rgba(237, 237, 237, 0.05)",
          "400": "rgba(237, 237, 237, 0.7)",
          "500": "rgba(237, 237, 237, 0.3)",
          "600": "rgba(237, 237, 237, 0.5)",
  			},
        skyblue: "#45b7db",
        goldenrod: "#e5c839",
        gainsboro: "#d9d9d9",
        black: "#000",
        dimgray: "#505050",
        tomato: "#ff6060",
        springgreen: "#60ff70",
  		},
  		spacing: {},
  		fontFamily: {
        thesans: "TheSans",
        poppins: "Poppins",
  		},
  		borderRadius: {
        "31xl": "50px",
        "81xl": "100px",
        "3xs": "10px",
        "481xl": "500px",
        "21xl": "40px",
        xl: "20px",
        "8xs": "5px",
      },
  	},
  	fontSize: {
      sm: "14px",
      xl: "20px",
      lg: "18px",
      "45xl": "64px",
      "19xl": "38px",
      "32xl": "51px",
      "13xl": "32px",
      lgi: "19px",
      "7xl": "26px",
      "77xl": "96px",
      "10xl": "29px",
      "29xl": "48px",
      base: "16px",
      xs: "12px",
      "5xl": "24px",
      "85xl": "104px",
      "12xl": "31px",
      "33xl": "52px",
      "3xs": "10px",
      "41xl": "60px",
      "17xl": "36px",
      "69xl": "88px",
      "25xl": "44px",
      inherit: "inherit",
  	},
  	screens: {
  		mq1600: {
        raw: "screen and (max-width: 1600px)",
  		},
  		mq1325: {
        raw: "screen and (max-width: 1325px)",
  		},
  		mq1275: {
        raw: "screen and (max-width: 1275px)",
  		},
  		lg: {
        max: "1200px",
  		},
  		mq1125: {
        raw: "screen and (max-width: 1125px)",
  		},
  		mq1050: {
        raw: "screen and (max-width: 1050px)",
  		},
  		mq900: {
        raw: "screen and (max-width: 900px)",
  		},
  		mq800: {
        raw: "screen and (max-width: 800px)",
  		},
  		mq750: {
        raw: "screen and (max-width: 750px)",
  		},
  		mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
  corePlugins: {
    preflight: true,
  },

  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        '.use-preflight': {
          // Only add the specific preflight rules you need
          '*, ::before, ::after': {
            boxSizing: 'border-box',
            borderStyle: 'solid',
            borderWidth: '0',
          },
          // Reset margins on block elements
          'blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
            margin: '0',
          },
          // Maintain existing font styles
          'body': {
            margin: '0',
            lineHeight: 'inherit',
            fontFamily: 'inherit',
          },
          // Keep button styles consistent
          'button, input, optgroup, select, textarea': {
            padding: '0',
            lineHeight: 'inherit',
            color: 'inherit',
          },
          // Preserve existing list styles
          'ol, ul': {
            listStyle: 'none',
            margin: '0',
            padding: '0',
          },
          // Keep images responsive
          'img, svg, video, canvas, audio, iframe, embed, object': {
            display: 'block',
            verticalAlign: 'middle',
            maxWidth: '100%',
            height: 'auto',
          },
        },
      });
    },
],
};