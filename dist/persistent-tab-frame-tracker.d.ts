import { TabFrameTracker } from "./tab-frame-tracker";
declare class PersistentTabFrameTracker extends TabFrameTracker {
    private static readonly STORAGE_KEY;
    private static readonly STATE_VERSION;
    private persistenceTimeout;
    constructor(options?: {
        persistenceInterval?: number;
    });
    private initializePersistence;
    private setupLifecycleHandlers;
    private persistState;
    private restoreState;
    private clearPersistedState;
    dispose(): void;
}
export { PersistentTabFrameTracker };
//# sourceMappingURL=persistent-tab-frame-tracker.d.ts.map