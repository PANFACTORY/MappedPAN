/*const inputnxi = document.getElementById('inputnxi');
const inputnita = document.getElementById('inputnita');


//********************ξη座標系ステージ********************
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


//********************イベント********************
inputnxi.addEventListener('change', drawxiitamesh);
inputnita.addEventListener('change', drawxiitamesh);
window.addEventListener('resize', resizewindow, false);


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
*/

















//********************共通********************

//----------点要素----------
class Point {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.shared = 0;    //  この点を含む要素の数
    }

    Distance(_p) {
        return Math.sqrt((this.x - _p.x)**2 + (this.y - _p.y)**2);
    }
}


//----------線要素----------
class Line {
    constructor(_p0, _p1, _color = "black", _width = 1) {
        this.p0 = _p0;
        this.p1 = _p1;
        this.color = _color;
        this.width = _width;
        this.p0.shared++;
        this.p1.shared++;
    }

    Draw(_ctx) {
        _ctx.strokeStyle = this.color;
        _ctx.lineWidth = this.width;
        _ctx.beginPath();
        _ctx.moveTo(this.p0.x, this.p0.y);
        _ctx.lineTo(this.p1.x, this.p1.y);
        _ctx.stroke();
    }

    isHit(_p) {
        return false;
    }
}


//----------円要素----------
class Circle {
    constructor(_p0, _r, _color = "black", _width = 1) {
        this.p0 = _p0;
        this.r = _r
        this.color = _color;
        this.width = _width;
        this.p0.shared++;
    }

    Draw(_ctx) {
        _ctx.strokeStyle = this.color;
        _ctx.lineWidth = this.width;
        _ctx.beginPath();
        _ctx.arc(this.p0.x, this.p0.y, this.r, 0, 2.0*Math.PI, 0);
        _ctx.stroke();
    }

    isHit(_p) {
        if(Math.abs(this.p0.Distance(_p) - this.r) < 5){
            return true;
        }
        return false;
    }
}


//----------座標軸の描画----------
function drawcoordinate(_canvas, _ctx, _axis0, _axis1){
    //----------Initialize context----------
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

    //----------Draw coordinate----------
    _ctx.strokeStyle = "red";
    _ctx.lineWidth = 1;
    _ctx.beginPath();
    _ctx.moveTo(10, _canvas.height - 15);
    _ctx.lineTo(50, _canvas.height - 15);
    _ctx.stroke();

    _ctx.strokeStyle = "yellow";
    _ctx.lineWidth = 1;
    _ctx.beginPath();
    _ctx.moveTo(10, _canvas.height - 15);
    _ctx.lineTo(10, _canvas.height - 55);
    _ctx.stroke();

    _ctx.fillStyle = "white";
    _ctx.font = "italic 15px 'Times New Roman'";
    _ctx.textAlign = "left";
    _ctx.textBaseline = "top";
    _ctx.fillText(_axis0, 55, _canvas.height - 25);
    _ctx.fillText(_axis1, 5, _canvas.height - 75);
}





//********************ξη座標系********************
const canvas_xiita = document.getElementById('canvas_xiita');       //  ξη座標系の作図用canvas
const ctx_xiita = canvas_xiita.getContext('2d');                    //  ξη座標系の作図用canvasのcontext





//********************xy座標系********************
const canvas_xy = document.getElementById('canvas_xy');                             //  xy座標系の作図用canvas
const ctx_xy = canvas_xy.getContext('2d');                                          //  xy座標系の作図用canvasのcontext
const canvas_xy_coordinate = document.getElementById('canvas_xy_coordinate');       //  xy座標系の座標軸用canvas
const ctx_xy_coordinate = canvas_xy_coordinate.getContext('2d');                    //  xy座標系の座標軸用canvasのcontext
const canvas_xy_tmp = document.getElementById('canvas_xy_tmp');                     //  xy座標系の下書き用canvas
const ctx_xy_tmp = canvas_xy_tmp.getContext('2d');                                  //  xy座標系の下書き用canvasのcontext


var elements = new Array();                                         //  xy座標系に作図された要素の配列
var points = new Array();                                           //  xy座標系に作図された点の配列


//----------線描画のイベント----------
function drawline(_edown){
    var rect = _edown.target.getBoundingClientRect();
    var startpoint = new Point(_edown.clientX - rect.left, _edown.clientY - rect.top);
    var isstartpointnew = true;

    for(var point of points){
        if(startpoint.Distance(point) < 5){
            startpoint = point;
            isstartpointnew = false;
            break;
        }
    }

    if(isstartpointnew){
        points.push(startpoint);
    }   

    canvas_xy_tmp.addEventListener('mousemove', guide);
    canvas_xy_tmp.addEventListener('mouseup', draw);

    function guide(_etmp){
        ctx_xy_tmp.clearRect(0, 0, canvas_xy.width, canvas_xy.height);

        var rect = _etmp.target.getBoundingClientRect();
        var endpoint = new Point(_etmp.clientX - rect.left, _etmp.clientY - rect.top);
       
        for(var point of points){
            if(endpoint.Distance(point) < 5){
                endpoint = point;
                break;
            }
        }
        
        var line = new Line(startpoint, endpoint, "gold");
        line.Draw(ctx_xy_tmp);
    }    

    function draw(_eup){
        ctx_xy_tmp.clearRect(0, 0, canvas_xy.width, canvas_xy.height);

        var rect = _eup.target.getBoundingClientRect();
        var endpoint = new Point(_eup.clientX - rect.left, _eup.clientY - rect.top);
        var isendpointnew = true;

        for(var point of points){
            if(endpoint.Distance(point) < 5){
                endpoint = point;
                isendpointnew = false;
                break;
            }
        }

        if(isendpointnew){
            points.push(endpoint);
        }
        
        var line = new Line(startpoint, endpoint, "aqua");
        line.Draw(ctx_xy);
        elements.push(line);

        canvas_xy_tmp.removeEventListener('mousemove', guide);
        canvas_xy_tmp.removeEventListener('mouseup', draw);
    }    
}


//----------円描画のイベント----------
function drawcircle(_edown){
    var rect = _edown.target.getBoundingClientRect();
    var centerpoint = new Point(_edown.clientX - rect.left, _edown.clientY - rect.top);
    var iscenterpointnew = true;

    for(var point of points){
        if(centerpoint.Distance(point) < 5){
            centerpoint = point;
            iscenterpointnew = false;
            break;
        }
    }

    if(iscenterpointnew){
        points.push(centerpoint);
    }   

    canvas_xy_tmp.addEventListener('mousemove', guide);
    canvas_xy_tmp.addEventListener('mouseup', draw);

    function guide(_etmp){
        ctx_xy_tmp.clearRect(0, 0, canvas_xy.width, canvas_xy.height);

        var rect = _etmp.target.getBoundingClientRect();
        var edgepoint = new Point(_etmp.clientX - rect.left, _etmp.clientY - rect.top);
       
        for(var point of points){
            if(edgepoint.Distance(point) < 5){
                edgepoint = point;
                break;
            }
        }
        
        var circle = new Circle(centerpoint, centerpoint.Distance(edgepoint), "gold");
        circle.Draw(ctx_xy_tmp);
    }    

    function draw(_eup){
        ctx_xy_tmp.clearRect(0, 0, canvas_xy.width, canvas_xy.height);

        var rect = _eup.target.getBoundingClientRect();
        var edgepoint = new Point(_eup.clientX - rect.left, _eup.clientY - rect.top);
        
        for(var point of points){
            if(edgepoint.Distance(point) < 5){
                edgepoint = point;
                break;
            }
        }
        
        var circle = new Circle(centerpoint, centerpoint.Distance(edgepoint), "aqua");
        circle.Draw(ctx_xy);
        elements.push(circle);

        canvas_xy_tmp.removeEventListener('mousemove', guide);
        canvas_xy_tmp.removeEventListener('mouseup', draw);
    }    
}


//----------要素削除のイベント----------
function deleteelement(_edown){
    //----------各要素について当たり判定----------
    var rect = _edown.target.getBoundingClientRect();
    var clickpoint = new Point(_edown.clientX - rect.left, _edown.clientY - rect.top);
    var isneedredraw = false;

    for(var i = 0; i < elements.length; i++){
        if(elements[i].isHit(clickpoint)) {
            elements.splice(i, 1);
            isneedredraw = true;
            break;
        }
    }

    //----------再描画----------
    if(isneedredraw){
        ctx_xy.clearRect(0, 0, canvas_xy.width, canvas_xy.height);
        for(var element of elements){
            element.Draw(ctx_xy);
        }
    }
}





//********************初期化関係********************
function initializeButton(){
    //----------ボタンの色----------
    document.getElementById("icon_line").style.color = "white";
    document.getElementById("icon_circle").style.color = "white";
    document.getElementById("icon_delete").style.color = "white";
    document.getElementById("icon_mesh").style.color = "white";
    document.getElementById("icon_export").style.color = "white";

    //-----------イベントリスナーの解除----------
    canvas_xy_tmp.removeEventListener('mousedown', drawline);
    canvas_xy_tmp.removeEventListener('mousedown', drawcircle);
    canvas_xy_tmp.removeEventListener('mousedown', deleteelement);
}


function initializeCanvas(){
    //----------ξη座標系----------
    drawcoordinate(canvas_xiita, ctx_xiita, "ξ", "η");

    //----------xy座標系----------
    drawcoordinate(canvas_xy_coordinate, ctx_xy_coordinate, "x", "y");
}


initializeButton();
initializeCanvas();





//********************ボタンイベント********************
document.getElementById("button_line").onclick = function() {
    initializeButton();

    document.getElementById("icon_line").style.color = "lime";
    canvas_xy_tmp.addEventListener('mousedown', drawline);
};


document.getElementById("button_circle").onclick = function() {
    initializeButton();

    document.getElementById("icon_circle").style.color = "lime";
    canvas_xy_tmp.addEventListener('mousedown', drawcircle);
};


document.getElementById("button_delete").onclick = function() {
    initializeButton();

    document.getElementById("icon_delete").style.color = "orangered";
    canvas_xy_tmp.addEventListener('mousedown', deleteelement);
};


document.getElementById("button_mesh").onclick = function() {
    initializeButton();
    
    document.getElementById("icon_mesh").style.color = "lime";
};


document.getElementById("button_export").onclick = function() {
    initializeButton();
    
    document.getElementById("icon_export").style.color = "lime";
};