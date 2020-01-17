import {Shape} from "./shapes/shape";
import Grid from "./drawers/grid";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";
import {GridDrawerFactory} from "./drawers/drawer-factory";

export class ShapeToGridMapper {

    private readonly arrowTipDirectionService: ArrowTipDirectionService;
    private readonly gridDrawerFactory: GridDrawerFactory;

    constructor(arrowTipDirectionService: ArrowTipDirectionService) {
        this.arrowTipDirectionService = arrowTipDirectionService;
        this.gridDrawerFactory = new GridDrawerFactory(this.arrowTipDirectionService);
    }

    addShapeToGrid(shape: Shape, grid: Grid): void {
        const drawer = this.gridDrawerFactory.create4(shape, grid);
        drawer.draw(shape);
    }
}
