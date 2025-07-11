import { api } from "@/api/api";
import { setAppWithUpdate } from "@/globalState";
import type { CreateVote, UpdateVote } from "@/Shared/SharedModel";
import toast from "react-hot-toast";

const _updateVoteLoading = (imageId: number | null) =>
	setAppWithUpdate("updateVoteLoading", [imageId], (prev) => {
		prev.vote.loadingImageId = imageId;
	});

const _updateVoteError = (error: string) =>
	setAppWithUpdate("updateVoteError", [error], (prev) => {
		prev.vote.error = error;
		prev.vote.loadingImageId = null;
	});

const _updateVoteSuccess = () =>
	setAppWithUpdate("updateVoteSuccess", (prev) => {
		prev.vote.error = "";
		prev.vote.loadingImageId = null;
	});

const createVote = (token: string, createVoteData: CreateVote) => {
	_updateVoteLoading(createVoteData.imageId);
	return api.v1.votes
		.post(createVoteData, { headers: { "x-token": token } })
		.then(({ data, error }) => {
			if (data) {
				toast.success("Vote created successfully");
				_updateVoteSuccess();
				return data;
			} else {
				toast.error("Failed to create vote");
				if (error.status === 401) _updateVoteError(error.value);
				else if (error.status === 422) _updateVoteError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateVoteError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

const updateVote = (token: string, imageId: number, voteId: number, updateVoteData: UpdateVote) => {
	_updateVoteLoading(imageId);
	return api.v1
		.votes({ id: voteId })
		.patch(updateVoteData, { headers: { "x-token": token } })
		.then(({ data, error }) => {
			if (data) {
				toast.success("Vote updated successfully");
				_updateVoteSuccess();
				return data;
			} else {
				toast.error("Failed to update vote");
				if (error.status === 401) _updateVoteError(error.value);
				else if (error.status === 404) _updateVoteError("Vote not found");
				else if (error.status === 422) _updateVoteError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateVoteError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

const deleteVote = (token: string, imageId: number, voteId: number) => {
	_updateVoteLoading(imageId);
	return api.v1
		.votes({ id: voteId })
		.delete({}, { headers: { "x-token": token } })
		.then(({ data, error }) => {
			if (data) {
				toast.success("Vote deleted successfully");
				_updateVoteSuccess();
				return data;
			} else {
				toast.error("Failed to delete vote");
				if (error.status === 401) _updateVoteError(error.value);
				else if (error.status === 404) _updateVoteError("Vote not found");
				else if (error.status === 422) _updateVoteError(error.value.summary ?? "Validation error");
				else throw error;
			}
		})
		.catch((error) => {
			_updateVoteError(typeof error === "object" && error && "message" in error ? (error.message as string) : "Unknown error");
		});
};

const handleVote = async (
	token: string,
	imageId: number,
	newVote: 0 | 1,
	currentUserVote: number | null,
	voteId: number | null
) => {
	if (currentUserVote === null) return createVote(token, { imageId, isPositive: newVote === 1 });
	// voteId should never be null, but just in case
	if (voteId === null) return _updateVoteError("Retrieved data invalid, please refresh and try again");
	if (currentUserVote === newVote) return deleteVote(token, imageId, voteId);
	return updateVote(token, imageId, voteId, { isPositive: newVote === 1 });
};

export const vote = {
	handle: handleVote,
};
