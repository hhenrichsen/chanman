import { isWithin } from "./Date";

export class TimedCache<K, V> {
    private times = new Map<K, number>();
    private values = new Map<K, V | undefined>();
    private fetch = new Map<K, () => Promise<V | undefined>>();

    constructor(
        private readonly timeout: number,
        private readonly cacheUndefined: boolean = false,
    ) {}

    public has(key: K): boolean {
        return this.fetch.has(key);
    }

    public set(key: K, fetchFunction: () => Promise<V | undefined>) {
        this.fetch.set(key, fetchFunction);
    }

    public setValue(key: K, update: (current: V | undefined) => V | undefined) {
        this.values.set(key, update(this.values.get(key)));
        this.times.set(key, new Date().getTime());
    }

    public invalidate(key: K) {
        this.times.delete(key);
    }

    public async get(key: K): Promise<V | undefined> {
        const time = this.times.get(key);
        if (time && isWithin(new Date(), time, this.timeout)) {
            return this.values.get(key);
        }
        const fetchFunction = this.fetch.get(key);
        if (fetchFunction) {
            const value = await fetchFunction();
            if (this.cacheUndefined || value != undefined) {
                this.values.set(key, value);
            }
            return value;
        }
        if (this.cacheUndefined) {
            this.values.set(key, undefined);
        }
        return undefined;
    }
}
