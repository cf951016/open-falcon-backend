/*! grafana - v2.1.0-pre1 - 2015-09-01
 * Copyright (c) 2015 Torkel Ödegaard; Licensed Apache License */

define(["angular","lodash","config","./gfunc","./parser"],function(a,b,c,d,e){"use strict";var f=a.module("grafana.controllers"),g="ABCDEFGHIJKLMNOPQRSTUVWXYZ";f.controller("GraphiteQueryCtrl",["$scope","$sce","templateSrv",function(c,f,h){function i(){if(c.functions=[],c.segments=[],delete c.parserError,!c.target.textEditor){var a=new e(c.target.target),b=a.getAst();if(null===b)return void m(0);if("error"===b.type)return c.parserError=b.message+" at position: "+b.pos,void(c.target.textEditor=!0);try{k(b)}catch(d){c.parserError=d.message,c.target.textEditor=!0}}}function j(a,b,c,d){d&&(c=Math.max(c-1,0)),a.params[c]=b}function k(a,e,f){if(null===a)return null;switch(a.type){case"function":var g=d.createFuncInstance(a.name,{withDefaultParams:!1});b.each(a.params,function(a,b){k(a,g,b)}),g.updateText(),c.functions.push(g);break;case"series-ref":j(e,a.value,f,c.segments.length>0);break;case"string":case"number":if(f-1>=e.def.params.length)throw{message:"invalid number of parameters to method "+e.def.name};j(e,a.value,f,!0);break;case"metric":if(c.segments.length>0){if(1!==a.segments.length)throw{message:"Multiple metric params not supported, use text editor."};j(e,a.segments[0].value,f,!0);break}c.segments=b.map(a.segments,function(a){return new p(a)})}}function l(a){var d=c.segments.slice(0,a);return b.reduce(d,function(a,b){return a?a+"."+b.value:b.value},"")}function m(a){if(0===a)return void c.segments.push(p.newSelectMetric());var b=l(a+1);return c.datasource.metricFindQuery(b).then(function(d){return 0===d.length?void(""!==b&&(c.segments=c.segments.splice(0,a),c.segments.push(p.newSelectMetric()))):void(c.segments.length===a&&c.segments.push(p.newSelectMetric()))}).then(null,function(a){c.parserError=a.message||"Failed to issue metric query"})}function n(a){b.each(c.segments,function(b,c){b.focus=a===c})}function o(a,b){return b.render(a)}function p(a){return"*"===a||"*"===a.value?(this.value="*",this.html=f.trustAsHtml('<i class="fa fa-asterisk"><i>'),void(this.expandable=!0)):(this.fake=a.fake,this.value=a.value,this.type=a.type,this.expandable=a.expandable,void(this.html=f.trustAsHtml(h.highlightVariablesAsHtml(this.value))))}c.init=function(){c.target.target=c.target.target||"",c.targetLetters=g,i()},c.toggleEditorMode=function(){c.target.textEditor=!c.target.textEditor,i()},c.getAltSegments=function(a,d){var e=0===a?"*."+d:l(a)+".*";return c.datasource.metricFindQuery(e).then(function(a){var c=b.map(a,function(a){return new p({value:a.text,expandable:a.expandable})});return 0===c.length?c:(b.each(h.variables,function(a){c.unshift(new p({type:"template",value:"$"+a.name,expandable:!0}))}),c.unshift(new p("*")),c)}).then(null,function(a){return c.parserError=a.message||"Failed to issue metric query",[]})},c.segmentValueChanged=function(a,b){return delete c.parserError,c.functions.length>0&&c.functions[0].def.fake&&(c.functions=[]),a.expandable?m(b+1).then(function(){n(b+1),c.targetChanged()}):(c.segments=c.segments.splice(0,b+1),n(b+1),void c.targetChanged())},c.targetTextChanged=function(){i(),c.get_data()},c.targetChanged=function(){if(!c.parserError){var a=c.target.target,d=l(c.segments.length);c.target.target=b.reduce(c.functions,o,d),c.target.target!==a&&c.$parent.get_data()}},c.removeFunction=function(a){c.functions=b.without(c.functions,a),c.targetChanged()},c.addFunction=function(a){var b=d.createFuncInstance(a,{withDefaultParams:!0});b.added=!0,c.functions.push(b),c.moveAliasFuncLast(),c.smartlyHandleNewAliasByNode(b),1===c.segments.length&&c.segments[0].fake&&(c.segments=[]),!b.params.length&&b.added&&c.targetChanged()},c.moveAliasFuncLast=function(){var a=b.find(c.functions,function(a){return"alias"===a.def.name||"aliasByNode"===a.def.name||"aliasByMetric"===a.def.name});a&&(c.functions=b.without(c.functions,a),c.functions.push(a))},c.smartlyHandleNewAliasByNode=function(a){if("aliasByNode"===a.def.name)for(var b=0;b<c.segments.length;b++)if(c.segments[b].value.indexOf("*")>=0)return a.params[0]=b,a.added=!1,void c.targetChanged()},c.toggleMetricOptions=function(){c.panel.metricOptionsEnabled=!c.panel.metricOptionsEnabled,c.panel.metricOptionsEnabled||delete c.panel.cacheTimeout},c.moveMetricQuery=function(a,d){b.move(c.panel.targets,a,d)},c.duplicate=function(){var b=a.copy(c.target);c.panel.targets.push(b)},p.newSelectMetric=function(){return new p({value:"select metric",fake:!0})}}]),f.directive("focusMe",["$timeout","$parse",function(a,b){return{link:function(c,d,e){var f=b(e.focusMe);c.$watch(f,function(b){b===!0&&a(function(){d[0].focus()})})}}}])});