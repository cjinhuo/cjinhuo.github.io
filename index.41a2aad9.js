import"./chunks/index.4d20ed52.js";import{r as E}from"./chunks/index.26158d41.js";import{j as C}from"./chunks/jsx-runtime.5df50126.js";var B=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function j(c){return c&&c.__esModule&&Object.prototype.hasOwnProperty.call(c,"default")?c.default:c}var _={exports:{}};/*!
 * 
 *   typed.js - A JavaScript Typing Animation Library
 *   Author: Matt Boldt <me@mattboldt.com>
 *   Version: v2.0.12
 *   Url: https://github.com/mattboldt/typed.js
 *   License(s): MIT
 * 
 */(function(c,b){(function(r,h){c.exports=h()})(B,function(){return function(m){var r={};function h(p){if(r[p])return r[p].exports;var o=r[p]={exports:{},id:p,loaded:!1};return m[p].call(o.exports,o,o.exports,h),o.loaded=!0,o.exports}return h.m=m,h.c=r,h.p="",h(0)}([function(m,r,h){Object.defineProperty(r,"__esModule",{value:!0});var p=function(){function u(s,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(s,n.key,n)}}return function(s,e,i){return e&&u(s.prototype,e),i&&u(s,i),s}}();function o(u,s){if(!(u instanceof s))throw new TypeError("Cannot call a class as a function")}var g=h(1),y=h(3),d=function(){function u(s,e){o(this,u),g.initializer.load(this,e,s),this.begin()}return p(u,[{key:"toggle",value:function(){this.pause.status?this.start():this.stop()}},{key:"stop",value:function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this))}},{key:"start",value:function(){this.typingComplete||!this.pause.status||(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this))}},{key:"destroy",value:function(){this.reset(!1),this.options.onDestroy(this)}},{key:"reset",value:function(){var e=arguments.length<=0||arguments[0]===void 0?!0:arguments[0];clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,e&&(this.insertCursor(),this.options.onReset(this),this.begin())}},{key:"begin",value:function(){var e=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){!e.currentElContent||e.currentElContent.length===0?e.typewrite(e.strings[e.sequence[e.arrayPos]],e.strPos):e.backspace(e.currentElContent,e.currentElContent.length)},this.startDelay)}},{key:"typewrite",value:function(e,i){var n=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var t=this.humanizer(this.typeSpeed),a=1;if(this.pause.status===!0){this.setPauseStatus(e,i,!0);return}this.timeout=setTimeout(function(){i=y.htmlParser.typeHtmlChars(e,i,n);var l=0,f=e.substr(i);if(f.charAt(0)==="^"&&/^\^\d+/.test(f)){var k=1;f=/\d+/.exec(f)[0],k+=f.length,l=parseInt(f),n.temporaryPause=!0,n.options.onTypingPaused(n.arrayPos,n),e=e.substring(0,i)+e.substring(i+k),n.toggleBlinking(!0)}if(f.charAt(0)==="`"){for(;e.substr(i+a).charAt(0)!=="`"&&(a++,!(i+a>e.length)););var v=e.substring(0,i),T=e.substring(v.length+1,i+a),w=e.substring(i+a+1);e=v+T+w,a--}n.timeout=setTimeout(function(){n.toggleBlinking(!1),i>=e.length?n.doneTyping(e,i):n.keepTyping(e,i,a),n.temporaryPause&&(n.temporaryPause=!1,n.options.onTypingResumed(n.arrayPos,n))},l)},t)}},{key:"keepTyping",value:function(e,i,n){i===0&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this)),i+=n;var t=e.substr(0,i);this.replaceText(t),this.typewrite(e,i)}},{key:"doneTyping",value:function(e,i){var n=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),!(this.arrayPos===this.strings.length-1&&(this.complete(),this.loop===!1||this.curLoop===this.loopCount))&&(this.timeout=setTimeout(function(){n.backspace(e,i)},this.backDelay))}},{key:"backspace",value:function(e,i){var n=this;if(this.pause.status===!0){this.setPauseStatus(e,i,!1);return}if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var t=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){i=y.htmlParser.backSpaceHtmlChars(e,i,n);var a=e.substr(0,i);if(n.replaceText(a),n.smartBackspace){var l=n.strings[n.arrayPos+1];l&&a===l.substr(0,i)?n.stopNum=i:n.stopNum=0}i>n.stopNum?(i--,n.backspace(e,i)):i<=n.stopNum&&(n.arrayPos++,n.arrayPos===n.strings.length?(n.arrayPos=0,n.options.onLastStringBackspaced(),n.shuffleStringsIfNeeded(),n.begin()):n.typewrite(n.strings[n.sequence[n.arrayPos]],i))},t)}},{key:"complete",value:function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0}},{key:"setPauseStatus",value:function(e,i,n){this.pause.typewrite=n,this.pause.curString=e,this.pause.curStrPos=i}},{key:"toggleBlinking",value:function(e){!this.cursor||this.pause.status||this.cursorBlinking!==e&&(this.cursorBlinking=e,e?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink"))}},{key:"humanizer",value:function(e){return Math.round(Math.random()*e/2)+e}},{key:"shuffleStringsIfNeeded",value:function(){!this.shuffle||(this.sequence=this.sequence.sort(function(){return Math.random()-.5}))}},{key:"initFadeOut",value:function(){var e=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){e.arrayPos++,e.replaceText(""),e.strings.length>e.arrayPos?e.typewrite(e.strings[e.sequence[e.arrayPos]],0):(e.typewrite(e.strings[0],0),e.arrayPos=0)},this.fadeOutDelay)}},{key:"replaceText",value:function(e){this.attr?this.el.setAttribute(this.attr,e):this.isInput?this.el.value=e:this.contentType==="html"?this.el.innerHTML=e:this.el.textContent=e}},{key:"bindFocusEvents",value:function(){var e=this;!this.isInput||(this.el.addEventListener("focus",function(i){e.stop()}),this.el.addEventListener("blur",function(i){e.el.value&&e.el.value.length!==0||e.start()}))}},{key:"insertCursor",value:function(){!this.showCursor||this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling))}}]),u}();r.default=d,m.exports=r.default},function(m,r,h){Object.defineProperty(r,"__esModule",{value:!0});var p=Object.assign||function(i){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(i[a]=t[a])}return i},o=function(){function i(n,t){for(var a=0;a<t.length;a++){var l=t[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(n,l.key,l)}}return function(n,t,a){return t&&i(n.prototype,t),a&&i(n,a),n}}();function g(i){return i&&i.__esModule?i:{default:i}}function y(i,n){if(!(i instanceof n))throw new TypeError("Cannot call a class as a function")}var d=h(2),u=g(d),s=function(){function i(){y(this,i)}return o(i,[{key:"load",value:function(t,a,l){if(typeof l=="string"?t.el=document.querySelector(l):t.el=l,t.options=p({},u.default,a),t.isInput=t.el.tagName.toLowerCase()==="input",t.attr=t.options.attr,t.bindInputFocusEvents=t.options.bindInputFocusEvents,t.showCursor=t.isInput?!1:t.options.showCursor,t.cursorChar=t.options.cursorChar,t.cursorBlinking=!0,t.elContent=t.attr?t.el.getAttribute(t.attr):t.el.textContent,t.contentType=t.options.contentType,t.typeSpeed=t.options.typeSpeed,t.startDelay=t.options.startDelay,t.backSpeed=t.options.backSpeed,t.smartBackspace=t.options.smartBackspace,t.backDelay=t.options.backDelay,t.fadeOut=t.options.fadeOut,t.fadeOutClass=t.options.fadeOutClass,t.fadeOutDelay=t.options.fadeOutDelay,t.isPaused=!1,t.strings=t.options.strings.map(function(w){return w.trim()}),typeof t.options.stringsElement=="string"?t.stringsElement=document.querySelector(t.options.stringsElement):t.stringsElement=t.options.stringsElement,t.stringsElement){t.strings=[],t.stringsElement.style.display="none";var f=Array.prototype.slice.apply(t.stringsElement.children),k=f.length;if(k)for(var v=0;v<k;v+=1){var T=f[v];t.strings.push(T.innerHTML.trim())}}t.strPos=0,t.arrayPos=0,t.stopNum=0,t.loop=t.options.loop,t.loopCount=t.options.loopCount,t.curLoop=0,t.shuffle=t.options.shuffle,t.sequence=[],t.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},t.typingComplete=!1;for(var v in t.strings)t.sequence[v]=v;t.currentElContent=this.getCurrentElContent(t),t.autoInsertCss=t.options.autoInsertCss,this.appendAnimationCss(t)}},{key:"getCurrentElContent",value:function(t){var a="";return t.attr?a=t.el.getAttribute(t.attr):t.isInput?a=t.el.value:t.contentType==="html"?a=t.el.innerHTML:a=t.el.textContent,a}},{key:"appendAnimationCss",value:function(t){var a="data-typed-js-css";if(!!t.autoInsertCss&&!(!t.showCursor&&!t.fadeOut)&&!document.querySelector("["+a+"]")){var l=document.createElement("style");l.type="text/css",l.setAttribute(a,!0);var f="";t.showCursor&&(f+=`
        .typed-cursor{
          opacity: 1;
        }
        .typed-cursor.typed-cursor--blink{
          animation: typedjsBlink 0.7s infinite;
          -webkit-animation: typedjsBlink 0.7s infinite;
                  animation: typedjsBlink 0.7s infinite;
        }
        @keyframes typedjsBlink{
          50% { opacity: 0.0; }
        }
        @-webkit-keyframes typedjsBlink{
          0% { opacity: 1; }
          50% { opacity: 0.0; }
          100% { opacity: 1; }
        }
      `),t.fadeOut&&(f+=`
        .typed-fade-out{
          opacity: 0;
          transition: opacity .25s;
        }
        .typed-cursor.typed-cursor--blink.typed-fade-out{
          -webkit-animation: 0;
          animation: 0;
        }
      `),l.length!==0&&(l.innerHTML=f,document.body.appendChild(l))}}}]),i}();r.default=s;var e=new s;r.initializer=e},function(m,r){Object.defineProperty(r,"__esModule",{value:!0});var h={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:1/0,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(o){},onComplete:function(o){},preStringTyped:function(o,g){},onStringTyped:function(o,g){},onLastStringBackspaced:function(o){},onTypingPaused:function(o,g){},onTypingResumed:function(o,g){},onReset:function(o){},onStop:function(o,g){},onStart:function(o,g){},onDestroy:function(o){}};r.default=h,m.exports=r.default},function(m,r){Object.defineProperty(r,"__esModule",{value:!0});var h=function(){function y(d,u){for(var s=0;s<u.length;s++){var e=u[s];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(d,e.key,e)}}return function(d,u,s){return u&&y(d.prototype,u),s&&y(d,s),d}}();function p(y,d){if(!(y instanceof d))throw new TypeError("Cannot call a class as a function")}var o=function(){function y(){p(this,y)}return h(y,[{key:"typeHtmlChars",value:function(u,s,e){if(e.contentType!=="html")return s;var i=u.substr(s).charAt(0);if(i==="<"||i==="&"){var n="";for(i==="<"?n=">":n=";";u.substr(s+1).charAt(0)!==n&&(s++,!(s+1>u.length)););s++}return s}},{key:"backSpaceHtmlChars",value:function(u,s,e){if(e.contentType!=="html")return s;var i=u.substr(s).charAt(0);if(i===">"||i===";"){var n="";for(i===">"?n="<":n="&";u.substr(s-1).charAt(0)!==n&&(s--,!(s<0)););s--}return s}}]),y}();r.default=o;var g=new o;r.htmlParser=g}])})})(_);const O=j(_.exports),x="typed-cursor";function M(){const c=E.exports.useRef(null),b=E.exports.useRef(null),m=()=>{b.current&&(new O(b.current,{strings:["I like designing SDK architecture and really into new tech things. ^1000 Now focusing on Monitoring of Web and Mini Program at Bytedance."],typeSpeed:30,loop:!1}),setTimeout(()=>{const r=b.current?.parentElement?.lastElementChild;r&&r?.classList.contains(x)&&b.current?.parentElement?.removeChild(r)},8e3))};return E.exports.useEffect(()=>{c.current&&(new O(c.current,{strings:["Hey, I'm cjinhuo.","Hey, I'm Shanks."],typeSpeed:50,backSpeed:36,smartBackspace:!0,loop:!1}),setTimeout(()=>{const r=c.current?.parentElement?.lastElementChild;r&&r?.classList.contains(x)&&c.current?.parentElement?.removeChild(r),m()},4e3))},[c]),C.exports.jsxs("div",{style:{height:"100%",width:"100%"},children:[C.exports.jsx("div",{className:"h-10",children:C.exports.jsx("div",{className:"inline w-auto text-skin-neutral-1 text-2xl font-mono font-semibold antialiased typed-name",ref:c})}),C.exports.jsx("div",{children:C.exports.jsx("div",{className:"inline w-auto text-skin-neutral-3 font-mono",ref:b})})]})}export{M as default};
