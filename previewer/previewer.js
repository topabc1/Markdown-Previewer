document.addEventListener("DOMContentLoaded", () => {
const edBtn = document.querySelector("#editor-container button");
const prevBtn = document.querySelector("#previewer-container button");
const editor = document.querySelector("#editor-container");
const previewer = document.querySelector("#previewer-container");
const inputEl = document.querySelector("#editor");
const outputEl = document.querySelector("#preview");

let edBtnID = false;
let prevBtnID = false;

let track = {
  singleLineCode: 0,
  multiLineCode: 0,
  singleLineCodeArr: [],
  bold: 0,
  boldArr: [],
  italic: 0,
  italicArr: [],
  italicBold: 0,
  italicBoldArr: [],
  crossOut: 0,
  crossOutArr: [],
  links: 0,
  linksArr: [],
	picture: 0,
	pictureArr: [],
	tables: 0,
	table: 0,
	tableID: false,
	unorderedList: 0,
	unorderedListID: false,
	orderedList: 0,
	orderedListID: false,
}
let html = "";
const regexp = /\d+./;

/************* START **********************************/
Convert();

/************** UPDATE ********************************/
edBtn.addEventListener("click", () => {
  if(!edBtnID) {
    edBtnID = true;
    previewer.classList.add("hidden");
    edBtn.innerHTML = '<i class="fa-solid fa-down-left-and-up-right-to-center"></i>';
  } else {
    edBtnID = false;
    previewer.classList.remove("hidden");
    edBtn.innerHTML = '<i class="fa-solid fa-maximize"></i>';
  }
});

prevBtn.addEventListener("click", () => {
  if(!prevBtnID) {
    prevBtnID = true;
    editor.classList.add("hidden");
    prevBtn.innerHTML = '<i class="fa-solid fa-down-left-and-up-right-to-center"></i>';
  } else {
    prevBtnID = false;
    editor.classList.remove("hidden");
    prevBtn.innerHTML = '<i class="fa-solid fa-maximize"></i>';
  }
});

inputEl.addEventListener("keyup", Convert);

/******************************************************************/
function Convert() {
  
  html = "";
  track.multiLineCode = 0;
	track.tables = 0;
	track.tableID = false;
	track.unorderedList = 0;
	track.unorderedListID = false;
	track.orderedList = 0;
	track.orderedListID = false;
  
  let input = inputEl.value;
  input = input.split(/\n/);
  input.forEach(index => {
    
    index = index.replace(/(\s){1,}/gi, " ");
    index = index.split(" ");
    
    track.singleLineCode = 0;
    track.singleLineCodeArr = [];
    track.bold = 0;
    track.italic = 0;
    track.italicArr = [];
    track.italicBold = 0;
    track.italicBoldArr = [];
    track.crossOut = 0;
    track.crossOutArr = [];
    track.links = 0;
    track.linksArr = [];
		track.picture = 0;
		track.pictureArr = [];
		track.table = 0;
		
		TableCheck(index);
		UnorderedListCheck(index);
		OrderedListCheck(index);
    
    if(index[0] === "#" || (index[0] === "" && index[1] === "#")) {
      H1(index);
    } else if(index[0] === "##" || (index[0] === "" && index[1] === "##")) {
      H2(index);
    } else if(index[0] === "###" || (index[0] === "" && index[1] === "###")) {
      H3(index);
    } else if(index[0] === "```" || (index[0] === "" && index[1] === "```")) {
      MultiLineCode(index);
    } else if(index[0] === ">" || (index[0] === "" && index[1] === ">")) {
      BlockQuote(index);	
		} else if(index[0] === "//" || (index[0] === "" && index[1] === "//")) {
      if(track.multiLineCode % 2 == 1) {
        Comment(index);
      } else {
        Default(index);
      }
    } else if(index[0] === "-" || (index[0] === "" && index[1] === "-")) {
			UnorderedList(index);
		} else if(regexp.test(index[0]) || (index[0] === "" && regexp.test(index[1]))) {
			OrderedList(index);
		} else if(index[0] === "function" || (index[0] === "" && index[1] === "function")) {
      if(track.multiLineCode % 2 == 1) {
        Function(index);
      } else {
        Default(index);
      }
    } else if(index.indexOf("if") != -1) {
      if(track.multiLineCode % 2 == 1) {
        IfStatement(index);
      } else {
        Default(index);
      }
    } else if(index.indexOf("return") != -1) {
      if(track.multiLineCode % 2 == 1) {
        Return(index);
      } else {
        Default(index);
      }
		} else {
      Default(index);
    }
    
    for(let i = 0; i < index.length; i++) {
      if(track.singleLineCode % 2 == 1) {
        track.singleLineCodeArr.push(index[i]);
      }
      if(track.bold % 2 == 1) {
        track.boldArr.push(index[i]);
      }
      if(track.italic % 2 == 1) {
        track.italicArr.push(index[i]);
      }
      if(track.italicBold % 2 == 1) {
        track.italicBoldArr.push(index[i]);
      }
      if(track.crossOut % 2 == 1) {
        track.crossOutArr.push(index[i]);
      }
      if(track.links % 2 == 1) {
        track.linksArr.push(index[i]);
      }
			if(track.picture % 2 == 1) {
        track.pictureArr.push(index[i]);
      }
			
      for(let a = 0; a < index[i].length; a++) {
        if(index[i][a] === "`" && track.multiLineCode % 2 == 0) {
          SingleLineCode(index, i);
        } else if((index[i][a] === "*" && index[i][a + 1] === "*" && index[i][a + 2] === "_") || (index[i][a] === "_" && index[i][a + 1] === "*" && index[i][a + 2] === "*")) {
          ItalicBold(index, i);
        } else if(index[i][a] === "*" && index[i][a + 1] === "*") {
          Bold(index, i);
        } else if(index[i][a] === "_") {
          Italic(index, i);
        } else if(index[i][a] === "~" && index[i][a + 1] === "~") {
          CrossOut(index, i);
        } else if((index[i][a] === "[" || index[i][a] === "]") && (track.picture % 2 != 1)) {
          Links(index, i);
        } else if((index[i][a] === "!" && index[i][a + 1] === "[" || index[i][a] === "]") && (track.links % 2 != 1)) {
          Picture(index, i);
				} else if(index[i][a] === "|") {
					Table(index, i);
				} else if(index[i][a] === "-" && index[i][a + 1] === "-" && index[i][a + 2] === "-" && index[i][a + 3] === "-") {
					TableHeader(index);
				}
      }
    }
		
  });
	outputEl.innerHTML = html;
	console.log(html)
}

function Alt(backtickless, j, s) {
	if(s == j - 1) {
		return backtickless[s];
	} else if(s > j - 1) {
		return "";
	} else {
		return backtickless[s] + " " + Alt(backtickless, j, s + 1);
	}
}

function TableCheck(index) {
	index = index.join(" ");
	index = index.split("");
	if(index.indexOf("|") == -1 && track.tableID == true) {
		track.tables = 0;
		track.tableID = false;
		html += `</table>`;
	}
	index = index.join("");
}

function UnorderedListCheck(index) {
	if(index.indexOf("-") == -1 && track.unorderedListID === true) {
		track.unorderedList = 0;
		track.unorderedListID = false;
		html += `</ul>`;
	}
}

function OrderedListCheck(index) {
	if(!regexp.test(index[0]) && !regexp.test(index[1]) && track.orderedListID === true) {
		track.orderedList = 0;
		track.orderedListID = false;
		html += `</ol>${index[0]}`;
	}
}

function H1(index) {
	if(index != "" && index != " ") {
  	index.splice(index.indexOf("#"), 1);
  	index = index.join(" ")
  	html += `<h1>${index}</h1>`;
	}
}

function H2(index) {
	if(index != "" && index != " ") {
  	index.splice(index.indexOf("##"), 1);
  	index = index.join(" ")
  	html += `<h2>${index}</h2>`;
	}
}

function H3(index) {
	if(index != "" && index != " ") {
  	index.splice(index.indexOf("###"), 1);
  	index = index.join(" ")
  	html += `<h3>${index}</h3>`;
	}
}

function SingleLineCode(index, i) {
  track.singleLineCode++;
  if(track.singleLineCode % 2 == 1) {
  	track.singleLineCodeArr.push(index[i]);
	}
	let backtickless = [];
	let temp = "";
  if(track.singleLineCode % 2 == 0) {
    for(let j = 0; j < track.singleLineCodeArr.length; j++) {
			if(j != track.singleLineCodeArr.length - 1) {
				temp += track.singleLineCodeArr[j] + " ";
			} else {
				temp += track.singleLineCodeArr[j];
			}
			
      backtickless[j] = track.singleLineCodeArr[j].split("");
      if(backtickless[j].indexOf("`") != -1) {
        backtickless[j].splice(backtickless[j].indexOf("`"), 1);
      }
      if(backtickless[j].indexOf("`") != -1) {
        backtickless[j].splice(backtickless[j].indexOf("`"), 1);
      }
      if(backtickless[j].indexOf(",") != -1) {
        backtickless[j].splice(backtickless[j].indexOf(","), 1);
      }
      backtickless[j] = backtickless[j].join("")
      backtickless[j] = backtickless[j].replace(/</gi, "&lt;");
      backtickless[j] = backtickless[j].replace(/>/gi, "&gt;");
      backtickless[j] = backtickless[j].replace(/</gi, "&lt;/");
    }
		html = html.replace(temp, `<span class='multi-line-code'>${Alt(backtickless, track.singleLineCodeArr.length, 0)}</span>`);
  }
}

function MultiLineCode(index) {
  index.splice(0, 1);
  track.multiLineCode++;
  if(track.multiLineCode % 2 == 1) {
    html += `<div class='multi-line-code'>`;
  } else if(track.multiLineCode % 2 == 0) {
    html += `</div>`;
  }
}

function Default(index) {
	if(index != "" && index != " ") {
  	index = index.join(" ");
  	html += `<p>${index}</p>`;
	}
}

function BlockQuote(index) {
  index.splice(0, 1);
  html += `<div class='block-quote'>${index.join("")}</div>`;
}

function Comment(index) {
  html += `<p class='comment'>${index.join(" ")}</p>`;
}

function Function(index) {
  html += `<span class='function'> ${index[index.indexOf("function")]}</span>`;
  let temp = index.indexOf("function");
  index.splice(temp, 1);
  
  index[temp] = index[temp].split("(");
  html += `<span class='parameter'> ${index[temp][0]}</span>`;
  index[temp].shift();
  index[temp] = index[temp][0];
  
  index[temp] = "(" + index[temp];
  index = index.join(" ");
  html += `<span>${index}</span><br />`;
}

function IfStatement(index) {
  html += `<span class='function'> ${index[index.indexOf("if")]}</span>`;
  index.splice(index.indexOf("if"), 1);
  
  html += `<span> ${index.join(" ")}</span><br />`;
}

function Return(index) {
  html += `<span class='function'> ${index[index.indexOf("return")]}</span>`;
  index.splice(index.indexOf("return"), 1);
  
  html += `<span> ${index.join(" ")}</span><br />`;
}

function Bold(index, i) {
  track.bold++;
	if(track.bold % 2 == 1) {
  	track.boldArr.push(index[i]);
	}
	let starless = [];
	let temp = "";
  if(track.bold % 2 == 0) {
    for(let j = 0; j < track.boldArr.length; j++) {
			if(j != track.boldArr.length - 1) {
				temp += track.boldArr[j] + " ";
			} else {
				temp += track.boldArr[j];
			}
      starless[j] = track.boldArr[j].split("");
      if(starless[j].indexOf("*") != -1) {
        starless[j].splice(starless[j].indexOf("*"), 1);
      }
      if(starless[j].indexOf("*") != -1) {
        starless[j].splice(starless[j].indexOf("*"), 1);
      }
      if(starless[j].indexOf("*") != -1) {
        starless[j].splice(starless[j].indexOf("*"), 1);
      }
      if(starless[j].indexOf("*") != -1) {
        starless[j].splice(starless[j].indexOf("*"), 1);
      }
      if(starless[j].indexOf(",") != -1) {
        starless[j].splice(starless[j].indexOf(","), 1);
      }
      starless[j] = starless[j].join("");
    }
		html = html.replace(temp, `<strong>${Alt(starless, track.boldArr.length, 0)}</strong>`);
  }
}

function Italic(index, i) {
  track.italic++;
	if(track.italic % 2 == 1) {
  	track.italicArr.push(index[i]);
	}
	let underscoreless = [];
	let temp = "";
  if(track.italic % 2 == 0) {
    for(let j = 0; j < track.italicArr.length; j++) {
			if(j != track.italicArr.length - 1) {
				temp += track.italicArr[j] + " ";
			} else {
				temp += track.italicArr[j];
			}
      underscoreless[j] = track.italicArr[j].split("");
      if(underscoreless[j].indexOf("_") != -1) {
        underscoreless[j].splice(underscoreless[j].indexOf("_"), 1);
      }
      if(underscoreless[j].indexOf("_") != -1) {
        underscoreless[j].splice(underscoreless[j].indexOf("_"), 1);
      }
      if(underscoreless[j].indexOf(",") != -1) {
        underscoreless[j].splice(underscoreless[j].indexOf(","), 1);
      }
      underscoreless[j] = underscoreless[j].join("");
    }
		html = html.replace(temp, `<em>${Alt(underscoreless, track.italicArr.length, 0)}</em>`);
  }
}

function ItalicBold(index, i) {
  track.italicBold++;
	if(track.italicBold % 2 == 1) {
  	track.italicBoldArr.push(index[i]);
	}
	let shapeless = [];
	let temp = "";
  if(track.italicBold % 2 == 0) {
    for(let j = 0; j < track.italicBoldArr.length; j++) {
			if(j != track.italicBoldArr.length - 1) {
				temp += track.italicBoldArr[j] + " ";
			} else {
				temp += track.italicBoldArr[j];
			}
      shapeless[j] = track.italicBoldArr[j].split("");
      if(shapeless[j].indexOf("*") != -1) {
        shapeless[j].splice(shapeless[j].indexOf("*"), 1);
      }
      if(shapeless[j].indexOf("*") != -1) {
        shapeless[j].splice(shapeless[j].indexOf("*"), 1);
      }
      if(shapeless[j].indexOf("*") != -1) {
        shapeless[j].splice(shapeless[j].indexOf("*"), 1);
      }
      if(shapeless[j].indexOf("*") != -1) {
        shapeless[j].splice(shapeless[j].indexOf("*"), 1);
      }
      if(shapeless[j].indexOf("_") != -1) {
        shapeless[j].splice(shapeless[j].indexOf("_"), 1);
      }
      if(shapeless[j].indexOf("_") != -1) {
        shapeless[j].splice(shapeless[j].indexOf("_"), 1);
      }
      if(shapeless[j].indexOf(",") != -1) {
        shapeless[j].splice(shapeless[j].indexOf(","), 1);
      }
      shapeless[j] = shapeless[j].join("");
    }
		html = html.replace(temp, `<strong><em>${Alt(shapeless, track.italicBoldArr.length, 0)}</em></strong>`);
  }
}

function CrossOut(index, i) {
  track.crossOut++;
	if(track.crossOut % 2 == 1) {
  	track.crossOutArr.push(index[i]);
	}
	let crossless = [];
	let temp = "";
  if(track.crossOut % 2 == 0) {
    for(let j = 0; j < track.crossOutArr.length; j++) {
			if(j != track.crossOutArr.length - 1) {
				temp += track.crossOutArr[j] + " ";
			} else {
				temp += track.crossOutArr[j];
			}
      crossless[j] = track.crossOutArr[j].split("");
      if(crossless[j].indexOf("~") != -1) {
        crossless[j].splice(crossless[j].indexOf("~"), 1);
      }
      if(crossless[j].indexOf("~") != -1) {
        crossless[j].splice(crossless[j].indexOf("~"), 1);
      }
      if(crossless[j].indexOf("~") != -1) {
        crossless[j].splice(crossless[j].indexOf("~"), 1);
      }
      if(crossless[j].indexOf("~") != -1) {
        crossless[j].splice(crossless[j].indexOf("~"), 1);
      }
      if(crossless[j].indexOf(",") != -1) {
        crossless[j].splice(crossless[j].indexOf(","), 1);
      }
      crossless[j] = crossless[j].join("");
    }
		html = html.replace(temp, `<s>${Alt(crossless, track.crossOutArr.length, 0)}</s>`);
  }
}

function Links(index, i) {
  track.links++;
	if(track.links % 2 == 1) {
  	track.linksArr.push(index[i]);
	}
	let braceless = [];
	let temp = "";
	let href = "";
  if(track.links % 2 == 0) {
    for(let j = 0; j < track.linksArr.length; j++) {
			if(j != track.linksArr.length - 1) {
				temp += track.linksArr[j] + " ";
			} else {
				temp += track.linksArr[j];
			}
      braceless[j] = track.linksArr[j].split("");
      if(braceless[j].indexOf("[") != -1) {
        braceless[j].splice(braceless[j].indexOf("["), 1);
      }
      if(braceless[j].indexOf("]") != -1) {
        braceless[j].splice(braceless[j].indexOf("]"), 1);
      }
      if(braceless[j].indexOf(",") != -1) {
        braceless[j].splice(braceless[j].indexOf(","), 1);
      }
      if(braceless[j].indexOf(")") != -1) {
        braceless[j].splice(braceless[j].indexOf(")"), 1);
      }
      braceless[j] = braceless[j].join("").split("(");
      href = braceless[j][1];
      braceless[j] = braceless[j][0];
    }
		html = html.replace(temp, `<a target='_blank' href='${href}'>${Alt(braceless, track.linksArr.length, 0)}</a>`);
  }
}

function Picture(index, i) {
	
	track.picture++;
	if(track.picture % 2 == 1) {
  	track.pictureArr.push(index[i]);
	}
	let braceless = [];
	let temp = "";
	let href = "";
  if(track.picture % 2 == 0) {
    for(let j = 0; j < track.pictureArr.length; j++) {
			if(j != track.pictureArr.length - 1) {
				temp += track.pictureArr[j] + " ";
			} else {
				temp += track.pictureArr[j];
			}
      braceless.push(track.pictureArr[j].split(""));
      if(braceless[j].indexOf("!") != -1) {
        braceless[j].splice(braceless[j].indexOf("!"), 1);
      }
      if(braceless[j].indexOf("[") != -1) {
        braceless[j].splice(braceless[j].indexOf("["), 1);
      }
			if(braceless[j].indexOf("]") != -1) {
        braceless[j].splice(braceless[j].indexOf("]"), 1);
      }
      if(braceless[j].indexOf(",") != -1) {
        braceless[j].splice(braceless[j].indexOf(","), 1);
      }
      if(braceless[j].indexOf(")") != -1) {
        braceless[j].splice(braceless[j].indexOf(")"), 1);
      }
      braceless[j] = braceless[j].join("").split("(");
			href = braceless[j][1];
      braceless[j] = braceless[j][0];
    }
		html = html.replace(temp, `<img class='image' alt='${Alt(braceless, track.pictureArr.length, 0)}' src='${href}' />`);
  }
}

function Table(index, i) {
	track.table++;
	track.tables++;
	
	index = index.join(" ");
	index = index.split("|");
	html = html.replace(/\|/gi, " ");
	if(track.tables == 1) {
		html = html.replace(index[0], `<table>${index[0]}`)
	}
	if(track.table == 1) {
		if(track.tables > 1) {
			html = html.replace(index[0], `</tr>${index[0]}`)
		}
		if(!track.tableID) {
			html = html.replace(index[0], `<tr><th>${index[0]}</th>`)
			html = html.replace(index[1], `<th>${index[1]}</th>`)
		} else {
			html = html.replace(index[0], `<tr><td>${index[0]}</td>`)
			html = html.replace(index[1], `<td>${index[1]}</td>`)
		}
	} else {
		if(!track.tableID) {
			html = html.replace(index[track.table], `<th>${index[track.table]}</th>`)
		} else {
			html = html.replace(index[track.table], `<td>${index[track.table]}</td>`)
		}
	}
}

function TableHeader(index) {
	track.tableID = true;
	index = index.join(" ");
	index = index.split("|");
	for(let i = 0; i < index.length; i++) {
		html = html.replace(index[i], "");
	}
}

function UnorderedList(index) {
	track.unorderedList++;
	track.unorderedListID = true;
	if(track.unorderedList == 1) {
		html += `<ul>`;
	}
	index.splice(index.indexOf("-"), 1);
	index = index.join(" ");
	if(track.unorderedList < 3) {
		html += `<li style='margin-left: ${2 * track.unorderedList}rem' class='ul-${track.unorderedList}'>${index}</li>`;
	} else if(track.unorderedList >= 3) {
		html += `<li style='margin-left: ${2 * track.unorderedList}rem' class='ul-3'>${index}</li>`;
	}
}

function OrderedList(index) {
	track.orderedList++;
	track.orderedListID = true;
	if(track.orderedList == 1) {
		html += `<ol>`;
	}
	if(regexp.test(index[0])) {
		index.splice(0, 1);
	} else if(regexp.test(index[1])) {
		index.splice(1, 1);
	}
	index = index.join(" ");
	html += `<li>${index}</li>`;
}
});