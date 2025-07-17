import { api } from "@/api/api";
import type { ImageViewType } from "@/globalState";
import { refreshToken, setAppWithUpdate } from "@/globalState";
import type { MultiImageOutput } from "@/Shared/SharedModel";

import toast from "react-hot-toast";

// TODO: see for transition or loading
const updateImageView = (imageView: string) =>
	setAppWithUpdate("updateImageViewValue", [imageView], (prev) => {
		prev.imageView = imageView as ImageViewType;
	});

const _updateImagesLoading = () =>
	setAppWithUpdate("updateImagesLoading", (prev) => {
		prev.images.isLoading = true;
	});

const _updateImages = ({ images }: MultiImageOutput) =>
	setAppWithUpdate("updateImages", (prev) => {
		prev.images.isLoading = false;
		prev.images.values = images;
	});

const _updateImagesError = (error: string) =>
	setAppWithUpdate("updateImagesError", [error], (prev) => {
		prev.images.error = error;
		prev.images.isLoading = false;
	});

const getImages = (token?: string): Promise<void> => {
	_updateImagesLoading();
	return api.v1.images
		.get({ headers: { "x-token": token } })
		.then(({ data, error }) => {
			if (error?.status === 401 && error.value === "Token expired") return refreshToken(getImages, token ?? "");
			if (data) _updateImages(data);
			else {
				toast.error("Failed to get images");
				if (error.status === 422) _updateImagesError(error.value.summary ?? "Validation error");
				if (error.status === 401) _updateImagesError(error.value);
				else throw error;
			}
		})
		.catch((error) => {
			_updateImagesError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

export const images = {
	updateImageView,
	get: getImages,
};
