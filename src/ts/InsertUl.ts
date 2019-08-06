import { IToolButton } from './interfaces/IToolButton';
import { StaticTools } from './StaticTools';
import { TWrapper } from './interfaces/TWrapper';

export class InsertUl implements IToolButton {

    private _buttonEl:Element;

    //private _tools:Tools;

    private _wrapperInfo:TWrapper;

    public constructor(button:Element, wrapper:TWrapper)
    {
        //this._tools = new Tools();
        //this._tools.isMyWrapper = this.isMyWrapper.bind(this);
        this._buttonEl = button;
        this._wrapperInfo = wrapper;
    }

    get el():Element
    {
        return this._buttonEl;
    }

    get wrapper():TWrapper
    {
        return this._wrapperInfo;
    }

    private _isMyWrapper(node:Node):boolean
    {
        if( node.parentNode.nodeName.toLowerCase() == 'li' ||
        node.parentNode.nodeName.toLowerCase() == 'ul') {
            return true;
        }
        return false;
    }

    private createUl():Element{
        let ul = document.createElement(this._wrapperInfo.elName);
        ul.classList.add(this._wrapperInfo.className);
        let li = document.createElement(this._wrapperInfo.child.elName);
        //li.classList.add(this._wrapperInfo.child.className);
        ul.appendChild(li);
        return ul;
    }

    public run()
    {
        let range = StaticTools.getRange();
        let topMyWrapper = StaticTools.topMyWrapper(range.commonAncestorContainer, this._isMyWrapper.bind(this));
        if(topMyWrapper === null){
            let ul = this.createUl();
            let br = document.createElement('br');
            let br2 = document.createElement('br');
            range.insertNode(br);
            range.insertNode(ul);
            range.insertNode(br2);
            range.setStartAfter(ul);
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