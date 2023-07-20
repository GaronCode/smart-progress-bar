function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return fn;
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}

var ClassList = {
  main: "dev-progress",
  mainSmall: "dev-progress-small",
  mainDone: "dev-progress-done",
  mainAnimationHidden: "dev-progress-before",
  mainAnimationHide: "dev-progress-before",
  //'dev-progress-hide'
  container: "dev-progress__container",
  card: "dev-progress__card",
  cardProgress: "dev-progress__card-progress-color",
  percent: "dev-progress__percent",
  number: "dev-progress__percent-num",
  numberText: "dev-progress__percent-a",
  headerText: "dev-progress__card-text",
  liActive: "dev-progress-li-active",
  liHidden: "dev-progress-li-hidden"
};

function createEl() {
  var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "div";
  var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var e = document.createElement(tag);
  if (className) e.className = className;
  if (text) e.appendChild(document.createTextNode(text));
  return e;
}
function createCircle(r) {
  var a = document.createElement("circle");
  a.cx = a.cy = a.r = r;
  return a;
}

function accFunction(t) {
  var sqrt = t * t;
  return sqrt / (2 * (sqrt - t) + 1);
}

function createProgressHtml(e) {
  var c = createEl;
  var li = c("", "li");
  var name = c("", "span", e.name);
  var progress = c("", "span", e.progress);
  li.appendChild(name);
  li.appendChild(progress);

  //для плавного появления

  //------------------------------------------------

  li.addEventListener("click", function () {
    e.onclick();
  });
  return {
    container: li,
    nameEl: name,
    progressEl: progress
  };
}

function startTransition(el, classAdded) {
  var reverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
  el.classList.add(classAdded);
  if (reverse) setTimeout(function () {
    return el.classList.remove(classAdded);
  }, 0);
  var _cb = function cb() {
    if (_cb) {
      el.removeEventListener("transitionend", _cb);
      if (!reverse) el.classList.remove(classAdded);
      _cb = null;
      callback();
    }
  };
  el.addEventListener("transitionend", _cb);
}

/**
 * Create instance for main progressbar
 */
var _animationData = /*#__PURE__*/new WeakMap();
var _animationSpeed = /*#__PURE__*/new WeakMap();
var _animationDuration = /*#__PURE__*/new WeakSet();
var _changeMainProgress = /*#__PURE__*/new WeakSet();
var _setProgress = /*#__PURE__*/new WeakSet();
var _changeHtml = /*#__PURE__*/new WeakSet();
var _startFastAnimation = /*#__PURE__*/new WeakSet();
var _startSmoothAnimation = /*#__PURE__*/new WeakSet();
var _stopAnimation = /*#__PURE__*/new WeakSet();
var SmartProgressElement = /*#__PURE__*/function () {
  /**
   * @param settings
   * @param {string} [settings.name] - name of progress
   * @param {SmartProgressBar} [settings.context] - main bar
   */
  function SmartProgressElement(_ref) {
    var context = _ref.context,
      name = _ref.name;
    _classCallCheck(this, SmartProgressElement);
    _classPrivateMethodInitSpec(this, _stopAnimation);
    _classPrivateMethodInitSpec(this, _startSmoothAnimation);
    _classPrivateMethodInitSpec(this, _startFastAnimation);
    _classPrivateMethodInitSpec(this, _changeHtml);
    _classPrivateMethodInitSpec(this, _setProgress);
    _classPrivateMethodInitSpec(this, _changeMainProgress);
    _classPrivateMethodInitSpec(this, _animationDuration);
    _classPrivateFieldInitSpec(this, _animationData, {
      writable: true,
      value: {}
    });
    _classPrivateFieldInitSpec(this, _animationSpeed, {
      writable: true,
      value: 1000
    });
    // progress
    _defineProperty(this, "_progress", 0);
    _defineProperty(this, "_name", void 0);
    this.context = context;
    var _createProgressHtml = createProgressHtml(this),
      container = _createProgressHtml.container,
      progressEl = _createProgressHtml.progressEl,
      nameEl = _createProgressHtml.nameEl;
    this.HtmlContainer = container;
    this.HtmlProgress = progressEl;
    this.HtmlName = nameEl;
    this.name = name;
    this.show();
  }
  _createClass(SmartProgressElement, [{
    key: "onclick",
    value:
    // events
    function onclick() {}
  }, {
    key: "ondone",
    value: function ondone() {}
  }, {
    key: "progress",
    get: function get() {
      return this._progress;
    },
    set: function set(n) {
      _classPrivateMethodGet(this, _setProgress, _setProgress2).call(this, n);
      if (n === 100) {
        this.ondone();
      }
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    },
    set: function set(n) {
      this._name = n;
      this.HtmlName.innerText = n;
    }
  }, {
    key: "makeActive",
    value:
    /**
     * Add active class
     */
    function makeActive() {
      this.HtmlContainer.classList.add(ClassList.liActive);
    }
    /**
     * Remove active class
     */
  }, {
    key: "removeActive",
    value: function removeActive() {
      this.HtmlContainer.classList.remove(ClassList.liActive);
    }
    /**
     * Start hide animation with callback
     * @param {function} afterAnimationDone - callback
     */
  }, {
    key: "hide",
    value: function hide() {
      var afterAnimationDone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      startTransition(this.HtmlContainer, ClassList.liHidden, false, afterAnimationDone);
    }
    /**
     * Start show animation with callback
     * @param {function} afterAnimationDone 
     */
  }, {
    key: "show",
    value: function show() {
      var afterAnimationDone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      startTransition(this.HtmlContainer, ClassList.liHidden, true, afterAnimationDone);
    }
  }]);
  return SmartProgressElement;
}();
function _animationDuration2() {
  return _classPrivateFieldGet(this, _animationSpeed);
}
function _changeMainProgress2(v) {
  this.context.tryChangeProgress(this, v);
}
function _setProgress2(num) {
  num = parseInt(num);
  if (num === this.progress) return;
  var Ad = _classPrivateFieldGet(this, _animationData);
  _classPrivateMethodGet(this, _stopAnimation, _stopAnimation2).call(this, Ad);
  Ad.oldVal = Ad.oldVal ? Ad.oldVal : 0;
  this._progress = num;
  Ad.needVal = num;
  if (num === 100) {
    _classPrivateMethodGet(this, _startFastAnimation, _startFastAnimation2).call(this, Ad);
    return;
  } else {
    _classPrivateMethodGet(this, _startSmoothAnimation, _startSmoothAnimation2).call(this, Ad);
  }
}
function _changeHtml2(val) {
  this.HtmlProgress.innerText = val + "%";
  _classPrivateMethodGet(this, _changeMainProgress, _changeMainProgress2).call(this, val);
}
function _startFastAnimation2(Ad) {
  var _this = this;
  var step = Math.ceil((100 - Ad.oldVal) / 8);
  Ad.timerId = setInterval(function () {
    Ad.oldVal += step;
    if (Ad.needVal <= Ad.oldVal) {
      clearInterval(Ad.timerId);
      _classPrivateMethodGet(_this, _changeHtml, _changeHtml2).call(_this, 100);
      _this.ondone();
    } else _classPrivateMethodGet(_this, _changeHtml, _changeHtml2).call(_this, Math.ceil(Ad.oldVal));
  }, 80);
}
function _startSmoothAnimation2(Ad) {
  var _this2 = this;
  var start = Ad.oldVal,
    max = Ad.needVal;
  var difference = max - start;
  var animationDurationMilli = _classPrivateMethodGet(this, _animationDuration, _animationDuration2).call(this),
    animationSpeed = 10;
  var animationEnd = animationDurationMilli / animationSpeed;
  var i = 0;
  // таймер плавной анимации
  Ad.timerId = setInterval(function () {
    if (i === animationEnd) {
      clearInterval(Ad.timerId);
      return;
    }
    var val = Math.ceil(start + difference * accFunction(i++ / animationEnd));
    Ad.oldVal = val;
    _classPrivateMethodGet(_this2, _changeHtml, _changeHtml2).call(_this2, val);
  }, animationSpeed);
}
function _stopAnimation2(Ad) {
  clearInterval(Ad.timerId);
}

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css = ".dev-progress\n{\n    z-index: 999999;\n    position:fixed;\n    display:flex;\n    width: 100vw;\n    height: 100vh;\n    justify-content: center;\n    align-items: center;\n    transition:0.5s;\n    top: 0;\n    left: 0;\n}\n.dev-progress .dev-progress__card\n{\n    padding-top: 20px;\n    position:relative;\n    width:250px;\n    background:#003a72;\n    display:flex;\n    justify-content:center;\n    align-items:center;\n    border-radius:20px;\n    text-align:center;\n    overflow:hidden;\n    transition: all 0.5s ease-out;\n}\n.dev-progress .dev-progress__card:hover\n{\n    transform:translateY(-10px);\n    box-shadow:0 15px 35px rgba(0,0,0,.5);\n}\n.dev-progress .dev-progress__card-progress-color\n{\n    content:'';\n    position:absolute;\n    top:0;\n    left:-50%;\n    width:100%;\n    height:100%;\n    background:rgba(255,255,255,.03);\n    pointer-events:none;\n    z-index:1;\n    transition: left .3s;\n}\n\n\n\n.dev-progress .dev-progress__container {\n    width: inherit;\n}\n\n\n.dev-progress  .dev-progress__percent\n{\n    position:relative;\n    width:150px;\n    height:150px;\n    border-radius:50%;\n    box-shadow: inset 0 0 50px #000;\n    background:#6fbcf0;\n    z-index:999;\n    transition: 0.5s;\n    margin: 0 auto;\n}\n.dev-progress  .dev-progress__percent  .dev-progress__percent-num\n{\n    position:absolute;\n    top:0;\n    left:0;\n    width:100%;\n    height:100%;\n    display:flex;\n    justify-content:center;\n    align-items:center;\n    border-radius:50%;\n}\n.dev-progress  .dev-progress__percent  .dev-progress__percent-num .dev-progress__percent-a\n{\n    color:#ececec;\n    font-weight:700;\n    font-size:40px;\n    transition:0.5s;\n    user-select: none;\n    cursor: inherit;\n}\n.dev-progress .dev-progress__card:hover  .dev-progress__percent  .dev-progress__percent-num .dev-progress__percent-a\n{\n    color:#fff;\n    font-size:60px;\n}\n.dev-progress  .dev-progress__percent  .dev-progress__percent-num span\n{\n    color:#ececec;\n    font-size:24px;\n    transition:0.5s;\n}\n.dev-progress .dev-progress__card:hover  .dev-progress__percent  .dev-progress__percent-num .dev-progress__percent-a span\n{\n    color:#fff;\n}\n.dev-progress .dev-progress__card-text\n{\n    position:relative;\n    color:#ececec;\n    margin-top:20px;\n    font-weight:700;\n    font-size:18px;\n    letter-spacing:1px;\n    text-transform:uppercase;\n    transition:0.5s;\n    overflow: hidden;\n}\n.dev-progress .dev-progress__card:hover .dev-progress__card-text\n{\n    color:#fff;\n}\n.dev-progress svg\n{\n    position:relative;\n    width:150px;\n    height:150px;\n    z-index:1000;\n}\n.dev-progress svg circle\n{\n    width:100%;\n    height:100%;\n    fill:none;\n    stroke:#82c6f3;\n    stroke-width:10;\n    stroke-linecap:round;\n    transform:translate(5px,5px);\n}\n.dev-progress svg circle:nth-child(2)\n{\n    stroke-dasharray:440;\n    stroke-dashoffset:440;\n}\n.dev-progress .dev-progress__card:nth-child(1) svg circle:nth-child(2)\n{\n    stroke-dashoffset:calc(440 - (440 * 90) / 100);\n    stroke:#c2c2c2;\n}\n\n\n.dev-progress-small {\n    top: 20px;\n    width: 220px;\n    height: 300px;\n}\n\n.dev-progress-small .dev-progress__card {\n    \n    width: 200px;\n    min-height: 200px;\n}\n\n.dev-progress-small .dev-progress__card-text {\n    font-size: xx-small;\n}\n\n.dev-progress-done .dev-progress__percent {\n    background: #6da462 !important;\n}\n\n.dev-progress-done .dev-progress__card {\n    background: #1a601e !important;\n}\n\n.dev-progress-hide .dev-progress__card\n{\n    transform:translateY(100px);\n    opacity: 0;\n}\n\n.dev-progress-before .dev-progress__card\n{\n    transform:translateY(100px);\n    opacity: 0;\n}\n\n\n\n.dev-progress ul {\n    color: #c2c2c2;\n    padding: 10px;\n    font-size: smaller;\n    list-style-type: none;\n    cursor: pointer;\n    user-select: none;\n}\n\n\n\n.dev-progress li {\n    display: flex;\n    text-transform: none;\n    gap: 5px;\n    transition: all .3s;\n    margin-bottom: 5px;\n}\n\n.dev-progress li.dev-progress-li-hidden {\n    font-size: 0;\n    opacity: .5;\n    padding: 0;\n    margin: 0;\n}\n\n.dev-progress li.dev-progress-li-active {\n    color: white;\n    text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.3);\n}\n\n.dev-progress li:hover {\n    text-shadow: 0px 3px 4px rgb(0, 0, 0, .5);\n}\n\n\n.dev-progress li span:first-child {\n    flex-grow: 1;\n    overflow: hidden;\n    text-align: left;\n}";
n(css,{});

/**
 * SmartProgressBar - create the pop-up bar with several progress elements
 */
var _whereHtml = /*#__PURE__*/new WeakMap();
var _settings = /*#__PURE__*/new WeakMap();
var _createStyle = /*#__PURE__*/new WeakSet();
var _createHtml = /*#__PURE__*/new WeakSet();
var _createEvents = /*#__PURE__*/new WeakSet();
var _setValue = /*#__PURE__*/new WeakSet();
var _mount = /*#__PURE__*/new WeakSet();
var _unmount = /*#__PURE__*/new WeakSet();
var SmartProgressBar = /*#__PURE__*/function () {
  /**
   * Create instance and html
   * @param settings -  base settings object for init bar
   * @param {string} [settings.whereSelector="body"] - selector for place modal body
   * @param {bool} [settings.show=true] - show pop-up immediately
   * @param {bool} [settings.headerText="Loading"] - displayed text
   * @param {bool} [settings.minimize=false] - display in compact size
   * @param {bool} [settings.changeSizeOnClick=true] - enable change size on click
   */
  function SmartProgressBar(_ref) {
    var _ref$whereSelector = _ref.whereSelector,
      whereSelector = _ref$whereSelector === void 0 ? "body" : _ref$whereSelector,
      _ref$show = _ref.show,
      show = _ref$show === void 0 ? true : _ref$show,
      _ref$headerText = _ref.headerText,
      headerText = _ref$headerText === void 0 ? "Loading" : _ref$headerText,
      _ref$minimize = _ref.minimize,
      minimize = _ref$minimize === void 0 ? false : _ref$minimize,
      _ref$changeSizeOnClic = _ref.changeSizeOnClick,
      changeSizeOnClick = _ref$changeSizeOnClic === void 0 ? true : _ref$changeSizeOnClic;
    _classCallCheck(this, SmartProgressBar);
    _classPrivateMethodInitSpec(this, _unmount);
    _classPrivateMethodInitSpec(this, _mount);
    _classPrivateMethodInitSpec(this, _setValue);
    _classPrivateMethodInitSpec(this, _createEvents);
    _classPrivateMethodInitSpec(this, _createHtml);
    _classPrivateMethodInitSpec(this, _createStyle);
    _classPrivateFieldInitSpec(this, _whereHtml, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _settings, {
      writable: true,
      value: {
        classes: ClassList,
        mini: false,
        activeProgress: null,
        progressList: [],
        texts: {
          headerText: ""
        }
      }
    });
    _classPrivateFieldSet(this, _whereHtml, document.querySelector(whereSelector));
    _classPrivateFieldGet(this, _settings).texts.headerText = headerText;
    _classPrivateFieldGet(this, _settings).changeSizeOnClick = changeSizeOnClick;
    _classPrivateMethodGet(this, _createHtml, _createHtml2).call(this);
    _classPrivateMethodGet(this, _createEvents, _createEvents2).call(this);
    _classPrivateMethodGet(this, _createStyle, _createStyle2).call(this);
    if (minimize) this.minimize();
    if (show) this.show();
  }
  _createClass(SmartProgressBar, [{
    key: "addProgress",
    value:
    /**
     * Create new instance of SmartProgressElement, mount and return it
     * @param settings
     * @param {string} [settings.name="element"] - name of progress
     * @param {number} [settings.progress=0] - number of progress
     * @returns {SmartProgressElement}
     */
    function addProgress(_ref2) {
      var _this = this;
      var _ref2$name = _ref2.name,
        name = _ref2$name === void 0 ? "element" : _ref2$name,
        _ref2$progress = _ref2.progress,
        progress = _ref2$progress === void 0 ? 0 : _ref2$progress;
      var newProgress = new SmartProgressElement({
        context: this,
        name: name
      });
      _classPrivateFieldGet(this, _settings).progressList.push(newProgress);
      newProgress.onclick = function () {
        _this.makeProgressActive(newProgress);
      };
      this.progressContainer.appendChild(newProgress.HtmlContainer);
      // первоначальное инифиализация
      newProgress.progress = progress;
      if (_classPrivateFieldGet(this, _settings).progressList.length === 1) this.makeProgressActive(newProgress);
      return newProgress;
    }
    /**
     * Remove progress form main modal
     * @param {SmartProgressElement} progress
     */
  }, {
    key: "removeProgress",
    value: function removeProgress(progress) {
      var _this2 = this;
      _classPrivateFieldGet(this, _settings).progressList.splice(_classPrivateFieldGet(this, _settings).progressList.indexOf(progress), 1);
      if (_classPrivateFieldGet(this, _settings).activeProgress === progress) {
        this.makeProgressActive(_classPrivateFieldGet(this, _settings).progressList[0]);
      }
      progress.hide(function () {
        _this2.progressContainer.removeChild(progress.HtmlContainer);
      });
    }
  }, {
    key: "minimize",
    value: function minimize() {
      if (_classPrivateFieldGet(this, _settings).mini) {
        this.main.classList.remove(_classPrivateFieldGet(this, _settings).classes.mainSmall);
        _classPrivateFieldGet(this, _settings).mini = false;
      } else {
        this.main.classList.add(_classPrivateFieldGet(this, _settings).classes.mainSmall);
        _classPrivateFieldGet(this, _settings).mini = true;
      }
    }
    /**
     * settter for main progress
     */
  }, {
    key: "progress",
    set: function set(data) {
      if (data === 100) this.main.classList.add(_classPrivateFieldGet(this, _settings).classes.mainDone);else this.main.classList.remove(_classPrivateFieldGet(this, _settings).classes.mainDone);
      _classPrivateMethodGet(this, _setValue, _setValue2).call(this, data);
      this.progressLine.style.left = parseInt(-100 + data) + "%";
    }
  }, {
    key: "tryChangeProgress",
    value: function tryChangeProgress(prog, value) {
      if (_classPrivateFieldGet(this, _settings).activeProgress === prog) this.progress = value;
    }
    /**
     * All progress changes will apply to header progress
     * @param {SmartProgressElement} prog - Progress, created by addProgress()
     */
  }, {
    key: "makeProgressActive",
    value: function makeProgressActive(prog) {
      if (prog === undefined) {
        this.progress = 0;
        return;
      }
      _classPrivateFieldGet(this, _settings).activeProgress = prog;
      _classPrivateFieldGet(this, _settings).progressList.forEach(function (e) {
        if (e === prog) e.makeActive();else e.removeActive();
      });
      this.progress = prog.progress;
    }
    /**
     * Shows modal window
     */
  }, {
    key: "show",
    value: function show() {
      var _this3 = this;
      if (this.isMounted) return;
      this.main.classList.add(_classPrivateFieldGet(this, _settings).classes.mainAnimationHidden);
      _classPrivateMethodGet(this, _mount, _mount2).call(this);
      setTimeout(function () {
        return _this3.main.classList.remove(_classPrivateFieldGet(_this3, _settings).classes.mainAnimationHidden);
      }, 0);
    }
    /**
     * Hide modal window
     */
  }, {
    key: "hide",
    value: function hide() {
      var _this4 = this;
      if (!this.isMounted) return;
      this.main.classList.add(_classPrivateFieldGet(this, _settings).classes.mainAnimationHide);
      var listener = function listener() {
        _classPrivateMethodGet(_this4, _unmount, _unmount2).call(_this4);
        _this4.main.removeEventListener("transitionend", listener);
        _this4.main.classList.remove(_classPrivateFieldGet(_this4, _settings).classes.mainAnimationHide);
      };
      this.main.addEventListener("transitionend", listener);
    }
    /**
     * mounted flag
     */
  }, {
    key: "isMounted",
    get: function get() {
      return _classPrivateFieldGet(this, _whereHtml) === this.main.parentElement;
    }
  }]);
  return SmartProgressBar;
}();
function _createStyle2() {
  this.style = createEl(false, "style", css);
}
function _createHtml2() {
  var c = createEl;
  var sc = _classPrivateFieldGet(this, _settings).classes;
  this.main = c(sc.main);
  this.card = c(sc.card);
  this.progressLine = c(sc.cardProgress);
  var div = c(sc.container);
  var percent = c(sc.percent);
  var SVG = c("", "svg");
  var cir = createCircle(70);
  var num = c(sc.number);
  var h5 = c("", "h5");
  this.progressHtml = c(sc.numberText, "span", "0");
  var span = c("", "span", "%");
  this.header = c(sc.headerText, "h5", _classPrivateFieldGet(this, _settings).texts.headerText);
  this.progressContainer = c("", "ul");
  this.main.appendChild(this.card);
  this.card.appendChild(div);
  this.card.appendChild(this.progressLine);
  div.appendChild(percent);
  div.appendChild(this.header);
  div.appendChild(this.progressContainer);
  percent.appendChild(SVG);
  percent.appendChild(num);
  SVG.appendChild(cir);
  num.appendChild(h5);
  h5.appendChild(this.progressHtml);
  h5.appendChild(span);
  return this.main;
}
function _createEvents2() {
  var _this5 = this;
  this.progressContainer.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  if (_classPrivateFieldGet(this, _settings).changeSizeOnClick) this.main.addEventListener("click", function () {
    return _this5.minimize();
  });
}
function _setValue2(val) {
  this.progressHtml.innerText = val;
}
function _mount2() {
  document.head.appendChild(this.style);
  _classPrivateFieldGet(this, _whereHtml).appendChild(this.main);
}
function _unmount2() {
  document.head.removeChild(this.style);
  _classPrivateFieldGet(this, _whereHtml).removeChild(this.main);
}

export { SmartProgressBar };
