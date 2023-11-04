import tailwindcss from "@tailwindcss/postcss7-compat";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";

export default {
  plugins: [postcssImport, tailwindcss, autoprefixer],
};
