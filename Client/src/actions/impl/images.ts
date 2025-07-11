import { api } from "@/api/api";
import { setAppWithUpdate } from "@/globalState";
import type { MultiImageOutput, MultiImageUserOutput } from "@/Shared/SharedModel";
import type { ImageViewType } from "@/types";
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

const _updatePublicImages = ({ images }: MultiImageOutput) =>
	setAppWithUpdate("updatePublicImages", (prev) => {
		prev.images.isLoading = false;
		prev.images.public = images;
	});

const _updateUserImages = ({ images }: MultiImageUserOutput) =>
	setAppWithUpdate("updateUserImages", (prev) => {
		prev.images.isLoading = false;
		prev.images.user = images;
	});

const _updateImagesError = (error: string) =>
	setAppWithUpdate("updateImagesError", [error], (prev) => {
		prev.images.error = error;
		prev.images.isLoading = false;
	});

const getPublicImages = () => {
	_updateImagesLoading();
	api.v1.images
		.get()
		.then(({ data, error }) => {
			if (data) _updatePublicImages(data);
			else {
				toast.error("Failed to get public images");
				if (error.status === 422) _updateImagesError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateImagesError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

const getUserImages = (token: string) => {
	_updateImagesLoading();
	api.v1.images.current
		.get({ headers: { "x-token": token } })
		.then(({ data, error }) => {
			if (data) _updateUserImages(data);
			else {
				toast.error("Failed to get user images");
				if (error.status === 422) _updateImagesError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateImagesError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

export const images = {
	view: { update: updateImageView },
	public: { get: getPublicImages },
	user: { get: getUserImages },
};
