import { setAppWithUpdate } from "@/globalState";
import type { ImageViewType } from "@/types";

// TODO: see for transition or loading
const updateImageView = (imageView: string) =>
	setAppWithUpdate("updateImageViewValue", [imageView], (prev) => {
		prev.imageView = imageView as ImageViewType;
	});

export const imageView = { update: updateImageView };
