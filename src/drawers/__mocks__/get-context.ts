import Has2DContext from "../../has-2d-context";

export function mockGetContext(object: Has2DContext): CanvasRenderingContext2D {
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 400;
    canvas.height = 300;
    jest.spyOn(object, "getContext").mockImplementation(() => {
        return ctx;
    });
    return ctx;
}

