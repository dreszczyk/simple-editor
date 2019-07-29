import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { Menu, Item, MenuProvider } from 'react-contexify';
import MoonLoader from 'react-spinners/MoonLoader';
import { CanvasImage } from './CanvasImage'
import { preloadImage, uniqId, throttleEventHandler } from '../utils'
import { CanvasText } from './CanvasText';
import { CanvasPainter } from './CanvasPainter';

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
        dropPositionX: 0,
        dropPositionY: 0,
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
        imageData.imagex = this.state.dropPositionX;
        imageData.imagey = this.state.dropPositionY;
        this.addCopyOfImage(imageData)
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
    duplicateText = (textData) => {
        textData.textx = textData.textx + 10;
        textData.texty = textData.texty + 10;
        this.addCopyOfText(textData);
    }
    addCopyOfText = (textData) => {
        const newText = Object.assign({}, textData);
        newText.textId = uniqId();
        this.props.addTextToActiveList(newText);
    }
    mapImages = (image, idx) => (
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
                    onDrag={this.props.onImageDrag}
                    onScale={this.props.onImageScale}
                />
            </MenuProvider>
        </Fragment>
    )
    mapTexts = (text, idx) => (
        <Fragment key={text.textId}>
            <Menu id={`Menu_${text.textId}`}>
                <Item onClick={() => this.props.removeTextFromActiveList(idx)}>
                    Remove text
                </Item>
                <Item onClick={() => this.duplicateText(text)}>
                    Duplicate text
                </Item>
            </Menu>
            <MenuProvider id={`Menu_${text.textId}`}>
                <CanvasText
                    {...text}
                    onDrag={this.props.onTextDrag}
                />
            </MenuProvider>
        </Fragment>
    )
    render() {
        const loader = this.props.loading || this.state.loadingPhoto ? (
            <LoaderWrapper>
                <div>
                    <MoonLoader size={40} loading={true}/>
                </div>
            </LoaderWrapper>
        ) : '';
        const backgroundImage = get(this.props, 'background.urls.custom', '');
        return (
            <Fragment>
                <Wrapper
                    id="editor"
                    background={backgroundImage}
                    onDrop={this.onDrop}
                    onDragOver={
                        throttleEventHandler((ev) => {
                            ev.persist();
                            const editor = document.getElementById('editor'); 
                            const posX = ev.pageX - editor.offsetLeft;
                            const posY = ev.pageY - editor.offsetTop;
                            this.setState({
                                dropPositionX: posX - 50, // default image is 100x100px
                                dropPositionY: posY - 50,
                            })
                        }, 100)
                    }
                >
                    {loader}
                    {this.props.images.map(this.mapImages)}
                    {this.props.texts.map(this.mapTexts)}
                </Wrapper>
                <CanvasPainter
                    imageData={{
                        background: backgroundImage,
                        images: this.props.images,
                        texts: this.props.texts,
                    }}
                />
            </Fragment>
        );
    }
}
