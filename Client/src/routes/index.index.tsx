import { actions } from "@/actions/actions.impl";
import type { ImagePublicCategoryType, ImageUserCategoryType } from "@/components/home/imageCategories";
import { ImageGallery } from "@/components/home/ImageGallery";
import { useApp } from "@/globalState";
import type { MultiImageOutput } from "@/Shared/SharedModel";
import { shuffle } from "@/Shared/SharedUtils";
import { Vertical } from "@/utils/ComponentToolbox";
import { Alert } from "@mantine/core";
import { InfoIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

const DISPLAYED_IMAGES_COUNT = 20;
const computeDisparity = (image: MultiImageOutput["images"][number]) => image.totalVotes / Math.max(Math.abs(image.score), 10);

const getPublicImagesByCategory = (
	images: MultiImageOutput["images"]
): Record<ImagePublicCategoryType, MultiImageOutput["images"]> => ({
	Random: shuffle(images).slice(0, DISPLAYED_IMAGES_COUNT),
	"Most liked": images.toSorted((a, b) => b.score - a.score).slice(0, DISPLAYED_IMAGES_COUNT),
	"Most voted": images.toSorted((a, b) => b.totalVotes - a.totalVotes).slice(0, DISPLAYED_IMAGES_COUNT),
	"Most disparity": images.toSorted((a, b) => computeDisparity(b) - computeDisparity(a)).slice(0, DISPLAYED_IMAGES_COUNT),
	"Most disliked": images.toSorted((a, b) => a.score - b.score).slice(0, DISPLAYED_IMAGES_COUNT),
});

const getUserImagesByCategory = (
	images: MultiImageOutput["images"]
): Record<ImageUserCategoryType, MultiImageOutput["images"]> => ({
	"Not voted yet": images
		.filter((image) => image.userVote === null)
		.sort((a, b) => a.totalVotes - b.totalVotes)
		.slice(0, DISPLAYED_IMAGES_COUNT),
	Liked: shuffle(images.filter((image) => image.userVote === 1)).slice(0, DISPLAYED_IMAGES_COUNT),
	Disliked: shuffle(images.filter((image) => image.userVote === 0)).slice(0, DISPLAYED_IMAGES_COUNT),
	"You liked, they hated it": images
		.filter((image) => image.userVote === 1 && image.score < 0)
		.sort((a, b) => a.score - b.score)
		.slice(0, DISPLAYED_IMAGES_COUNT),
	"You disliked, they loved it": images
		.filter((image) => image.userVote === 0 && image.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, DISPLAYED_IMAGES_COUNT),
});

export const Home = () => {
	const app = useApp();
	const { images, imageView, auth, vote } = app;

	const token = auth.token.get();

	// Fetch images when component mounts or when imageView changes
	useEffect(() => void actions.images.get(token), [imageView, token]);

	const imagesByCategory = useMemo(
		() => (imageView === "Public" ? getPublicImagesByCategory(images.values) : getUserImagesByCategory(images.values)),
		[images.values, imageView]
	);

	return (
		<Vertical heightFull>
			{(images.error || vote.error) && (
				<Alert color="red" icon={<InfoIcon />}>
					{images.error || vote.error}
				</Alert>
			)}
			<ImageGallery
				isImagesLoading={images.isLoading}
				loadingImageId={vote.loadingImageId}
				token={token}
				imagesByCategory={imagesByCategory}
			/>
		</Vertical>
	);
};
