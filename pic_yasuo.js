// const images = require("images");
// const path = require("path")
// const fs = require("fs");

// //读取所有文件
// var count = 0;
// function explorer(_fileName){
//     let files = fs.readdirSync(_fileName);
//     files.forEach((item, index) => {
//         fs.stat(_fileName + '/' + item, function(err, stat){
//             if(err){console.log(err); return;}
//             if(stat.isDirectory()){ 
//             // 如果是文件夹遍历
//                 explorer(_fileName + '/' + item);
//             }else{
//                 var type = path.extname(item);
//                 if(type == ".png"){
//                     // 读出所有的文件
//                     count ++;
//                     console.log('文件名:' + _fileName + '/' + item);
//                     console.log(count);

//                     var arr = _fileName.split("/");
//                     console.log(arr);
//                     var oldname =  _fileName + '/' + item;
//                     var newname =  "./Texture/" + arr[arr.length -1] + "/" + item;
//                     images(oldname)
//                     .save(newname, {
//                     quality : 30
//                     });
//                 }
//             }
//         })
//     })
// }

// explorer("./Texture_old");

const imagemin = require("imagemin")
const imageminPngquant = require('imagemin-pngquant');
const images = require("images");
const path = require("path")
const fs = require("fs");
const readline = require('readline')

const oldFile = "pic";
const newFile = "pic_new";

//读取所有文件
var count = 0;
function explorer(_fileName){
    let files = fs.readdirSync(_fileName);
    files.forEach((item, index) => {
        fs.stat(_fileName + '/' + item, function(err, stat){
            if(err){console.log(err); return;}
            if(stat.isDirectory()){ 
            // 如果是文件夹遍历
                explorer(_fileName + '/' + item);
            }else{
                var type = path.extname(item);
                if(type == ".png"){
                    // 读出所有的文件
                    count ++;

                    var oldname =  _fileName + '/' + item;
                    let _str =  _fileName + '/';
                    var newname = _str.replace(oldFile,newFile)

                    // var newname =  newFile + "/" + arr[arr.length -1] + "/";
                    imagemin([oldname], {
                        destination: newname, 
                        plugins: [
                            imageminPngquant({
                                quality: [0.3, 0.3]  //压缩质量（0,1）
                            })
                        ]
                    }).then(() => {
                        console.log("压缩成功");
                    }).catch(err => {
                        console.log("压缩失败:"+err)
                    });
                }
            }
        })
    })
}

explorer("./" + oldFile);

