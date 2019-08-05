import { IToolButton } from './IToolButton';
export interface IEditor {
    editorDiv: Element;
    addButton(button: IToolButton): void;
}
