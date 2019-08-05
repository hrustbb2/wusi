define(["require", "exports", "./ts/Editor", "./ts/WrapperButton", "./ts/InsertUl", "./ts/KeyListener", "jquery"], function (require, exports, Editor_1, WrapperButton_1, InsertUl_1, KeyListener_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    $(document).ready(function () {
        var div = document.querySelector('.edited-area');
        var editor = new Editor_1.Editor(div);
        var resizer = document.querySelector('.resizer');
        var direction = 'up';
        function resize(e) {
            // let b = (<HTMLElement>div).getBoundingClientRect();
            // let h = e.movementY + b.height;
            e.preventDefault();
            var currentHeiht = div.offsetHeight;
            var dH = e.movementY;
            div.style.height = currentHeiht + dH - 12 + 'px';
        }
        resizer.addEventListener('mousedown', function (e) {
            document.querySelector('body').addEventListener('mousemove', resize);
            document.querySelector('body').addEventListener('mouseup', function (e) {
                document.querySelector('body').removeEventListener('mousemove', resize);
            });
        });
        var brTag = {
            elName: 'br',
            className: '',
            bbCode: 'br',
            child: null,
        };
        editor.addWraper(brTag);
        var boldButtonEl = document.querySelector('.toolbar .bold');
        var boldTag = {
            elName: 'span',
            className: 'bold-text',
            bbCode: 'b',
            child: null,
        };
        var boldButton = new WrapperButton_1.WrapperButton(boldButtonEl, boldTag);
        var italicButtonEl = document.querySelector('.toolbar .italic');
        var italicTag = {
            elName: 'span',
            className: 'italic-text',
            bbCode: 'i',
            child: null,
        };
        var italicButton = new WrapperButton_1.WrapperButton(italicButtonEl, italicTag);
        var underlineButtonEl = document.querySelector('.toolbar .underline');
        var ulButtonEl = document.querySelector('.toolbar .ul');
        var underlineTag = {
            elName: 'span',
            className: 'underline-text',
            bbCode: 'u',
            child: null,
        };
        var underlineButton = new WrapperButton_1.WrapperButton(underlineButtonEl, underlineTag);
        var ulTag = {
            elName: 'ul',
            className: 'ul',
            bbCode: 'ul',
            child: {
                elName: 'li',
                className: '',
                bbCode: 'li',
                child: null,
            },
        };
        var ulButton = new InsertUl_1.InsertUl(ulButtonEl, ulTag);
        editor.addButton(boldButton);
        editor.addButton(italicButton);
        editor.addButton(underlineButton);
        editor.addButton(ulButton);
        var keyListener = new KeyListener_1.KeyListener();
        editor.addKeyListener(13, keyListener);
        // let el = document.createElement('p');
        // let txt = document.createTextNode('\uFEFF');
        // el.appendChild(txt);
        // div.appendChild(el);
        var toStringButton = document.querySelector('.tostring');
        toStringButton.addEventListener('click', function (e) {
            e.preventDefault();
            //editor.stringToContent('12[b]34[/b]56');
            console.log(editor.contentToString(div));
        });
    });
});
//# sourceMappingURL=Main.js.map