GIAC_VERSION = '1_1_12';

var last_archive = ""
get_archive_data = function(package_name) {
  console.log(last_archive);
  return last_archive;
}
eval_function = function(var_name) {
  console.log("TRY FUNCTION: " + var_name);
  /* 
  Will receive a string, var_name, that is asking if we know its value.
  If we do, return its value as a string (and add units if you want)
  and if we dont, return an empty string ''
  */
  if(var_name === 'test')
    return '1_mm';
  return '';
}
eval_method = function(method_name, inputs) {
  console.log("TRY METHOD: " + method_name);
  console.log(inputs);
  /*
  Receives two strings.  The first, method_name, is the name of the function
  we are trying to call.  The second, inputs, is a string containing the
  inputs to the function as a comma seperated list (use split to blow it up)
  If we know the function, attempt to evaluate it with the inputs.  Errors should
  be cause and returned as a string with 'ERROR: ' as the first 7 characters.
  If the evaluation is successful, return the results as a string
  If no function of this name is found, return an empty string ''
  */
  if(method_name === 'testf') {
    if(inputs.match(','))
      return 'ERROR: Invalid input to ' + method_name;
    else
      return '23_mm';
  }
  return '';
}
check_method = function(method_name) {
  /* 
  Will receive a string, method_name, that is asking if this is a valid
  method_name.  We simply do a regex now and return 1 or 0 (expecting int response)
  */
  if(method_name.trim().match(/^[a-z][a-z0-9_]*$/i)) 
    return 1; 
   else 
    return 0; 
}
var sendMessage = function(json) {
  postMessage(JSON.stringify(json));
}
var receiveMessage = function(json) {
  if(json.load) {
    var supported = (function () {
      try {
        if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
          var module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
          if (module instanceof WebAssembly.Module)
            return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
      } catch (e) {}
      return false;
    })();
    var scriptsrc = ".js";
    var webAssemblyAvailable = supported;
    if (webAssemblyAvailable && json.useWASM) {
      console.log("LOADING WASM VERSION");
      scriptsrc = "_wasm.js";
    }
    importScripts('/giac' + GIAC_VERSION + scriptsrc);
    return;
  }
  caseval = Module.cwrap('caseval', 'string', ['string']);    
  Module.setCurrency = Module.cwrap('setCurrency', 'void', ['number','number']);
  Module.print(json.value+'\n  '+caseval(json.value));
  if(json.value.match(/^archive_string/)) {
    var output = caseval("archive_string()").replace(/""/g,'"').replace(/\n/g,'').replace(/\\/g,"\\\\").replace(/\\\\"/g,"\\\"");
    output = output.substr(1,output.length-2);
    console.log("RETURNED: " + output);
    output = JSON.parse(output);
    last_archive = [];
    for(var i = 0; i < output.length; i++)
      last_archive.push('"' + output[i].name + '",' + output[i].data);
    last_archive = "[" + last_archive.join(",") + "]";
    console.log("SET: " + last_archive);
  }
}
this.addEventListener("message", function (evt) {
  receiveMessage(JSON.parse(evt.data));
},false);

// connect to canvas
var Module = {
  preRun: [],
  postRun: [],
  print: function(text) {
    sendMessage({command: 'print', value: text});
  },
  printErr: function(text) {
    sendMessage({command: 'printErr', value: text});
  },
  // canvas: document.getElementById('canvas'),
  setStatus: function(text) {
    if (Module.setStatus.interval) clearInterval(Module.setStatus.interval);
    sendMessage({command: 'setStatus', value: text});
  },
  totalDependencies: 0,
  monitorRunDependencies: function(left) {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
  }
};
Module.setStatus('Downloading...');

