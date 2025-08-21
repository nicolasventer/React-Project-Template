import { api } from "@/api/api";
import type { ImageViewType } from "@/globalState";
import { app, checkAndRefreshToken } from "@/globalState";
import type { MultiImageOutput } from "@/Shared/SharedModel";

import toast from "react-hot-toast";

// TODO: see for transition or loading
const updateImageView = (imageView: ImageViewType) => app.imageView.setValue(imageView);

const _updateImagesLoading = () => app.images.isLoading.setValue(true);

const _updateImages = ({ images }: MultiImageOutput) => {
	app.images.isLoading.setValue(false);
	app.images.values.setValue(images);
};

const _updateImagesError = (error: string) => {
	app.images.isLoading.setValue(false);
	app.images.error.setValue(error);
};

const getImages = async (token?: string) => {
	const validToken = token ? await checkAndRefreshToken(token) : undefined;
	_updateImagesLoading();
	return api.v1.images
		.get({ headers: validToken ? { "x-token": validToken } : {} })
		.then(async ({ data, error }) => {
			if (data) _updateImages(data);
			else {
				toast.error("Failed to get images");
				if (error.status === 401) _updateImagesError(error.value);
				else if (error.status === 422) _updateImagesError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateImagesError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

export const images = {
	imageView: { update: updateImageView },
	get: getImages,
};
