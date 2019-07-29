import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Button } from './Button';
import { uniqId } from '../utils';

const Wrapper = styled.div`
`;

const TextInput = styled.textarea`
    margin-top: 25px;
    box-sizing: border-box;
    border-radius: 3px;
    padding: 10px;
    height: 100px;
    width: 100%;
`;

const OptionsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: -5px;
    justify-content: space-between;
    button {
        font-size: 11px;
        margin-left: 5px;
    }
`;

const defaultState = {
    fontFamily: 'Arial',
    fontSize: '20px',
    color: 'black',
    value: '',
    texty: 0,
    textx: 0,
};

const sizes = [
    '20px',
    '30px',
    '40px',
];

const fonts = [
    { name: 'Arial', fullName: 'Arial'},
    { name: 'Times', fullName: 'Times New Roman'},
    { name: 'Open Sans', fullName: 'Open Sans'},
];

export class AddTextForm extends PureComponent {
    state = defaultState
    updateText = ({ target: { value }}) => {
        this.setState({ value })
    }
    updateSize = (fontSize) => {
        this.setState({ fontSize })
    }
    updateFont = (fontFamily) => {
        this.setState({ fontFamily })
    }
    handleAddText = () => {
        if (this.state.value !== '') {
            this.props.onAddText(
                Object.assign(
                    this.state,
                    { textId: uniqId() }
                )
            );
            this.setState({ value: '' });
            toast(`Text added`, { type: 'success' });
        } else {
            toast(`Text field is empty`, { type: 'warning' });
        }
    }
    getSizeButtons = size => {
        const ButtonComponent = size === this.state.fontSize
            ? Button.Primary
            : Button;
        return  (
            <ButtonComponent
                key={`ButtonTextSize_${size}`}
                onClick={() => this.updateSize(size)}
            >
                {size}
            </ButtonComponent>
        )
    }
    getFontFamilyButtons = ({name, fullName}) => {
        const ButtonComponent = fullName === this.state.fontFamily
            ? Button.Primary
            : Button;
        return  (
            <ButtonComponent
                key={`ButtonTextSize_${name}`}
                onClick={() => this.updateFont(fullName)}
                style={{ fontFamily: fullName }}
            >
                {name}
            </ButtonComponent>
        )
    }
    render() {
        return (
            <Wrapper>
                <TextInput
                    style={{
                        fontFamily: this.state.fontFamily,
                        fontSize: this.state.fontSize,
                        color: this.state.color,
                    }}
                    value={this.state.value}
                    onChange={this.updateText}
                />
                <OptionsWrapper>
                    {sizes.map(this.getSizeButtons)}
                </OptionsWrapper>
                <OptionsWrapper>
                    {fonts.map(this.getFontFamilyButtons)}
                </OptionsWrapper>
                <Button.Primary
                    onClick={this.handleAddText}
                >
                    Add text
                </Button.Primary>
            </Wrapper>
        );
    }
}
