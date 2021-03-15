"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("atom");function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var i=t(e);function n(e){atom.notifications.addError(e.name,{stack:e.stack,detail:e.message})}class o{constructor(){this.pointToElementsMap=new Map,this.element=document.createElement("div"),this.element.classList.add("outline-view")}destroy(){this.element.remove()}getElement(){return this.element}getTitle(){return"Outline"}getIconName(){return"list-unordered"}setOutline(e,t,i){const n=this.clearOutline();if(i){const e=document.createElement("div");e.innerHTML='\n        <span style = "\n          font-size: var(--editor-font-size);\n          font-family: var(--editor-font-family);\n          line-height: var(--editor-line-height);\n          color: #71844c;\n        "\n        >Large file mode</span>\n      ',n.appendChild(e)}const o=document.createElement("ul");s(o,e,t,this.pointToElementsMap,i||atom.config.get("atom-ide-outline.foldInitially")),n.appendChild(o)}clearOutline(){const e=this.getElement();return e.innerHTML="",e}presentStatus(e){this.clearOutline();const t=e&&function(e){const t=document.createElement("div");t.className="status";const{title:i="",description:n=""}=e;return t.innerHTML=`<h1>${i}</h1>\n  <span>${n}</span>`,t}(e);if(t){this.getElement().appendChild(t)}}selectAtCursorLine(e){if(!this.isVisible())return;if(r)return void(r=!1);if(void 0!==this.focusedElms)for(const e of this.focusedElms)e.toggleAttribute("cursorOn",!1);const t=e.row;if(this.focusedElms=this.pointToElementsMap.get(t),void 0!==this.focusedElms)for(const e of this.focusedElms)e.toggleAttribute("cursorOn",!0),e.scrollIntoView({block:"center"})}isVisible(){return function(e){const t=atom.workspace.paneContainerForItem(e);return void 0!==t&&("function"!=typeof t.isVisible||t.isVisible())}(this)}}let r=!1;function s(e,t,i,n,o,c=0){var u;const f=i.getTabLength(),p=16*("number"==typeof f?f:4);atom.config.get("atom-ide-outline.sortEntries")&&t.sort(((e,t)=>{const i=e.startPosition.row-t.startPosition.row;return 0===i?e.startPosition.column-e.startPosition.column:i}));for(const f of t){const t=document.createElement("li"),v=document.createElement("span");v.innerText=null!==(u=f.representativeName||f.plainText)&&void 0!==u?u:"",v.prepend(a(null==f?void 0:f.icon,null==f?void 0:f.kind)),t.appendChild(v);const m=n.get(f.startPosition.row);if(void 0!==m?(m.push(t),n.set(f.startPosition.row,m)):n.set(f.startPosition.row,[t]),t.addEventListener("click",(()=>{const e=atom.workspace.paneForItem(i);e&&(e.activate(),i.getCursors()[0].setBufferPosition(f.startPosition,{autoscroll:!0}),r=!0)}),{passive:!0}),null==f.children||null==f.children[0])v.style.paddingLeft=0!==c?p*c+"px":`${l}px`;else{v.style.paddingLeft=0!==c?p*c-l+"px":"0px";const e=document.createElement("ul");e.addEventListener("click",(e=>e.stopPropagation()),{passive:!0}),t.appendChild(e);const r=d(e,o);v.prepend(r),s(e,f.children,i,n,o,c+1)}e.appendChild(t)}}function a(e,t){const i=document.createElement("span");i.classList.add("outline-icon"),null==t&&null!=e&&(t=e);let n="•";if("string"==typeof t&&t.length>0){let e;0===t.indexOf("type-")?(e=`${t}`,n=t.replace("type-","")):(e=`type-${t}`,n=t),i.classList.add(e)}return i.innerHTML=`<span>${n.substring(0,3)}</span>`,i}const l=20;function d(e,t){const i=document.createElement("button");return t?(e.hidden=!0,i.classList.add("outline-fold-btn","collapsed")):i.classList.add("outline-fold-btn","expanded"),i.addEventListener("click",(t=>{e.hidden=!e.hidden,e.hidden?(i.classList.remove("expanded"),i.classList.add("collapsed")):(i.classList.remove("collapsed"),i.classList.add("expanded")),t.stopPropagation()}),{passive:!0}),i}var c="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var u,f=(function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.ProviderRegistry=void 0,t.ProviderRegistry=class{constructor(){this.providers=[]}addProvider(e){const t=this.providers.findIndex((t=>e.priority>t.priority));return-1===t?this.providers.push(e):this.providers.splice(t,0,e),new i.default.Disposable((()=>{this.removeProvider(e)}))}removeProvider(e){const t=this.providers.indexOf(e);-1!==t&&this.providers.splice(t,1)}getProviderForEditor(e){const t=e.getGrammar().scopeName;return this.findProvider(t)}getAllProvidersForEditor(e){const t=e.getGrammar().scopeName;return this.findAllProviders(t)}findProvider(e){for(const t of this.findAllProviders(e))return t;return null}*findAllProviders(e){for(const t of this.providers)null!=t.grammarScopes&&-1===t.grammarScopes.indexOf(e)||(yield t)}}}(u={exports:{}},u.exports),u.exports);const p={noEditor:{title:"Outline is unavailable.",description:"Open a text editor."},noProvider:{title:"Provider is unavailable",description:"Looks like a provider for this type of file is not available. Check if a relevant IDE language package is installed and has outline support, or try adding one from Atom's package registry (e.g.: atom-ide-javascript, atom-typescript, ide-python, ide-rust, ide-css, ide-json)."}};var v=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)},m="object"==typeof c&&c&&c.Object===Object&&c,g="object"==typeof self&&self&&self.Object===Object&&self,h=m||g||Function("return this")(),y=function(){return h.Date.now()},b=/\s/;var w=function(e){for(var t=e.length;t--&&b.test(e.charAt(t)););return t},E=/^\s+/;var x=function(e){return e?e.slice(0,w(e)+1).replace(E,""):e},P=h.Symbol,O=Object.prototype,T=O.hasOwnProperty,L=O.toString,k=P?P.toStringTag:void 0;var j=function(e){var t=T.call(e,k),i=e[k];try{e[k]=void 0;var n=!0}catch(e){}var o=L.call(e);return n&&(t?e[k]=i:delete e[k]),o},C=Object.prototype.toString;var I=function(e){return C.call(e)},A=P?P.toStringTag:void 0;var M=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":A&&A in Object(e)?j(e):I(e)};var S=function(e){return null!=e&&"object"==typeof e};var D=function(e){return"symbol"==typeof e||S(e)&&"[object Symbol]"==M(e)},F=/^[-+]0x[0-9a-f]+$/i,N=/^0b[01]+$/i,$=/^0o[0-7]+$/i,V=parseInt;var R=function(e){if("number"==typeof e)return e;if(D(e))return NaN;if(v(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=v(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=x(e);var i=N.test(e);return i||$.test(e)?V(e.slice(2),i?2:8):F.test(e)?NaN:+e},B=Math.max,H=Math.min;var _=function(e,t,i){var n,o,r,s,a,l,d=0,c=!1,u=!1,f=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function p(t){var i=n,r=o;return n=o=void 0,d=t,s=e.apply(r,i)}function m(e){return d=e,a=setTimeout(h,t),c?p(e):s}function g(e){var i=e-l;return void 0===l||i>=t||i<0||u&&e-d>=r}function h(){var e=y();if(g(e))return b(e);a=setTimeout(h,function(e){var i=t-(e-l);return u?H(i,r-(e-d)):i}(e))}function b(e){return a=void 0,f&&n?p(e):(n=o=void 0,s)}function w(){var e=y(),i=g(e);if(n=arguments,o=this,l=e,i){if(void 0===a)return m(l);if(u)return clearTimeout(a),a=setTimeout(h,t),p(l)}return void 0===a&&(a=setTimeout(h,t)),s}return t=R(t)||0,v(i)&&(c=!!i.leading,r=(u="maxWait"in i)?B(R(i.maxWait)||0,t):r,f="trailing"in i?!!i.trailing:f),w.cancel=function(){void 0!==a&&clearTimeout(a),d=0,n=l=o=a=void 0},w.flush=function(){return void 0===a?s:b(y())},w},z={initialDisplay:{title:"Initial Outline Display",description:"Show outline initially aftern atom loads",type:"boolean",default:!0},sortEntries:{title:"Sort entries based on the line number",description:"This option sorts the entries based on where they appear in the code.",type:"boolean",default:!0},foldInitially:{title:"Fold the entries initially",description:"If enabled, the outline entries are folded initially. This is enabled automatically in large file mode.",type:"boolean",default:!1}};const G=new e.CompositeDisposable;let W;const q=new f.ProviderRegistry;const U=atom.config.get("linter-ui-default.longLineLength")||4e3,J=atom.config.get("linter-ui-default.largeFileLineCount")/6||3e3;function K(e){if(e.largeFileMode)return 2e4;const t=e.getLineCount();if(t>=J)return t;{const i=e.getBuffer();for(let e=0,n=t;e<n;e++)if(i.lineLengthForRow(e)>U)return U;return 0}}let Q;async function X(e){var t;if(void 0===e)return;null===(t=null==Q?void 0:Q.dispose)||void 0===t||t.call(Q),await ee(e);const i=K(e),n=Math.max(i/5,300),o=_(ee,n);Q.add(e.onDidStopChanging((async()=>{await o(e)})),e.onDidDestroy((()=>{te("noEditor")})))}function Y(){const e=atom.workspace.getActiveTextEditor();void 0!==e&&void 0!==W&&W.selectAtCursorLine(e.getCursorBufferPosition())}async function Z(){void 0===W&&(W=new o);const e=atom.workspace.paneForItem(W);if(e)return void e.destroyItem(W);const t=atom.workspace.getRightDock(),[i]=t.getPanes();i.addItem(W),i.activateItem(W),t.show();try{await X(atom.workspace.getActiveTextEditor())}catch(e){n(e)}}async function ee(e=atom.workspace.getActiveTextEditor()){var t;if(void 0===W&&(W=new o),!W.isVisible())return;if(void 0===e)return te("noEditor");const i=q.getProviderForEditor(e);if(!i)return te("noProvider");const n=await i.getOutline(e);W.setOutline(null!==(t=null==n?void 0:n.outlineTrees)&&void 0!==t?t:[],e,Boolean(K(e)))}function te(e){null==W||W.presentStatus(p[e])}exports.activate=function(){G.add(atom.commands.add("atom-workspace","outline:toggle",Z),atom.commands.add("atom-workspace","outline:reveal-cursor",Y)),function(){Q=new e.CompositeDisposable;const t=atom.workspace.observeActiveTextEditor(X);G.add(t)}(),atom.config.get("atom-ide-outline.initialDisplay")&&Z().catch((e=>{n(e)}))},exports.config=z,exports.consumeOutlineProvider=async function(e){G.add(q.addProvider(e)),await ee()},exports.deactivate=function(){var e;null===(e=null==Q?void 0:Q.dispose)||void 0===e||e.call(Q),G.dispose(),null==W||W.destroy(),W=void 0},exports.getOutline=ee,exports.outlineProviderRegistry=q,exports.revealCursor=Y,exports.setStatus=te,exports.statuses=p,exports.toggleOutlineView=Z;
//# sourceMappingURL=main.js.map
