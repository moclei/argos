export type CoreFrameInfo = {
    visible: boolean;
    url: string;
    parentFrameId?: number;
};
type CoreTabInfo = {
    url: string;
    frames: Map<number, CoreFrameInfo>;
};
type FrameMap = Map<number, CoreTabInfo>;
type ChangeType = "added" | "removed" | "modified" | "visibility_changed";
type ChangeEvent = {
    type: ChangeType;
    tabId: number;
    frameId?: number;
    previousState?: {
        url?: string;
        visible?: boolean;
    };
    currentState?: {
        url?: string;
        visible?: boolean;
    };
};
type ChangeListener = (event: ChangeEvent) => void;
export declare class TabFrameTracker {
    frameMap: FrameMap;
    private listeners;
    constructor();
    notifyListeners(event: ChangeEvent): void;
    subscribe(listener: ChangeListener): () => void;
    private initializeListeners;
    getTabInfo(tabId: number): CoreTabInfo | undefined;
    getFrameInfo(tabId: number, frameId: number): CoreFrameInfo | undefined;
    getAllTabs(): FrameMap;
}
export {};
//# sourceMappingURL=tab-frame-tracker.d.ts.map