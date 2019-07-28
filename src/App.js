import React, { Component } from 'react';
import Unsplash, { toJson } from 'unsplash-js';
import LocalStorage from 'localstorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get } from 'lodash';

import {
    Header,
    Layout,
    ImagesList,
    Editor,
    Button,
} from './components';

import {
    updateCanvasImages,
} from './utils';

toast.configure({
    autoClose: 5000,
    draggable: false,
});

const EmptyImage = require('./static/empty_background.png');

const SEStorage = new LocalStorage('SimpleEditor');

const unsplash = new Unsplash({
    applicationId: "7817bc71d67c6a7949afb58046ede25307b3d39b294e02d538eb0da7f0f25b14",
    secret: "078b9d0a5eed0d6ef14cf0da8baedd7c3bcf9d5ee2c73acd56f111a3d1684f59"
});

const emptyImage = {
    id: 'EMPTY',
    urls: {
        custom: EmptyImage,
    }
}

export default class App extends Component {
    state = {
        selectedBackground: emptyImage,
        backgroundsList: [],
        loadingImages: false,
        loadingBackground: false,
        canvasImages: [],
    }
    componentDidMount() {
        if (SEStorage.has('appstate') && get(SEStorage.get('appstate'), '[1].backgroundsList.length', false)) {
            this.setState({ ...SEStorage.get('appstate')[1] })
        } else {
            this.getBackgrounds();
        }
    }
    componentDidUpdate () {
        SEStorage.put('appstate', this.state);
    }
    getBackgrounds = () => {
        this.setState({
            loadingImages: true,
            backgroundsList: [],
        })
        unsplash.photos
            .getRandomPhoto({ width: 180, height: 180, count: 4 })
            .then(toJson)
            .then(backgroundsList => {
                this.setState({
                    backgroundsList,
                    loadingImages: false,
                })
            });
    }
    resetBackground = () => {
        this.setState({ selectedBackground: emptyImage });
    }
    selectBackground = (id) => {
        this.setState({
            loadingBackground: true,
            selectedBackground: {},
        })
        unsplash.photos
            .getPhoto(id, 400, 400 )
            .then(toJson)
            .then(selectedBackground => {
                this.setState({
                    loadingBackground: false,
                    selectedBackground,
                });
            });
    }
    addImageToCanvas = (imageData) => {
        this.setState((state) => ({
            canvasImages: [...state.canvasImages, imageData],
        }));
    }
    onImageDrag = ({ imageId }, dragData) => {
        this.setState({
            canvasImages: updateCanvasImages('drag', this.state.canvasImages, { imageId, ...dragData }),
        })
    }
    onImageScale = ({ imageId }, scaleData) => {
        this.setState({
            canvasImages: updateCanvasImages('scale', this.state.canvasImages, { imageId, ...scaleData }),
        })
    }
    render() {
        return (
            <Layout>
                <Layout.Sidebar>
                    <Header.Small>Select Background</Header.Small>
                    <ImagesList
                        images={this.state.backgroundsList}
                        onSelect={this.selectBackground}
                        loading={this.state.loadingImages}
                    />
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Button onClick={this.getBackgrounds}>
                            New images
                        </Button>
                        <Button onClick={this.resetBackground}>
                            Clear background
                        </Button>
                    </div>
                </Layout.Sidebar>
                <Layout.Editor>
                    <Header>Simple Editor</Header>
                    <Editor
                        loading={this.state.loadingBackground}
                        background={this.state.selectedBackground}
                        onAddImage={this.addImageToCanvas}
                        images={this.state.canvasImages}
                        onDrag={this.onImageDrag}
                        onScale={this.onImageScale}
                    />
                </Layout.Editor>
                <Layout.Sidebar>
                    <Header.Small>Add logo</Header.Small>
                </Layout.Sidebar>
            </Layout>
        );
    }
}
