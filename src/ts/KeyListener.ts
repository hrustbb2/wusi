import { IKeyListener } from './interfaces/IKeyListener';
import { StaticTools } from './StaticTools';

export class KeyListener implements IKeyListener {

    public exec()
    {
        let range = StaticTools.getRange();
        let el;
        if(range.commonAncestorContainer.parentNode.nodeName == 'LI'){
            el = document.createElement('li');
            range.commonAncestorContainer.parentNode.parentNode.appendChild(el);
            range.setStart(el, 0);
        }else{
            let el = document.createElement('br');
            let txt = document.createTextNode('\u00A0');
            range.insertNode(txt);
            range.insertNode(el);
            range.setStartAfter(el);
            // let parent = (range.commonAncestorContainer.nodeName.toLowerCase() == '#text') ?
            //                 range.commonAncestorContainer.parentNode :
            //                 range.commonAncestorContainer;
            // parent.appendChild(el);
            // let txt = document.createTextNode('\u00A0');
            // parent.appendChild(txt);
            // range.setStartAfter(el);

            // let el = document.createElement('p');
            // let txt = document.createTextNode('\uFEFF');
            // el.appendChild(txt);
            // let topP = this.tools.findTopNode(range.commonAncestorContainer, 'p');
            // if(topP !== null){
            //     (<any>topP).after(el);
            //     range.setStart(el, 0);
            // }else{
            //     range.commonAncestorContainer.parentNode.appendChild(el);
            //     range.setStart(el, 0);
            // }
        }
    }

    protected getRange():Range
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

}