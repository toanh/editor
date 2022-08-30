Sk.builtins.RESET = new Sk.builtin.str("\u001b[ 0;2;0;0;0 m");

Sk.builtins.RED = new Sk.builtin.str("\u001b[ 38;2;255;0;0 m");
Sk.builtins.BLACK = new Sk.builtin.str("\u001b[ 38;2;0;0;0 m");
Sk.builtins.WHITE = new Sk.builtin.str("\u001b[ 38;2;255;255;255 m");
Sk.builtins.RED = new Sk.builtin.str("\u001b[ 38;2;255;0;0 m");
Sk.builtins.GREEN = new Sk.builtin.str("\u001b[ 38;2;0;255;0 m");
Sk.builtins.BLUE = new Sk.builtin.str("\u001b[ 38;2;0;0;255 m");
Sk.builtins.CYAN = new Sk.builtin.str("\u001b[ 38;2;0;255;255 m");
Sk.builtins.YELLOW = new Sk.builtin.str("\u001b[ 38;2;255;255;0 m");
Sk.builtins.MAGENTA = new Sk.builtin.str("\u001b[ 38;2;255;0;255 m");
Sk.builtins.ORANGE = new Sk.builtin.str("\u001b[ 38;2;255;165;0 m");
Sk.builtins.PURPLE = new Sk.builtin.str("\u001b[ 38;2;127;0;255 m");
    
Sk.builtins.HL_BLACK = new Sk.builtin.str("\u001b[ 48;2;0;0;0 m");
Sk.builtins.HL_WHITE = new Sk.builtin.str("\u001b[ 48;2;255;255;255 m");
Sk.builtins.HL_RED = new Sk.builtin.str("\u001b[ 48;2;255;0;0 m");
Sk.builtins.HL_GREEN = new Sk.builtin.str("\u001b[ 48;2;0;255;0 m");
Sk.builtins.HL_BLUE = new Sk.builtin.str("\u001b[ 48;2;0;0;255 m");    
Sk.builtins.HL_CYAN = new Sk.builtin.str("\u001b[ 48;2;0;255;255 m");
Sk.builtins.HL_YELLOW = new Sk.builtin.str("\u001b[ 48;2;255;255;0 m");
Sk.builtins.HL_MAGENTA = new Sk.builtin.str("\u001b[ 48;2;255;0;255 m");
Sk.builtins.HL_ORANGE = new Sk.builtin.str("\u001b[ 48;2;255;165;0 m");
Sk.builtins.HL_PURPLE = new Sk.builtin.str("\u001b[ 48;2;127;0;255 m");
    
Sk.builtins.BOLD = new Sk.builtin.str("\u001b[ 1;2;0;0;0 m");    
Sk.builtins.ITALICS = new Sk.builtin.str("\u001b[ 3;2;0;0;0 m");    
Sk.builtins.UNDERLINE = new Sk.builtin.str("\u001b[ 4;2;0;0;0 m");    


var fontColour = "rgba(255, 255, 255, 1)";
var fontBgColour = "rgba(0, 0, 0, 1)";
var fontItalics = "normal";
var fontBold = "normal";
var fontUnderlined = "normal";
var fontSize = "12pt";

function outputf(n) {
    var text = "";
                  
    i = 0;
    while (n.length > 0)
    {
        if (n[0] == "\u001b")
        {
            i++;
            if (text.length > 0)
                pyConsole.appendChild(createColouredTextSpanElement(text));                
            text = "";
            
            var escPattern = /\[ (\d+);2;(\d+);(\d+);(\d+) m/;                          
            var match = n.match(escPattern);
            
            if (typeof(match) !== 'undefined')
            {
                code = parseInt(match[1]);
                if (code == 0)
                {
                    // reset
                    fontColour = "rgb(255,255,255)";
                    fontBgColour = "rgb(0,0,0)";                    
                    fontItalics = "normal";
                    fontBold = "normal";
                    fontUnderlined = "normal";
                    fontSize = "12pt";
                }
                else if (code == 38)
                {
                    fontColour = "rgb(" + parseInt(match[2]) + "," + parseInt(match[3]) + "," + parseInt(match[4]) + ")"; 
                }
                else if (code == 48)
                {
                    fontBgColour = "rgb(" + parseInt(match[2]) + "," + parseInt(match[3]) + "," + parseInt(match[4]) + ")"; 
                }
                else if (code == 1)
                {
                    // bold
                    fontBold = "bold";
                }
                else if (code == 3)
                {
                    // italics
                    fontItalics = "italic";
                }
                else if (code == 4)
                {
                    // underlined
                    fontUnderlined = "underline";
                }                
                i = match.index + match[0].length;
            }
            n = n.substring(i);
        }
        else
        {
            text += n[0];
            n = n.substring(1);
        }                
    }
    if (text.length > 0)
        pyConsole.appendChild(createColouredTextSpanElement(text));                           
    
    pyConsole.scrollTop = document.getElementById("console").scrollHeight;
}

function inputf(n) {
    inputPromise = new Promise((function(n, e) {                    
                inputElement = document.createElement("span");
                inputElement.setAttribute("contenteditable", "true");
                inputElement.style.color = "rgb(255,255,255)";
                inputElement.style.fontSize = "12pt";
                inputElement.style.outlineStyle = "none";
                pyConsole.appendChild(inputElement);
                inputElement.focus();
                inputElement.addEventListener("keyup", (function(e) {
                    e.preventDefault();
                    if (e.key ==="Enter") {
                        userResponse = inputElement.innerText.replace(/\n+$/, "");
                        inputElement.remove();
                        inputElement = null;
                        outputf(userResponse);
                        outputf("\n");
                        n(userResponse);
                    }
                }))
            }));
    return inputPromise;
}
    
function resetConsole()
{
    fontColour = "rgba(255, 255, 255, 1)";
    fontBgColour = "rgba(0, 0, 0, 1)";
    fontItalics = "normal";
    fontBold = "normal";
    fontUnderlined = "normal";
    fontSize = "12pt"; 
    clearConsole();
}

function createColouredTextSpanElement(n) {
    let t = document.createTextNode(n);        
    let e = document.createElement("span");    
    
    e.style.textDecoration = fontUnderlined;
    e.style.fontWeight = fontBold;
    e.style.fontStyle = fontItalics;
    e.style.backgroundColor = fontBgColour;
    e.style.color = fontColour;
    e.style.fontSize = fontSize;
    
    e.appendChild(t);        
    return e;
}

Sk.builtins.clear = function()
{
    clearConsole();
}