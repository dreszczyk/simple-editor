import React, { PureComponent } from 'react';
import styled from 'styled-components';

const LogosWrapper = styled.div`
    display: flex;
    margin-top: 15px;
`;

const LogoHolder = styled.div`
    margin-bottom: 10px;
    text-align: center;
    & button {
        transition: 0.1s opacity, 0.4s transform;
        opacity: 0;
        transform: scale(0.7);
    }
    &:hover button {
        opacity: 1;
        transform: scale(1.0);
    }
`;

const Logo = styled.div`
    width: 60px;
    height: 60px;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
    background-image: url(${props => props.background});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 3px;
    line-height: 60px;
    cursor: move;
`;

const RemoveButton = styled.button`
    font-size: 9px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    text-transform: uppercase;
`;

const Column = styled.div`
    margin: 0 10px;
`;

export class LogoList extends PureComponent {
    onDragEnd (ev) {
        ev.preventDefault();
    }
    render() {
        const leftColumn = [];
        const rightColumn = [];
        this.props.logos.forEach((logo, idx) => {
            const logoElement = (
                <LogoHolder key={`Logo_${logo.imageId}`}>
                    <Logo
                        draggable
                        onDragEnd={this.onDragEnd}
                        onDragStart={(ev) => {
                            ev.dataTransfer.setData('logoData', JSON.stringify(logo));
                        }}
                        background={logo.imageData}
                    />
                    <RemoveButton onClick={() => this.props.onRemoveImage(idx)}>remove<br/>image</RemoveButton>
                </LogoHolder>
            );
            idx % 2 === 0
            ? leftColumn.push(logoElement)
            : rightColumn.push(logoElement);
        })
        return (
            <LogosWrapper>
                <Column>{leftColumn}</Column>
                <Column>{rightColumn}</Column>
            </LogosWrapper>
        );
    }
}
