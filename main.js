const { Text, Color, Group, Artboard, RootNode } = require("scenegraph"); // XD拡張APIのクラスをインポート
let arr = {};

let panel;

function create() {
  const html = `
    <style>
    .show {display: block;}
    .hide {display: none;}
    h2 > a {
      display: inline;
      color: gray;
    }
    #data_items p {
      font-size: 12px;
      margin-left: 2em;
    }
    </style>
    <div id="property" class="show">
      <div id="data_items">
      </div>
    </div>
  `;

  // function createCircle(e) {} // [4]
  // function onChangeSlider(e) {}

  panel = document.createElement("div");
  panel.innerHTML = html;

  // panel.querySelector("button").addEventListener("click", createCircle); // [5]
  // panel.querySelector("input").addEventListener("change", onChangeSlider);

  return panel;
}

function show(event) {
  if (!panel) event.node.appendChild(create());
  console.log("show panel");
}

function update(selection) {
  const propertyPanel = document.getElementById("property");
  const dataList = document.getElementById("data_items");
  dataList.innerHTML = "";
  if (selection && selection.items.length > 0) {
    // console.log(panel.innerHTML);
    const dataSet = helloHandlerFunction(selection);
    Object.keys(dataSet).forEach((key) => {
      const div = document.createElement("div");
      div.innerHTML = `
      <div>
        <h2 style="font-family:${key}"><a href="https://fonts.google.com/?query=${key}" target="_blank">${key}</a></h2>
        <p>count : ${dataSet[key].count}</p>
        <p>style : ${dataSet[key].option.fontStyle.sort().join(",")}</p>
        <p>size  : ${dataSet[key].option.fontSize.sort().join(",")}</p>
        <p>space : ${dataSet[key].option.charSpacing.sort().join(",")}</p>
        <p>line  : ${dataSet[key].option.lineSpacing.sort().join(",")}</p>
        <p>para  : ${dataSet[key].option.paragraphSpacing.sort().join(",")}</p>
        <p>use character : </p>
        <p><textarea style="font-family:${key}">${dataSet[key].option.text.split('').filter((x,i,self)=>(self.indexOf(x)===i)).join('')}</textarea></p>
      </div>`;
      dataList.appendChild(div);
    });
    propertyPanel.className = "show";
  } else {
    propertyPanel.className = "hide";
  }
  console.log("update panel");
}

function helloHandlerFunction(selection, documentRoot) {
  // console.log(selection?.constructor?.name);
  // console.log(selection);
  let items = null;
  let baseNode = selection === [] ? documentRoot : selection;
  if (baseNode || baseNode.items) {
    switch (baseNode.constructor?.name || "") {
      case "Selection":
        arr = {};
        items = baseNode.items;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          helloHandlerFunction(item);
        }
        console.log(arr);
        return arr;
        break;
      case "DocumentRoot":
        arr = [];
        items = baseNode.items;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          helloHandlerFunction(item);
        }
        // console.log(arr);
        break;
      case "Text":
        // テキストを選択した場合
        // console.log("TextNode:",baseNode.styleRanges);
        const fontFamily = baseNode.styleRanges[0].fontFamily || "";
        const fontStyle = baseNode.styleRanges[0].fontStyle || "";
        const fontSize = baseNode.styleRanges[0].fontSize || "";
        const charSpacing = baseNode.styleRanges[0].charSpacing || "";
        const lineSpacing = baseNode.styleRanges[0].lineSpacing || "";
        const paragraphSpacing = baseNode.styleRanges[0].paragraphSpacing || "";
        const text = baseNode.text;
        const fontOption = `${fontFamily}`;
        if (!arr[fontOption]) {
          arr = {...arr, [fontOption]: {
            count : 1,
            option : {
              fontStyle: [fontStyle],
              fontSize: [fontSize],
              charSpacing: [charSpacing],
              lineSpacing: [lineSpacing],
              paragraphSpacing: [paragraphSpacing],
              text: text
            }
          }};
        }else{
          arr[fontOption].count++;
          arr[fontOption].option.fontStyle.indexOf(fontStyle) === -1 && arr[fontOption].option.fontStyle.push(fontStyle);
          arr[fontOption].option.fontSize.indexOf(fontSize) === -1 && arr[fontOption].option.fontSize.push(fontSize);
          arr[fontOption].option.charSpacing.indexOf(charSpacing) === -1 && arr[fontOption].option.charSpacing.push(charSpacing);
          arr[fontOption].option.lineSpacing.indexOf(lineSpacing) === -1 && arr[fontOption].option.lineSpacing.push(lineSpacing);
          arr[fontOption].option.paragraphSpacing.indexOf(paragraphSpacing) === -1 && arr[fontOption].option.paragraphSpacing.push(paragraphSpacing);
          arr[fontOption].option.text += text;
        }
        break;
      case "Group":
        // console.log("Group:",baseNode);
        items = baseNode.items;
        items = baseNode.children.forEach((child) => {
          helloHandlerFunction(child);
        });
        break;
      case "Artboard":
        // console.log("Artboard:",baseNode);
        items = baseNode.children.forEach((child) => {
          helloHandlerFunction(child);
        });
        break;
      default:
      // console.log("default:",baseNode.constructor?.name);
    }
  }
  return arr;
}

module.exports = {
  // コマンドIDとファンクションの紐付け
  commands: {
    helloCommand: helloHandlerFunction,
  },
  panels: {
    panelUITest: {
      show,
      update,
    },
  },
};
