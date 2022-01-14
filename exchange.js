//中文转byte
Array.prototype.map.call(str, function (c) { return c.charCodeAt(0); })

function StringToByte ( str ) {
    var re = [], idx;
    for(var i = 0; i < str.length; i++)
    {
        idx = str.charCodeAt(0);
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


var NumberUtil={
    //byte数组转换为int整数
    bytesToInt2:function(bytes, off) {
        var b3 = bytes[off] & 0xFF;
        var b2 = bytes[off + 1] & 0xFF;
        var b1 = bytes[off + 2] & 0xFF;
        var b0 = bytes[off + 3] & 0xFF;
        return (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
    },
    //byte数组转换为无符号short整数
    byte2ToUnsignedShort:function(bytes, off) {
        var high = bytes[off + 1];
        var low = bytes[off];
        return (high << 8 & 0xFF00) | (low & 0xFF);
    },
    //byte数组转字符串
    byteToString:function(arr) {
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
    },     
    //int整数转换为4字节的byte数组
    intToByte4:function(i) {
        var targets =[];
        targets[0] = (i & 0xFF);
        targets[1] = (i >> 8 & 0xFF);
        targets[2] = (i >> 16 & 0xFF);
        targets[3] = (i >> 24 & 0xFF);
        return targets;
    },
    //无符号short转换为2字节的byte数组
    unsignedShortToByte2:function(s){
        var targets = [];
        targets[1] = (s >> 8 & 0xFF);
        targets[0] = (s & 0xFF);
        return targets;
    },
    //字符串转byte数组
    stringToByte:function(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for(var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if(c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    },
    //有符int转无符int
    int2uint:function(i) {
        if (i >= 0)
            return i;
        else
            4294967296 + i;
    },
    //无符int转有符int
    uint2int:function(i) {
        if (i <= 2147483647)
            return i;
        else
            return i - 4294967296
    },
    //有符char转无符char
    char2uchar:function(i) {
        if (i >= 0)
            return i;
        else
            65535 + i;
    },
    //无符char转有符char
    uchar2char:function(i) {
        if (i <= 32767)
            return i;
        else
            return i - 65535
    },
    //有符byte转无符byte
    bytes2ubytes:function(i) {
        if (i >= 0)
            return i;
        else
            255 + i;
    },
    //无符byte转有符byte
    ubytes2bytes:function(i) {
        if (i <= 127)
            return i;
        else
            return i - 255
    }
}