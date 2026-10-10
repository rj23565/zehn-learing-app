import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zehn — Learn, Play, Create",
    short_name: "Zehn",
    description: "Voice-guided learning, brain games and a creative art studio — built to work on slow networks.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f5f6fa",
    theme_color: "#4f46e5",
    orientation: "any",
    icons: [
      { src: "/images/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/images/logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
