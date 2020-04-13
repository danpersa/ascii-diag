import {Shape} from "./shape";
import {Connector, ConnectorTipStyle, ConnectorType, GridPoint, LineStyle} from "../entities/connector";

export class ConnectorShape extends Connector implements Shape {

    private readonly _id: number;
    private _editing: boolean = false;

    static createShape(id: number,
                       connectorType: ConnectorType,
                       lineStyle: LineStyle = LineStyle.Continuous,
                       horizontalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                       verticalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat): ConnectorShape {
        return new ConnectorShape(id, connectorType, lineStyle, horizontalTipStyle, verticalTipStyle);
    }

    static createShapeByStartPoints(id: number,
                                    horizontalEdgeStartPoint: GridPoint,
                                    intersectionPoint: GridPoint,
                                    verticalEdgeStartPoint: GridPoint,
                                    lineStyle: LineStyle = LineStyle.Continuous,
                                    horizontalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                                    verticalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat): ConnectorShape {
        const connector = Connector.createByStartPoints(horizontalEdgeStartPoint, intersectionPoint, verticalEdgeStartPoint, lineStyle, horizontalTipStyle, verticalTipStyle);
        return new ConnectorShape(id, connector.connectorType, lineStyle, horizontalTipStyle, verticalTipStyle);
    }

    constructor(id: number,
                connectorType: ConnectorType,
                lineStyle: LineStyle = LineStyle.Continuous,
                horizontalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                verticalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                editing: boolean = false) {

        super(connectorType, lineStyle, horizontalTipStyle, verticalTipStyle);
        this._id = id;
        this._editing = editing;
    }

    id(): number {
        return this._id;
    }

    editing(): boolean {
        return this._editing;
    }

    endEditing(): void {
        this._editing = false;
    }

    startEditing(): void {
        this._editing = true;
    }
}

export namespace ConnectorShape {
    export class ShapeBuilder extends Connector.Builder {
        protected _id: number;
        protected _editing: boolean = false;

        protected constructor(id: number,
                              connectorType: ConnectorType,
                              lineStyle: LineStyle,
                              horizontalTipStyle: ConnectorTipStyle,
                              verticalTipStyle: ConnectorTipStyle,
                              editing: boolean = false) {
            super(connectorType, lineStyle, horizontalTipStyle, verticalTipStyle);
            this._id = id;
            this._editing = editing;
        }

        static from(connectorShape: ConnectorShape): ShapeBuilder {
            return new ShapeBuilder(
                connectorShape.id(),
                connectorShape.connectorType,
                connectorShape.lineStyle,
                connectorShape.horizontalTipStyle,
                connectorShape.verticalTipStyle,
                connectorShape.editing());
        }

        build(): ConnectorShape {
            return new ConnectorShape(
                this._id,
                this._connectorType,
                this._lineStyle,
                this._horizontalTipStyle,
                this._verticalTipStyle,
                this._editing
            );
        }

        id(value: number) {
            this._id = value;
            return this;
        }

        editing(value: boolean) {
            this._editing = value;
            return this;
        }
    }
}
