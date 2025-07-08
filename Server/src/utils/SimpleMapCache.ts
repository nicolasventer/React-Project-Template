export class SimpleMapCache {
	private values: Map<string, { value: unknown; registerTime: number }> = new Map();
	private interval: Timer;

	public constructor(private expirationTimeInMs: number) {
		this.interval = setInterval(() => this.checkExpirationTime(), expirationTimeInMs);
	}

	public get<T>(key: string, callback?: () => T): T | null {
		const value = this.values.get(key);
		if (value) return value.value as T;
		if (!callback) return null;
		const newValue = callback();
		this.values.set(key, { value: newValue, registerTime: Date.now() });
		return newValue;
	}

	public async asyncGet<T>(key: string, callback?: () => T | Promise<T>): Promise<T | null> {
		const value = await this.values.get(key);
		if (value) return value.value as T;
		if (!callback) return null;
		const newValue = await callback();
		this.values.set(key, { value: newValue, registerTime: Date.now() });
		return newValue;
	}

	// tags are not editable
	public set<T>(key: string, value: T) {
		this.values.set(key, { value, registerTime: Date.now() });
	}

	public delete(key: string) {
		this.values.delete(key);
	}

	public close() {
		clearInterval(this.interval);
	}

	private checkExpirationTime() {
		const now = Date.now();
		for (const [key, value] of this.values) if (now - value.registerTime > this.expirationTimeInMs) this.values.delete(key);
	}
}
