!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).OnScrollTo=e()}(this,function(){"use strict";function t(){return window.pageYOffset}function e(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function n(){if("undefined"!=typeof window&&window.OnScrollToDebug){for(var t,n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];(t=console).log.apply(t,e(["[on-scroll-to]"].concat(o)))}}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),o.forEach(function(e){r(t,e,n[e])})}return t}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}return function(){function e(t,i,s,c){var a=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),r(this,"onScroll",function(){return a.onCheckScrollStatus({reason:"scroll"})}),r(this,"onResize",function(){return a.onCheckScrollStatus({reason:"resize"})}),r(this,"onIntersectViewport",function(t,e){t[0].isIntersecting&&a.onScrollTo()}),r(this,"onResult",function(t){!0===t?a.enable():a.hide()}),r(this,"onError",function(t){console.error(t),a.setState({error:t})}),this.getElement=t,this._onScrollTo=i,this.onStateChange=s,this.options=o({},c),void 0===this.options.distance&&(this.options.distance="undefined"==typeof window?0:window.innerHeight),this.state={},n("~ Initialize ~"),n("Distance",this.options.distance)}var s,c,a;return s=e,(c=[{key:"onMount",value:function(){if(this.isMounted=!0,n("Mounted"),window.IntersectionObserver){var t=this.options.distance;this.intersectionObserver=new IntersectionObserver(this.onIntersectViewport,{root:null,rootMargin:"".concat(t,"px 0px ").concat(t,"px 0px"),threshold:0}),this.intersectionObserver.observe(this.getElement())}else window.addEventListener("scroll",this.onScroll),window.addEventListener("resize",this.onResize),this.onCheckScrollStatus({reason:"mount"})}},{key:"onUnmount",value:function(){this.isMounted&&(this.isMounted=!1,n("Unmount"),this.intersectionObserver?this.intersectionObserver.disconnect():(window.addEventListener("scroll",this.onScroll),window.addEventListener("resize",this.onResize)))}},{key:"onCheckScrollStatus",value:function(t){this.getState().loading||(n("Check scroll status (".concat(t,")")),this.isVisible()&&this.onScrollTo())}},{key:"isVisible",value:function(){var e,n=this.options.distance,o=this.getElementCoordinates(),i=o.top,r=o.bottom,s=(e=window.innerHeight,{top:t(),bottom:t()+e,height:e});return r>=s.top-n&&i<=s.bottom+n}},{key:"getElementCoordinates",value:function(){var t=this.getElement().getBoundingClientRect(),e=t.top;return{top:e,bottom:e+t.height}}},{key:"getState",value:function(){return this.state}},{key:"setState",value:function(t){n("Set state",t),this.state=o({},this.state,t),n("New state",this.state),this.onStateChange(this.state)}},{key:"onScrollTo",value:function(){n("On scroll to"),this.disable(),function(t,e,n){try{var o=t();o&&"function"==typeof o.then?o.then(e,n):e(o)}catch(t){n(t)}}(this._onScrollTo,this.onResult,this.onError)}},{key:"disable",value:function(){n("Disable while loading"),this.setState({loading:!0}),this.intersectionObserver&&this.intersectionObserver.disconnect()}},{key:"isEnabled",value:function(){var t=this.getState(),e=t.loading,n=t.error;return!e&&!n}},{key:"enable",value:function(){n("Enable"),this.setState({loading:void 0,error:void 0}),this.intersectionObserver?this.intersectionObserver.observe(this.getElement()):this.onCheckScrollStatus({reason:"re-enable"})}},{key:"retry",value:function(){if(!this.getState().error)throw new Error("[on-scroll-to] No error");n("Retry"),this.enable()}},{key:"hide",value:function(){n("Hide"),this.setState({hidden:!0}),this.onUnmount()}}])&&i(s.prototype,c),a&&i(s,a),e}()});
//# sourceMappingURL=on-scroll-to.js.map
