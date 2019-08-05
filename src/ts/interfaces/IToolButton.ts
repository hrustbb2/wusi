import { TWrapper } from './TWrapper';

export interface IToolButton {
    run():void;
    setActive():void;
    unsetActive():void;
    el:Element;
    wrapper:TWrapper;
}