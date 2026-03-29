import { lazyLoader } from "easy-react-router";

export const IndexLazyLoader = lazyLoader(() => import("./index.lazy"));
// @routeExport
export const MainLayout = IndexLazyLoader.getComponent("MainLayout");
