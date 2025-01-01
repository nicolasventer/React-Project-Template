import { type ReadonlySignal, signal } from "@preact/signals";

/**
 * A class that allows you to undo and redo changes to a state.
 * @template T The type of the state.
 */
export class StateHistoryManager<T> {
	private stateList: T[] = [];
	private historyIndex = -1;
	private canUndo_ = signal(false);
	private canRedo_ = signal(false);

	/**
	 * Create a new instance of the StateHistoryManager.
	 * @param getState return the current state.
	 * @param setState update the state.
	 */
	constructor(private getState: () => T, private setState: (state: T) => void) {}

	/** Signal that indicates whether the state can be undone. */
	public canUndo = this.canUndo_ as ReadonlySignal<boolean>;
	/** Signal that indicates whether the state can be redone. */
	public canRedo = this.canRedo_ as ReadonlySignal<boolean>;

	/** get the current state and push it to the history. */
	public pushHistory = () => {
		if (this.historyIndex !== -1) this.stateList.length = this.historyIndex + 1;
		this.stateList.push(this.getState());
		this.historyIndex = -1;
		this.canUndo_.value = true;
		this.canRedo_.value = false;
	};

	/** Clear the history. */
	public clearHistory = () => {
		this.stateList.length = 0;
		this.historyIndex = -1;
		this.canUndo_.value = false;
		this.canRedo_.value = false;
	};

	/**
	 * Undo the last change from the history.
	 * @returns true if undo is successful, otherwise false.
	 */
	public undo = () => {
		if (this.stateList.length === 0 || this.historyIndex === 0) return false;
		if (this.historyIndex === -1) {
			this.pushHistory();
			this.historyIndex = this.stateList.length - 1;
		}
		this.historyIndex--;
		this.canRedo_.value = true;
		this.canUndo_.value = this.historyIndex !== 0;
		this.setState(this.stateList[this.historyIndex]);
		return true;
	};

	/**
	 * Redo the last change from the history.
	 * @returns true if redo is successful, otherwise false.
	 */
	public redo = () => {
		if (this.stateList.length === 0 || this.historyIndex === this.stateList.length - 1) return false;
		this.historyIndex++;
		this.canUndo_.value = true;
		this.canRedo_.value = this.historyIndex !== this.stateList.length - 1;
		this.setState(this.stateList[this.historyIndex]);
		return true;
	};
}
