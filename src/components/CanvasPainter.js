import React, { PureComponent } from 'react';
import { Button } from './Button';
import {
    convertImgToBase64URL,
    uniqId,
} from '../utils'

export class CanvasPainter extends PureComponent {
    paintAndSave = () => {
        convertImgToBase64URL(
            this.props.imageData.background,
            backgroundB64 => {
                const canvasElement = document.createElement('canvas');
                const canvasContext = canvasElement.getContext('2d');
                const background = new Image();
                const link = document.createElement('a');
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
                        canvasContext.fillStyle = text.color;  //<======= here
                        canvasContext.fillText(
                            text.value,
                            text.textx,
                            text.texty
                        );
                    });
                    
                    link.setAttribute('download', `YourSimpleProject${uniqId()}.png`);
                    link.setAttribute('href', canvasElement.toDataURL());
                    link.click();
                }
            }
        )
    }
    render() {
        return (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Button onClick={this.paintAndSave}>
                    Download as image 
                </Button>
            </div>
        );
    }
}
