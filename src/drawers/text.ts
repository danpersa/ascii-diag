export class Text {
    private readonly _row: number;
    private readonly _column: number;
    private _text: string;

    static fromGrid(row: number, column: number, text: string) {
        return new Text(row, column, text);
    }

    protected constructor(row: number, column: number, text: string) {
        this._row = row;
        this._column = column;
        this._text = text;
    }

    get row(): number {
        return this._row;
    }

    get column(): number {
        return this._column;
    }

    get text(): string {
        return this._text;
    }

    addChar(char: string) {
        this._text += char;
    }

    removeChar() {
        this._text = this._text.substr(0, this._text.length - 1);
    }
}