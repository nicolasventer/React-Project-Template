import { api } from "@/api/api";
import { app, checkAndRefreshToken } from "@/globalState";
import type { CreateVote, UpdateVote } from "@/Shared/SharedModel";
import toast from "react-hot-toast";

const _updateVoteLoading = (imageId: number | null) => app.vote.loadingImageId.setValue(imageId);

const _updateVoteError = (error: string) => {
	app.vote.error.setValue(error);
	app.vote.loadingImageId.setValue(null);
};

const _updateVoteSuccess = () => {
	app.vote.error.setValue("");
	app.vote.loadingImageId.setValue(null);
};

const createVote = async (token: string, createVoteData: CreateVote) => {
	const validToken = await checkAndRefreshToken(token);
	_updateVoteLoading(createVoteData.imageId);
	return api.v1.votes
		.post(createVoteData, { headers: { "x-token": validToken } })
		.then(async ({ data, error }) => {
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

const updateVote = async (token: string, imageId: number, voteId: number, updateVoteData: UpdateVote) => {
	const validToken = await checkAndRefreshToken(token);
	_updateVoteLoading(imageId);
	return api.v1
		.votes({ id: voteId })
		.patch(updateVoteData, { headers: { "x-token": validToken } })
		.then(async ({ data, error }) => {
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

const deleteVote = async (token: string, imageId: number, voteId: number) => {
	const validToken = await checkAndRefreshToken(token);
	_updateVoteLoading(imageId);
	return api.v1
		.votes({ id: voteId })
		.delete({}, { headers: { "x-token": validToken } })
		.then(async ({ data, error }) => {
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
	userVote: { current: number; voteId: number } | null
) => {
	if (userVote === null) return createVote(token, { imageId, isPositive: newVote === 1 });
	if (userVote.current === newVote) return deleteVote(token, imageId, userVote.voteId);
	return updateVote(token, imageId, userVote.voteId, { isPositive: newVote === 1 });
};

export const vote = {
	handle: handleVote,
};
