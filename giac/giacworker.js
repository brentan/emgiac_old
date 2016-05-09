// 2d plot don't work currently because mathml.cc EM_ASM_INT_V refers to the window
// 3d plot additionnally refer to document
var Module = {
    worker:true,
    preRun: [],
    postRun: [],
    print: function(text) {
	postMessage(['print', text]);
    },
    printErr: function(text) {
	postMessage(['printErr', text]);
    },
    canvas:0,
};
console.log('start loading giac.js');
self.importScripts('giac.js'); 
console.log('giac.js loaded');


onmessage = function(e){
    //console.log(e.data);
    if (e.data[0]!='eval'){ console.log(e.data[0]); return;}
    var docaseval = Module.cwrap('caseval',  'string', ['string']);
    var value=e.data[1];
    var n=value.search(';');
    if (n<0 || n>=value.length)
	value='add_autosimplify('+value+')';
    console.log('worker eval '+value);
    var s,err;
    try {s=docaseval(value); } catch(err){ console.log(err);}
    //console.log('worker evaled '+s);
    postMessage(['cas',s]);
}
