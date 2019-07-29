import React, { Component } from 'react';
import Unsplash, { toJson } from 'unsplash-js';
import LocalStorage from 'localstorage';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import 'react-toastify/dist/ReactToastify.css';
import 'react-contexify/dist/ReactContexify.min.css';

import {
    Header,
    Layout,
    BackgroundsList,
    Editor,
    Button,
    LogoList,
    LogoDrop,
} from './components';

import {
    updateCanvasImages,
    removeCanvasImage,
} from './utils';

toast.configure({
    autoClose: 3000,
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
        activeCanvasImages: [],
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
    // adding image from desktop to sidebar
    addImageToList = (imageData) => {
        this.setState((state) => ({
            canvasImages: [...state.canvasImages, imageData],
        }));
    }
    // adding image from sidebar to canvas
    addImageToActiveList = (imageData) => {
        this.setState((state) => ({
            activeCanvasImages: [...state.activeCanvasImages, imageData],
        }));
    }
    // removing image from canvas (contesxt menu)
    removeImageFromActiveList = (idx) => {
        this.setState((state) => ({
            activeCanvasImages: removeCanvasImage(state.activeCanvasImages, idx)
        }), () => {
            console.log('this.state', this.state)
        });
    }
    // handle image drag on canvas
    onImageDrag = ({ imageId }, dragData) => {
        this.setState({
            activeCanvasImages: updateCanvasImages('drag', this.state.activeCanvasImages, { imageId, ...dragData }),
        })
    }
    // handle scale drag on canvas
    onImageScale = ({ imageId }, scaleData) => {
        this.setState({
            activeCanvasImages: updateCanvasImages('scale', this.state.activeCanvasImages, { imageId, ...scaleData }),
        })
    }

    removeImageFromList = (idx) => {
        this.setState((state) => ({
            canvasImages: removeCanvasImage(state.canvasImages, idx)
        }))
    }
    render() {
        return (
            <Layout>
                <Layout.Sidebar>
                    <Layout.SidebarContent>
                        <Header.Small>Select Background</Header.Small>
                        <BackgroundsList
                            backgrounds={this.state.backgroundsList}
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
                    </Layout.SidebarContent>
                </Layout.Sidebar>
                <Layout.Editor>
                    <Header>Simple Editor</Header>
                    <Editor
                        loading={this.state.loadingBackground}
                        background={this.state.selectedBackground}
                        images={this.state.activeCanvasImages}
                        onDrag={this.onImageDrag}
                        onScale={this.onImageScale}
                        addImageToActiveList={this.addImageToActiveList}
                        removeImageFromActiveList={this.removeImageFromActiveList}
                    />
                </Layout.Editor>
                <Layout.Sidebar>
                    <Layout.SidebarContent>
                        <Header.Small>Add logo</Header.Small>
                        <LogoList
                            logos={this.state.canvasImages}
                            onRemoveImage={this.removeImageFromList}
                        />
                        <LogoDrop onAddImage={this.addImageToList}/>
                    </Layout.SidebarContent>
                    <Layout.SidebarContent>
                        <Header.Small>Add Text</Header.Small>
                    </Layout.SidebarContent>
                </Layout.Sidebar>
            </Layout>
        );
    }
}
