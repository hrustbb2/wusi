define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StaticTools = /** @class */ (function () {
        function StaticTools() {
        }
        StaticTools.wrap = function (range, isMyWrapper, createWrapper) {
            if (range.collapsed && range.endOffset == range.startOffset)
                return;
            var topNodes = StaticTools.getCommonTopNodes(range.startContainer, range.endContainer);
            if (topNodes[0].nodeName.toLowerCase() == 'li' ||
                topNodes[1].nodeName.toLowerCase() == 'li') {
                return;
            }
            var wrapper = createWrapper();
            if (topNodes[0] == topNodes[1]) {
                var selectedContent = range.cloneContents();
                wrapper.appendChild(selectedContent);
                range.deleteContents();
                range.insertNode(wrapper);
            }
            else {
                var selectedNodes = StaticTools.getSelectedNodes(topNodes[0].parentElement, range.startContainer, range.endContainer);
                for (var _i = 0, selectedNodes_1 = selectedNodes; _i < selectedNodes_1.length; _i++) {
                    var selectedNode = selectedNodes_1[_i];
                    if (StaticTools.isContainNodeName(selectedNode, 'br')) {
                        return;
                    }
                }
                var afterNodes = StaticTools.cloneNodes(StaticTools.getAfterNodes2(topNodes[0], range.startContainer));
                var beforeNodes = StaticTools.cloneNodes(StaticTools.getBeforeNodes2(topNodes[1], range.endContainer));
                var splitStart = StaticTools.splitNode(range.startContainer, range.startOffset);
                var splitEnd = StaticTools.splitNode(range.endContainer, range.endOffset);
                //(<HTMLElement>topNodes[0]).remove();
                topNodes[0].parentNode.removeChild(topNodes[0]);
                //(<HTMLElement>topNodes[1]).remove();
                topNodes[1].parentNode.removeChild(topNodes[1]);
                wrapper.appendChild(document.createTextNode(splitStart[1]));
                for (var _a = 0, selectedNodes_2 = selectedNodes; _a < selectedNodes_2.length; _a++) {
                    var selectedNode = selectedNodes_2[_a];
                    wrapper.appendChild(selectedNode);
                    StaticTools.unWrap(selectedNode, isMyWrapper);
                }
                wrapper.appendChild(document.createTextNode(splitEnd[0]));
                for (var i = beforeNodes.length - 1; i >= 0; i--) {
                    range.insertNode(beforeNodes[i]);
                }
                range.insertNode(document.createTextNode(splitEnd[1]));
                range.insertNode(wrapper);
                range.insertNode(document.createTextNode(splitStart[0]));
                for (var i = afterNodes.length - 1; i >= 0; i--) {
                    range.insertNode(afterNodes[i]);
                }
            }
            StaticTools.pretier(wrapper, isMyWrapper);
            StaticTools.pretier(wrapper.parentNode, isMyWrapper);
            StaticTools.clearSelection();
        };
        StaticTools.getPath = function (node) {
            var result = [];
            while (!StaticTools.isRootNode(node)) {
                result.push(node);
                if (node.parentNode) {
                    node = node.parentNode;
                }
                else {
                    break;
                }
            }
            return result;
        };
        StaticTools.unWrap = function (node, isMyWrapper) {
            if (isMyWrapper(node)) {
                var parentNode = node.parentNode;
                while (node.firstChild) {
                    parentNode.insertBefore(node.firstChild, node);
                }
                parentNode.removeChild(node);
                StaticTools.pretier(parentNode, isMyWrapper);
            }
            for (var i in node.childNodes) {
                if ((+i ^ 0) !== +i)
                    break;
                StaticTools.unWrap(node.childNodes[i], isMyWrapper);
            }
        };
        StaticTools.getRange = function () {
            if (window.getSelection) {
                var selection = StaticTools.getSelection();
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
        StaticTools.getSelection = function () {
            if (window.getSelection) {
                return window.getSelection();
            }
            if (document.selection) {
                //IE
                return document.selection.createRange();
            }
        };
        StaticTools.clearSelection = function () {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
        };
        StaticTools.topMyWrapper = function (node, isMyWrapper) {
            if (isMyWrapper(node)) {
                return node;
            }
            if (StaticTools.isRootNode(node)) {
                return null;
            }
            return StaticTools.topMyWrapper(node.parentNode, isMyWrapper);
        };
        StaticTools.pretier = function (wrapper, isMyWrapper) {
            StaticTools.defragmentateTextNodes(wrapper);
            if (wrapper.parentNode) {
                StaticTools.defragmentateTextNodes(wrapper.parentNode);
                StaticTools.deleteEmptyTextNodes(wrapper.parentNode);
                StaticTools.defragmentateMyNodes(wrapper.parentNode, isMyWrapper);
            }
        };
        StaticTools.cloneNodes = function (nodes) {
            var result = [];
            for (var i in nodes) {
                if ((+i ^ 0) !== +i)
                    break;
                var clonedNode = nodes[i].cloneNode();
                var childNodes = StaticTools.cloneNodes(nodes[i].childNodes);
                for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
                    var childNode = childNodes_1[_i];
                    clonedNode.appendChild(childNode);
                }
                result.push(clonedNode);
            }
            return result;
        };
        StaticTools.isRootNode = function (node) {
            var r = (node.hasAttribute) ? node.hasAttribute('editor') : false;
            return r;
        };
        StaticTools.findTopNode = function (childNode, nodeName) {
            var result = null;
            var parent = childNode.parentNode;
            while (!StaticTools.isRootNode(parent)) {
                if (parent.nodeName.toLowerCase() == nodeName) {
                    result = parent;
                    break;
                }
                parent = parent.parentNode;
            }
            return result;
        };
        StaticTools.getCommonTopNodes = function (startNode, endNode) {
            var startTop = startNode;
            var endTop = endNode;
            while (startTop.parentNode != endTop.parentNode) {
                if (!StaticTools.isRootNode(startTop.parentNode)) {
                    startTop = startTop.parentNode;
                }
                else {
                    startTop = startNode;
                    if (!StaticTools.isRootNode(endTop)) {
                        endTop = endTop.parentNode;
                    }
                    else {
                        break;
                    }
                }
            }
            return [startTop, endTop];
        };
        StaticTools.getAfterNodes2 = function (topNode, endContainer, checkIsText) {
            if (checkIsText === void 0) { checkIsText = false; }
            var result = [];
            if (checkIsText) {
                var sn = (endContainer.nodeName == '#text') ? endContainer.parentNode : endContainer;
                if (sn == topNode)
                    return result;
            }
            var nodes = topNode.childNodes;
            for (var i = 0; i <= nodes.length - 1; i++) {
                if (nodes[i] == endContainer) {
                    break;
                }
                result.push(nodes[i]);
            }
            return result;
        };
        StaticTools.getBeforeNodes2 = function (topNode, startContainer, checkIsText) {
            if (checkIsText === void 0) { checkIsText = false; }
            var result = [];
            if (checkIsText) {
                var sn = (startContainer.nodeName == '#text') ? startContainer.parentNode : startContainer;
                if (sn == topNode)
                    return result;
            }
            var nodes = topNode.childNodes;
            var isPush = false;
            for (var i = 0; i <= nodes.length - 1; i++) {
                if (isPush) {
                    result.push(nodes[i]);
                }
                if (nodes[i] == startContainer) {
                    isPush = true;
                }
            }
            return result;
        };
        StaticTools.splitNode = function (node, offset) {
            var result = [];
            if (node.nodeName == '#text') {
                result.push(node.data.substr(0, offset));
                result.push(node.data.substr(offset));
            }
            else {
                result.push(node.innerText.substr(0, offset));
                result.push(node.innerText.substr(offset));
            }
            return result;
        };
        StaticTools.isContainNode = function (container, child) {
            if (container == child)
                return true;
            if (container.nodeName == '#text')
                return false;
            var result = false;
            for (var i = 0; i <= container.childNodes.length - 1; i++) {
                if (StaticTools.isContainNode(container.childNodes[i], child)) {
                    result = true;
                    break;
                }
            }
            return result;
        };
        StaticTools.isContainNodeName = function (container, nodeName) {
            if (container.nodeName.toLowerCase() == nodeName)
                return true;
            if (container.nodeName == '#text')
                return false;
            var result = false;
            for (var i = 0; i <= container.childNodes.length - 1; i++) {
                if (StaticTools.isContainNodeName(container.childNodes[i], nodeName)) {
                    result = true;
                    break;
                }
            }
            return result;
        };
        StaticTools.isNodeIn = function (node, nodes) {
            for (var i in nodes) {
                if (node == nodes[i]) {
                    return true;
                }
            }
            return false;
        };
        StaticTools.getSelectedNodes = function (parent, startNode, endNode) {
            var childNodes = parent.childNodes;
            var result = [];
            var stage = 0;
            var sn = (StaticTools.isRootNode(startNode.parentNode)) ? startNode : startNode.parentNode;
            var en = (StaticTools.isRootNode(endNode.parentNode)) ? endNode : endNode.parentNode;
            for (var i in childNodes) {
                if ((+i ^ 0) !== +i)
                    break;
                if (stage == 0 && StaticTools.isContainNode(childNodes[i], sn)) {
                    var nextSiblingNodes = StaticTools.getBeforeNodes2(childNodes[i], sn, true);
                    result = result.concat(nextSiblingNodes);
                    stage = 1;
                    continue;
                }
                if (stage == 1) {
                    if (!StaticTools.isContainNode(childNodes[i], en)) {
                        result.push(childNodes[i]);
                    }
                    else {
                        var previousSiblingNodes = StaticTools.getAfterNodes2(childNodes[i], en, true);
                        result = result.concat(previousSiblingNodes);
                        break;
                    }
                }
            }
            return result;
        };
        StaticTools.deleteEmptyTextNodes = function (containerNode) {
            var i = 0;
            var childNodes = containerNode.childNodes;
            while (i <= childNodes.length - 1) {
                if (childNodes[i].nodeName == '#text' && childNodes[i].data == '') {
                    //childNodes[i].remove();
                    childNodes[i].parentNode.removeChild(childNodes[i]);
                }
                else {
                    i++;
                }
            }
        };
        StaticTools.defragmentateTextNodes = function (containerNode) {
            var i = 0;
            var childNodes = containerNode.childNodes;
            var previousNode = null;
            while (i <= childNodes.length - 1) {
                if (previousNode &&
                    childNodes[i].nodeName == '#text' &&
                    previousNode.nodeName == '#text') {
                    var previousText = previousNode.data;
                    previousNode.data = previousText + childNodes[i].data;
                    //childNodes[i].remove();
                    childNodes[i].parentNode.removeChild(childNodes[i]);
                }
                else {
                    previousNode = childNodes[i];
                    i++;
                }
            }
        };
        StaticTools.defragmentateMyNodes = function (containerNode, isMyWrapper) {
            var i = 0;
            var childNodes = containerNode.childNodes;
            var previousNode = null;
            while (i <= childNodes.length - 1) {
                if (previousNode && isMyWrapper(childNodes[i]) && isMyWrapper(previousNode)) {
                    var previousText = previousNode.innerText;
                    previousNode.innerText = previousText + childNodes[i].innerText;
                    //childNodes[i].remove();
                    childNodes[i].parentNode.removeChild(childNodes[i]);
                }
                else {
                    previousNode = childNodes[i];
                    i++;
                }
            }
        };
        return StaticTools;
    }());
    exports.StaticTools = StaticTools;
});
//# sourceMappingURL=StaticTools.js.map