import Bun from "bun";

await Promise.all([Bun.$`cd ../Server && bun run dev`, Bun.$`bun run dev`]);
