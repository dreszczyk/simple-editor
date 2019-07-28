import React, { PureComponent } from 'react';
import styled from 'styled-components';
import FileDrop from 'react-file-drop';
import { toast } from 'react-toastify';
import { uniqId } from '../utils';

const FileDropStyled = styled(FileDrop)`
    .file-drop-target {
        width: 100%;
        padding: 20px 15px;
        text-align: center;
        font-style: italic;
        box-sizing: border-box;
        border: 1px dashed #ccc;
        border-radius: 5px;
        transition: 0.3s all;
        user-select: none;
        &.file-drop-dragging-over-frame {
            border: 1px solid #000;
        }
        &.file-drop-dragging-over-target {
            background: #b7e0f5;
        }
    }
`;

export class LogoDrop extends PureComponent {
    handleDrop = ([file]) => {
        if (
            ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
        ) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.props.onAddImage({
                    imageId: uniqId(),
                    imageData: reader.result,
                    imagey: 0,
                    imagex: 0,
                    imagewidth: 100,
                    imageheight: 100,
                })
                toast(`Image added successfully`, { type: 'success' });
            };
            reader.onerror = function (error) {
                toast(`Error: ${error}`, { type: 'error' });
            };
        } else {
            toast(`File is not an image`, { type: 'warning' });
        }
    }
    render() {
        return (
            <FileDropStyled onDrop={this.handleDrop}>
                <p>Drag&Drop your image file here</p>
            </FileDropStyled>
        );
    }
}