import {Svg} from "@svgdotjs/svg.js";
import {Entity} from "../entities/entity";
import {BoxEntity} from "../entities/box-entity";
import Constants from "../constants";
import {ArrowEntity} from "../entities/arrow-entity";
import {ArrowDirection} from "../arrow";
import {TextEntity} from "../entities/text-entity";
import {RefObject} from "react";
import {LayerService} from "../layer-service";

export class DiagToSvg {
    private readonly layerService: LayerService;
    private readonly ref: RefObject<HTMLDivElement>;

    constructor(ref: RefObject<HTMLDivElement>, layerService: LayerService) {
        this.ref = ref;
        this.layerService = layerService;
    }

    render(): void {

        const draw = new Svg('#drawing');
        draw.size(Constants.canvasWidth, Constants.canvasHeight);

        this.layerService.entities.forEach((entity: Entity) => {
            if (entity instanceof BoxEntity) {
                const rectWidth = (entity.rightColumn - entity.leftColumn) * Constants.densityX;
                const rectHeight = (entity.bottomRow - entity.topRow) * Constants.densityY;
                const rect = draw.rect(rectWidth, rectHeight).fill('none')
                    .stroke({color: '#333333', width: 1.5});
                rect.center(entity.leftColumn * Constants.densityX + ((entity.rightColumn - entity.leftColumn) / 2) * Constants.densityX,
                    (entity.topRow) * Constants.densityY + ((entity.bottomRow - entity.topRow) / 2) * Constants.densityY);
            } else if (entity instanceof ArrowEntity) {
                const startX = entity.startColumn * Constants.densityX;
                const startY = entity.startRow * Constants.densityY;


                const endX = entity.endColumn * Constants.densityX;
                const endY = entity.endRow * Constants.densityY;

                const midX = entity.startDirection === ArrowDirection.Horizontal ? endX : startX;
                const midY = entity.startDirection === ArrowDirection.Horizontal ? startY : endY;

                const line = draw.polyline([startX, startY, midX, midY, endX, endY]).fill('none')
                    .stroke({color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round'});
            } else if (entity instanceof TextEntity) {
                const startX = (entity.column - 0.5) * Constants.densityX;
                const startY = (entity.row + 0.2) * Constants.densityY;
                draw.text(add => {
                    add.tspan(entity.text)
                }).font({
                    family: 'Courier',
                    size: 16.5,
                }).amove(startX, startY);
            }
        });

        if (this.ref.current) {
            this.ref.current.innerHTML = draw.svg();
        }
    }
}
