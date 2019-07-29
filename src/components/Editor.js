import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { Menu, Item, MenuProvider } from 'react-contexify';
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
        this.addCopyOfImage(JSON.parse(ev.dataTransfer.getData('logoData')))
    }
    duplicateImage = (imageData) => {
        imageData.imagex = imageData.imagex + 10;
        imageData.imagey = imageData.imagey + 10;
        this.addCopyOfImage(imageData);
    }
    addCopyOfImage = (imageData) => {
        const newImage = Object.assign({}, imageData);
        newImage.imageId = uniqId();
        this.props.addImageToActiveList(newImage);
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
                id="editor"
                background={get(this.props, 'background.urls.custom', '')}
                onDrop={this.onDrop}
                // onMouseMove={(ev) => {
                //     console.log('ev', ev);
                //     console.log('ev.movementX', ev.movementX);
                // }}
            >
                {loader}
                {this.props.images.map((image, idx) => (
                    <Fragment key={image.imageId}>
                        <Menu id={`Menu_${image.imageId}`}>
                            <Item onClick={() => this.props.removeImageFromActiveList(idx)}>
                                Remove image
                            </Item>
                            <Item onClick={() => this.duplicateImage(image)}>
                                Duplicate image
                            </Item>
                        </Menu>
                        <MenuProvider id={`Menu_${image.imageId}`}>
                            <CanvasImage
                                {...image}
                                onDrag={this.props.onDrag}
                                onScale={this.props.onScale}
                            />
                        </MenuProvider>
                    </Fragment>
                ))}
            </Wrapper>
        );
    }
}
