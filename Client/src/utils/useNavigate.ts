import { useCallback, useEffect, useState } from "react";

/** Get the current URL. */
export const getUrl = () => `${window.location.pathname}${window.location.search}`;

/**
 * Hook for navigating the application.
 * @param bTransition - Whether to use view transitions. (default: true)
 * @returns The current URL and a function to navigate to a new URL.
 */
export const useNavigate = (bTransition = true) => {
	const [url, setUrl] = useState(getUrl());

	useEffect(() => {
		const listener = () => setUrl(getUrl());
		window.addEventListener("popstate", listener);
		return () => window.removeEventListener("popstate", listener);
	}, []);

	const navigate: typeof setUrl = useCallback(
		(newUrl) => {
			if (typeof newUrl === "function") return navigate(newUrl(url));
			if (newUrl === url) return;
			const fn = () => {
				window.history.pushState({}, "", newUrl);
				setUrl(newUrl);
			};
			if (bTransition) document.startViewTransition(fn);
			else fn();
		},
		[bTransition, url]
	);

	return {
		/** The current URL */
		url,
		/** The function to navigate to a new URL */
		navigate,
	};
};
