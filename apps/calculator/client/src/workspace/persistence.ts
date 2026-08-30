import type { SaveState, SDStandardProject } from "../../../../../packages/standard-core/src/project";

type TimerHandle = ReturnType<typeof setTimeout>;

export interface PersistenceCoordinatorOptions {
  delay?: number;
  save: (project: SDStandardProject) => boolean;
  onStateChange: (state: SaveState) => void;
  setTimer?: (callback: () => void, delay: number) => TimerHandle;
  clearTimer?: (timer: TimerHandle) => void;
}

export interface PersistenceCoordinator {
  schedule(project: SDStandardProject): void;
  flush(project: SDStandardProject): boolean;
  cancel(): void;
}

export function createPersistenceCoordinator(options: PersistenceCoordinatorOptions): PersistenceCoordinator {
  const delay = options.delay ?? 700;
  const setTimer = options.setTimer ?? ((callback, timeout) => setTimeout(callback, timeout));
  const clearTimer = options.clearTimer ?? ((timer) => clearTimeout(timer));
  let timer: TimerHandle | null = null;
  let generation = 0;

  const cancel = () => {
    generation += 1;
    if (timer !== null) clearTimer(timer);
    timer = null;
  };

  const persist = (project: SDStandardProject, expectedGeneration: number) => {
    if (expectedGeneration !== generation) return false;
    options.onStateChange("saving");
    const saved = options.save(project);
    if (expectedGeneration === generation) options.onStateChange(saved ? "saved" : "error");
    return saved;
  };

  return {
    schedule(project) {
      cancel();
      options.onStateChange("dirty");
      const expectedGeneration = generation;
      timer = setTimer(() => {
        timer = null;
        persist(project, expectedGeneration);
      }, delay);
    },
    flush(project) {
      cancel();
      return persist(project, generation);
    },
    cancel,
  };
}
