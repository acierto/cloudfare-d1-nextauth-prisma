import {setupDevPlatform} from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mui/material", "@mui/system", "@mui/icons-material"],
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}
