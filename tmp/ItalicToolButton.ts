import { IToolButton } from './interfaces/IToolButton';
import { INodeWrapper } from './interfaces/INodeWrapper';
import { IEditor } from './interfaces/IEditor';
import { Tools } from './Tools';

export class ItalicToolButton extends Tools implements IToolButton {

    private _el:Element;

    private _wrapperName = 'italic';

    private _editor:Node;
    
    public constructor(el:Element)
    {
        super();
        this._el = el;
    }

    get el():Element
    {
        return this._el;
    }
    
    private createWrapper():INodeWrapper
    {
        let wrapper:INodeWrapper = <any>document.createElement('span');
        wrapper.classList.add('italic-text');
        wrapper.parameters = {
            isRoot: false,
            name: this._wrapperName,
        };
        return wrapper;
    }

    public run(editor:IEditor)
    {
        let range = this.getRange();
        let topMyWrapper = this.topMyWrapper(range.commonAncestorContainer);
        if(topMyWrapper === null){
            this.enable(range);
        }else{
            this.unWrap(topMyWrapper);
        }
    }

    private enable(range:Range)
    {
        if(range.collapsed && range.endOffset == range.startOffset) return;
        let topNodes = this.getCommonTopNodes(range.startContainer, range.endContainer);
        let wrapper = this.createWrapper();
        if(topNodes[0] == topNodes[1]){
            let selectedContent = range.cloneContents();
            wrapper.appendChild(selectedContent);
            range.deleteContents();
            range.insertNode(wrapper);
        }else{
            let selectedNodes = this.getSelectedNodes(topNodes[0].parentElement, range.startContainer, range.endContainer);
            let afterNodes = this.cloneNodes(this.getAfterNodes2(topNodes[0], range.startContainer));
            let beforeNodes = this.cloneNodes(this.getBeforeNodes2(topNodes[1], range.endContainer));
            let splitStart = this.splitNode(range.startContainer, range.startOffset);
            let splitEnd = this.splitNode(range.endContainer, range.endOffset);
            (<HTMLElement>topNodes[0]).remove();
            (<HTMLElement>topNodes[1]).remove();
            wrapper.appendChild(document.createTextNode(splitStart[1]));
            for(let selectedNode of selectedNodes){
                wrapper.appendChild(selectedNode);
                this.unWrap(selectedNode);
            }
            wrapper.appendChild(document.createTextNode(splitEnd[0]));

            for(let i=beforeNodes.length-1; i>=0; i--){
                range.insertNode(beforeNodes[i]);
            }
            range.insertNode(document.createTextNode(splitEnd[1]));
            range.insertNode(wrapper);
            range.insertNode(document.createTextNode(splitStart[0]));
            for(let i=afterNodes.length-1; i>=0; i--){
                range.insertNode(afterNodes[i]);
            }
        }
        
        this.pretier(wrapper);
        this.clearSelection();
    }

    private unWrap(node:Node)
    {
        if(this.isMyWrapper(node)){
            let parentNode = node.parentNode;
            while (node.firstChild) {
                parentNode.insertBefore(node.firstChild, node);
            }
            parentNode.removeChild(node);
            this.pretier(parentNode);
        }
        for(let i in node.childNodes){
            if((+i ^ 0) !== +i) break;
            this.unWrap(node.childNodes[i]);
        }
    }

    private topMyWrapper(node:Node):Node
    {
        if(this.isMyWrapper(node)){
            return node;
        }
        if(this.isRootNode(node)){
            return null;
        }
        return this.topMyWrapper(node.parentNode);
    }

    private pretier(wrapper:Node)
    {
        this.defragmentateTextNodes(wrapper);
        if(wrapper.parentNode){
            this.defragmentateTextNodes(wrapper.parentNode);
            this.deleteEmptyTextNodes(wrapper.parentNode);
            this.defragmentateMyNodes(wrapper.parentNode);
        }
    }

    private cloneNodes(nodes:Node[]|NodeList):Node[]
    {
        let result = [];
        for(let i in nodes){
            if((+i ^ 0) !== +i) break;
                let clonedNode = nodes[i].cloneNode();
                let childNodes = this.cloneNodes(nodes[i].childNodes);
                for(let childNode of childNodes){
                    clonedNode.appendChild(childNode);
                }
                result.push(clonedNode);
        }
        return result;
    }

    private isRootNode(node:Node)
    {
        let r = ((<HTMLElement>node).hasAttribute) ? (<HTMLElement>node).hasAttribute('editor') : false;
        return r;
    }

    private isMyWrapper(node:Node)
    {
        if((<INodeWrapper>node).parameters && (<INodeWrapper>node).parameters.name == this._wrapperName){
            return true;
        }
        return false;
    }

    private getCommonTopNodes(startNode:Node, endNode:Node):Node[]
    {
        let startTop = startNode;
        let endTop = endNode;
        while(startTop.parentNode != endTop.parentNode){
            if(!this.isRootNode(startTop.parentNode)){
                startTop = startTop.parentNode;
            }else {
                startTop = startNode;
                if(!this.isRootNode(endTop)){
                    endTop = endTop.parentNode;
                }else{
                    break;
                }
            }
        }
        return [startTop, endTop];
    }

    private getAfterNodes2(topNode:Node, endContainer:Node, checkIsText = false):Node[]
    {
        let result:Node[] = [];
        if(checkIsText){
            let sn = (endContainer.nodeName == '#text') ? endContainer.parentNode : endContainer;
            if(sn == topNode) return result;
        }
        let nodes = topNode.childNodes;
        for(let i = 0; i <= nodes.length - 1; i++){
            if(nodes[i] == endContainer){
                break;
            }
            result.push(nodes[i]);
        }
        return result;
    }

    private getBeforeNodes2(topNode:Node, startContainer:Node, checkIsText = false):Node[]
    {
        let result:Node[] = [];
        if(checkIsText){
            let sn = (startContainer.nodeName == '#text') ? startContainer.parentNode : startContainer;
            if(sn == topNode) return result;
        }
        let nodes = topNode.childNodes;
        let isPush = false;
        for(let i = 0; i <= nodes.length - 1; i++){
            if(isPush){
                result.push(nodes[i]);
            }
            if(nodes[i] == startContainer){
                isPush = true;
            }
        }
        return result;
    }

    private splitNode(node:Node, offset:number):any[]
    {
        let result:any[] = [];
        if(node.nodeName == '#text'){
            result.push((<any>node).data.substr(0, offset));
            result.push((<any>node).data.substr(offset));
        }else{
            result.push((<any>node).innerText.substr(0, offset));
            result.push((<any>node).innerText.substr(offset));
        }
        return result;
    }

    private isContainNode(container:Node, child:Node)
    {
        if(container == child) return true;
        if(container.nodeName == '#text') return false;
        let result = false;
        for(let i = 0; i <= container.childNodes.length - 1; i++){
            if(this.isContainNode(container.childNodes[i], child)){
                result = true;
                break;
            }
        }
        return result;
    }

    private getSelectedNodes(parent:Node, startNode:Node, endNode:Node):Node[]
    {
        let childNodes = parent.childNodes;
        let result:Node[] = [];
        let stage = 0;
        let sn = (this.isRootNode(startNode.parentNode)) ? startNode : startNode.parentNode;
        let en = (this.isRootNode(endNode.parentNode)) ? endNode : endNode.parentNode;
        for(let i in childNodes){
            if((+i ^ 0) !== +i) break;
            if(stage == 0 && this.isContainNode(childNodes[i], sn)){
                let nextSiblingNodes = this.getBeforeNodes2(childNodes[i], sn, true);
                result = result.concat(nextSiblingNodes);
                stage = 1;
                continue;
            }
            if(stage == 1){
                if(!this.isContainNode(childNodes[i], en)){
                    result.push(childNodes[i]);
                }else{
                    let previousSiblingNodes = this.getAfterNodes2(childNodes[i], en, true);
                    result = result.concat(previousSiblingNodes);
                    break;
                }
            }
        }
        return result;
    }

    private deleteEmptyTextNodes(containerNode:Node)
    {
        let i = 0;
        let childNodes = <any>containerNode.childNodes;
        while(i <= childNodes.length - 1){
            if(childNodes[i].nodeName == '#text' && childNodes[i].data == ''){
                childNodes[i].remove();
            }else{
                i++;
            }
        }
    }

    private defragmentateTextNodes(containerNode:Node)
    {
        let i = 0;
        let childNodes = <any>containerNode.childNodes;
        let previousNode:any = null;
        while(i <= childNodes.length - 1){
            if(previousNode &&
                childNodes[i].nodeName == '#text' &&
                previousNode.nodeName == '#text'){

                    let previousText = previousNode.data;
                    previousNode.data = previousText + childNodes[i].data;
                    childNodes[i].remove();
            }else{
                previousNode = childNodes[i];
                i++;
            }
        }
    }

    private defragmentateMyNodes(containerNode:Node)
    {
        let i = 0;
        let childNodes = <any>containerNode.childNodes;
        let previousNode:any = null;
        while(i <= childNodes.length - 1){
            if(previousNode && this.isMyWrapper(childNodes[i]) && this.isMyWrapper(previousNode)){

                    let previousText = previousNode.innerText;
                    previousNode.innerText = previousText + childNodes[i].innerText;
                    childNodes[i].remove();
            }else{
                previousNode = childNodes[i];
                i++;
            }
        }
    }

}