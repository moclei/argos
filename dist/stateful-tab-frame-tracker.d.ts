import { CoreFrameInfo, TabFrameTracker } from "./tab-frame-tracker";
type TabWithFrameStates<T, F> = {
    tabState: T;
    frames: Map<number, {
        frameInfo: CoreFrameInfo;
        state?: F;
    }>;
};
type FramePollingOptions = {
    enabled: boolean;
    interval?: number;
    includeChildFrames?: boolean;
};
declare class StatefulTabFrameTracker<TabStateType extends object = any, FrameStateType extends object = any> extends TabFrameTracker {
    private tabStates;
    private frameSignatureMap;
    private useInjection;
    private pollingInterval?;
    private framePollingOptions;
    private hasScriptingPermission;
    private defaultTabState?;
    private defaultFrameState?;
    constructor(options?: {
        persistenceInterval?: number;
        useInjection?: boolean;
        framePolling?: FramePollingOptions;
        defaultTabState?: TabStateType;
        defaultFrameState?: FrameStateType;
    });
    private initialize;
    private initializeFramePolling;
    private initializeContentScriptSupport;
    private injectContentScript;
    private pollFramesForTab;
    private handleFrameVisibilityChange;
    setFrameVisibility(tabId: number, frameId: number, visible: boolean): void;
    setTabState(tabId: number, state: TabStateType | Partial<TabStateType>): void;
    setFrameState(tabId: number, frameId: number, state: FrameStateType | Partial<FrameStateType>): void;
    private isFullState;
    private getTypeTemplate;
    getTabState(tabId: number): TabStateType | undefined;
    getFrameState(tabId: number, frameId: number): FrameStateType | undefined;
    getAllTabsWithState(): Map<number, TabWithFrameStates<TabStateType, FrameStateType>>;
    queryTabs(predicate: (state: TabStateType) => boolean): Map<number, TabWithFrameStates<TabStateType, FrameStateType>>;
    dispose(): void;
}
export { StatefulTabFrameTracker };
//# sourceMappingURL=stateful-tab-frame-tracker.d.ts.map