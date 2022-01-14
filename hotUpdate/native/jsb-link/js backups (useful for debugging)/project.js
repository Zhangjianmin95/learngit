window.__require = function t(e, s, n) {
function i(a, o) {
if (!s[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!o && l) return l(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
}
var p = s[a] = {
exports: {}
};
e[a][0].call(p.exports, function(t) {
return i(e[a][1][t] || t);
}, p, p.exports, t, e, s, n);
}
return s[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < n.length; a++) i(n[a]);
return i;
}({
Helloworld: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "e1b90/rohdEk4SdmmEZANaD", "Helloworld");
var n = this && this.__extends || function() {
var t = function(e, s) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var s in e) e.hasOwnProperty(s) && (t[s] = e[s]);
})(e, s);
};
return function(e, s) {
t(e, s);
function n() {
this.constructor = e;
}
e.prototype = null === s ? Object.create(s) : (n.prototype = s.prototype, new n());
};
}(), i = this && this.__decorate || function(t, e, s, n) {
var i, r = arguments.length, a = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, s) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, s, n); else for (var o = t.length - 1; o >= 0; o--) (i = t[o]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, s, a) : i(e, s)) || a);
return r > 3 && a && Object.defineProperty(e, s, a), a;
};
Object.defineProperty(s, "__esModule", {
value: !0
});
var r = cc._decorator, a = r.ccclass, o = r.property, c = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.label = null;
e.text = "hello";
return e;
}
e.prototype.start = function() {
this.label.string = this.text;
};
e.prototype.clickBtn = function() {
this.label.string = "你点击按钮了,热更新成功了";
};
i([ o(cc.Label) ], e.prototype, "label", void 0);
i([ o ], e.prototype, "text", void 0);
return e = i([ a ], e);
}(cc.Component);
s.default = c;
cc._RF.pop();
}, {} ],
HotUpdate: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "1f41cxVeVZLS6181pOGScwf", "HotUpdate");
var n = this && this.__extends || function() {
var t = function(e, s) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var s in e) e.hasOwnProperty(s) && (t[s] = e[s]);
})(e, s);
};
return function(e, s) {
t(e, s);
function n() {
this.constructor = e;
}
e.prototype = null === s ? Object.create(s) : (n.prototype = s.prototype, new n());
};
}(), i = this && this.__decorate || function(t, e, s, n) {
var i, r = arguments.length, a = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, s) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, s, n); else for (var o = t.length - 1; o >= 0; o--) (i = t[o]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, s, a) : i(e, s)) || a);
return r > 3 && a && Object.defineProperty(e, s, a), a;
};
Object.defineProperty(s, "__esModule", {
value: !0
});
var r = cc._decorator, a = r.ccclass, o = r.property, c = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.manifestUrl = null;
e.tipLabel = null;
e._updateListener = null;
e._updating = !1;
e._canRetry = !1;
e._storagePath = null;
e._am = null;
e._checkListener = null;
e._failCount = 0;
return e;
}
e.prototype.onClick = function(t, e) {
"sure" == e ? this.hotUpdate() : "cancel" == e && cc.director.end();
};
e.prototype.checkCb = function(t) {
var e = this;
cc.log("Code: " + t.getEventCode());
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.tipLabel.string = "未找到本地清单文件，已跳过热更新.";
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.tipLabel.string = "无法下载清单文件，已跳过热更新.";
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.tipLabel.string = "已经是最新远程版本的最新版本.";
setTimeout(function() {
e.changeScene();
}, 2e3);
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this.tipLabel.string = "找到新版本，请尝试更新.";
break;

default:
return;
}
this._am.setEventCallback(null);
this._checkListener = null;
this._updating = !1;
};
e.prototype.updateCb = function(t) {
var e = this, s = !1, n = !1;
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.tipLabel.string = "No local manifest file found, hot update skipped.";
n = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var i = 100 * parseInt(t.getPercent());
i || (i = 0);
this.tipLabel.string = "更新进度:" + i;
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.tipLabel.string = "下载远程版本文件失败";
n = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.tipLabel.string = "当前为最新版本";
n = !0;
setTimeout(function() {
e.changeScene();
}, 2e3);
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this.tipLabel.string = "更新完成. " + t.getMessage();
s = !0;
setTimeout(function() {
e.changeScene();
}, 2e3);
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this.tipLabel.string = "更新失败. " + t.getMessage();
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
this.tipLabel.string = "资源错误: " + t.getAssetId() + ", " + t.getMessage();
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
this.tipLabel.string = t.getMessage();
}
if (n) {
this._am.setEventCallback(null);
this._updateListener = null;
this._updating = !1;
}
if (s) {
this._am.setEventCallback(null);
this._updateListener = null;
var r = jsb.fileUtils.getSearchPaths(), a = this._am.getLocalManifest().getSearchPaths();
console.log(JSON.stringify(a));
Array.prototype.unshift.apply(r, a);
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(r));
jsb.fileUtils.setSearchPaths(r);
cc.game.restart();
}
};
e.prototype.loadCustomManifest = function() {
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var t = new jsb.Manifest(this._storagePath);
this._am.loadLocalManifest(t, this._storagePath);
this.tipLabel.string = "Using custom manifest";
}
};
e.prototype.retry = function() {
if (!this._updating && this._canRetry) {
this._canRetry = !1;
this.tipLabel.string = "重新获取失败资源...";
this._am.downloadFailedAssets();
}
};
e.prototype.checkUpdate = function() {
this.tipLabel.string = "检查更新中 ...";
if (cc.sys.isNative) if (this._updating) this.tipLabel.string = "更新中 ..."; else {
this._am.getState() === jsb.AssetsManager.State.UNINITED && this._am.loadLocalManifest(this.manifestUrl);
if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
this._am.setEventCallback(this.checkCb.bind(this));
this._failCount = 0;
this._am.checkUpdate();
this._updating = !0;
} else this.tipLabel.string = "Failed to load local manifest ...";
}
};
e.prototype.hotUpdate = function() {
if (this._am && !this._updating) {
this._am.setEventCallback(this.updateCb.bind(this));
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var t = this.manifestUrl;
cc.loader.md5Pipe && (t = cc.loader.md5Pipe.transformURL(t));
this._am.loadLocalManifest(t);
}
this._failCount = 0;
this._am.update();
this._updating = !0;
}
};
e.prototype.changeScene = function() {
cc.director.loadScene("helloworld");
};
e.prototype.onLoad = function() {
console.log(this.manifestUrl);
if (cc.sys.isNative) {
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
cc.log("Storage path for remote asset : " + this._storagePath);
this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
var t = this.tipLabel;
this._am.setVerifyCallback(function(e, s) {
var n = s.compressed, i = s.md5, r = s.path;
s.size;
if (n) {
t.string = "Verification passed : " + r;
return !0;
}
t.string = "Verification passed : " + r + " (" + i + ")";
return !0;
});
this.tipLabel.string = "Hot update is ready, please check or directly update.";
if (cc.sys.os === cc.sys.OS_ANDROID) {
this._am.setMaxConcurrentTask(2);
this.tipLabel.string = "Max concurrent tasks count have been limited to 2";
}
}
};
e.prototype.versionCompareHandle = function(t, e) {
cc.log("JS Custom Version Compare: version A is " + t + ", version B is " + e);
for (var s = t.split("."), n = e.split("."), i = 0; i < s.length; ++i) {
var r = parseInt(s[i]), a = parseInt(n[i] || 0);
if (r !== a) return r - a;
}
return n.length > s.length ? -1 : 0;
};
e.prototype.onDestroy = function() {
if (this._updateListener) {
this._am.setEventCallback(null);
this._updateListener = null;
}
};
i([ o(cc.Asset) ], e.prototype, "manifestUrl", void 0);
i([ o(cc.Label) ], e.prototype, "tipLabel", void 0);
return e = i([ a ], e);
}(cc.Component);
s.default = c;
cc._RF.pop();
}, {} ],
Uipanel: [ function(t, e, s) {
"use strict";
cc._RF.push(e, "592d351xi1Ls6BIM1YXttlf", "Uipanel");
var n = this && this.__extends || function() {
var t = function(e, s) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var s in e) e.hasOwnProperty(s) && (t[s] = e[s]);
})(e, s);
};
return function(e, s) {
t(e, s);
function n() {
this.constructor = e;
}
e.prototype = null === s ? Object.create(s) : (n.prototype = s.prototype, new n());
};
}(), i = this && this.__decorate || function(t, e, s, n) {
var i, r = arguments.length, a = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, s) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, s, n); else for (var o = t.length - 1; o >= 0; o--) (i = t[o]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, s, a) : i(e, s)) || a);
return r > 3 && a && Object.defineProperty(e, s, a), a;
};
Object.defineProperty(s, "__esModule", {
value: !0
});
var r = cc._decorator, a = r.ccclass, o = (r.property, function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.start = function() {};
e.prototype.clickBtn = function() {};
return e = i([ a ], e);
}(cc.Component));
s.default = o;
cc._RF.pop();
}, {} ]
}, {}, [ "Helloworld", "Uipanel", "HotUpdate" ]);