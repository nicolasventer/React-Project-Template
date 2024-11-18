import { lazyLoader } from "../router_src/lazyLoader";

const indexLazyLoader = lazyLoader(() => import("./index.lazy"));
/** The function to load the module. */
export const load = indexLazyLoader.load;
/** The loading state. */
export const loadingState = indexLazyLoader.loadingState;
// @routeExport
export const MainLayout = indexLazyLoader.getComponent("MainLayout");
