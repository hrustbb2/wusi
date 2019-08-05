import { IKeyListener } from './interfaces/IKeyListener';
export declare class KeyListener implements IKeyListener {
    exec(): void;
    protected getRange(): Range;
}
