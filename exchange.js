function StringToByte ( str ) {
    var re = [], idx;
    for(var i = 0; i < str.length; i++)
    {
        idx = str.charCodeAt(i);
        if(idx & 0xff00){
            re.push(idx >> 8);
            re.push(idx & 0xff);
        }else{
            re.push(idx);
        }
    }
    return re;
}

var _byte = StringToByte("nihaoyahello123")
console.log(_byte);

function byteToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}  

console.log(byteToString(_byte));