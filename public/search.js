const { resolve } = require('path');
const { readdir, readFile } = require('fs').promises;

function getFileName(path){
  var tmp = path.split('\\');
  return tmp[tmp.length - 1];
}

function getDirPriority(path){
  var tmp = path.split('\\');
  return tmp.length;
}

function getFileType(path){
  var tmp = path.split('.');
  return tmp[tmp.length - 1];
}


function validPath(dirent, invalidPaths){
  return invalidPaths.includes(dirent.name) ? false : true;
}

async function* getFiles(dir, invalidPaths) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
      try{

        if(validPath(dirent, invalidPaths)){
            if (dirent.isDirectory()) {
                yield* getFiles(res, invalidPaths);
            } else {
                yield res;
              }
        }
      }catch(e){
  
      }
  }
}


function getCompareValueObject(obj){
  return obj.fileName;
}


function getCompareValue(arr, index){
  return getCompareValueObject(arr[index]);
}

function swap(arr, i, j){
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function medianOfThree(arr, low, high){
  var middle = Math.floor((low+high)/2);
  
  if(getCompareValue(arr, low) > getCompareValue(arr, middle)) swap(arr, low, middle);
  
  if(getCompareValue(arr, low) > getCompareValue(arr, high)) swap(arr, low, high);

  if(getCompareValue(arr, middle) > getCompareValue(arr, high)) swap(arr,middle, high);

  swap(arr, middle, high);
}


function partition(arr, low, high, pivot){
  var i = low;
  var j = high;
  
  while(i <= j){
    
    while(getCompareValue(arr, i) < getCompareValueObject(pivot)){
      i++;
  }

  while(getCompareValue(arr, j) > getCompareValueObject(pivot)){
      j--;
  }

    if(i <= j){
      swap(arr, i, j);
      i++;
      j--;
    }
  }

  return i;
}



function quickSort(arr, low, high){

  var partitionIndex;

  if(arr.length > 1){
      
      medianOfThree(arr, low, high);
      var pivot = arr[high];

      partitionIndex = partition(arr, low, high, pivot);
      
      if(low < partitionIndex - 1){
          quickSort(arr, low, partitionIndex - 1);
      }

      if(partitionIndex < high){
          quickSort(arr, partitionIndex, high);
      } 
  }

  return arr;
}



function binarySearch(arr, value){

  let start = 0;
  let end = arr.length - 1;

  while(start <= end){
    let middle = Math.floor((start+end) / 2);

    if(arr[middle] == value){
        return middle;
    }else if(arr[middle] < value){
      end = middle - 1;
    }else{
      start = middle + 1;
    }
  }

}



function main(){

  readFile('invalidPaths.txt', 'utf8' , (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    return data;
  }).then((invalidPaths) => {
      var tmp = invalidPaths.replace(/(\r\n|\n|\r)/gm, "");
      tmp = (tmp.split(','));

      var arr = [];
      var first = performance.now();
    (async () => {
        for await (const f of getFiles('C:/', tmp)) {
            arr.push({
              path: f,
              fileName: getFileName(f),
              dirPriority: getDirPriority(f)
            });
        }
      })().then(() => {
          quickSort(arr, 0, arr.length - 1);
          console.log(performance.now() - first);
      });
  });
}

main();