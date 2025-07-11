import { actions } from "@/actions/actions.impl";
import { useApp } from "@/globalState";
import type { ImageViewType } from "@/types";
import { useEffect } from "react";
import styles from "./ImageGallery.module.css";

export const ImageGallery = () => {
	const app = useApp();
	const { images, imageView, auth } = app;

	useEffect(() => {
		// Fetch images when component mounts or when imageView changes
		const token = auth.token.get();
		if (imageView === "Public") actions.images.public.get();
		else actions.images.user.get(token);
	}, [imageView, auth.token]);

	const handleViewChange = (newView: ImageViewType) => {
		actions.images.view.update(newView);
	};

	const currentImages = imageView === "Public" ? images.public : images.user;
	const isLoading = images.isLoading;

	return (
		<div className={styles.imageGallery}>
			<div className={styles.galleryControls}>
				<button onClick={() => handleViewChange("Public")} className={imageView === "Public" ? styles.active : ""}>
					Public Images
				</button>
				<button onClick={() => handleViewChange("You")} className={imageView === "You" ? styles.active : ""}>
					Your Images
				</button>
			</div>

			{isLoading ? (
				<div className={styles.loading}>Loading images...</div>
			) : (
				<div className={styles.imagesGrid}>
					{currentImages.map((image) => (
						<div key={image.imageId} className={styles.imageCard}>
							<img src={image.url} alt={`Image ${image.imageId}`} />
							<div className={styles.imageInfo}>
								<div className={styles.votes}>
									<span>👍 {image.positiveVotes}</span>
									<span>👎 {image.negativeVotes}</span>
									<span>Score: {image.score}</span>
								</div>
								{imageView === "You" && "userVote" in image && (
									<div className={styles.userVote}>
										Your vote: {image.userVote === 1 ? "👍" : image.userVote === -1 ? "👎" : "None"}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{!isLoading && currentImages.length === 0 && <div className={styles.noImages}>No images found.</div>}
		</div>
	);
};
