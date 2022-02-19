const {Text, Color} = require("scenegraph"); // XD拡張APIのクラスをインポート

function helloHandlerFunction(selection) { // メインのファンクション
  console.log("my function is called!"); // Developer Consoleに出力
  const el = new Text(); // XDのTextクラスからインスタンスを生成
  el.text = "Hello, World!";
  el.styleRanges = [ // テキストのスタイルを設定
    {
      length: el.text.length,
      fill: new Color("#FF0000"),
      fontSize: 24
    }
  ];
  selection.insertionParent.addChild(el); // XDノードツリーにテキストオブジェクトを追加
  el.moveInParentCoordinates(100, 100); // テキストオブジェクトの表示位置を指定
}

module.exports = { // コマンドIDとファンクションの紐付け
  commands: {
    helloCommand: helloHandlerFunction
  }
};