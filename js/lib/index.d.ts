declare enum OP_CODE {
    ELEMENT_CREATE = 0,
    ELEMENT_DELETE = 1,
    ATTRIBUTE_SET = 2,
    ATTRIBUTE_DELETE = 3,
    TEXT_SET = 4,
    TEXT_DELETE = 5
}
declare type Operation = [OP_CODE, string[], any];
export default class Nori {
    private _root;
    onevent: (e: NoriEvent) => void;
    constructor(root: HTMLElement);
    patch(ops: Operation[]): void;
    event_scan(t: Element, shallow?: boolean): void;
    event_bind(t: Element, type: string, handler: string): void;
}
interface NoriEvent {
    handler: string;
    data: any;
}
export {};
