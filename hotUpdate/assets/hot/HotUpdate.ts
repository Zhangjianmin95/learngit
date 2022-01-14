import Uipanel from "../Script/Uipanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HotUpdate extends cc.Component {
    
    @property(cc.Asset)
    manifestUrl: cc.Asset = null;
   
    @property(cc.Label)
    tipLabel: cc.Label = null;

    _updateListener: any = null;
    _updating:boolean =  false;
    _canRetry:boolean =  false;
    _storagePath: any = null;
    _am: any = null;
    _checkListener:boolean = null;
    _failCount: number = 0;
    onClick(event, data) {      //*
        if (data == "sure") {
            this.hotUpdate();
        }
        else if (data == "cancel") {
            cc.director.end();
        }
    }

    checkCb(event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.tipLabel.string = "未找到本地清单文件，已跳过热更新.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.tipLabel.string = "无法下载清单文件，已跳过热更新.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.tipLabel.string = "已经是最新远程版本的最新版本.";
                setTimeout(() => {
                    this.changeScene();       //*
                }, 2000);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.tipLabel.string = '找到新版本，请尝试更新.';
                break;
            default:
                return;
        }

        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    }

    updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.tipLabel.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                  let percent = parseInt(event.getPercent()) * 100;

                if (!percent) percent = 0;

                this.tipLabel.string = '更新进度:' + percent;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.tipLabel.string = '下载远程版本文件失败';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.tipLabel.string = '当前为最新版本';
                failed = true;
                setTimeout(() => {
                    this.changeScene();       //*
                }, 2000);
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.tipLabel.string = '更新完成. ' + event.getMessage();
                needRestart = true;
                setTimeout(() => {
                    this.changeScene();       //*
                }, 2000);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.tipLabel.string = '更新失败. ' + event.getMessage();
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.tipLabel.string = '资源错误: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.tipLabel.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.game.restart();
        }
    }

    loadCustomManifest() {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
            this.tipLabel.string = 'Using custom manifest';
        }
    }

    retry() {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;

            this.tipLabel.string = '重新获取失败资源...';
            this._am.downloadFailedAssets();
        }
    }

    checkUpdate() {
        this.tipLabel.string = '检查更新中 ...';
        if (!cc.sys.isNative) {
            return;
        }
        if (this._updating) {
            this.tipLabel.string = '更新中 ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.tipLabel.string = 'Failed to load local manifest ...';
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        this._failCount = 0;
        this._am.checkUpdate();
        this._updating = true;
    }

    hotUpdate() {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._am.update();
            // this.panel.updateBtn.active = false;
            this._updating = true;
        }
    }

    // show() {
    //     if (this.updateUI.active === false) {
    //         this.updateUI.active = true;
    //     }
    // },

    changeScene(){
        cc.director.loadScene("helloworld");
    }

    // use this for initialization
    onLoad() {
        console.log(this.manifestUrl);
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        
        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        
        var panel = this.tipLabel;
        // Setup the verification callback, but we don't have md5 checyet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback((path, asset) =>{
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                panel.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                panel.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        })

        this.tipLabel.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            this.tipLabel.string = "Max concurrent tasks count have been limited to 2";
        }

        // this.checkUpdate();     //*
    }

    versionCompareHandle (versionA, versionB) {
        cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }

    onDestroy() {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    }
}
