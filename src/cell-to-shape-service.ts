import {ShapeUpdateEvent, ShapeUpdateListener} from "./shape-update-notification-service";
import {Shape} from "./shapes/shape";
import {TextShape} from "./shapes/text-shape";
import {ArrayTextDrawer} from "./drawers/text-drawer";
import {BoxShape} from "./shapes/box-shape";
import {ArrayBoxDrawer} from "./drawers/box-drawer";
import {ArrowShape} from "./shapes/arrow-shape";
import {ArrayArrowDrawer} from "./drawers/arrow-drawer";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";
import {Domain} from "./drawers/cell";
import {LayerService} from "./layer-service";
import Cell = Domain.Cell;

export class CellToShapeService implements ShapeUpdateListener {

    private readonly shapeMatrix: Array<Array<Shape | undefined>> = [];
    private readonly arrowTipDirectionService: ArrowTipDirectionService;
    private readonly layerService: LayerService;
    private readonly rows: number;
    private readonly columns: number;

    constructor(rows: number, columns: number,
                arrowTipDirectionService: ArrowTipDirectionService,
                layerService: LayerService) {
        this.arrowTipDirectionService = arrowTipDirectionService;
        this.layerService = layerService;
        this.rows = rows;
        this.columns = columns;
        this.reset(rows, columns);
        this.initFromLayers();
    }

    private reset(rows: number, columns: number) {
        this.shapeMatrix.splice(0, rows);
        for (let row = 0; row < rows; row++) {
            this.shapeMatrix.push([]);
            for (let column = 0; column < columns; column++) {
                this.shapeMatrix[row].push(undefined);
            }
        }
    }

    private initFromLayers() {
        this.reset(this.rows, this.columns);
        this.layerService.shapes.forEach((shape: Shape) => {
            this.update(ShapeUpdateEvent.CREATED, shape);
        });
    }

    getShape(row: number, column: number): Shape | undefined {
        return this.shapeMatrix[row][column];
    }

    update(event: ShapeUpdateEvent, shape: Shape): void {
        if (event === ShapeUpdateEvent.DELETED || event === ShapeUpdateEvent.UPDATED) {
            this.initFromLayers();
            return;
        }
        if (shape && shape instanceof TextShape) {
            const textDrawer = new ArrayTextDrawer();
            textDrawer.draw(shape);
            this.addShapeToMatrix(textDrawer.cells, shape);
        } else if (shape && shape instanceof BoxShape) {
            const boxDrawer = new ArrayBoxDrawer();
            boxDrawer.draw(shape);
            this.addShapeToMatrix(boxDrawer.cells, shape);
        } else if (shape && shape instanceof ArrowShape) {
            const arrowDrawer = new ArrayArrowDrawer(this.arrowTipDirectionService);
            arrowDrawer.draw(shape);
            this.addShapeToMatrix(arrowDrawer.cells, shape);
        } else {
            throw new Error("No drawer for shape");
        }
    }

    private addShapeToMatrix(cells: Array<Cell>, shape: Shape) {
        cells.forEach((cell: Cell) => {
            // should only do this if cell is on top
            this.shapeMatrix[cell.row][cell.column] = shape;
        });
    }
}
