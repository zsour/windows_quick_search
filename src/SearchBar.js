
import React from 'react';
import ResultAlternative from './ResultAlternative';
import './SearchBar.css';

const remote = window.require('@electron/remote');

class SearchBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {searchTerm: '', activeResultAlts: [false, true, false]};
        
    }


    isFolder(str){
      
    }

    componentDidMount(){
        var searchbar =  document.getElementById('search-bar');
    
        window.addEventListener('focus', () => {
            searchbar.focus();  
        });

        window.addEventListener('blur', () => {
        
            this.setState({searchTerm: ''}, this.resizeBrowserWindow);
            setTimeout(() => {
                remote.getCurrentWindow().close();
            }, 10);
            
            
        });
    }
    
        
     
    resizeBrowserWindow(){
        if(this.state.searchTerm.length > 0){

            remote.getCurrentWindow().setMaximumSize(800, 240);
            remote.getCurrentWindow().setMinimumSize(800, 240);
            remote.getCurrentWindow().setSize(800, 240);
        }else{
            remote.getCurrentWindow().setMaximumSize(800, 60);
            remote.getCurrentWindow().setMinimumSize(800, 60);
            remote.getCurrentWindow().setSize(800, 60);
        }
    }

   
    onSearchBarInput(event){
        this.setState({searchTerm: event.target.value}, this.resizeBrowserWindow);
    }

    generateResultAlternative(){
       
    }


    render(){
        return <div className="search-bar-container">
            <input type="text" id="search-bar" spellCheck="false" value={this.state.searchTerm} onChange={(e) => {
                this.onSearchBarInput(e);
            }}/>

            <span id="search-icon"></span>
            <div className='search-result-container' id="result">
                <ResultAlternative  active={this.state.activeResultAlts[0]}/>
                <ResultAlternative  active={this.state.activeResultAlts[1]}/>
                <ResultAlternative  active={this.state.activeResultAlts[2]}/>
            </div>
            
        </div>;
    } 
}



export default SearchBar;