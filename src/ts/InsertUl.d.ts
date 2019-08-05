import { IToolButton } from './interfaces/IToolButton';
import { TWrapper } from './interfaces/TWrapper';
export declare class InsertUl implements IToolButton {
    private _buttonEl;
    private _wrapperInfo;
    constructor(button: Element, wrapper: TWrapper);
    readonly el: Element;
    readonly wrapper: TWrapper;
    private isMyWrapper;
    private createUl;
    run(): void;
    setActive(): void;
    unsetActive(): void;
}
