define(["require", "exports", "./StaticTools"], function (require, exports, StaticTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InsertUl = /** @class */ (function () {
        function InsertUl(button, wrapper) {
            //this._tools = new Tools();
            //this._tools.isMyWrapper = this.isMyWrapper.bind(this);
            this._buttonEl = button;
            this._wrapperInfo = wrapper;
        }
        Object.defineProperty(InsertUl.prototype, "el", {
            get: function () {
                return this._buttonEl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InsertUl.prototype, "wrapper", {
            get: function () {
                return this._wrapperInfo;
            },
            enumerable: true,
            configurable: true
        });
        InsertUl.prototype.isMyWrapper = function (node) {
            if (node.parentNode.nodeName.toLowerCase() == 'li' ||
                node.parentNode.nodeName.toLowerCase() == 'ul') {
                return true;
            }
            return false;
        };
        InsertUl.prototype.createUl = function () {
            var ul = document.createElement(this._wrapperInfo.elName);
            ul.classList.add(this._wrapperInfo.className);
            var li = document.createElement(this._wrapperInfo.child.elName);
            //li.classList.add(this._wrapperInfo.child.className);
            ul.appendChild(li);
            return ul;
        };
        InsertUl.prototype.run = function () {
            var range = StaticTools_1.StaticTools.getRange();
            var topMyWrapper = StaticTools_1.StaticTools.topMyWrapper(range.commonAncestorContainer, this.isMyWrapper.bind(this));
            if (topMyWrapper === null) {
                var ul = this.createUl();
                var br = document.createElement('br');
                var br2 = document.createElement('br');
                range.insertNode(br);
                range.insertNode(ul);
                range.insertNode(br2);
                range.setStartAfter(ul);
            }
        };
        InsertUl.prototype.setActive = function () {
            this._buttonEl.classList.add('active-button');
        };
        InsertUl.prototype.unsetActive = function () {
            this._buttonEl.classList.remove('active-button');
        };
        return InsertUl;
    }());
    exports.InsertUl = InsertUl;
});
//# sourceMappingURL=InsertUl.js.map