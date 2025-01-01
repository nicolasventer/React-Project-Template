/** Configurations for the API. */
export const apiConfig = {
	/** Whether the API mock is enabled. */
	isMockEnabled: false,
};

/** Enables the API mock. */
export const enableApiMock = () => (apiConfig.isMockEnabled = true);
