import { IToolButton } from './interfaces/IToolButton';
import { IEditor } from './interfaces/IEditor';
import { IKeyListener } from './interfaces/IKeyListener';
import { TWrapper } from './interfaces/TWrapper';
export declare class Editor implements IEditor {
    private _buttons;
    private _editorDiv;
    private _keyListeners;
    private _wrappersCollection;
    constructor(editorDiv: Element);
    private isMyButton;
    private keyPress;
    readonly editorDiv: Element;
    addKeyListener(keyCode: number, keyListener: IKeyListener): void;
    addWraper(wrapper: TWrapper): void;
    addButton(button: IToolButton): void;
    private toolButtonClick;
    contentToString(node: Node): string;
    private isOpenTag;
    private isCloseTag;
    stringToContent(str: string): void;
}
