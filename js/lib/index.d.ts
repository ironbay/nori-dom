declare enum OP_CODE {
    ELEMENT_CREATE = 0,
    ELEMENT_DELETE = 1,
    ATTRIBUTE_SET = 2,
    ATTRIBUTE_DELETE = 3,
    TEXT_SET = 4,
    TEXT_DELETE = 5
}
declare type Operation = [OP_CODE, string[], any];
export declare function patch(root: HTMLElement, ops: Operation[]): void;
export {};
