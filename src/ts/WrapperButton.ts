import { IToolButton } from './interfaces/IToolButton';
import { StaticTools } from './StaticTools';
import { TWrapper } from './interfaces/TWrapper';

export class WrapperButton implements IToolButton {

    private _buttonEl:Element;

    //private _tools:Tools;

    private _wrapperInfo:TWrapper;

    public constructor(button:Element, wrapper:TWrapper)
    {
        //this._tools = new Tools();
        //this._tools.createWrapper = this.createWrapper.bind(this);
        //this._tools.isMyWrapper = this.isMyWrapper.bind(this);
        this._wrapperInfo = wrapper;
        this._buttonEl = button;
    }

    get el():Element
    {
        return this._buttonEl;
    }

    get wrapper():TWrapper
    {
        return this._wrapperInfo;
    }
    
    private createWrapper():Element
    {
        let wrapper = document.createElement(this._wrapperInfo.elName);
        if(this._wrapperInfo.className){
            wrapper.classList.add(this._wrapperInfo.className);
        }
        
        return wrapper;
    }

    private _isMyWrapper(node:Node):boolean
    {
        // if((<Element>node).classList && (<Element>node).classList.contains){
        //     return (<Element>node).classList.contains(this._wrapperInfo.className);
        // }
        if(node.nodeName.toLowerCase() == this._wrapperInfo.elName){
            return true;
        }
        return false;
    }

    public run()
    {
        let range = StaticTools.getRange();
        let topMyWrapper = StaticTools.topMyWrapper(range.commonAncestorContainer, this._isMyWrapper.bind(this));
        if(topMyWrapper === null){
            StaticTools.wrap(range, this._isMyWrapper.bind(this), this.createWrapper.bind(this));
        }else{
            StaticTools.unWrap(topMyWrapper, this._isMyWrapper.bind(this));
        }
    }

    public isMyWrapper(node:Node):boolean
    {
        if((<HTMLElement>node).nodeName.toLowerCase() == this._wrapperInfo.elName){
            if(this._wrapperInfo.className){
                if((<HTMLElement>node).classList.contains(this._wrapperInfo.className)){
                    return true;
                }
            }else{
                return true;
            }
        }
        return false;
    }

    public setActive()
    {
        this._buttonEl.classList.add('active-button');
    }

    public unsetActive()
    {
        this._buttonEl.classList.remove('active-button');
    }

}