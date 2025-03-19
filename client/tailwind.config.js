/** @type {import('tailwindcss').Config} */
module.exports = {
    // Update the content path to include all components
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          primary: "#3b82f6", // blue-500
          secondary: "#6b7280", // gray-500
          background: "#ffffff",
          text: {
            primary: "#111827", // gray-900
            secondary: "#6b7280", // gray-500
          },
          border: "#e5e7eb", // gray-200
        },
        spacing: {
          safe: "env(safe-area-inset-bottom)",
        },
      },
    },
    plugins: [],
  }