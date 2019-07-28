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
    max-width: 100%;
    max-height: 100%;
    pointer-events: none;
`;

export class CanvasImage extends PureComponent {
    render() {
        const { image } = this.props;
        return (
            <RndStyled
                default={{
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                }}
                bounds="parent"
                lockAspectRatio
            >
                <RndImage src={image} alt="" />
            </RndStyled>
        );
    }
}
