const { resolve } = require('path');
const { readdir, readFile, writeFile } = require('fs').promises;



class LocalDataCollector{
  static getFileName(path){
    var tmp = path.split('\\');
    return tmp[tmp.length - 1];
  }

 static getDirPriority(path){
    var tmp = path.split('\\');
    return tmp.length;
  }

  static getFileType(path){
    var tmp = LocalDataCollector.getFileName(path).split('.');
    return tmp[tmp.length - 1];
  }

  static isDirectory(path){
    var tmp = LocalDataCollector.getFileType(path);
    if(tmp == LocalDataCollector.getFileName(path)){
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

  async fetchData(searchPath, invalidPathsTxt, callback){

    readFile(invalidPathsTxt, 'utf8' , (err, data) => { 
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
  
        for await (const f of this.getFiles(searchPath, tmp)){
              arr.push({
                path: f,
                fileName: LocalDataCollector.getFileName(f),
                dirPriority: LocalDataCollector.getDirPriority(f),
                isDir: LocalDataCollector.isDirectory(f)
              });
        }

        return arr;
     
      }).then((arr) => {
          callback(arr);
      });
  }
}


module.exports = LocalDataCollector;