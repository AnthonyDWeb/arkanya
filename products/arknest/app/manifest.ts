import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ArkNest",
    short_name: "ArkNest",
    description: "Gestion simple et partagée du budget du foyer.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#17243b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
