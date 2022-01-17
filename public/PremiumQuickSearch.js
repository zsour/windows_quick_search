const LocalDataCollector = require('./LocalDataCollector');

class PremiumQuickSearch{
    constructor(){
   
    }


    watchForUpdates(){

    }

    getData(){
        return this.files;
    }

    dataReady(){
        console.log(this.files);
        if(this.files.length > 0){
            return true;
        }

        return false;
    }

}

var searcher = new PremiumQuickSearch();

var arr = searcher.getData();
console.log(arr);