export declare const frameMonitorContentScript: () => {
    success: boolean;
    frames: {
        frameId: string;
        visible: boolean;
    }[];
};
export declare const diagnosticScript: () => {
    success: boolean;
    iframes: number;
};
//# sourceMappingURL=frame-monitor.d.ts.map