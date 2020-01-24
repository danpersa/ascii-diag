import {ConnectorTipDirectionService} from "../../connector-tip-direction-service";

export let ConnectorTipDirectionServiceMock = jest.fn<ConnectorTipDirectionService, []>(() => ({
    startTipDirection: jest.fn(),
    endTipDirection: jest.fn()
}));
