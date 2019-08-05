import { IListInsert } from './interfaces/IListInsert';
import { IEditor } from './interfaces/IEditor';

export class ListInsert implements IListInsert {

    public run(editor:IEditor)
    {
        let range = this.getRange();
        let topMyWrapper = this.topMyWrapper(range.commonAncestorContainer);
    }

}