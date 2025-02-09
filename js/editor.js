//var storeURL = "https://limitless-plains-92704.herokuapp.com/";
var storeURL = "https://gcs.csinschoolsatse.repl.co/";

var animID = null;

var dots = 0;
var origMsg = "Generating URL"
var prevTime = null;
function animateURL(timestamp) {
	if (prevTime == null) {
		prevTime = timestamp;
	}
	if (timestamp - 400 > prevTime) {
		prevTime = timestamp;
		msg = document.getElementById("urlmsg").innerText;
		
		if (dots < 3) {
			dots += 1;
			msg = ">" + msg + "<";
		}
		else {
			msg = origMsg;
			dots = 0;
		}
		document.getElementById("urlmsg").innerText = msg;
	}
	animID = window.requestAnimationFrame(animateURL);
}
function getCodestoreURL() {
	document.getElementById("urlmsg").innerText = origMsg;
	document.getElementById("urlmsg").style.display = "block";
	document.getElementById("url").style.display = "none";
	document.getElementById("urlerr").style.display = "none";
	dots = 0;
	animID = window.requestAnimationFrame(animateURL);
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", storeURL + 'put', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.onerror = function() {
		console.log("Error");
		window.cancelAnimationFrame(animID);
		document.getElementById("urlmsg").style.display = "none";
		document.getElementById("url").style.display = "none";
		document.getElementById("urlerr").style.display = "block";
		console.log(this);
	}
	
	xhr.onreadystatechange = function() {
	  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		if (xhr.responseText.length == 0) {
		  alert("There was an error generating your URL, please save your code to a file instead.");
		}
		codeurl = window.location.toString();
		codeurl = codeurl.split('?')[0] + "?";
		delimit = "";

		urlParams.forEach(function(value, key) {
		  if (key != "id" && key !== "undefined") {
			codeurl = codeurl + "&" + key + "=" + value;
		  }
		});
		
		codeurl += "&id=" + xhr.responseText; 
		
		document.getElementById("url").text = codeurl;
		document.getElementById("url").href = codeurl;
		document.getElementById("urlmsg").style.display = "none";
		document.getElementById("url").style.display = "block";
		document.getElementById("urlerr").style.display = "none";
		window.cancelAnimationFrame(animID);
	  }
	}
	var code = ace.edit("editor").getValue();

	saveToLocalStorage();
	sendURL = "code="+ encodeURIComponent(code);
	// update existing id if exists - comment out for new URL everytime
	/*
	if (id !== null) {
		sendURL += "&id=" + id;
	}
	*/

	xhr.send(sendURL);            
}

function setTrainingWheels() {
	if (document.getElementById("trainingWheels").checked)
		urlParams.set('wheels', 1)
	else
		urlParams.delete('wheels')
}

function setTheme() {
	if (document.getElementById("lightTheme").checked) {
		urlParams.set('light', 1);
		editor.setTheme("ace/theme/eclipse");
	}
	else {
		editor.setTheme("ace/theme/monokai");
		urlParams.delete('light')
	}
}
 
function clearConsole() {
	var clearButton = document.getElementById("consoleClear");

	pyConsole.innerHTML = "";
	pyConsole.appendChild(clearButton);
	if (inputElement != null)
	{
		inputElement.innerText = "";
		pyConsole.appendChild(inputElement);
	}
}

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen property yet */
function openFullscreen() {
	/* Get the element you want displayed in fullscreen mode (a video in this example): */
	var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
		(document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
		(document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
		(document.msFullscreenElement && document.msFullscreenElement !== null);

	if (!isInFullScreen) {
		var docElm = document.documentElement;
		if (docElm.requestFullscreen) {
			docElm.requestFullscreen();
		} else if (docElm.mozRequestFullScreen) {
			docElm.mozRequestFullScreen();
		} else if (docElm.webkitRequestFullScreen) {
			docElm.webkitRequestFullScreen();
		} else if (docElm.msRequestFullscreen) {
			docElm.msRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
}

//gets the type of browser
function detectBrowser() {
	if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
		return 'Opera';
	} else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
		return 'Chrome';
	} else if(navigator.userAgent.indexOf("Safari") != -1) {
		return 'Safari';
	} else if(navigator.userAgent.indexOf("Firefox") != -1 ){
		return 'Firefox';
	} else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
		return 'IE';
	} else {
		return 'Unknown';
	}
}

function copyToClipboard(text, successMsg, errorMsg)
{
	var browser = detectBrowser();
	if (browser == "Firefox")
	{
		navigator.clipboard.writeText(text);
		alert(successMsg);
	}
	else
	{
		navigator.permissions.query({name: "clipboard-write"}).then(result => {
		  if (result.state == "granted" || result.state == "prompt") {
			navigator.clipboard.writeText(text);
			alert(successMsg);
		  }
		  else
		  {
			alert(errorMsg);
		  }
		});
	}
}

function generateEmbed()
{
	ta = document.getElementById("code");

	var url = window.location.href.split("?")[0];

	url = url + "?code=" + encodeToUTF16(ace.edit("editor").getValue());

	embed = "<iframe src=\"" + url + "\" allow='clipboard-write' width = 960 height = 640 style='border:1px solid #808080;'></iframe>";

	copyToClipboard(embed, "Embed code copied to clipboard.", "Unable to copy embed code to clipboard. Please copy the embed code below manually: \n" + embed);
}

function generateURL()
{
	ta = document.getElementById("code");

	var url = window.location.href.split("?")[0];

	url = url + "?code=" + encodeToUTF16(ace.edit("editor").getValue());

	copyToClipboard(url, "URL copied to clipboard.", "Unable to copy URL to clipboard. Please copy the URL below manually: \n" + url);
}

function copyCode()
{
	var code = ace.edit("editor").getValue();
	navigator.clipboard.writeText(code);

	copyToClipboard(code, "Code copied to clipboard.", "Unable to copy code to clipboard. Please copy the code manually.");
}

function resetCanvas()
{
	window.cancelAnimationFrame(Sk.builtins.animationFrameRequest);
	var canvas = document.getElementById("pyangelo");
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "rgb(127, 127, 127)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function isChromiumBrowser()
{
	agent = window.navigator.userAgent.toLowerCase();
	if ((agent.indexOf("edg/") > -1) || (agent.indexOf("chrome") > -1 && !!window.chrome))
		return true;
	else
		return false;
}

async function saveCode(filename)
{
	if (isChromiumBrowser())
		saveCodeFS(filename);
	else
		saveCodeFilesaver(filename);            
}

async function saveCodeFS(filename)
{          
  const options = {
	suggestedName: filename,
	types: [
	  {
		
		description: 'Text Files',
		accept: {
		  'text/plain': ['.txt'],
		},
	  },
	],
  };
  const handle = await window.showSaveFilePicker(options);
  var code = ace.edit("editor").getValue();

  const writable = await handle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(code);
  // Close the file and write the contents to disk.
  await writable.close();          

  if (filename != null)
  {
	// only save to local storage if a filename was specified
	saveToLocalStorage();            
  }
}        

function saveCodeFilesaver(filename) {
	filename = window.prompt("Enter file name:", filename)
	if (filename == null)
	{
		return;
	}
	var code = ace.edit("editor").getValue();
	var file = new File([code], filename + ".txt", {type: "text/plain;charset=utf-8"});
	saveAs(file);
	saveToLocalStorage();
}

function saveToLocalStorage()
{
  try {
	var code = ace.edit("editor").getValue();
	localStorage.setItem(filename, code);
  }
  catch(e) {
	console.log("Unable to save to local storage");
  }
}

function loadFromLocalStorage()
{
  if (filename == null || filename.length == 0)
  {
	return;
  }
  try {
	var src = localStorage.getItem(filename);
	if (!(src === null || src == "")) {
		editor.setValue(src, -1);
	}
  }
  catch (e) {
	console.log("Unable to load from local storage");
  }
}

function saveToLocalStorage()
{
  try {
	var code = ace.edit("editor").getValue();
	localStorage.setItem(filename, code);
  }
  catch(e) {
	console.log("Unable to save to local storage");
  }
} 

async function loadCode()
{
	if (isChromiumBrowser())
		loadCodeFS();
	else
		document.getElementById('file-input').click();           
	return false;
}

async function loadCodeFS()
{             
	const options = {    
		suggestedName: filename,        
		types: [
		  {                                
			description: 'Text Files',
			accept: {
			  'text/plain': ['.txt'],
			},
		  },
		],};          
	[fileHandle] = await window.showOpenFilePicker(options);
	const file = await fileHandle.getFile();
	const contents = await file.text();

	checkForPyangelo(contents);
	editor.setValue(contents, -1);
	clearConsole();//pyConsole.innerHTML = "";            
	stopEditor();            
}

function userLoadCode(event) {
	var files = event.target.files;
	var file = null;
	if (files.length > 0) file = files[0];
	else return;
	var reader = new FileReader();
	reader.onload = (function (theFile) {
		return function (e) {
			checkForPyangelo(e.target.result);
			editor.setValue(e.target.result, -1);
			clearConsole();//pyConsole.innerHTML = "";
		};
	})(file);
	reader.readAsText(file);
	stopEditor();
}        

function loadFromLocalStorage()
{
  if (filename == null || filename.length == 0)
  {
	return;
  }
  try {
	var src = localStorage.getItem(filename);
	if (!(src === null || src == "")) {
		editor.setValue(src, -1);
	}      
  }
  catch (e) {
	console.log("Unable to load from local storage");
  }  
}        

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function singleStep()
{
	return new Promise((resolve, reject) => {
		nextButton.addEventListener('click', function(e) {
			resolve(1);
		}, {once: true});
		stopButton.addEventListener('click', function(e) {
			stopSkulpt();
			resolve(1);
		}, {once: true});
	});
}

var prevLine = 0;
async function nextlineStepper(susp)
{
	checkForStop();
	try {
		var child = susp.child;
		while (child.child.child != null)
		{
			child = child.child;
		}
		if (child.$lineno != prevLine)
		{
			editor.gotoLine(child.$lineno);
			await singleStep();
			prevLine = child.$lineno;
		}

		// Return an already-resolved promise in this case
		return Promise.resolve(susp.resume());
	} catch(e) {
		return Promise.reject(e);
	}
}

async function lineStepper(susp)
{
	checkForStop();
	try {
		var child = susp.child;
		while (child.child.child != null)
		{
			child = child.child;
		}
		if (child.$lineno != prevLine)
		{
			editor.gotoLine(child.$lineno);
			await sleep(1000);
			prevLine = child.$lineno;
		}
		return Promise.resolve(susp.resume());
	} catch(e) {
		return Promise.reject(e);
	}
}

function checkForStop() {
	if (_stopped)
		throw 'Stopped!';
}

function logError(text)
{
	outputf(Sk.builtins.RESET + Sk.builtins.RED + text + "\n" + Sk.builtins.RESET);
}

function getStyleSheet(unique_title) {
  for(var i=0; i<document.styleSheets.length; i++) {
	var sheet = document.styleSheets[i];
	if(sheet.title == unique_title) {
	  return sheet;
	}
  }
}

var stepRun = false;
function runSkulpt(stepMode) {

	stepRun = stepMode;
	var code = ace.edit("editor").getValue();

	saveToLocalStorage();

	code = stripPeriodFromGoto(code);
	if (document.getElementById("trainingWheels").checked)
		code = pygmify(code);
	usingPyangelo = checkForPyangelo(code);
	setDisplayMode(usingPyangelo ? "canvas": display);
	if (usingPyangelo) document.getElementById("pyangelo").focus();

	editor.setReadOnly(true);

	_stopped = false;
	stopButton.style.display = "inline";
	stepButton.style.display = "none";
	runButton.style.display = "none";
	stopButton.style.width = "144px";

	// clear the console
	clearConsole();//pyConsole.innerHTML = "";
	just_run = true;

	resetConsole();

	Sk.configure({
		output: outputf,
		inputfun: inputf,
		inputfunTakesPrompt: false,
		debugging: true, //stepRun ? true : false,
		killableWhile: true,
		//breakpoints: function() { return true; },
		__future__: Sk.python3
	});

	var handlers = {};
	handlers["*"] = checkForStop;
	if (stepRun) {
		prevLine = 0;
		//editor.setTheme("ace/theme/gob");
		var styleSheet =  document.styleSheets[0];//getStyleSheet('ace-monokai');
		styleSheet.insertRule(".ace-monokai .ace_marker-layer .ace_active-line {background: #208020}", styleSheet.rules.length);
		if (autostep != null)
		{
			handlers["Sk.debug"] = lineStepper;
			handlers["Sk.delay"] = lineStepper;
		}
		else
		{
			handlers["Sk.debug"] = nextlineStepper;
			handlers["Sk.delay"] = nextlineStepper;
			// shorten stop button
			stopButton.style.width = "72px";
			nextButton.style.display = "inline";
		}
	}

	var e = Sk.misceval.asyncToPromise((function() {
		return Sk.importMainWithBody("<stdin>", true, code, true)})
		, handlers);

	e.catch((function(err) {
		if (err.message) {
		   logError(err.message);
		   logError(err.stack);
		   if (err.nativeError) {
			   logError(err.nativeError.message);
			   logError(err.nativeError.stack);
		   }
		}
		else {
		   logError(err.toString());
		   if (err.stack)
		   {
			   logError(err.stack);
		   }
	}}));
	e.finally((function() {
		stopSkulpt();
	} ));
}

function stopSkulpt() {
	editor.setReadOnly(false);
	if (stepRun)
	{
		// remove step highlighting
		var styleSheet =  document.styleSheets[0];
		var lastRule = styleSheet.rules[styleSheet.rules.length - 1];
		if (lastRule.cssText.indexOf(".ace_active-line") != -1)
		{
			styleSheet.deleteRule(styleSheet.rules.length - 1);
		}
	}
	just_run = false;

	stopButton.style.display = "none";
	nextButton.style.display = "none";
	runButton.style.display = "inline";
	if (nostep != null && nostep.length > 0)
	{
		stepButton.style.display = "none";
	}
	else
	{
		stepButton.style.display = "inline";
	}
	if (norun != null && norun.length > 0)
	{
		runButton.style.display = "none";
	}
	else
	{
		runButton.style.display = "inline";
	}
	resetCanvas();
}

function stopEditor()
{
	_stopped = true;
	if (inputElement != null)
	{
		// if stopped during an input...
		stopSkulpt();
		userResponse = inputElement.innerText.replace(/\n+$/, "");
		inputElement.remove();
		outputf(userResponse);
		outputf("\n");
		// TODO: fold this into the main promise/catch process?
		inputElement = null;
		logError("Stopped!");
		throw "Stopped!";
	}
}
function checkForPyangelo(code)
{
	var pyangeloPattern = /^(?:\s*import\s+pyangelo.*)|(?:\s*from\s+pyangelo\s+import.*)$/gm;
	var match = code.match(pyangeloPattern);
	return (match != null ? true: false);
}

function setDisplayMode(mode)
{
	if (prevDisplay != null && prevDisplay == mode)
	{
		return;
	}
	var gutters = document.getElementsByClassName("gutter");
	if (typeof(gutters) !== 'undefined' && gutters.length > 0)
	{
		for (gutter of gutters)
		{
			gutter.parentNode.removeChild(gutter);
		}
	}

	prevDisplay = mode;
	// FIXME: Setting display mode to non-canvas after it has been set to canvas causes issues
	if (mode == "canvas")
	{
		// we're in canvas demo mode
		document.getElementById('leftpane').appendChild(document.getElementById('editor'));
		document.getElementById('rightpane').appendChild(document.getElementById('pyangelo'));
		document.getElementById('bottompane').appendChild(document.getElementById('consoleWrapper'));

		document.getElementById('bottompane').style = "display:block; height: " + prefixedCalc() + "(100% - 580px);";

		//document.getElementById('split').style = "height: 505px; display: flex; flex-direction:row;";
		document.getElementById('split').style = "height: 505px; display: flex; flex-direction:row;";
		document.getElementById('rightpane').style = "width: 330px;"
		document.getElementById('leftpane').style = "height: 500px; flex-grow: 1;";

		//document.getElementById('editor').style.height = "100%";
		document.getElementById('editor').style.height = "500px";

		document.getElementById('consoleWrapper').style = "height: 200px";
		//document.getElementById('console').style = "height: 100%";

		document.getElementById('pyangelo').style = "display:block";

		// no step-run for canvas items
		// TODO: implement optional immediate drawing mode to support this
		nostep = "1";
		stepButton.style.display = "none";

		new ResizeObserver(function(entries) {
			// needed so that resizing the divider forces a resize on the window
			// and thereby updating the ace code window properly
			window.dispatchEvent(new Event('resize'));
		}).observe(document.getElementById('leftpane'));
	}
	else if (mode == "top")
	{
	   // editor on top, console at the bottom, splittable
		document.getElementById('pyangelo').style = "display:none";

		document.getElementById('split').style = "display: flex; flex-direction: column";
		document.getElementById('split').style.width = "100%";
		document.getElementById('split').style.height = prefixedCalc() + "(100% - 60px)";

		document.getElementById('editor').style.width = "100%";
		document.getElementById('editor').style.height = "100%";
		document.getElementById('consoleWrapper').style.width = "100%";
		document.getElementById('consoleWrapper').style.height = "100%";

		document.getElementById('leftpane').appendChild(document.getElementById('editor'));
		document.getElementById('rightpane').appendChild(document.getElementById('consoleWrapper'));
		document.getElementById('bottompane').appendChild(document.getElementById('pyangelo'));

		Split(['#leftpane', '#rightpane'], {direction: 'vertical', minSize: [128, 128], snapOffset: 0,})

		document.getElementById('rightpane').style.width = "100%";
		document.getElementById('leftpane').style.width = "100%";
		document.getElementById('bottompane').style = "display:none";

		new ResizeObserver(function(entries) {
			// needed so that resizing the divider forces a resize on the window
			// and thereby updating the ace code window properly
			window.dispatchEvent(new Event('resize'));
		}).observe(document.getElementById('leftpane'));
	}
	else if (mode == "bottom")
	{
		// console on top, editor at the bottom, splittable
		document.getElementById('pyangelo').style = "display:none";

		document.getElementById('split').style = "display: flex; flex-direction: column";
		document.getElementById('split').style.width = "100%";
		document.getElementById('split').style.height = prefixedCalc() + "(100% - 60px)";

		document.getElementById('editor').style.width = "100%";
		document.getElementById('editor').style.height = "100%";
		document.getElementById('consoleWrapper').style.width = "100%";
		document.getElementById('consoleWrapper').style.height = "100%";

		document.getElementById('leftpane').appendChild(document.getElementById('consoleWrapper'));
		document.getElementById('rightpane').appendChild(document.getElementById('editor'));
		document.getElementById('bottompane').appendChild(document.getElementById('pyangelo'));

		Split(['#leftpane', '#rightpane'], {direction: 'vertical', minSize: [128, 128], snapOffset: 0,})

		document.getElementById('rightpane').style.width = "100%";
		document.getElementById('leftpane').style.width = "100%";
		document.getElementById('bottompane').style = "display:none";

		new ResizeObserver(function(entries) {
			// needed so that resizing the divider forces a resize on the window
			// and thereby updating the ace code window properly
			window.dispatchEvent(new Event('resize'));
		}).observe(document.getElementById('rightpane'));
	}
	else
	{
		// "side" is the default
		// standard editor mode: console to the right of the editor, no canvas - splittable view
		document.getElementById('pyangelo').style = "display:none";
		//document.getElementById('split').style.height = "100%";
		document.getElementById('split').style.height = prefixedCalc() + "(100% - 80px)";
		document.getElementById('editor').style.height = "100%";
		document.getElementById('consoleWrapper').style.height = "100%";

		document.getElementById('rightpane').style.height = "100%;"
		document.getElementById('leftpane').style.height = "100%";
		document.getElementById('bottompane').style = "display:none";

		document.getElementById('leftpane').appendChild(document.getElementById('editor'));
		document.getElementById('rightpane').appendChild(document.getElementById('consoleWrapper'));
		document.getElementById('bottompane').appendChild(document.getElementById('pyangelo'));

		Split(['#leftpane', '#rightpane'], {direction: 'horizontal', minSize: [128, 128], snapOffset: 0,})

		new ResizeObserver(function(entries) {
			// needed so that resizing the divider forces a resize on the window
			// and thereby updating the ace code window properly
			window.dispatchEvent(new Event('resize'));
		}).observe(document.getElementById('leftpane'));
	}
}

function prefixedCalc () {
	var prefixes = ["","-webkit-","-moz-","-o-"], el;
	for (var i = 0; i < prefixes.length; i++) {
		el = document.createElement('div');
		el.style.cssText = "width:" + prefixes[i] + "calc(9px)";
		if (el.style.length) return prefixes[i] + "calc";
	}
}

function resetEditor()
{
	if (confirm("This will reset the code and you will lose your progress so far.\nIs this okay?"))
	{
		clearConsole();
		resetConsole();
		if (esc != null && esc.length > 0)
		{
			codeString = decodeFromUTF16(esc);
			usingPyangelo = checkForPyangelo(codeString);
			setDisplayMode(usingPyangelo ? "canvas": display);
			editor.setValue(codeString, -1);

			saveToLocalStorage();
		}
		else if (project != null && project.length > 0)
		{
			var client = new XMLHttpRequest();
			client.open("GET", "projects/" + project + ".py");
			client.onreadystatechange = function () {
				if (client.readyState == 4) {
					project_src = client.responseText;
					usingPyangelo = checkForPyangelo(project_src);
					setDisplayMode(usingPyangelo ? "canvas": display);
					editor.setValue(project_src, -1);
				}

				saveToLocalStorage();
			};
			client.send();
		}
		else
		{
			editor.setValue("", -1);
			// clear local storage
			localStorage.removeItem(filename);
		}
	}
}

// setting up the ace editor
var pyConsole = document.getElementById("console");

var editor = ace.edit("editor");
var darkTheme = true;
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setOptions({
  fontSize: "12pt"
});
editor.setHighlightActiveLine(true);

document.getElementById('file-input').addEventListener('change', userLoadCode, false);

// configurable buttons
var runButton = document.getElementById("runButton");
var saveButton = document.getElementById("saveButton");
var loadButton = document.getElementById("loadButton");
var stepButton = document.getElementById("stepButton");
var nextButton = document.getElementById("nextButton");
var copyButton = document.getElementById("copyButton");
var stopButton = document.getElementById("stopButton");
var URLButton = document.getElementById("URLButton");
var embedButton = document.getElementById("embedButton");
var fsButton = document.getElementById("fullscreenButton");

// grabbing the URL parameters and processing them
urlParams = new URLSearchParams(window.location.search);

// canvas demo mode: canvas to the right of the editor, console at the bottom
var prevDisplay = null;
var display = urlParams.get('display');
// TODO: the order below is important

if (display == null || display.length == 0)
{
	display = "side";
}
setDisplayMode(display);

// embedded code in the URL
esc = urlParams.get('code')
if (esc != null && esc.length > 0)
{
	//codeString = atou(esc);
	codeString = decodeFromUTF16(esc);
	usingPyangelo = checkForPyangelo(codeString);
	setDisplayMode(usingPyangelo ? "canvas": display);
	editor.setValue(codeString, -1);
	//document.getElementById("editor").innerHTML = codeString;
}

// dark/light theme
light = urlParams.get('light')
if (light != null && light.length > 0) {
	editor.setTheme("ace/theme/eclipse");
	document.getElementById("lightTheme").checked = true;
}
else {
	editor.setTheme("ace/theme/monokai");
}

// code store id
var id = urlParams.get('id');

if (id != null && id.length > 0) {
  var xhr2 = new XMLHttpRequest();
  xhr2.open("GET", storeURL + 'get?id=' + id, true);
  xhr2.onreadystatechange = function() { 
	  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		codeString = xhr2.responseText;
		usingPyangelo = checkForPyangelo(codeString);
		setDisplayMode(usingPyangelo ? "canvas": display);
		editor.setValue(codeString, -1);
	  }
  }
  xhr2.send();   
}

// project mode: load from code from existing .py file under /projects
// only works when hosted on web server (no filesystem mode)
project = urlParams.get('project');
if (project != null && project.length > 0)
{
	var client = new XMLHttpRequest();
	client.open("GET", "projects/" + project + ".py");
	client.onreadystatechange = function () {
		if (client.readyState == 4) {

			if (localStorage.getItem(filename) === null)
			{
				project_src = client.responseText;
				usingPyangelo = checkForPyangelo(project_src);
				setDisplayMode(usingPyangelo ? "canvas": display);
				editor.setValue(project_src, -1);
			}
		}
	};
	client.send();
}

// hide stop and next button on load
stopButton.style.display = "none";
nextButton.style.display = "none";

// allows save (and load)
nosave = urlParams.get('nosave')
if (nosave != null && nosave.length > 0)
{
	saveButton.style.display = "none";
	loadButton.style.display = "none";
}
else
{
	saveButton.style.display = "inline";
	loadButton.style.display = "inline";
}

var filename = null;
if (project != null && project.length > 0)
{
	filename = project;
}
else
{
	// default file name (for saving)
	filename = urlParams.get('name')
	if (filename == null || filename.length == 0)
	{
		filename = "my_code";
	}
}
loadFromLocalStorage();

// disable step-run button
nostep = urlParams.get('nostep')
if (nostep != null && nostep.length > 0)
{
	stepButton.style.display = "none";
	stopButton.style.width = "72px";
}
else
{
	stepButton.style.display = "inline";
}

// disable run button
norun = urlParams.get('norun')
if (norun != null && norun.length > 0)
{
	runButton.style.display = "none";
	stopButton.style.width = "72px";
	stepButton.innerHTML = "👣 Step";
}
else
{
	runButton.style.display = "inline";
}

// disable copy code button
nocopy = urlParams.get('nocopy')
if (nocopy != null && nocopy.length > 0)
{
	copyButton.style.display = "none";
}
else
{
	copyButton.style.display = "inline";
}

// autostep
// (linestepper with sleep)
autostep = urlParams.get('autostep')
autodelay = urlParams.get('autodelay')

// get URL button
URLButton.style.display = "none";
urlButtonOn = urlParams.get('url')
if (urlButtonOn != null && urlButtonOn.length > 0)
{
	URLButton.style.display = "inline";
}
else
{
	URLButton.style.display = "none";
}

// get embed button
embedButton.style.display = "none";
embedButtonOn = urlParams.get('embed')
if (embedButtonOn != null && embedButtonOn.length > 0)
{
	embedButton.style.display = "inline";
}
else
{
	embedButton.style.display = "none";
}

// hides the drawing canvas
nocanvas = urlParams.get('nocanvas')
if (nocanvas != null && nocanvas.length > 0)
{
	var rightpane = document.getElementById("rightpane");
	rightpane.style.display = "none";
	var leftpane = document.getElementById("leftpane");
	leftpane.style.width = "100%";
}

// no full screen (if unsupported by other widgets etc.)
nofs = urlParams.get('nofs')
if (nofs != null && nofs.length > 0)
{
	fsButton.style.display = "none";
}

// no full screen (if unsupported by other widgets etc.)
wheels = urlParams.get('wheels')
if (wheels != null && wheels.length > 0) {
	document.getElementById("trainingWheels").checked = true;
}

var just_run = false;
var _stopped = false;
var inputElement = null;

resetCanvas();

document.getElementsByClassName('gutter')[0].style.zIndex = 10;
