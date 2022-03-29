const fs = require("fs");
const join = require("path").join;
const path = require("path")
const archiver = require('archiver')
const compressing = require("compressing");

const allLanguageNames = ["CN", "EN", "JP", "KR", "TW"];
allFiles = [];

//被打包文件
function setZip(pathName, zipName) {
    let _files = fs.readdirSync(pathName);
    var files = [];
    _files.forEach((item, index) => {
        console.log(item)
        files.push(pathName + "/" + item);
    });

    if (zipName == "mtg") {
        zipName = "index";
    }
    var zipPath = pathName + "/" + zipName + '.zip';
    //创建一最终打包文件的输出流
    var output = fs.createWriteStream(zipPath);
    //生成archiver对象，打包类型为zip
    var zipArchiver = archiver('zip');
    //将打包对象与输出流关联
    zipArchiver.pipe(output);
    for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
        //将被打包文件的流添加进archiver对象中
        zipArchiver.append(fs.createReadStream(files[i]), { 'name': files[i] });
    }
    //打包
    zipArchiver.finalize();
}

/**
 * @pram 最外层文件夹名字
 */
const parentFileName = "web"

//获取解压以后的所有文件
function getAllFiles(pathName) {
    let files = fs.readdirSync(pathName);
    fs.mkdirSync(parentFileName);
    //创建五个文件夹
    for (let i = 0; i < allLanguageNames.length; i++) {
        let langureName = parentFileName + "/" + allLanguageNames[i];
        fs.mkdirSync(langureName);
        let langure = i;
        files.forEach((item, index) => {
            let oldPathName = pathName + item;
            let newPathName = pathName + langureName + "/" + item;
            console.log(index, item);
            var type = path.extname(item)
            var stat = fs.lstatSync(item);
            if (type == ".html") {
                fs.copyFileSync(oldPathName, newPathName);
                let res = fs.readFileSync(newPathName, 'utf-8');

                setLanguage(res, newPathName, langure);
            } else if (stat.isDirectory()) {
                exieFile(item, pathName, langureName, langure);
            }
            // fs.renameSync(path.resolve(pathName + item), path.resolve(pathName+'CN/'+ item));
        })
    }
}
//修改语言字段
function setLanguage(tmpl, newPathName, langure) {
    let info = _info = tmpl.replace("language=0", "language=" + langure);
    // if(langure == 0){
    //     //修改链接地址
    //     _info = info.replace("https://apps.apple.com/us/app/id1485195465", "https://apps.apple.com/cn/app/id1477285136");
    // }
    fs.writeFileSync(newPathName, _info, 'utf-8');
}

async function exieFile(item, pathName, langureName, langure) {
    let files = fs.readdirSync(item);
    let oldPath = pathName + item;
    let newPath = pathName + langureName + "/" + item;
    await files.forEach((value, index) => {
        // console.log(oldPath, ":", newPath)
        try {
            fs.accessSync(newPath);
            // console.log("文件夹存在");
            let data = fs.readFileSync(oldPath + "/" + value, 'utf-8');
            setLanguage(data, newPath + "/" + value, langure);
        } catch (err) {
            // console.log("文件夹不存在", newPath);
            fs.mkdirSync(newPath, { recursive: true });

            let data = fs.readFileSync(oldPath + "/" + value, 'utf-8');
            setLanguage(data, newPath + "/" + value, langure);
        }

        // fs.access(newPath, function (err) {
        //     if (err) {
        //         console.log("文件夹不存在", newPath);
        //         fs.mkdirSync(newPath, { recursive: true });

        //         // let data =  fs.readFileSync(oldPath + "/" + value, 'utf-8');
        //         // setLanguage(JSON.stringify(data) ,newPath + "/" + value , count);

        //         fs.readFile(oldPath + "/" + value, 'utf-8', function (err, data) {
        //             if (err) {
        //                 throw err;
        //             }
        //             let info = data.replace("COUNTRY=0", "COUNTRY="+ count);
        //             fs.writeFile(newPath + "/" + value, info, 'utf-8', function (error) {
        //                 if (error) {
        //                     throw error;
        //                 }
        //             })
        //         });

        //     } else {
        //         console.log("文件夹存在");
        //         // let data =  fs.readFileSync(oldPath + "/" + value, 'utf-8');
        //         // setLanguage(JSON.stringify(data) ,newPath + "/" + value , count);

        //         fs.readFile(oldPath + "/" + value, 'utf-8', function (err, data) {
        //             if (err) {
        //                 throw err;
        //             }
        //             let info = data.replace("COUNTRY=0", "COUNTRY="+ count);
        //             fs.writeFile(newPath + "/" + value, info, 'utf-8', function (error) {
        //                 if (error) {
        //                     throw error;
        //                 }
        //             })
        //         });
        //     }
        // });
    })
    let _arr = newPath.split("/")
    // console.log("修改完毕", _arr);
    setZip(newPath, _arr[_arr.length - 1]);
}

function unZip(__dirname) {
    let _count = 0;
    //读取所有文件
    let files = fs.readdirSync(__dirname);
    files.forEach((item, index) => {
        var stat = path.extname(item)
        if (stat == ".zip") {
            //将原来的名字进行分解
            let newNames = item.split("_");
            let newName = newNames[1];
            console.log("(__dirname + item" ,__dirname + item)
            //解压zip包,并重新命名
            compressing.zip.uncompress(__dirname + item, __dirname + newName)
                .then(() => {
                    console.log("newName",newName);
                    if(newName == "mtg"){
                        let mtgfile = fs.readdirSync(__dirname + newName);
                        mtgfile.forEach((mtgitem ,_index )=>{
                            fs.renameSync(__dirname + newName + "/" + mtgitem,__dirname + newName + "/index.html")
                        })
                    }
                    _count++;
                    console.log('unzip', 'success');
                    if (_count >= 3) {
                        getAllFiles(__dirname)
                    }
                })
                .catch(err => {
                    console.error('unzip', err);
                });
        }
    })
}

unZip("./");    
// getAllFiles("./");