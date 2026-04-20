export class VirtualClock {
  private _now = 0;
  private _idCounter = 0;
  private _timers: Map<
    number,
    { callback: () => void; time: number; interval?: number }
  > = new Map();
  private _originalSetTimeout: typeof setTimeout;
  private _originalSetInterval: typeof setInterval;
  private _originalClearTimeout: typeof clearTimeout;
  private _originalClearInterval: typeof clearInterval;
  private _originalDateNow: () => number;

  constructor() {
    this._originalSetTimeout = globalThis.setTimeout;
    this._originalSetInterval = globalThis.setInterval;
    this._originalClearTimeout = globalThis.clearTimeout;
    this._originalClearInterval = globalThis.clearInterval;
    this._originalDateNow = Date.now;
  }

  get now(): number {
    return this._now;
  }

  install(): void {
    const self = this;

    globalThis.setTimeout = function (callback: () => void, delay = 0): number {
      const id = ++self._idCounter;
      self._timers.set(id, {
        callback,
        time: self._now + delay,
      });
      return id;
    } as typeof setTimeout;

    globalThis.setInterval = function (
      callback: () => void,
      delay = 0,
    ): number {
      const id = ++self._idCounter;
      self._timers.set(id, {
        callback,
        time: self._now + delay,
        interval: delay,
      });
      return id;
    } as typeof setInterval;

    globalThis.clearTimeout = function (id: number): void {
      self._timers.delete(id);
    } as typeof clearTimeout;

    globalThis.clearInterval = function (id: number): void {
      self._timers.delete(id);
    } as typeof clearInterval;

    Date.now = function (): number {
      return self._now;
    };
  }

  uninstall(): void {
    globalThis.setTimeout = this._originalSetTimeout;
    globalThis.setInterval = this._originalSetInterval;
    globalThis.clearTimeout = this._originalClearTimeout;
    globalThis.clearInterval = this._originalClearInterval;
    Date.now = this._originalDateNow;
  }

  tick(ms: number): void {
    const target_time = this._now + ms;

    while (true) {
      let next_timer: {
        id: number;
        time: number;
        callback: () => void;
        interval?: number;
      } | null = null;

      for (const [id, timer] of this._timers) {
        if (timer.time <= target_time) {
          if (!next_timer || timer.time < next_timer.time) {
            next_timer = {
              id,
              time: timer.time,
              callback: timer.callback,
              interval: timer.interval,
            };
          }
        }
      }

      if (!next_timer) {
        break;
      }

      this._now = next_timer.time;
      this._timers.delete(next_timer.id);

      try {
        next_timer.callback();
      } catch {
        // Ignore errors from callbacks
      }

      if (next_timer.interval !== undefined) {
        this._timers.set(next_timer.id, {
          callback: next_timer.callback,
          time: this._now + next_timer.interval,
          interval: next_timer.interval,
        });
      }
    }

    this._now = target_time;
  }
}
