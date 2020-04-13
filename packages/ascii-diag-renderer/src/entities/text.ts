export class Text {
    private readonly _row: number;
    private readonly _column: number;
    private _text: string;

    static fromGrid(row: number, column: number, text: string) {
        return new Text(row, column, text);
    }

    constructor(row: number, column: number, text: string) {
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

export namespace Text {
    export class Builder {
        protected _row: number;
        protected _column: number;
        protected _text: string;

        protected constructor(row: number, column: number, text: string) {
            this._row = row;
            this._column = column;
            this._text = text;
        }

        static from(text: Text): Builder {
            return new Builder(text.row, text.column, text.text);
        }

        build(): Text {
            return new Text(this._row, this._column, this._text);
        }

        row(value: number) {
            this._row = value;
            return this;
        }

        column(value: number) {
            this._column = value;
            return this;
        }

        text(value: string) {
            this._text = value;
            return this;
        }
    }
}
