import React, { PureComponent } from 'react';
import { Button } from './Button';
import {
    convertImgToBase64URL,
    uniqId,
} from '../utils'

export class CanvasPainter extends PureComponent {
    state = {
        canvasElement: {},
    }
    componentDidUpdate() {
        convertImgToBase64URL(
            this.props.imageData.background,
            backgroundB64 => {
                const canvasElement = document.createElement('canvas');
                const canvasContext = canvasElement.getContext('2d');
                const background = new Image();
                canvasElement.width = 400;
                canvasElement.height = 400;
                canvasContext.textBaseline = 'top';
                background.src = backgroundB64;
                background.onload = () => {
                    canvasContext.drawImage(background, 0, 0);
                    this.props.imageData.images.forEach(image => {
                        const proxyImage = new Image();
                        proxyImage.onload = () => {
                            canvasContext.drawImage(
                                proxyImage,
                                image.imagex,
                                image.imagey,
                                image.imagewidth,
                                image.imageheight
                            );
                        };
                        proxyImage.src = image.imageData;
                    });
                    this.props.imageData.texts.forEach(text => {
                        canvasContext.font = `${text.fontSize} ${text.fontFamily}`;
                        canvasContext.fillText(
                            text.value,
                            text.textx,
                            text.texty
                        );
                    });
                    this.setState({
                        canvasElement,
                    })
                }
            }
        )
    }
    render() {
        return (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Button
                    onClick={() => {
                        var link = document.createElement('a');
                        link.setAttribute('download', `YourSimpleProject${uniqId()}.png`);
                        link.setAttribute('href', this.state.canvasElement.toDataURL());
                        link.click();
                    }}
                >
                    Download as image 
                </Button>
            </div>
        );
    }
}
