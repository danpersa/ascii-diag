import {ArrowTipDirectionService} from "../../arrow-tip-direction-service";

export let ArrowTipDirectionServiceMock = jest.fn<ArrowTipDirectionService, []>(() => ({
    endTipDirection: jest.fn()
}));
