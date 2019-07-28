import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import MoonLoader from 'react-spinners/MoonLoader';

const Image = styled.img`
    border-radius: 3px;
    margin-top: 20px;
    cursor: pointer;
    opacity: 0.8;
    transition: 0.2s all;
    width: 180px;
    height: 180px;
    border: 1px inset rgba(0,0,0,0.1);
    &:hover {
        opacity: 1.0;
        transform: scale(0.95);
    }
`;

const ErrorText = styled.p`
    margin-top: 20px;
    color: rgba(255, 100, 100, 1);
`;

export class ImagesList extends PureComponent {
    render() {
        const images = this.props.images.map(image => (
            <Image key={`Image_${image.id}`} src={image.urls.custom} onClick={() => { this.props.onSelect(image.id) }} />
        ));
        const error = !this.props.loading ? (
            <ErrorText>No internet connection or API error.</ErrorText>
        ) : '';
        return (
            <Fragment>
                <MoonLoader css={{ margin: '30px auto' }} color="blue" loading={this.props.loading}/>
                {
                    images.length && !this.props.loading
                    ? images
                    : error
                }
            </Fragment>
        );
    }
}
