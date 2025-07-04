export const IMAGE_PUBLIC_CATEGORIES = ["Random", "Most liked", "Most voted", "Most disparity", "Most disliked"] as const;
export type ImagePublicCategoryType = (typeof IMAGE_PUBLIC_CATEGORIES)[number];

export const IMAGE_USER_CATEGORIES = [
	"Not voted yet",
	"Liked",
	"Disliked",
	"You liked, they hated it",
	"You disliked, they loved it",
] as const;
export type ImageUserCategoryType = (typeof IMAGE_USER_CATEGORIES)[number];
