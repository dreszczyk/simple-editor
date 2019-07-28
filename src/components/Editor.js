import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import MoonLoader from 'react-spinners/MoonLoader';
import { CanvasImage } from './CanvasImage'
import { preloadImage, uniqId } from '../utils'

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
    state = {
        loadingPhoto: false,
    }
    componentDidUpdate(prevProps) {
        if (prevProps.loading && !this.props.loading) {
            // preloading image
            this.setState({
                loadingPhoto: true,
            }, () => {
                preloadImage(
                    this.props.background.urls.custom,
                    this.finishPreloading
                );
            });
        }
    }
    finishPreloading = () => {
        this.setState({
            loadingPhoto: false,
        });
    }
    onDrop = (ev) => {
        ev.preventDefault();
        const imageData = JSON.parse(ev.dataTransfer.getData('logoData'));
        imageData.imageId = uniqId();
        this.props.addImageToActiveList(imageData);
    }
    render() {
        const loader = this.props.loading || this.state.loadingPhoto ? (
            <LoaderWrapper>
                <div>
                    <MoonLoader size={40} loading={true}/>
                </div>
            </LoaderWrapper>
        ) : '';
        return (
            <Wrapper
                background={get(this.props, 'background.urls.custom', '')}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
            >
                {loader}
                {this.props.images.map((image, idx) => (
                    <CanvasImage
                        key={image.imageId}
                        imageIndex={idx}
                        {...image}
                        removeImageFromActiveList={this.props.removeImageFromActiveList}
                        onDrag={this.props.onDrag}
                        onScale={this.props.onScale}
                    />
                ))}
            </Wrapper>
        );
    }
}
