// TODO: see where this file should be

export const IMAGE_VIEW_VALUES = ["Public", "You"] as const;
export type ImageViewType = (typeof IMAGE_VIEW_VALUES)[number];
