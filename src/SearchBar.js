
import React from 'react';
import ResultAlternative from './ResultAlternative';
import './SearchBar.css';

const remote = window.require('@electron/remote');
const LocalDataCollector = window.require('./public/LocalDataCollector.js');
const QuickSort = window.require('./public/QuickSort.js');


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


        var collector = new LocalDataCollector();
        collector.fetchData('C:/Users/', 'public/invalidPaths.txt', (arr) => {
            var qs = new QuickSort(arr, "fileName");
            this.setState({files: qs.sort(0, arr.length - 1)});
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

            if(substring !== searchTerm){
                return i + 1;
            }
        }

        return i + 1;
    }

    binarySearch(arr, objComparator, searchTerm){
        var low = 0;
        var high = arr.length - 1;
        
      
        while(low <= high){
            var middle = Math.floor((low + high) / 2);
            var substring = this.searchSubstring(arr[middle][objComparator], searchTerm.length);
            if(substring === searchTerm){
            
                console.log(substring);
                this.setState({numberOfMatches: 1}, () => {
                    this.resizeBrowserWindow(1);
                });  
    
                return middle;
            } 

            if(substring > searchTerm){
                high = middle - 1;
            }

            if(substring < searchTerm){
                low = middle + 1;
            }
        }

        this.setState({numberOfMatches: 0}, () => {
            this.resizeBrowserWindow(0);
        });
        return -1;
    }
    
        
     
    resizeBrowserWindow(numberOfMatches){
        if(numberOfMatches > 0){
            remote.getCurrentWindow().setMaximumSize(600, 240);
            remote.getCurrentWindow().setMinimumSize(600, 240);
            remote.getCurrentWindow().setSize(600, 240);
        }else{
            remote.getCurrentWindow().setMaximumSize(600, 60);
            remote.getCurrentWindow().setMinimumSize(600, 60);
            remote.getCurrentWindow().setSize(600, 60);
        }
    }

   
    onSearchBarInput(event){
        this.setState({searchTerm: event.target.value}, () => {
            if(event.target.value.length > 0 && this.state.files.length > 0){
                this.setState({searchIndex: this.binarySearch(this.state.files, "fileName", event.target.value)});
            }else{
                this.resizeBrowserWindow(0);
            }
        });
    }


    renderAlts(){
        if(this.state.numberOfMatches > 0){
            return <div className='search-result-container' id="result">

                <ResultAlternative  
                    active={this.state.activeResultAlts[2]} 
                    fileName={this.state.files[this.state.searchIndex].fileName} 
                    isFolder={LocalDataCollector.isDirectory(this.state.files[this.state.searchIndex].path)}
                    fileType={LocalDataCollector.getFileType(this.state.files[this.state.searchIndex].path)} />

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