const { resolve } = require('path');
const { readdir, readFile, writeFile } = require('fs').promises;
const QuickSort = require('./QuickSort');



class LocalDataCollector{
  getFileName(path){
    var tmp = path.split('\\');
    return tmp[tmp.length - 1];
  }

  getDirPriority(path){
    var tmp = path.split('\\');
    return tmp.length;
  }

  getFileType(path){
    var tmp = this.getFileName(path).split('.');
    return tmp[tmp.length - 1];
  }

  isDirectory(path){
    var tmp = this.getFileType(path);
    if(tmp == this.getFileName(path)){
        return true;
    }else{
        return false;
    }
  }

  invalidPath(dirent, invalidPaths){
    if(invalidPaths.includes(dirent.name)) return false;
    return true;
  }

  async *getFiles(dir, invalidPaths) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
        try{
            if(this.invalidPath(dirent, invalidPaths)){
               yield res;
              if (dirent.isDirectory()) {
               yield* this.getFiles(res, invalidPaths);
              }
        }
              
          
        }catch(e){
    
        }
    }
  }

  async fetchData(callback){

    readFile('invalidPaths.txt', 'utf8' , (err, data) => { 
      if (err) {
        console.error(err);
        return;
      }
  
      return data;
  
    }).then(async (invalidPaths) => {
  
        var tmp = invalidPaths.replace(/(\r\n|\n|\r)/gm, "");
        tmp = (tmp.split(','));
        var arr = [];
        var first = performance.now();
  
        for await (const f of this.getFiles('C:/Users/', tmp)) {
              arr.push({
                path: f,
                fileName: this.getFileName(f),
                dirPriority: this.getDirPriority(f),
                isDir: this.isDirectory(f)
              });
        }

        return arr;
     
      }).then((arr) => {
          callback(arr);
      });
  }
}


module.exports = LocalDataCollector;