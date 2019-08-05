define(["require", "exports", "./StaticTools"], function (require, exports, StaticTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeyListener = /** @class */ (function () {
        function KeyListener() {
        }
        KeyListener.prototype.exec = function () {
            var range = StaticTools_1.StaticTools.getRange();
            var el;
            if (range.commonAncestorContainer.parentNode.nodeName == 'LI') {
                el = document.createElement('li');
                range.commonAncestorContainer.parentNode.parentNode.appendChild(el);
                range.setStart(el, 0);
            }
            else {
                var el_1 = document.createElement('br');
                var txt = document.createTextNode('\u00A0');
                range.insertNode(txt);
                range.insertNode(el_1);
                range.setStartAfter(el_1);
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
        };
        KeyListener.prototype.getRange = function () {
            if (window.getSelection) {
                var selection = StaticTools_1.StaticTools.getSelection();
                if (selection.getRangeAt && selection.rangeCount > 0) {
                    return selection.getRangeAt(0);
                }
                if (selection.anchorNode) {
                    var range = document.createRange();
                    range.setEnd(selection.focusNode, selection.focusOffset);
                    return range;
                }
            }
            else {
                return document.selection.createRange();
            }
        };
        return KeyListener;
    }());
    exports.KeyListener = KeyListener;
});
//# sourceMappingURL=KeyListener.js.map