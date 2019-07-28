import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import MoonLoader from 'react-spinners/MoonLoader';
import FileDrop from 'react-file-drop';
import { toast } from 'react-toastify';
import { CanvasImage } from './CanvasImage'

const Wrapper = styled.div`
    margin: 20px auto 0;
    width: 400px;
    height: 400px;
    border-radius: 3px;
    background-image: url(${props => props.background});
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 400px;
`;

export class Editor extends PureComponent {
    handleDrop = ([file]) => {
        if (
            ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
        ) {
            const imageId = '_' + Math.random().toString(36).substr(2, 9);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.props.onAddImage({
                    imageId,
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
        const loader = this.props.loading ? (
            <LoaderWrapper>
                <div>
                    <MoonLoader size={40} loading={true}/>
                </div>
            </LoaderWrapper>
        ) : '';
        return (
            <FileDrop
                onDrop={this.handleDrop}
            >
                <Wrapper background={get(this.props, 'background.urls.custom', '')}>
                    {loader}
                    {this.props.images.map(image => (
                        <CanvasImage
                            key={image.imageId}
                            {...image}
                            onDrag={this.props.onDrag}
                            onScale={this.props.onScale}
                        />
                    ))}
                </Wrapper>
            </FileDrop>
        );
    }
}
