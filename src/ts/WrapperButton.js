define(["require", "exports", "./StaticTools"], function (require, exports, StaticTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WrapperButton = /** @class */ (function () {
        function WrapperButton(button, wrapper) {
            //this._tools = new Tools();
            //this._tools.createWrapper = this.createWrapper.bind(this);
            //this._tools.isMyWrapper = this.isMyWrapper.bind(this);
            this._wrapperInfo = wrapper;
            this._buttonEl = button;
        }
        Object.defineProperty(WrapperButton.prototype, "el", {
            get: function () {
                return this._buttonEl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WrapperButton.prototype, "wrapper", {
            get: function () {
                return this._wrapperInfo;
            },
            enumerable: true,
            configurable: true
        });
        WrapperButton.prototype.createWrapper = function () {
            var wrapper = document.createElement(this._wrapperInfo.elName);
            wrapper.classList.add(this._wrapperInfo.className);
            return wrapper;
        };
        WrapperButton.prototype.isMyWrapper = function (node) {
            if (node.classList && node.classList.contains) {
                return node.classList.contains(this._wrapperInfo.className);
            }
            return false;
        };
        WrapperButton.prototype.run = function () {
            var range = StaticTools_1.StaticTools.getRange();
            var topMyWrapper = StaticTools_1.StaticTools.topMyWrapper(range.commonAncestorContainer, this.isMyWrapper.bind(this));
            if (topMyWrapper === null) {
                StaticTools_1.StaticTools.wrap(range, this.isMyWrapper.bind(this), this.createWrapper.bind(this));
            }
            else {
                StaticTools_1.StaticTools.unWrap(topMyWrapper, this.isMyWrapper.bind(this));
            }
        };
        WrapperButton.prototype.setActive = function () {
            this._buttonEl.classList.add('active-button');
        };
        WrapperButton.prototype.unsetActive = function () {
            this._buttonEl.classList.remove('active-button');
        };
        return WrapperButton;
    }());
    exports.WrapperButton = WrapperButton;
});
//# sourceMappingURL=WrapperButton.js.map