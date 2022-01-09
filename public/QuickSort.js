class QuickSort{
    constructor(arr, sortBy, customComparator){
        this.arr = arr;
        this.sortBy = sortBy;
        this.customComparator = customComparator;
        if(this.sortBy == undefined && !this.customComparator) throw "Constructor parameter sortBy misssing.";
        if(!this.arr[0].hasOwnProperty(this.sortBy) && !this.customComparator) throw "Constructor parameter sortBy is not a valid object property.";
    }


    getCompareValueObject(obj){
        if(this.customComparator){
            var tmp = this.customComparator(obj);
            console.log(obj.Name, tmp);
            return tmp;
        }

        return obj[this.sortBy];
    }

    getCompareValue(index){
        return this.getCompareValueObject(this.arr[index]);
    }

    swap(i, j){
        var tmp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = tmp;
    }

    medianOfThree(low, high){
        var middle = Math.floor((low+high)/2);
        
        if(this.getCompareValue(low) > this.getCompareValue(middle))    this.swap(low, middle);
        
        if(this.getCompareValue(low) > this.getCompareValue(high))      this.swap(low, high);
      
        if(this.getCompareValue(middle) > this.getCompareValue(high))   this.swap(middle, high);
      
        this.swap(middle, high);
    }

    partition(low, high, pivot){
        var i = low;
        var j = high;
        
        while(i <= j){
          
          while(this.getCompareValue(i) < this.getCompareValueObject(pivot)){
            i++;
          }
      
          while(this.getCompareValue(j) >   this.getCompareValueObject(pivot)){
            j--;
          }
      
          if(i <= j){
            this.swap(i, j);
            i++;
            j--;
          }
        }
      
        return i;
      }


    sort(low, high){
        
        if(low == undefined && high == undefined){
            low = 0;
            high = this.arr.length - 1;
        }

        var partitionIndex;
      
        if(this.arr.length > 1){
            
            this.medianOfThree(low, high);
            var pivot = this.arr[high];
      
            partitionIndex = this.partition(low, high, pivot);
            
            if(low < partitionIndex - 1){
                this.sort(low, partitionIndex - 1);
            }
      
            if(partitionIndex < high){
                this.sort(partitionIndex, high);
            } 
        }
      
        return this.arr;
      }
}
  
module.exports = QuickSort;