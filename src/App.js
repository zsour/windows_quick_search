import React from 'react';

import './App.css';
import SearchBar from './SearchBar';

const fs = window.require('fs');
const pathModule = window.require('path');

const remote = window.require('@electron/remote');


class App extends React.Component{

    constructor(props){
        super(props);
        this.positionWindow();
    }

    componentDidMount(){
  
    }


    positionWindow(){
        var screenSize = remote.screen.getPrimaryDisplay().workAreaSize;
        var screenWidth = screenSize.width;
        var screenHeight = screenSize.height; 

        remote.getCurrentWindow().setPosition(Math.floor(screenWidth/2) - 400, Math.floor(screenHeight/6));
        remote.getCurrentWindow().close();
    }

    render(){
        return <div className="content" id="content"> 
            <SearchBar />
        </div>;
    }
}

export default App;