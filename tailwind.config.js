/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#FAF9F5",
          dark: "#262624",
        },
        foreground: {
          DEFAULT: "#3D3929",
          dark: "#C3C0B6",
        },
        card: {
          DEFAULT: "#FAF9F5",
          dark: "#262624",
          foreground: {
            DEFAULT: "#1A1A19",
            dark: "#FAF9F5",
          },
        },
        popover: {
          DEFAULT: "#FFFFFF",
          dark: "#30302E",
          foreground: {
            DEFAULT: "#28261B",
            dark: "#E5E5E2",
          },
        },
        primary: {
          DEFAULT: "#C96442",
          dark: "#D97757",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E9E6DC",
          dark: "#FAF9F5",
          foreground: {
            DEFAULT: "#535146",
            dark: "#30302E",
          },
        },
        muted: {
          DEFAULT: "#EDE9DE",
          dark: "#1B1B19",
          foreground: {
            DEFAULT: "#83827D",
            dark: "#B7B5A9",
          },
        },
        accent: {
          DEFAULT: "#E9E6DC",
          dark: "#1C1B17",
          foreground: {
            DEFAULT: "#28261B",
            dark: "#F5F4EE",
          },
        },
        destructive: {
          DEFAULT: "#1A1A19",
          dark: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: {
          DEFAULT: "#DAD9D4",
          dark: "#3E3E38",
        },
        input: {
          DEFAULT: "#B4B2A7",
          dark: "#52514A",
        },
        ring: {
          DEFAULT: "#C96442",
          dark: "#D97757",
        },
        chart: {
          1: "#B05730",
          2: "#9C87F5",
          3: {
            DEFAULT: "#DED8C4",
            dark: "#1C1B17",
          },
          4: {
            DEFAULT: "#DBD3F0",
            dark: "#2F2B48",
          },
          5: "#B4552D",
        },
        sidebar: {
          DEFAULT: "#F5F4EE",
          dark: "#1F1E1D",
          foreground: {
            DEFAULT: "#3D3D3A",
            dark: "#C3C0B6",
          },
          primary: {
            DEFAULT: "#C96442",
            dark: "#343434",
            foreground: "#FBFBFB",
          },
          accent: {
            DEFAULT: "#E9E6DC",
            dark: "#1A1A19",
            foreground: {
              DEFAULT: "#343434",
              dark: "#C3C0B6",
            },
          },
          border: "#EBEBEB",
          ring: "#B5B5B5",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        "2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
        xs: "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
        sm: "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
        DEFAULT:
          "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
        md: "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
        lg: "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
        xl: "0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
        "2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
      },
      fontFamily: {
        sans: ["Poppins_400Regular"],
        serif: ["Lora_400Regular"],
        mono: ["RobotoMono_400Regular"],
      },
    },
  },
  plugins: [],
};
