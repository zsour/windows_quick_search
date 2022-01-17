import React from 'react';

class ResultAlternative extends React.Component{

    constructor(props){
        super(props);
    }

    getIcon(){
        if(this.props.isFolder){
            return  <span className="search-result-icon folder"></span>;
        }else{
            var fileType = this.props.fileType;
            switch(fileType){
                case "exe": return  <span className="search-result-icon exe"></span>;
            
                case "pdf": return  <span className="search-result-icon pdf"></span>;
                

                default: return  <span className="search-result-icon file"></span>;
                
            }

        }
    }

    render(){ 
        return <div className='search-result-alt'>
            <span className="search-result-custom-border">
                <span className='rainbow-animation'></span>
            </span>
            
            <p className="search-result-file-name">
                {this.getIcon()}
                {this.props.fileName}
            </p>
        </div>;
    }

}


export default ResultAlternative;



