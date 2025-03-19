import type { IErrorMessage } from "@/actions/actions.interface";
import { state } from "@/actions/actions.state";

export class ErrorMessageImpl implements IErrorMessage {
	clear = () => void (state.errorMessage.value = null);
}
