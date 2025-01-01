/* eslint-disable react-refresh/only-export-components */
import { lazyLoader } from "easy-react-router";

const indexLazyLoader = lazyLoader(() => import("./index.lazy"));
/** The function to load the module. */
export const load = indexLazyLoader.load;
/** The loading state. */
export const loadingState = indexLazyLoader.loadingState;
// @routeExport
export const MainLayout = indexLazyLoader.getComponent("MainLayout");
