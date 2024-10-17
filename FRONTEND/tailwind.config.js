/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {



    screens: {
      mobile: { max: "772px" },
      tablet: { max: "1230px", min: "773px" },
      desktop: { min: "1231px" }, 
    },



    colors: {

      main: {
        1: "#1F1F1F",
        2: "#282828",
        3: "#434343",
      },
      //highlight: "#CA4346",
      highlight: "#B63BC1",
      ntw: "#F1F1F1", // <- not that white
      shading: "rgba(0,0,0,0.6)",

      status: {
        err: "#B10003",
        ok: "#2FC01B",
      }


    },



    fontFamily: {
      main_regular: "CrimsonText Regular",
      main_semiBold: "CrimsonText SemiBold",
      main_bold: "CrimsonText Bold",
      main_regular_italic: "CrimsonText Regular Italic",
      main_semiBold_italic: "CrimsonText SemiBold Italic",
      main_bold_italic: "CrimsonText Bold Italic"
    },


    extend: {},
  },
  plugins: [],
}

