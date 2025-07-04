import { actions } from "@/actions/actions.impl";
import type { ImagePublicCategoryType, ImageUserCategoryType } from "@/components/home/imageCategories";
import type { AppState } from "@/globalState";
import type { MultiImageOutput } from "@/Shared/SharedModel";
import { Box, Vertical } from "@/utils/ComponentToolbox";
import { Carousel } from "@mantine/carousel";
import { Button, Image, LoadingOverlay, Text, Title } from "@mantine/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { Fragment } from "react/jsx-runtime";

type ImageGalleryProps = {
	isImagesLoading: AppState["images"]["isLoading"]; // props used to force re-render when images change
	loadingImageId: number | null;
	token?: string;
	imagesByCategory:
		| Record<ImagePublicCategoryType, MultiImageOutput["images"]>
		| Record<ImageUserCategoryType, MultiImageOutput["images"]>;
};

const handleVoteFn = (imageId: number, newVote: 0 | 1, userVote: number | null, voteId: number | null, token?: string) => () => {
	if (!token) {
		toast.error("You must be logged in to vote");
		actions.auth.isModalOpened.updateFn(true)();
		actions.auth.loginView.updateFn("Login")();
		return;
	}

	const currentUserVote = userVote && voteId ? { current: userVote, voteId } : null;
	// Use the vote action to handle the vote logic
	actions.vote.handle(token, imageId, newVote, currentUserVote).then(() => actions.images.get(token));
};

export const ImageGallery = ({ isImagesLoading, imagesByCategory, token, loadingImageId }: ImageGalleryProps) => (
	<Box heightFull positionRelative overflowAuto>
		<Vertical gap={12}>
			{Object.entries(imagesByCategory).map(([category, images]) => (
				<Fragment key={category}>
					<Title order={2} mt={6}>
						{category}
					</Title>
					{images.length === 0 ? (
						<Text style={{ textAlign: "center", padding: 36, fontSize: 20, color: "var(--mantine-color-gray-6)" }}>
							No images found
						</Text>
					) : (
						<Carousel slideSize={128} slideGap={16}>
							{images.map((image) => (
								<Carousel.Slide key={image.imageId}>
									<Vertical width={128}>
										<Image src={image.url} alt={image.imageId.toString()} height={128} />
										<Button.Group>
											<Button
												variant="default"
												p="4px"
												onClick={handleVoteFn(image.imageId, 1, image.userVote, image.userVoteId, token)}
												style={{ borderTopRightRadius: 0 }}
												loading={loadingImageId === image.imageId}
												disabled={loadingImageId !== null}
											>
												<ChevronUp color="var(--mantine-color-teal-text)" strokeWidth={image.userVote === 1 ? 4 : undefined} />
											</Button>
											<Button.GroupSection
												variant="default"
												bg="var(--mantine-color-body)"
												style={{ flex: 1 }}
												c={
													image.userVote === 1
														? "var(--mantine-color-teal-text)"
														: image.userVote === 0
														? "var(--mantine-color-red-text)"
														: undefined
												}
											>
												{image.score}
											</Button.GroupSection>
											<Button
												variant="default"
												p="4px"
												onClick={handleVoteFn(image.imageId, 0, image.userVote, image.userVoteId, token)}
												style={{ borderTopLeftRadius: 0 }}
												loading={loadingImageId === image.imageId}
												disabled={loadingImageId !== null}
											>
												<ChevronDown color="var(--mantine-color-red-text)" strokeWidth={image.userVote === 0 ? 4 : undefined} />
											</Button>
										</Button.Group>
									</Vertical>
								</Carousel.Slide>
							))}
						</Carousel>
					)}
				</Fragment>
			))}
		</Vertical>
		<LoadingOverlay visible={isImagesLoading} />
	</Box>
);
