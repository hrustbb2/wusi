export declare class StaticTools {
    static wrap(range: Range, isMyWrapper: (node: Node) => boolean, createWrapper: () => Element): void;
    static getPath(node: Node): Node[];
    static unWrap(node: Node, isMyWrapper: (node: Node) => boolean): void;
    static getRange(): Range;
    static getSelection(): Selection;
    static clearSelection(): void;
    static topMyWrapper(node: Node, isMyWrapper: (node: Node) => boolean): Node;
    static pretier(wrapper: Node, isMyWrapper: (node: Node) => boolean): void;
    static cloneNodes(nodes: Node[] | NodeList): Node[];
    static isRootNode(node: Node): boolean;
    static findTopNode(childNode: Node, nodeName: string): Node;
    static getCommonTopNodes(startNode: Node, endNode: Node): Node[];
    static getAfterNodes2(topNode: Node, endContainer: Node, checkIsText?: boolean): Node[];
    static getBeforeNodes2(topNode: Node, startContainer: Node, checkIsText?: boolean): Node[];
    static splitNode(node: Node, offset: number): any[];
    static isContainNode(container: Node, child: Node): boolean;
    static isContainNodeName(container: Node, nodeName: string): boolean;
    static isNodeIn(node: Node, nodes: Node[]): boolean;
    static getSelectedNodes(parent: Node, startNode: Node, endNode: Node): Node[];
    static deleteEmptyTextNodes(containerNode: Node): void;
    static defragmentateTextNodes(containerNode: Node): void;
    static defragmentateMyNodes(containerNode: Node, isMyWrapper: (node: Node) => boolean): void;
}
