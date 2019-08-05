import { IToolButton } from './interfaces/IToolButton';
import { IEditor } from './interfaces/IEditor';
import { IKeyListener } from './interfaces/IKeyListener';
import { TWrapper } from './interfaces/TWrapper';
import { StaticTools } from './StaticTools';

type TWrapperCollection = {
    [elementName:string] : TWrapper;
}

export class Editor implements IEditor {

    private _buttons:IToolButton[];

    private _editorDiv:Element;

    private _keyListeners:any;

    private _wrappersCollection:TWrapperCollection = {};

    public constructor(editorDiv:Element)
    {
        this._buttons = new Array();
        this._keyListeners = {};
        this._editorDiv = editorDiv;
        (<HTMLElement>this._editorDiv).onkeydown = function(event:KeyboardEvent){
            this.keyPress(event);
        }.bind(this);
        editorDiv.addEventListener('mouseup', function(e:Event) {
            let range = StaticTools.getRange();
            let path = StaticTools.getPath(range.startContainer);
            //if(!StaticTools.isNodeIn(this._editorDiv, path)){
            //    return;
            //}
            for(let i in this._buttons){
                this._buttons[i].unsetActive();
                this.isMyButton(this._buttons[i], path);
            }
        }.bind(this));
    }

    private isMyButton(button:IToolButton, path:Node[])
    {
        for(let i in path){
            if((<HTMLElement>path[i]).nodeName.toLowerCase() == button.wrapper.elName &&
                (<HTMLElement>path[i]).classList.contains(button.wrapper.className)){
                    button.setActive();
            }
        }
    }

    private keyPress(event:KeyboardEvent)
    {
        let range = StaticTools.getRange();
        let path = StaticTools.getPath(range.startContainer);
        for(let i in this._buttons){
            this._buttons[i].unsetActive();
            this.isMyButton(this._buttons[i], path);
        }
        
        if (event.which == null) { // IE
            if (event.keyCode < 32){
                event.preventDefault();
                this._keyListeners[event.keyCode].exec();
            }
        }
        
        if (event.which != 0) { // все кроме IE && event.charCode != 0
            if (event.which < 32){
                if(this._keyListeners[event.which]){
                    event.preventDefault();
                    this._keyListeners[event.which].exec();
                }
            }
        }
    }

    get editorDiv():Element
    {
        return this._editorDiv;
    }

    public addKeyListener(keyCode:number, keyListener:IKeyListener)
    {
        this._keyListeners[keyCode] = keyListener;
    }

    public addWraper(wrapper:TWrapper)
    {
        this._wrappersCollection[wrapper.elName+'_'+wrapper.className] = wrapper;
    }

    public addButton(button:IToolButton)
    {
        button.el.addEventListener('mousedown', function(e:Event){
            e.preventDefault();
            this.toolButtonClick(button);
        }.bind(this));
        this._buttons.push(button);
        this._wrappersCollection[button.wrapper.elName+'_'+button.wrapper.className] = button.wrapper;
        if(button.wrapper.child){
            let child = button.wrapper.child;
            this._wrappersCollection[child.elName+'_'+child.className] = child;
        }
    }

    private toolButtonClick(button:IToolButton)
    {
        button.run();
    }

    public contentToString(node:Node):string
    {
        let childNodes = node.childNodes;
        let result = '';
        for(let i=0; i<=childNodes.length-1; i++){
            let childNode = childNodes[i];
            if(childNode.nodeName == '#text'){
                result += (<Text>childNode).data;
            }else{
                let nodeName = childNode.nodeName.toLowerCase();
                let className = (<HTMLElement>childNode).className;
                let wrapperInfo = this._wrappersCollection[nodeName+'_'+className];
                if(wrapperInfo){
                    if(nodeName == 'br'){
                        result += '[/'+wrapperInfo.bbCode+']';
                    }else{
                        result += '['+wrapperInfo.bbCode+']' + this.contentToString(childNode) + '[/'+wrapperInfo.bbCode+']';
                    }
                }else{
                    result += this.contentToString(childNode);
                }
            }
        }
        return result;
    }

    private isOpenTag(str:string):TWrapper
    {
        for(let i in this._wrappersCollection){
            let bbCode = this._wrappersCollection[i].bbCode;
            if(str.indexOf('[' + bbCode + ']') == 0){
                return this._wrappersCollection[i];
            }
        }
        return null;
    }

    private isCloseTag(str:string):TWrapper
    {
        for(let i in this._wrappersCollection){
            let bbCode = this._wrappersCollection[i].bbCode;
            if(str.indexOf('[/' + bbCode + ']') == 0){
                return this._wrappersCollection[i];
            }
        }
        return null;
    }

    public stringToContent(str:string)
    {
        let curentNode = <HTMLElement>this.editorDiv;
        let curStr = '';
        let curentPos = 0;
        while(curentPos <= str.length - 1){
            let subStr = str.substr(curentPos, 6)
            let openTag = this.isOpenTag(subStr);
            if(openTag){
                if(curStr){
                    let txt = document.createTextNode(curStr);
                    curentNode.appendChild(txt);
                    curStr = '';
                }
                let elName = openTag.elName;
                let className = openTag.className;
                let newNode = document.createElement(elName);
                newNode.classList.add(className);
                curentNode.appendChild(newNode);
                curentNode = newNode;
                curentPos += openTag.bbCode.length + 2;
                continue;
            }
            let closeTag = this.isCloseTag(subStr);
            if(closeTag){
                if(curentNode == this.editorDiv){
                    break;
                }
                if(curStr){
                    let txt = document.createTextNode(curStr);
                    curentNode.appendChild(txt);
                    curStr = '';
                }
                let elName = closeTag.elName;
                curentNode = curentNode.parentElement;
                curentPos += closeTag.bbCode.length + 3;
                continue;
            }
            curStr += str.substr(curentPos, 1);
            curentPos += 1;
        }
        if(curStr){
            let txt = document.createTextNode(curStr);
            curentNode.appendChild(txt);
            curStr = '';
        }
    }

}