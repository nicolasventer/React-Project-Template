// TODO: see where this file should be

export const IMAGE_VIEW_VALUES = ["Public", "You"] as const;
export type ImageViewType = (typeof IMAGE_VIEW_VALUES)[number];

export const LOGIN_VIEW_VALUES = ["Login", "Create account", "Forgot password?"] as const;
export type LoginViewType = (typeof LOGIN_VIEW_VALUES)[number];
