import ShapeParser from "./parser";
import {ShapeIdService} from "../shapes/shape-id-service";
import Grid from "../drawers/grid";
import {Shape} from "../shapes/shape";
import {TextShape} from "../shapes/text-shape";
import {Domain} from "../drawers/cell";
import Cell = Domain.Cell;

type Point = {
    row: number,
    column: number
}

type Text = {
    start: Point | null
    text: string
}

export default class TextParser implements ShapeParser {

    private readonly shapeIdService: ShapeIdService;

    constructor(shapeIdService: ShapeIdService) {
        this.shapeIdService = shapeIdService;
    }

    parse(grid: Grid): Array<Shape> {
        let texts = new Array<Text>();
        let text: Text = {start: null, text: ''};
        // if there is only one space, we should not split the string in two
        // when there is a v surrounded by chars we should not treat it as an arrow tip, unless there is a | on top of it
        let specialSymbols = new Set([' ', '-', '|', '^', '+']);
        for (let row = 0; row < grid.rows(); row++) {
            text = this.pushText(text, texts);
            for (let column = 0; column < grid.columns(); column++) {
                const cell = grid.cell(row, column);
                if (cell.text !== '' && !specialSymbols.has(cell.text)) {
                    this.addSymbolToText(text, row, column, cell.text);
                } else if (cell.text === '' &&
                    text.start &&
                    this.getRightCellText(cell, grid) !== '' &&
                    !specialSymbols.has(this.getRightCellText(cell, grid))) {
                    this.addSymbolToText(text, row, column, " ");
                } else if (cell.text === 'v' && (this.getTopCellText(cell, grid) !== '|')) {
                    this.addSymbolToText(text, row, column, cell.text);
                } else {
                    text = this.pushText(text, texts);
                }
            }
        }
        const shapes = texts.map(text => {
            return new TextShape(this.shapeIdService.nextId(),
                text.start!.row,
                text.start!.column,
                text.text.trim());
        });
        return shapes;
    }

    private getRightCellText(cell: Cell, grid: Grid): string {
        if (cell.column + 1 >= grid.columns()) {
            return '';
        }
        return grid.cell(cell.row, cell.column + 1).text;
    }

    private getTopCellText(cell: Cell, grid: Grid): string {
        if (cell.row - 1 < 0) {
            return '';
        }
        return grid.cell(cell.row - 1, cell.column).text;
    }

    private pushText(text: Text, texts: Text[]) {
        if (text.start !== null) {
            texts.push(text);
            text = {start: null, text: ''};
        }
        return text;
    }

    private addSymbolToText(text: Text, row: number, column: number, symbol: string) {
        if (text.start === null) {
            text.start = {row: row, column: column};
            text.text = symbol;
        } else {
            text.text += symbol;
        }
    }
}
