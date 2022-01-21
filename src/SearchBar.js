
import isWindows from 'cross-env/src/is-windows';
import React from 'react';
import ResultAlternative from './ResultAlternative';
import './SearchBar.css';

const fs = window.require('fs');
const remote = window.require('@electron/remote');
const LocalDataCollector = window.require('./public/LocalDataCollector.js');
const QuickSort = window.require('./public/QuickSort.js');
const childProcess = window.require('child_process');

class SearchBar extends React.Component{

    constructor(props){
        super(props);

        this.state = {searchTerm: '', activeResultAlts: [false, false, false], files: [], matchFound: false, numberOfMatches: 0, searchIndex: -1};
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

        window.addEventListener('keypress', (e) => {
            if(e.code == "Enter"){
                if(this.state.numberOfMatches > 0 && this.state.searchIndex != -1){
                    console.log("Opens");
                    childProcess.exec('start "" "' + this.state.files[this.state.searchIndex].path + '"');
                }
            }
        });


        var collector = new LocalDataCollector();
        collector.fetchData('C:/Users/', 'public/invalidPaths.txt', (arr) => {
            var qs = new QuickSort(arr, undefined, (obj) => {
                return obj.fileName.toUpperCase();
            });
            this.setState({files: qs.sort(0, arr.length - 1)}, () => {
                console.log(this.state.files);
            });
        });
    }

    searchSubstring(str, len){
        return str.substring(0, len);
    }

    findNumberOfMatches(lowIndex, objComparator, searchTerm){
        var tmp = 0;
        var substring = this.searchSubstring(this.state.files[lowIndex][objComparator], searchTerm.length);
        for(var i = 0; i < this.state.files.length; i++){
            var substring = this.searchSubstring(this.state.files[lowIndex + i][objComparator], searchTerm.length);

            if(substring.toLowerCase() !== searchTerm.toLowerCase()){
                return i + 1;
            }
        }

        return i + 1;
    }

    findFirstMatch(middleIndex, objComparator, searchTerm){
        var i = middleIndex;
        var substring = this.searchSubstring(this.state.files[i][objComparator], searchTerm.length);
 
        while(searchTerm.toLowerCase() == substring.toLowerCase()){
            i--;
            substring = this.searchSubstring(this.state.files[i][objComparator], searchTerm.length);
        }

        i++;

        return i;
    }

    binarySearch(arr, objComparator){
        var low = 0;
        var high = arr.length - 1;
        
      
        while(low <= high){
            var middle = Math.floor((low + high) / 2);
            var substring = this.searchSubstring(arr[middle][objComparator], this.state.searchTerm.length);
    

            if(substring.toLowerCase() == this.state.searchTerm.toLowerCase()){
                
                var firstMatch = this.findFirstMatch(middle, "fileName", this.state.searchTerm);
                var numberOfMatches = this.findNumberOfMatches(firstMatch, "fileName", this.state.searchTerm.toLowerCase());
               
                if(numberOfMatches != this.state.numberOfMatches){
                    this.setState({numberOfMatches: numberOfMatches, searchIndex: firstMatch}, () => {
                        this.resizeBrowserWindow(numberOfMatches);
                    });  
                }
                
    
                return firstMatch;
            } 

            if(substring.toLowerCase() > this.state.searchTerm.toLowerCase()){
                high = middle - 1;
            }

            if(substring.toLowerCase() < this.state.searchTerm.toLowerCase()){
                low = middle + 1;
            }
        }

        this.setState({numberOfMatches: 0}, () => {
            this.resizeBrowserWindow(0);
        });
        return -1;
    }
    
        
     
    resizeBrowserWindow(numberOfMatches = 0){
        if(numberOfMatches > 0){
            if(numberOfMatches > 3){
                remote.getCurrentWindow().setMaximumSize(600, 380);
                remote.getCurrentWindow().setMinimumSize(600, 380);
                remote.getCurrentWindow().setSize(600, 380);
            }else{
                remote.getCurrentWindow().setMaximumSize(600, 60 + (numberOfMatches) * 80);
                remote.getCurrentWindow().setMinimumSize(600, 60 + (numberOfMatches) * 80);
                remote.getCurrentWindow().setSize(600, 60 + (numberOfMatches) * 80);
            }   
        }else{
            remote.getCurrentWindow().setMaximumSize(600, 60);
            remote.getCurrentWindow().setMinimumSize(600, 60);
            remote.getCurrentWindow().setSize(600, 60);
        }
    }

   
    onSearchBarInput(event){
        this.setState({searchTerm: event.target.value}, () => {
            if(event.target.value.length > 0 && this.state.files.length > 0){
                this.setState({searchIndex: this.binarySearch(this.state.files, "fileName", this.state.searchTerm)});
            }else{
                this.setState({searchIndex: '', matchFound: false, numberOfMatches: 0, searchIndex: -1});
                this.resizeBrowserWindow(0);
            }
        });
    }


    renderAlts(){
        if(this.state.numberOfMatches > 0){
            return <div className='search-result-container' id="result">

                <ResultAlternative  
                    active={this.state.activeResultAlts[0]} 
                    fileName={this.state.files[this.state.searchIndex].fileName} 
                    isFolder={LocalDataCollector.isDirectory(this.state.files[this.state.searchIndex].path)}
                    fileType={LocalDataCollector.getFileType(this.state.files[this.state.searchIndex].path)} 
                    path={this.state.files[this.state.searchIndex].path}/>

                <ResultAlternative  
                    active={this.state.activeResultAlts[1]} 
                    fileName={this.state.files[this.state.searchIndex + 1].fileName} 
                    isFolder={LocalDataCollector.isDirectory(this.state.files[this.state.searchIndex + 1].path)}
                    fileType={LocalDataCollector.getFileType(this.state.files[this.state.searchIndex + 1].path)} 
                    path={this.state.files[this.state.searchIndex + 1].path}/>


                <ResultAlternative  
                    active={this.state.activeResultAlts[2]} 
                    fileName={this.state.files[this.state.searchIndex + 2].fileName} 
                    isFolder={LocalDataCollector.isDirectory(this.state.files[this.state.searchIndex + 2].path)}
                    fileType={LocalDataCollector.getFileType(this.state.files[this.state.searchIndex + 2].path)} 
                    path={this.state.files[this.state.searchIndex + 2].path}/>

                <ResultAlternative  
                    active={this.state.activeResultAlts[3]} 
                    fileName={this.state.files[this.state.searchIndex + 3].fileName} 
                    isFolder={LocalDataCollector.isDirectory(this.state.files[this.state.searchIndex + 3].path)}
                    fileType={LocalDataCollector.getFileType(this.state.files[this.state.searchIndex + 3].path)} 
                    path={this.state.files[this.state.searchIndex + 3].path}/>
            </div>
        }
    }

    render(){
        return <div className="search-bar-container">
            <input type="text" id="search-bar" spellCheck="false" value={this.state.searchTerm} onChange={(e) => {
                this.onSearchBarInput(e);
            }}/>

            <span id="search-icon"></span>

            {this.renderAlts()}
            
        </div>;
    } 
}



export default SearchBar;