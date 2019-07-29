import React, { PureComponent } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const RndStyled = styled(Rnd)`
    transition: 0.5s background-color, 0.1s box-shadow;
    &:hover {
        background-color: rgba(190, 190, 190, 0.3);
        box-shadow: inset 0 0 0 2px white;
    }
`;

const RndImage = styled.img`
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

export class CanvasImage extends PureComponent {
    render() {
        const { imageData, imagex, imagey, imagewidth, imageheight } = this.props;
        return (
            <RndStyled
                default={{
                    x: imagex,
                    y: imagey,
                    width: imagewidth,
                    height: imageheight,
                }}
                bounds="#editor"
                lockAspectRatio
                onDragStop={(ev, dragData) => this.props.onDrag(this.props, dragData)}
                onResizeStop={(ev, scaleData2, scaleData3, scaleData) => this.props.onScale(this.props, scaleData)}
            >
                <RndImage src={imageData} alt="" />
            </RndStyled>
        );
    }
}
