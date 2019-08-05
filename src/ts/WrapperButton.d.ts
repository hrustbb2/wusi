import { IToolButton } from './interfaces/IToolButton';
import { TWrapper } from './interfaces/TWrapper';
export declare class WrapperButton implements IToolButton {
    private _buttonEl;
    private _wrapperInfo;
    constructor(button: Element, wrapper: TWrapper);
    readonly el: Element;
    readonly wrapper: TWrapper;
    private createWrapper;
    private isMyWrapper;
    run(): void;
    setActive(): void;
    unsetActive(): void;
}
