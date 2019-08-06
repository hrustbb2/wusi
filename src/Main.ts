import 'jquery';
import { Editor } from './ts/Editor';
import { WrapperButton } from './ts/WrapperButton';
import { InsertUl } from './ts/InsertUl';
import { KeyListener } from './ts/KeyListener';
import { TWrapper } from './ts/interfaces/TWrapper';

$(document).ready(function(){
    let div = document.querySelector('.edited-area');
    let editor = new Editor(div);

    let resizer = document.querySelector('.resizer');

    let direction = 'up';

    function resize(e:any) {
        // let b = (<HTMLElement>div).getBoundingClientRect();
        // let h = e.movementY + b.height;
        e.preventDefault();
        let currentHeiht = (<HTMLElement>div).offsetHeight;
        let dH = e.movementY;
        (<HTMLElement>div).style.height = currentHeiht + dH - 12 + 'px';
    }

    

    resizer.addEventListener('mousedown', function(e:Event) {
        document.querySelector('body').addEventListener('mousemove', resize);
        document.querySelector('body').addEventListener('mouseup', function(e:Event) {
            document.querySelector('body').removeEventListener('mousemove', resize);
        });
    });

    let brTag:TWrapper = {
        elName: 'br',
        className: '',
        bbCode: 'br',
        child: null,
    };
    editor.addWraper(brTag);

    let boldButtonEl = document.querySelector('.toolbar .bold');
    let boldTag:TWrapper = {
        elName: 'b',
        className: '',
        bbCode: 'b',
        child: null,
    };
    let boldButton = new WrapperButton(boldButtonEl, boldTag);

    let italicButtonEl = document.querySelector('.toolbar .italic');
    let italicTag:TWrapper = {
        elName: 'i',
        className: '',
        bbCode: 'i',
        child: null,
    };
    let italicButton = new WrapperButton(italicButtonEl, italicTag);

    let underlineButtonEl = document.querySelector('.toolbar .underline');
    let ulButtonEl = document.querySelector('.toolbar .ul');
    let underlineTag:TWrapper = {
        elName: 'u',
        className: '',
        bbCode: 'u',
        child: null,
    };
    let underlineButton = new WrapperButton(underlineButtonEl, underlineTag);

    let ulTag:TWrapper = {
        elName: 'ul',
        className: 'ul',
        bbCode: 'ul',
        child: {
            elName: 'li',
            className: '',
            bbCode: 'li',
            child: null,
        },
    }
    let ulButton = new InsertUl(ulButtonEl, ulTag);
    editor.addButton(boldButton);
    editor.addButton(italicButton);
    editor.addButton(underlineButton);
    editor.addButton(ulButton);
    let keyListener = new KeyListener();
    editor.addKeyListener(13, keyListener);

    // let el = document.createElement('p');
    // let txt = document.createTextNode('\uFEFF');
    // el.appendChild(txt);

    // div.appendChild(el);

    let toStringButton = document.querySelector('.tostring');
    toStringButton.addEventListener('click', function(e:Event){
        e.preventDefault();
        //editor.stringToContent('12[b]34[/b]56');
        console.log(editor.contentToString(div));
        //div.innerHTML = '';
    })
})