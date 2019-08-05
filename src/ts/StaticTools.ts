export class StaticTools {

    static wrap(range:Range, isMyWrapper:(node:Node)=>boolean, createWrapper:()=>Element)
    {
        if(range.collapsed && range.endOffset == range.startOffset) return;
        let topNodes = StaticTools.getCommonTopNodes(range.startContainer, range.endContainer);
        if( topNodes[0].nodeName.toLowerCase() == 'li' ||
            topNodes[1].nodeName.toLowerCase() == 'li'){
                return;
            }
        let wrapper = createWrapper();
        if(topNodes[0] == topNodes[1]){
            let selectedContent = range.cloneContents();
            wrapper.appendChild(selectedContent);
            range.deleteContents();
            range.insertNode(wrapper);
        }else{
            let selectedNodes = StaticTools.getSelectedNodes(topNodes[0].parentElement, range.startContainer, range.endContainer);
            for(let selectedNode of selectedNodes){
                if(StaticTools.isContainNodeName(selectedNode, 'br')){
                    return;
                }
            }
            let afterNodes = StaticTools.cloneNodes(StaticTools.getAfterNodes2(topNodes[0], range.startContainer));
            let beforeNodes = StaticTools.cloneNodes(StaticTools.getBeforeNodes2(topNodes[1], range.endContainer));
            let splitStart = StaticTools.splitNode(range.startContainer, range.startOffset);
            let splitEnd = StaticTools.splitNode(range.endContainer, range.endOffset);
            //(<HTMLElement>topNodes[0]).remove();
            (<HTMLElement>topNodes[0]).parentNode.removeChild(topNodes[0]);
            //(<HTMLElement>topNodes[1]).remove();
            (<HTMLElement>topNodes[1]).parentNode.removeChild(topNodes[1]);
            wrapper.appendChild(document.createTextNode(splitStart[1]));
            for(let selectedNode of selectedNodes){
                wrapper.appendChild(selectedNode);
                StaticTools.unWrap(selectedNode, isMyWrapper);
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
        
        StaticTools.pretier(wrapper, isMyWrapper);
        StaticTools.pretier(wrapper.parentNode, isMyWrapper);
        StaticTools.clearSelection();
    }

    static getPath(node:Node):Node[] {
        let result = [];
        while(!StaticTools.isRootNode(node)){
            result.push(node);
            if(node.parentNode){
                node = node.parentNode;
            }else{
                break;
            }
        }
        return result;
    }

    static unWrap(node:Node, isMyWrapper:(node:Node)=>boolean)
    {
        if(isMyWrapper(node)){
            let parentNode = node.parentNode;
            while (node.firstChild) {
                parentNode.insertBefore(node.firstChild, node);
            }
            parentNode.removeChild(node);
            StaticTools.pretier(parentNode, isMyWrapper);
        }
        for(let i in node.childNodes){
            if((+i ^ 0) !== +i) break;
            StaticTools.unWrap(node.childNodes[i], isMyWrapper);
        }
    }

    static getRange():Range
    {
        if (window.getSelection) {
            let selection = StaticTools.getSelection();
            if(selection.getRangeAt && selection.rangeCount > 0){
                return selection.getRangeAt(0);
            }
            if(selection.anchorNode){
                let range = document.createRange();
                range.setEnd (selection.focusNode, selection.focusOffset);
				return range;
            }
        }else{
            return (<any>document).selection.createRange()
        }
    }

    static getSelection():Selection
    {
        if (window.getSelection) {
            return window.getSelection();
        }
        if ((<any>document).selection) {
            //IE
            return (<any>document).selection.createRange();
        }
    }

    static clearSelection()
    {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    static topMyWrapper(node:Node, isMyWrapper:(node:Node)=>boolean):Node
    {
        if(isMyWrapper(node)){
            return node;
        }
        if(StaticTools.isRootNode(node)){
            return null;
        }
        return StaticTools.topMyWrapper(node.parentNode, isMyWrapper);
    }

    static pretier(wrapper:Node, isMyWrapper:(node:Node)=>boolean)
    {
        StaticTools.defragmentateTextNodes(wrapper);
        if(wrapper.parentNode){
            StaticTools.defragmentateTextNodes(wrapper.parentNode);
            StaticTools.deleteEmptyTextNodes(wrapper.parentNode);
            StaticTools.defragmentateMyNodes(wrapper.parentNode, isMyWrapper);
        }
    }

    static cloneNodes(nodes:Node[]|NodeList):Node[]
    {
        let result = [];
        for(let i in nodes){
            if((+i ^ 0) !== +i) break;
                let clonedNode = nodes[i].cloneNode();
                let childNodes = StaticTools.cloneNodes(nodes[i].childNodes);
                for(let childNode of childNodes){
                    clonedNode.appendChild(childNode);
                }
                result.push(clonedNode);
        }
        return result;
    }

    static isRootNode(node:Node)
    {
        let r = ((<HTMLElement>node).hasAttribute) ? (<HTMLElement>node).hasAttribute('editor') : false;
        return r;
    }

    static findTopNode(childNode:Node, nodeName:string):Node
    {
        let result = null;
        let parent = childNode.parentNode;
        while(!StaticTools.isRootNode(parent)){
            if(parent.nodeName.toLowerCase() == nodeName){
                result = parent;
                break;
            }
            parent = parent.parentNode;
        }
        return result;
    }

    static getCommonTopNodes(startNode:Node, endNode:Node):Node[]
    {
        let startTop = startNode;
        let endTop = endNode;
        while(startTop.parentNode != endTop.parentNode){
            if(!StaticTools.isRootNode(startTop.parentNode)){
                startTop = startTop.parentNode;
            }else {
                startTop = startNode;
                if(!StaticTools.isRootNode(endTop)){
                    endTop = endTop.parentNode;
                }else{
                    break;
                }
            }
        }
        return [startTop, endTop];
    }

    static getAfterNodes2(topNode:Node, endContainer:Node, checkIsText = false):Node[]
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

    static getBeforeNodes2(topNode:Node, startContainer:Node, checkIsText = false):Node[]
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

    static splitNode(node:Node, offset:number):any[]
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

    static isContainNode(container:Node, child:Node)
    {
        if(container == child) return true;
        if(container.nodeName == '#text') return false;
        let result = false;
        for(let i = 0; i <= container.childNodes.length - 1; i++){
            if(StaticTools.isContainNode(container.childNodes[i], child)){
                result = true;
                break;
            }
        }
        return result;
    }

    static isContainNodeName(container:Node, nodeName:string)
    {
        if(container.nodeName.toLowerCase() == nodeName) return true;
        if(container.nodeName == '#text') return false;
        let result = false;
        for(let i = 0; i <= container.childNodes.length - 1; i++){
            if(StaticTools.isContainNodeName(container.childNodes[i], nodeName)){
                result = true;
                break;
            }
        }
        return result;
    }

    static isNodeIn(node:Node, nodes:Node[]):boolean
    {
        for(let i in nodes){
            if(node == nodes[i]){
                return true;
            }
        }
        return false;
    }

    static getSelectedNodes(parent:Node, startNode:Node, endNode:Node):Node[]
    {
        let childNodes = parent.childNodes;
        let result:Node[] = [];
        let stage = 0;
        let sn = (StaticTools.isRootNode(startNode.parentNode)) ? startNode : startNode.parentNode;
        let en = (StaticTools.isRootNode(endNode.parentNode)) ? endNode : endNode.parentNode;
        for(let i in childNodes){
            if((+i ^ 0) !== +i) break;
            if(stage == 0 && StaticTools.isContainNode(childNodes[i], sn)){
                let nextSiblingNodes = StaticTools.getBeforeNodes2(childNodes[i], sn, true);
                result = result.concat(nextSiblingNodes);
                stage = 1;
                continue;
            }
            if(stage == 1){
                if(!StaticTools.isContainNode(childNodes[i], en)){
                    result.push(childNodes[i]);
                }else{
                    let previousSiblingNodes = StaticTools.getAfterNodes2(childNodes[i], en, true);
                    result = result.concat(previousSiblingNodes);
                    break;
                }
            }
        }
        return result;
    }

    static deleteEmptyTextNodes(containerNode:Node)
    {
        let i = 0;
        let childNodes = <any>containerNode.childNodes;
        while(i <= childNodes.length - 1){
            if(childNodes[i].nodeName == '#text' && childNodes[i].data == ''){
                //childNodes[i].remove();
                childNodes[i].parentNode.removeChild(childNodes[i]);
            }else{
                i++;
            }
        }
    }

    static defragmentateTextNodes(containerNode:Node)
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
                    //childNodes[i].remove();
                    childNodes[i].parentNode.removeChild(childNodes[i]);
            }else{
                previousNode = childNodes[i];
                i++;
            }
        }
    }

    static defragmentateMyNodes(containerNode:Node, isMyWrapper:(node:Node)=>boolean)
    {
        let i = 0;
        let childNodes = <any>containerNode.childNodes;
        let previousNode:any = null;
        while(i <= childNodes.length - 1){
            if(previousNode && isMyWrapper(childNodes[i]) && isMyWrapper(previousNode)){

                    let previousText = previousNode.innerText;
                    previousNode.innerText = previousText + childNodes[i].innerText;
                    //childNodes[i].remove();
                    childNodes[i].parentNode.removeChild(childNodes[i]);
            }else{
                previousNode = childNodes[i];
                i++;
            }
        }
    }

}