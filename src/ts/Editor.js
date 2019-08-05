define(["require", "exports", "./StaticTools"], function (require, exports, StaticTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Editor = /** @class */ (function () {
        function Editor(editorDiv) {
            this._wrappersCollection = {};
            this._buttons = new Array();
            this._keyListeners = {};
            this._editorDiv = editorDiv;
            this._editorDiv.onkeydown = function (event) {
                this.keyPress(event);
            }.bind(this);
            editorDiv.addEventListener('mouseup', function (e) {
                var range = StaticTools_1.StaticTools.getRange();
                var path = StaticTools_1.StaticTools.getPath(range.startContainer);
                //if(!StaticTools.isNodeIn(this._editorDiv, path)){
                //    return;
                //}
                for (var i in this._buttons) {
                    this._buttons[i].unsetActive();
                    this.isMyButton(this._buttons[i], path);
                }
            }.bind(this));
        }
        Editor.prototype.isMyButton = function (button, path) {
            for (var i in path) {
                if (path[i].nodeName.toLowerCase() == button.wrapper.elName &&
                    path[i].classList.contains(button.wrapper.className)) {
                    button.setActive();
                }
            }
        };
        Editor.prototype.keyPress = function (event) {
            var range = StaticTools_1.StaticTools.getRange();
            var path = StaticTools_1.StaticTools.getPath(range.startContainer);
            for (var i in this._buttons) {
                this._buttons[i].unsetActive();
                this.isMyButton(this._buttons[i], path);
            }
            if (event.which == null) { // IE
                if (event.keyCode < 32) {
                    event.preventDefault();
                    this._keyListeners[event.keyCode].exec();
                }
            }
            if (event.which != 0) { // все кроме IE && event.charCode != 0
                if (event.which < 32) {
                    if (this._keyListeners[event.which]) {
                        event.preventDefault();
                        this._keyListeners[event.which].exec();
                    }
                }
            }
        };
        Object.defineProperty(Editor.prototype, "editorDiv", {
            get: function () {
                return this._editorDiv;
            },
            enumerable: true,
            configurable: true
        });
        Editor.prototype.addKeyListener = function (keyCode, keyListener) {
            this._keyListeners[keyCode] = keyListener;
        };
        Editor.prototype.addWraper = function (wrapper) {
            this._wrappersCollection[wrapper.elName + '_' + wrapper.className] = wrapper;
        };
        Editor.prototype.addButton = function (button) {
            button.el.addEventListener('mousedown', function (e) {
                e.preventDefault();
                this.toolButtonClick(button);
            }.bind(this));
            this._buttons.push(button);
            this._wrappersCollection[button.wrapper.elName + '_' + button.wrapper.className] = button.wrapper;
            if (button.wrapper.child) {
                var child = button.wrapper.child;
                this._wrappersCollection[child.elName + '_' + child.className] = child;
            }
        };
        Editor.prototype.toolButtonClick = function (button) {
            button.run();
        };
        Editor.prototype.contentToString = function (node) {
            var childNodes = node.childNodes;
            var result = '';
            for (var i = 0; i <= childNodes.length - 1; i++) {
                var childNode = childNodes[i];
                if (childNode.nodeName == '#text') {
                    result += childNode.data;
                }
                else {
                    var nodeName = childNode.nodeName.toLowerCase();
                    var className = childNode.className;
                    var wrapperInfo = this._wrappersCollection[nodeName + '_' + className];
                    if (wrapperInfo) {
                        if (nodeName == 'br') {
                            result += '[/' + wrapperInfo.bbCode + ']';
                        }
                        else {
                            result += '[' + wrapperInfo.bbCode + ']' + this.contentToString(childNode) + '[/' + wrapperInfo.bbCode + ']';
                        }
                    }
                    else {
                        result += this.contentToString(childNode);
                    }
                }
            }
            return result;
        };
        Editor.prototype.isOpenTag = function (str) {
            for (var i in this._wrappersCollection) {
                var bbCode = this._wrappersCollection[i].bbCode;
                if (str.indexOf('[' + bbCode + ']') == 0) {
                    return this._wrappersCollection[i];
                }
            }
            return null;
        };
        Editor.prototype.isCloseTag = function (str) {
            for (var i in this._wrappersCollection) {
                var bbCode = this._wrappersCollection[i].bbCode;
                if (str.indexOf('[/' + bbCode + ']') == 0) {
                    return this._wrappersCollection[i];
                }
            }
            return null;
        };
        Editor.prototype.stringToContent = function (str) {
            var curentNode = this.editorDiv;
            var curStr = '';
            var curentPos = 0;
            while (curentPos <= str.length - 1) {
                var subStr = str.substr(curentPos, 6);
                var openTag = this.isOpenTag(subStr);
                if (openTag) {
                    if (curStr) {
                        var txt = document.createTextNode(curStr);
                        curentNode.appendChild(txt);
                        curStr = '';
                    }
                    var elName = openTag.elName;
                    var className = openTag.className;
                    var newNode = document.createElement(elName);
                    newNode.classList.add(className);
                    curentNode.appendChild(newNode);
                    curentNode = newNode;
                    curentPos += openTag.bbCode.length + 2;
                    continue;
                }
                var closeTag = this.isCloseTag(subStr);
                if (closeTag) {
                    if (curentNode == this.editorDiv) {
                        break;
                    }
                    if (curStr) {
                        var txt = document.createTextNode(curStr);
                        curentNode.appendChild(txt);
                        curStr = '';
                    }
                    var elName = closeTag.elName;
                    curentNode = curentNode.parentElement;
                    curentPos += closeTag.bbCode.length + 3;
                    continue;
                }
                curStr += str.substr(curentPos, 1);
                curentPos += 1;
            }
            if (curStr) {
                var txt = document.createTextNode(curStr);
                curentNode.appendChild(txt);
                curStr = '';
            }
        };
        return Editor;
    }());
    exports.Editor = Editor;
});
//# sourceMappingURL=Editor.js.map