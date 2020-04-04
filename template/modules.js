const inputnxi = document.getElementById('inputnxi');
const inputnita = document.getElementById('inputnita');
const buttonline = document.getElementById('buttonline');


//********************ξη座標系ステージ********************
const stagexiita = new createjs.Stage('canvasxiita');       //  ξη座標系ステージ
const xiitacoordinate = new createjs.Container();           //  ξη座標系座標軸コンテナ
stagexiita.addChild(xiitacoordinate);
const xiitamesh = new createjs.Container();                 //  ξη座標系メッシュコンテナ
stagexiita.addChild(xiitamesh);


function drawxiitacoordinate(){
    //----------Initialize container----------
    xiitacoordinate.removeAllChildren();

    //----------Draw coordinate----------
    var line = new createjs.Graphics();
    line.s('red').mt(10, stagexiita.canvas.height - 15).lt(50, stagexiita.canvas.height - 15).es();
    line.s('yellow').mt(10, stagexiita.canvas.height - 15).lt(10, stagexiita.canvas.height - 55).es();
    var shape = new createjs.Shape(line);
    xiitacoordinate.addChild(shape);

    var textxi = new createjs.Text("ξ", "italic 15px Times New Roman", "white");
    textxi.x = 55;
    textxi.y = stagexiita.canvas.height - 25;
    xiitacoordinate.addChild(textxi);

    var textita = new createjs.Text("η", "italic 15px Times New Roman", "white");
    textita.x = 5;
    textita.y = stagexiita.canvas.height - 75;
    xiitacoordinate.addChild(textita);
    
    stagexiita.update();
}


function drawxiitamesh(){
    //----------Initialize container----------
    if(Number(inputnxi.value) == 0){
        inputnxi.value = 1;
    }
    if(Number(inputnita.value) == 0){
        inputnita.value = 1;
    }
    xiitamesh.removeAllChildren();

    //----------Draw mesh----------
    var delta = 0.8*Math.min(stagexiita.canvas.width/Number(inputnxi.value), stagexiita.canvas.height/Number(inputnita.value));
    var offsetxi = 0.5*(stagexiita.canvas.width - delta*Number(inputnxi.value));
    var offsetita = 0.5*(stagexiita.canvas.height - delta*Number(inputnita.value));
    
    var line = new createjs.Graphics();
    for(var v = 0; v < Number(inputnxi.value) + 1; v++){
        line.s('aqua').mt(v*delta + offsetxi, offsetita).lt(v*delta + offsetxi, Number(inputnita.value)*delta + offsetita).es();
    }
    for(var v = 0; v < Number(inputnita.value) + 1; v++){
        line.s('aqua').mt(offsetxi, v*delta + offsetita).lt(Number(inputnxi.value)*delta + offsetxi, v*delta + offsetita).es();
    }
    var shape = new createjs.Shape(line);
    xiitamesh.addChild(shape);

    //----------Draw point marker----------
    var textmarker0 = new createjs.Text("0", "15px Times New Roman", "lightsalmon");
    textmarker0.x = offsetxi - 10;
    textmarker0.y = Number(inputnita.value)*delta + offsetita;
    xiitamesh.addChild(textmarker0);

    var textmarker1 = new createjs.Text("1", "15px Times New Roman", "lightsalmon");
    textmarker1.x = Number(inputnxi.value)*delta + offsetxi + 5;
    textmarker1.y = Number(inputnita.value)*delta + offsetita;
    xiitamesh.addChild(textmarker1);

    var textmarker2 = new createjs.Text("2", "15px Times New Roman", "lightsalmon");
    textmarker2.x = Number(inputnxi.value)*delta + offsetxi + 5;
    textmarker2.y = offsetita - 10;
    xiitamesh.addChild(textmarker2);

    var textmarker3 = new createjs.Text("3", "15px Times New Roman", "lightsalmon");
    textmarker3.x = offsetxi - 10;
    textmarker3.y = offsetita - 10;
    xiitamesh.addChild(textmarker3);

    stagexiita.update();
}


//********************xy座標系ステージ********************
const stagexy = new createjs.Stage('canvasxy');             //  xy座標系ステージ
const xycoordinate = new createjs.Container();              //  xy座標系座標軸コンテナ
stagexy.addChild(xycoordinate);
const xymesh = new createjs.Container();                    //  xy座標系メッシュコンテナ
stagexy.addChild(xymesh);
const xytmp = new createjs.Container();                     //  xy座標系下書きコンテナ
stagexy.addChild(xytmp);
var xyx0 = 0;
var xyy0 = 0;



function drawxycoordinate(){
    //----------Initialize container----------
    xycoordinate.removeAllChildren();

    //----------Draw coordinate----------
    var line = new createjs.Graphics();
    line.s('red').mt(10, stagexy.canvas.height - 15).lt(50, stagexy.canvas.height - 15).es();
    line.s('yellow').mt(10, stagexy.canvas.height - 15).lt(10, stagexy.canvas.height - 55).es();
    var shape = new createjs.Shape(line);
    xycoordinate.addChild(shape);

    var textx = new createjs.Text("x", "italic 15px Times New Roman", "white");
    textx.x = 55;
    textx.y = stagexy.canvas.height - 25;
    xycoordinate.addChild(textx);

    var texty = new createjs.Text("y", "italic 15px Times New Roman", "white");
    texty.x = 5;
    texty.y = stagexy.canvas.height - 75;
    xycoordinate.addChild(texty);
    
    stagexy.update();
}


function xymousedown(event){
    xyx0 = event.stageX;
    xyy0 = event.stageY;
    stagexy.addEventListener("stagemousemove", xymousemove);
    stagexy.addEventListener("stagemouseup", xymouseup);
}


function xymousemove(event){
    xytmp.removeAllChildren();
    var line = new createjs.Graphics();
    line.s('lightsalmon').mt(xyx0, xyy0).lt(event.stageX, event.stageY).es();
    var shape = new createjs.Shape(line);
    xytmp.addChild(shape);
    stagexy.update();
}


function xymouseup(event){
    xytmp.removeAllChildren();
    var line = new createjs.Graphics();
    line.s('aqua').mt(xyx0, xyy0).lt(event.stageX, event.stageY).es();
    var shape = new createjs.Shape(line);
    xymesh.addChild(shape);
    stagexy.update();

    stagexy.removeEventListener("stagemousemove", xymousemove);
    stagexy.removeEventListener("stagemouseup", xymouseup);
}


//********************イベント********************
inputnxi.addEventListener('change', drawxiitamesh);
inputnita.addEventListener('change', drawxiitamesh);
window.addEventListener('resize', resizewindow, false);
stagexy.addEventListener('stagemousedown', xymousedown);


function resizewindow(){
    //Need to modify
    stagexiita.canvas.width = document.getElementById('canvasxiita').parentNode.parentNode.clientWidth;
    stagexiita.canvas.height = document.getElementById('canvasxiita').parentNode.parentNode.clientHeight - document.getElementById('headerxiita').clientHeight - document.getElementById('footerxiita').clientHeight*1.2;
    stagexiita.update();
    
    drawxiitacoordinate();
    drawxiitamesh();
    
    stagexy.canvas.width = document.getElementById('canvasxy').parentNode.clientWidth;
    stagexy.canvas.height = document.getElementById('canvasxy').parentNode.parentNode.clientHeight - document.getElementById('headerxy').clientHeight - document.getElementById('footerxiita').clientHeight*1.2;
    stagexy.update();
    
    drawxycoordinate();
}


resizewindow();