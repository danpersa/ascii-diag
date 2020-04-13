import * as React from "react";
import {RefObject} from "react";
import {Constants} from "ascii-diag-renderer";

type DiagCanvasProps = {
    canvasRef: RefObject<HTMLCanvasElement>,
}

export default class DiagCanvas extends React.Component<DiagCanvasProps> {

    constructor(props: DiagCanvasProps) {
        super(props);
    }

    componentDidMount() {
        console.log("Diag Canvas mounted!");

    }

    render() {
        return (
            <div>
                <canvas ref={this.props.canvasRef}
                        width={Constants.canvasWidth}
                        height={Constants.canvasHeight}/>
            </div>
        )
    }
}
