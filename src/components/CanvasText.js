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

const RndText = styled.div`
    pointer-events: none;
    user-select: none;
`;

export class CanvasText extends PureComponent {
    render() {
        const { fontFamily, color, fontSize, value, texty, textx } = this.props;
        return (
            <RndStyled
                default={{ x: textx, y: texty }}
                bounds="#editor"
                enableResizing={false}
                onDragStop={(ev, dragData) => this.props.onDrag(this.props, dragData)}
            >
                <RndText style={{ fontSize, color, fontFamily }}>
                    {value}
                </RndText>

            </RndStyled>
        );
    }
}
