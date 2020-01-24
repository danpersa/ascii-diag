import {ArrowTipDirectionService} from "../../arrow-tip-direction-service";

export let ArrowTipDirectionServiceMock = jest.fn<ArrowTipDirectionService, []>(() => ({
    startTipDirection: jest.fn(),
    endTipDirection: jest.fn()
}));
