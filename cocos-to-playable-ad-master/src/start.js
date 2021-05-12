"use strict";
exports.__esModule = true;
exports.X = void 0;
var fs = require("fs");
var path = require("path");
var uglify = require("uglify-js");
var CleanCSS = require("clean-css");
var X;
(function (X) {
    /** 一些配置参数
     * - [注意] 路径问题.start脚本与web-mobile同层级,因此相对路径需要带上web-mobile;cocos在调用资源时没有web-mobile,需要在最后去掉
     */
    var C = {
        BASE_PATH: "src/web-mobile",
        RES_PATH: "src/web-mobile/res",
        RES_BASE64_EXTNAME_SET: new Set([
            ".png", ".jpg", ".webp", ".mp3",
        ]),
        OUTPUT_RES_JS: "dist/res.js",
        OUTPUT_INDEX_HTML: "dist/index.html",
        INPUT_HTML_FILE: "src/web-mobile/index.html",
        INPUT_CSS_FILES: [
            "src/web-mobile/style-mobile.css"
        ],
        INPUT_JS_FILES: [
            "dist/res.js",
            "src/web-mobile/cocos2d-js-min.js",
            "src/web-mobile/main.js",
            "src/web-mobile/src/settings.js",
            "src/web-mobile/src/project.js",
            "src/new-res-loader.js",
            "src/game-start.js",
        ]
    };
    /**
     * 读取文件内容
     * - 特定后缀返回base64编码后字符串,否则直接返回文件内容字符串
     * @param filepath
     */
    function get_file_content(filepath) {
        var file = fs.readFileSync(filepath);
        return C.RES_BASE64_EXTNAME_SET.has(path.extname(filepath)) ? file.toString("base64") : file.toString();
    }
    /**
     * 获取路径下的所有子文件路径(深度遍历)
     * @param filepath
     */
    function get_all_child_file(filepath) {
        var children = [filepath];
        for (;;) {
            // 如果都是file类型的,则跳出循环
            if (children.every(function (v) { return fs.statSync(v).isFile(); })) {
                break;
            }
            // 如果至少有1个directroy类型,则删除这一项,并加入其子项
            children.forEach(function (child, i) {
                if (fs.statSync(child).isDirectory()) {
                    delete children[i];
                    var child_children = fs.readdirSync(child).map(function (v) { return child + "/" + v; });
                    children.push.apply(children, child_children);
                }
            });
        }
        return children;
    }
    /**
     * 将所有res路径下的资源转化为res.js
     * - 存储方式为:res-url(注意是相对的),res文件内容字符串或编码
     */
    function write_resjs() {
        // 读取并写入到一个对象中
        var res_object = {};
        console.log("C.RES_PATH", C.BASE_PATH);
        get_all_child_file(C.RES_PATH).forEach(function (path) {
            // 注意,存储时删除BASE_PATH前置
            var store_path = path.replace(new RegExp("^" + C.BASE_PATH + "/"), "");
            res_object[store_path] = get_file_content(path);
        });
        // 写入文件
        console.log("C.OUTPUT_RES_JS", C.OUTPUT_RES_JS);
        fs.writeFileSync(C.OUTPUT_RES_JS, "window.res=" + JSON.stringify(res_object));
    }
    /** 将js文件转化为html文件内容(包括压缩过程) */
    function get_html_code_by_js_file(js_filepath) {
        var js = get_file_content(js_filepath);
        var min_js = uglify.minify(js).code;
        return "<script type=\"text/javascript\">" + min_js + "</script>";
    }
    /** 将css文件转化为html文件内容(包括压缩过程) */
    function get_html_code_by_css_file(css_filepath) {
        var css = get_file_content(css_filepath);
        var min_css = new CleanCSS().minify(css).styles;
        return "<style>" + min_css + "</style>";
    }
    /** 执行任务 */
    function do_task() {
        // 前置:将res资源写成res.js
        console.time("写入res.js");
        write_resjs();
        console.timeEnd("写入res.js");
        // 清理html
        console.time("清理html");
        var html = get_file_content(C.INPUT_HTML_FILE);
        html = html.replace(/<link rel="stylesheet".*\/>/gs, "");
        html = html.replace(/<script.*<\/script>/gs, "");
        console.timeEnd("清理html");
        // 写入css
        console.log("写入所有css文件");
        C.INPUT_CSS_FILES.forEach(function (v) {
            console.time("---" + path.basename(v));
            html = html.replace(/<\/head>/, get_html_code_by_css_file(v) + "\n</head>");
            console.timeEnd("---" + path.basename(v));
        });
        // 写入js
        console.log("写入所有js到html");
        C.INPUT_JS_FILES.forEach(function (v) {
            console.time("---" + path.basename(v));
            html = html.replace("</body>", function () { return get_html_code_by_js_file(v) + "\n</body>"; });
            console.timeEnd("---" + path.basename(v));
        });
        // 写入文件并提示成功
        console.time("输出html文件");
        fs.writeFileSync(C.OUTPUT_INDEX_HTML, html);
        console.timeEnd("输出html文件");
    }
    X.do_task = do_task;
})(X = exports.X || (exports.X = {}));
X.do_task();
