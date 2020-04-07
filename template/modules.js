//*****************************************************************************
//  Title       :   template/modules.js
//  Author      :   Tanabe Yuta
//  Date        :   2020/04/07
//  Copyright   :   (C)2020 TanabeYuta
//*****************************************************************************   





//********************システム非依存********************

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
    constructor(_p0, _p1) {
        this.p0 = _p0;
        this.p1 = _p1;
        this.p0.shared++;
        this.p1.shared++;
    }

    get Length() {
        return this.p0.Distance(this.p1);
    }

    Draw(_ctx, _color = "aqua", _width = 1) {
        _ctx.strokeStyle = _color;
        _ctx.lineWidth = _width;
        _ctx.beginPath();
        _ctx.moveTo(this.p0.x, this.p0.y);
        _ctx.lineTo(this.p1.x, this.p1.y);
        _ctx.stroke();
        _ctx.strokeStyle = "white";
        _ctx.beginPath();
        _ctx.arc(this.p0.x, this.p0.y, 5, 0, 2.0*Math.PI, 0);
        _ctx.stroke();
        _ctx.strokeStyle = "white";
        _ctx.beginPath();
        _ctx.arc(this.p1.x, this.p1.y, 5, 0, 2.0*Math.PI, 0);
        _ctx.stroke();
    }

    isHit(_p) {
        var a = this.p1.y - this.p0.y;
        var b = this.p0.x - this.p1.x;
        var c = this.p1.x*this.p0.y - this.p0.x*this.p1.y;
        var d0 = Math.abs(a*_p.x + b*_p.y + c)/Math.sqrt(a**2 + b**2);
        var d1 = this.p0.Distance(_p);
        var d2 = this.p1.Distance(_p);
        var d3 = this.Length;
        if(d0 < 5 && d1 < d3 + 5 && d2 < d3 + 5){
            return true;
        }
        return false;
    }

    releasePoint() {
        this.p0.shared--;
        this.p1.shared--;
    }

    generatePointOnEdge(_n) {
        var points = new Array(_n);
        for(var i = 0; i < _n; i++){
            points[i] = [(this.p1.x - this.p0.x)*i/_n + this.p0.x, (this.p1.y - this.p0.y)*i/_n + this.p0.y];
        }
        return points;
    }
}


//----------円要素----------
class Circle {
    constructor(_p0, _p1, _p2, _direction) {
        this.p0 = _p0;      //  始点
        this.p1 = _p1;      //  終点
        this.p2 = _p2;      //  中心
        this.direction = _direction;
        this.p0.shared++;
        this.p1.shared++;
        this.p2.shared++;
        this.radius = this.p2.Distance(this.p0);
        this.startangle = Math.atan2(this.p0.y - this.p2.y, this.p0.x - this.p2.x);
        this.endangle = Math.atan2(this.p1.y - this.p2.y, this.p1.x - this.p2.x);
        if(this.direction && this.startangle < this.endangle) {
            this.endangle -= 2*Math.PI;
        } else if(!this.direction && this.startangle > this.endangle) {
            this.endangle += 2*Math.PI;
        }
    }

    Draw(_ctx, _color = "aqua", _width = 1) {
        _ctx.strokeStyle = _color;
        _ctx.lineWidth = _width;
        _ctx.beginPath();
        _ctx.arc(this.p2.x, this.p2.y, this.radius, this.startangle, this.endangle, this.direction);
        _ctx.stroke();
        _ctx.strokeStyle = "white";
        _ctx.beginPath();
        _ctx.arc(this.p0.x, this.p0.y, 5, 0, 2.0*Math.PI, 0);
        _ctx.stroke();
        _ctx.beginPath();
        _ctx.arc(this.p1.x, this.p1.y, 5, 0, 2.0*Math.PI, 0);
        _ctx.stroke();
        _ctx.beginPath();
        _ctx.arc(this.p2.x, this.p2.y, 5, 0, 2.0*Math.PI, 0);
        _ctx.stroke();
    }

    isHit(_p) {
        var tmpangle = Math.atan2(_p.y - this.p2.y, _p.x - this.p2.x);
        if(this.direction && this.startangle < tmpangle) {
            tmpangle -= 2*Math.PI;
        } else if(!this.direction && this.startangle > tmpangle) {
            tmpangle += 2*Math.PI;
        }
        if(Math.abs(this.p2.Distance(_p) - this.radius) < 5 && ((!this.direction && this.startangle <= tmpangle && tmpangle <= this.endangle) || (this.direction && this.endangle <= tmpangle && tmpangle <= this.startangle))){
            return true;
        }
        return false;
    }

    releasePoint() {
        this.p0.shared--;
        this.p1.shared--;
        this.p2.shared--;
    }

    generatePointOnEdge(_n) {
        var points = new Array(_n);
        var dangle = this.endangle - this.startangle;
        for(var i = 0; i < _n; i++){
            var angle = dangle*i/_n + this.startangle;
            points[i] = [this.radius*Math.cos(angle) + this.p2.x, this.radius*Math.sin(angle) + this.p2.y];
        }
        return points;
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


//----------メッシュ描画----------
function drawmesh(_canvas, _ctx, _xs, _ys) {
    //----------Initialize context----------
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

    //----------Draw mesh----------
    _ctx.strokeStyle = "white";
    _ctx.lineWidth = 1;
    _ctx.beginPath();
    for(var i = 0; i < _xs.length - 1; i++) {
        for(var j = 0; j < _xs[i].length - 1; j++) {
            _ctx.moveTo(_xs[i][j], _ys[i][j]);
            _ctx.lineTo(_xs[i + 1][j], _ys[i + 1][j]);
            _ctx.moveTo(_xs[i][j], _ys[i][j]);
            _ctx.lineTo(_xs[i][j + 1], _ys[i][j + 1]);
        }
    }
    _ctx.stroke();
}


//----------メッシング関数----------
function mappedmeshing(_nxi, _nita, _pbx, _pby) {
    //----------Get array of xy----------
    var pinx = new Array(_nxi + 1);
    var piny = new Array(_nxi + 1);
    for(var i = 0; i < _nxi + 1; i++) {
        pinx[i] = new Array(_nita + 1).fill(0);
        piny[i] = new Array(_nita + 1).fill(0);
    }

    //----------Set Dirichlet condition----------
    var pbi = 0;
    //.....Bottom edge (η = 0).....
    for(var i = 0; i < _nxi; i++, pbi++){
        pinx[i][0] = _pbx[pbi];
        piny[i][0] = _pby[pbi];
    }

    //.....Right edge (ξ = ξmax).....
    for(var j = 0; j < _nita; j++, pbi++){
        pinx[_nxi][j] = _pbx[pbi];
        piny[_nxi][j] = _pby[pbi];
    }

    //.....Top edge (η = ηmax).....
    for(var i = _nxi; i > 0; i--, pbi++){
        pinx[i][_nita] = _pbx[pbi];
        piny[i][_nita] = _pby[pbi];
    }

    //.....Left edge (ξ = 0).....
    for(var j = _nita; j > 0; j--, pbi++){
        pinx[0][j] = _pbx[pbi];
        piny[0][j] = _pby[pbi];
    }

    //----------Solve Laplace equation----------
    for(var k = 0; k < 100000; k++) {
        var errormax = 0;
        for(var i = 1; i < _nxi; i++) {
            for(var j = 1; j < _nita; j++) {
                //.....Make Laplace equation.....
                var xix = 0.5*(pinx[i + 1][j] - pinx[i - 1][j]);
                var xiy = 0.5*(piny[i + 1][j] - piny[i - 1][j]);
                var itax = 0.5*(pinx[i][j + 1] - pinx[i][j - 1]);
                var itay = 0.5*(piny[i][j + 1] - piny[i][j - 1]);
                var alpha = itax**2 + itay**2;
                var beta = xix*itax + xiy*itay;
                var ganma = xix**2 + xiy**2;

                //.....Update values.....
                var tmpx = pinx[i][j];
                var tmpy = piny[i][j];
                pinx[i][j] = 0.5*(alpha*(pinx[i + 1][j] + pinx[i - 1][j]) - 0.5*beta*(pinx[i + 1][j + 1] - pinx[i - 1][j + 1] - pinx[i + 1][j - 1] + pinx[i - 1][j - 1]) + ganma*(pinx[i][j + 1] + pinx[i][j - 1]))/(alpha + ganma);
				piny[i][j] = 0.5*(alpha*(piny[i + 1][j] + piny[i - 1][j]) - 0.5*beta*(piny[i + 1][j + 1] - piny[i - 1][j + 1] - piny[i + 1][j - 1] + piny[i - 1][j - 1]) + ganma*(piny[i][j + 1] + piny[i][j - 1]))/(alpha + ganma);

                //.....Update maximam error.....
                var tmperror = (tmpx - pinx[i][j])**2 + (tmpy - piny[i][j])**2;
                if(errormax < tmperror) {
                    errormax = tmperror;
                    
                }
            }
        }

        //.....Check convergence.....
        if(errormax < 1.0e-6) {
            console.log(k, errormax);
            return [pinx, piny];
        }
    }

    console.log("convergence failed");
    return [pinx, piny];
}





//********************システム依存********************
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
    canvas_xy_tmp.removeEventListener('mousedown', meshing);

    //----------その他----------
    paths.splice(0, paths.length);
    ctx_xy_tmp.clearRect(0, 0, canvas_xy_tmp.width, canvas_xy_tmp.height);
    ctx_xy_mesh.clearRect(0, 0, canvas_xy_mesh.width, canvas_xy_mesh.height);
}


function initializeCanvas(){
    //----------ξη座標系----------
    canvas_xiita.width = document.getElementById('canvas_xiita').parentNode.parentNode.clientWidth;
    canvas_xiita.height = document.getElementById('canvas_xiita').parentNode.parentNode.clientHeight;

    canvas_xiita_coordinate.width = canvas_xiita.width;
    canvas_xiita_coordinate.height = canvas_xiita.height;

    drawcoordinate(canvas_xiita_coordinate, ctx_xiita_coordinate, "ξ", "η");

    drawxiitamesh();

    //----------xy座標系----------
    canvas_xy.width = document.getElementById('canvas_xy').parentNode.parentNode.clientWidth;
    canvas_xy.height = document.getElementById('canvas_xy').parentNode.parentNode.clientHeight;
    
    canvas_xy_mesh.width = canvas_xy.width;
    canvas_xy_mesh.height = canvas_xy.height;

    canvas_xy_coordinate.width = canvas_xy.width;
    canvas_xy_coordinate.height = canvas_xy.height;
    
    canvas_xy_tmp.width = canvas_xy.width;
    canvas_xy_tmp.height = canvas_xy.height;

    drawcoordinate(canvas_xy_coordinate, ctx_xy_coordinate, "x", "y");
    
    ctx_xy.clearRect(0, 0, canvas_xy.width, canvas_xy.height);
    for(var element of elements){
        element.Draw(ctx_xy);
    }
    
    ctx_xy_tmp.clearRect(0, 0, canvas_xy_tmp.width, canvas_xy_tmp.height);
    for(var element of paths){
        element.Draw(ctx_xy_tmp, "lime", 3);
    }
}





//********************ξη座標系********************
const canvas_xiita = document.getElementById('canvas_xiita');                           //  ξη座標系の作図用canvas
const ctx_xiita = canvas_xiita.getContext('2d');                                        //  ξη座標系の作図用canvasのcontext
const canvas_xiita_coordinate = document.getElementById('canvas_xiita_coordinate');     //  ξη座標系の座標軸用canvas
const ctx_xiita_coordinate = canvas_xiita_coordinate.getContext('2d');                  //  ξη座標系の座標軸用canvasのcontext

const input_nxi = document.getElementById('input_nxi');
const input_nita = document.getElementById('input_nita');


function drawxiitamesh(){
    //----------Initialize container----------
    if(Number(input_nxi.value) == 0){
        input_nxi.value = 1;
    }
    if(Number(input_nita.value) == 0){
        input_nita.value = 1;
    }
    ctx_xiita.clearRect(0, 0, canvas_xiita.width, canvas_xiita.height);

    //----------Draw mesh----------
    var delta = 0.8*Math.min(canvas_xiita.width/Number(input_nxi.value), canvas_xiita.height/Number(input_nita.value));
    var offsetxi = 0.5*(canvas_xiita.width - delta*Number(input_nxi.value));
    var offsetita = 0.5*(canvas_xiita.height - delta*Number(input_nita.value));

    ctx_xiita.strokeStyle = "aqua";
    ctx_xiita.lineWidth = 1;
    ctx_xiita.beginPath();
    
    for(var v = 0; v < Number(input_nxi.value) + 1; v++){
        ctx_xiita.moveTo(v*delta + offsetxi, offsetita);
        ctx_xiita.lineTo(v*delta + offsetxi, Number(input_nita.value)*delta + offsetita);
    }
    for(var v = 0; v < Number(input_nita.value) + 1; v++){
        ctx_xiita.moveTo(offsetxi, v*delta + offsetita);
        ctx_xiita.lineTo(Number(input_nxi.value)*delta + offsetxi, v*delta + offsetita);
    }
    ctx_xiita.stroke();
}





//********************xy座標系********************
const canvas_xy = document.getElementById('canvas_xy');                                 //  xy座標系の作図用canvas
const ctx_xy = canvas_xy.getContext('2d');                                              //  xy座標系の作図用canvasのcontext
const canvas_xy_mesh = document.getElementById('canvas_xy_mesh');                       //  xy座標系のメッシュ用canvas
const ctx_xy_mesh = canvas_xy_mesh.getContext('2d');                                    //  xy座標系のメッシュ用canvasのcontext
const canvas_xy_coordinate = document.getElementById('canvas_xy_coordinate');           //  xy座標系の座標軸用canvas
const ctx_xy_coordinate = canvas_xy_coordinate.getContext('2d');                        //  xy座標系の座標軸用canvasのcontext
const canvas_xy_tmp = document.getElementById('canvas_xy_tmp');                         //  xy座標系の下書き用canvas
const ctx_xy_tmp = canvas_xy_tmp.getContext('2d');                                      //  xy座標系の下書き用canvasのcontext


var elements = new Array();                                                             //  xy座標系に作図された要素の配列
var points = new Array();                                                               //  xy座標系に作図された点の配列
var paths = new Array();                                                                //  xy座標系に作図された要素のうち閉曲線を成す要素の集合
var meshs = new Array();                                                                //  xy座標系に生成されたメッシュ


//----------線描画のイベント----------
function drawline(_edown){
    var rect = _edown.target.getBoundingClientRect();
    var startpoint = new Point(_edown.clientX - rect.left, _edown.clientY - rect.top);
    var isstartpointnew = true;

    for(var point of points){
        if(startpoint.Distance(point) < 5){
            startpoint = point;                 //  delete必要？
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
        
        ctx_xy_tmp.strokeStyle = "gold";
        ctx_xy_tmp.lineWidth = 2;
        ctx_xy_tmp.beginPath();
        ctx_xy_tmp.moveTo(startpoint.x, startpoint.y);
        ctx_xy_tmp.lineTo(endpoint.x, endpoint.y);
        ctx_xy_tmp.stroke();

        ctx_xy_tmp.beginPath();
        ctx_xy_tmp.arc(startpoint.x, startpoint.y, 2, 0, 2.0*Math.PI, 0);
        ctx_xy_tmp.stroke();

        ctx_xy_tmp.beginPath();
        ctx_xy_tmp.arc(endpoint.x, endpoint.y, 2, 0, 2.0*Math.PI, 0);
        ctx_xy_tmp.stroke();

        ctx_xy_tmp.fillStyle = "gold";
        ctx_xy_tmp.font = "15px 'Times New Roman'";
        ctx_xy_tmp.textAlign = "left";
        ctx_xy_tmp.textBaseline = "top";
        ctx_xy_tmp.fillText(startpoint.Distance(endpoint).toFixed(2), 0.5*(startpoint.x + endpoint.x), 0.5*(startpoint.y + endpoint.y));
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
        
        var line = new Line(startpoint, endpoint);
        line.Draw(ctx_xy);
        elements.push(line);

        canvas_xy_tmp.removeEventListener('mousemove', guide);
        canvas_xy_tmp.removeEventListener('mouseup', draw);
    }    
}


//----------円描画のイベント----------
function drawcircle(_edown) {
    var rect = _edown.target.getBoundingClientRect();
    var centerpoint = new Point(_edown.clientX - rect.left, _edown.clientY - rect.top);
    var iscenterpointnew = true;

    for(var point of points){
        if(centerpoint.Distance(point) < 5){
            centerpoint = point;                        //  delete必要？
            iscenterpointnew = false;
            break;
        }
    }

    if(iscenterpointnew){
        points.push(centerpoint);
    }   

    canvas_xy_tmp.removeEventListener('mousedown', drawcircle);
    canvas_xy_tmp.addEventListener('mousemove', guide1);
    canvas_xy_tmp.addEventListener('mouseup', draw1);

    function guide1(_etmp) {
        ctx_xy_tmp.clearRect(0, 0, canvas_xy.width, canvas_xy.height);

        var rect = _etmp.target.getBoundingClientRect();
        var edgepoint = new Point(_etmp.clientX - rect.left, _etmp.clientY - rect.top);
       
        for(var point of points) {
            if(edgepoint.Distance(point) < 5){
                edgepoint = point;
                break;
            }
        }
        
        ctx_xy_tmp.strokeStyle = "gold";
        ctx_xy_tmp.lineWidth = 2;
        ctx_xy_tmp.beginPath();
        ctx_xy_tmp.moveTo(centerpoint.x, centerpoint.y);
        ctx_xy_tmp.lineTo(edgepoint.x, edgepoint.y);
        ctx_xy_tmp.stroke();

        ctx_xy_tmp.beginPath();
        ctx_xy_tmp.arc(centerpoint.x, centerpoint.y, 2, 0, 2.0*Math.PI, 0);
        ctx_xy_tmp.stroke();

        ctx_xy_tmp.beginPath();
        ctx_xy_tmp.arc(edgepoint.x, edgepoint.y, 2, 0, 2.0*Math.PI, 0);
        ctx_xy_tmp.stroke();

        ctx_xy_tmp.fillStyle = "gold";
        ctx_xy_tmp.font = "15px 'Times New Roman'";
        ctx_xy_tmp.textAlign = "left";
        ctx_xy_tmp.textBaseline = "top";
        ctx_xy_tmp.fillText(centerpoint.Distance(edgepoint).toFixed(2), 0.5*(centerpoint.x + edgepoint.x), 0.5*(centerpoint.y + edgepoint.y));
    }    

    function draw1(_eup) {
        var rect = _eup.target.getBoundingClientRect();
        var startpoint = new Point(_eup.clientX - rect.left, _eup.clientY - rect.top);
        var isstartpointnew = true;
        
        for(var point of points){
            if(startpoint.Distance(point) < 5){
                startpoint = point;
                break;
            }
        }

        if(isstartpointnew){
            points.push(startpoint);
        }
        
        var radius = centerpoint.Distance(startpoint);
        var direction = 1;
        
        canvas_xy_tmp.removeEventListener('mousemove', guide1);
        canvas_xy_tmp.removeEventListener('mouseup', draw1);
        canvas_xy_tmp.addEventListener('mousemove', guide2);
        canvas_xy_tmp.addEventListener('mouseup', draw2);

        function guide2(_etmp) {
            ctx_xy_tmp.clearRect(0, 0, canvas_xy.width, canvas_xy.height);

            var rect = _etmp.target.getBoundingClientRect();
            var tmppoint = new Point(_etmp.clientX - rect.left, _etmp.clientY - rect.top);
            var ratio = radius/centerpoint.Distance(tmppoint);
            var endpoint = new Point(ratio*(_etmp.clientX - rect.left) + (1 - ratio)*centerpoint.x, ratio*(_etmp.clientY - rect.top) + (1 - ratio)*centerpoint.y);
        
            for(var point of points) {
                if(endpoint.Distance(point) < 5){
                    endpoint = point;
                    if(point == startpoint) {
                        direction = !direction;
                    }
                    break;
                }
            }

            var startangle = Math.atan2(startpoint.y - centerpoint.y, startpoint.x - centerpoint.x);
            var endangle = Math.atan2(endpoint.y - centerpoint.y, endpoint.x - centerpoint.x);

            ctx_xy_tmp.strokeStyle = "gold";
            ctx_xy_tmp.lineWidth = 2;
            ctx_xy_tmp.beginPath();
            ctx_xy_tmp.moveTo(startpoint.x, startpoint.y);
            ctx_xy_tmp.lineTo(centerpoint.x, centerpoint.y);
            ctx_xy_tmp.arc(centerpoint.x, centerpoint.y, radius, startangle, endangle, direction);
            ctx_xy_tmp.moveTo(endpoint.x, endpoint.y);
            ctx_xy_tmp.lineTo(centerpoint.x, centerpoint.y);
            ctx_xy_tmp.stroke();

            ctx_xy_tmp.beginPath();
            ctx_xy_tmp.arc(startpoint.x, startpoint.y, 2, 0, 2.0*Math.PI, 0);
            ctx_xy_tmp.stroke();

            ctx_xy_tmp.beginPath();
            ctx_xy_tmp.arc(endpoint.x, endpoint.y, 2, 0, 2.0*Math.PI, 0);
            ctx_xy_tmp.stroke();

            ctx_xy_tmp.beginPath();
            ctx_xy_tmp.arc(centerpoint.x, centerpoint.y, 2, 0, 2.0*Math.PI, 0);
            ctx_xy_tmp.stroke();

            ctx_xy_tmp.fillStyle = "gold";
            ctx_xy_tmp.font = "15px 'Times New Roman'";
            ctx_xy_tmp.textAlign = "left";
            ctx_xy_tmp.textBaseline = "top";
            ctx_xy_tmp.fillText(centerpoint.Distance(startpoint).toFixed(2), 0.5*(centerpoint.x + startpoint.x), 0.5*(centerpoint.y + startpoint.y));

            var dangle = endangle - startangle;
            if(!direction && dangle < 0){
                dangle += 2*Math.PI;
            } else if(direction && dangle > 0){
                dangle -= 2*Math.PI;
            }
            ctx_xy_tmp.fillText((180*dangle/Math.PI).toFixed(2), 0.5*(centerpoint.x + endpoint.x), 0.5*(centerpoint.y + endpoint.y));
        }
    
        function draw2(_eup) {
            ctx_xy_tmp.clearRect(0, 0, canvas_xy.width, canvas_xy.height);

            var rect = _eup.target.getBoundingClientRect();
            var tmppoint = new Point(_eup.clientX - rect.left, _eup.clientY - rect.top);
            var ratio = radius/centerpoint.Distance(tmppoint);
            var endpoint = new Point(ratio*(_eup.clientX - rect.left) + (1 - ratio)*centerpoint.x, ratio*(_eup.clientY - rect.top) + (1 - ratio)*centerpoint.y);
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

            var circle = new Circle(startpoint, endpoint, centerpoint, direction);
            circle.Draw(ctx_xy);
            elements.push(circle);

            canvas_xy_tmp.removeEventListener('mousemove', guide2);
            canvas_xy_tmp.removeEventListener('mouseup', draw2);
            canvas_xy_tmp.addEventListener('mousedown', drawcircle);
        }
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
            elements[i].releasePoint();
            delete elements[i];
            elements.splice(i, 1);
            isneedredraw = true;
            break;
        }
    }

    if(isneedredraw){
        //----------不要な点の削除----------
        for(var i = points.length - 1; i >= 0; i--){
            if(points[i].shared <= 0) {
                delete points[i];
                points.splice(i, 1);
            }
        }

        //----------再描画----------
        ctx_xy.clearRect(0, 0, canvas_xy.width, canvas_xy.height);
        for(var element of elements){
            element.Draw(ctx_xy);
        }
    }
}


//----------メッシュ生成のイベント----------
function meshing(_edown){
    //----------各要素について当たり判定----------
    var rect = _edown.target.getBoundingClientRect();
    var clickpoint = new Point(_edown.clientX - rect.left, _edown.clientY - rect.top);
    var isneedcheck = false;
    
    for(var element of elements){
        if(element.isHit(clickpoint)) {
            paths.push(element);
            isneedcheck = true;
            break;
        }
    }

    
    if(isneedcheck) {
        var isclosedpath = true;
        ctx_xy_tmp.clearRect(0, 0, canvas_xy_tmp.width, canvas_xy_tmp.height);
        for(var element of paths){
            element.Draw(ctx_xy_tmp, "lime", 3);
        }

        //----------閉曲線か確認----------
        for(var i = 0; i < paths.length; i++){
            if(paths[i].p1 != paths[(i + 1)%paths.length].p0){
                isclosedpath = false;
                ctx_xy_tmp.clearRect(0, 0, canvas_xy_tmp.width, canvas_xy_tmp.height);
                for(var element of paths){
                    element.Draw(ctx_xy_tmp, "red", 3);
                }
            }
        }

        //----------閉曲線ならメッシュを生成----------
        if(isclosedpath) {
            var pbx = new Array();
            var pby = new Array();
            var pbn = [Number(input_nxi.value), Number(input_nita.value), Number(input_nxi.value), Number(input_nita.value)]
            for(var i = 0; i < paths.length; i++) {
                var points = paths[i].generatePointOnEdge(pbn[i]);
                for(var point of points){
                    pbx.push(point[0]);
                    pby.push(point[1]);
                }
            }
            var mesh = mappedmeshing(Number(input_nxi.value), Number(input_nita.value), pbx, pby);
            drawmesh(canvas_xy_mesh, ctx_xy_mesh, mesh[0], mesh[1]);
        }
    }
}





//********************イベントリスナーの登録********************
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
    canvas_xy_tmp.addEventListener('mousedown', meshing);
};


document.getElementById("button_export").onclick = function() {
    initializeButton();
    
    document.getElementById("icon_export").style.color = "lime";
};


window.addEventListener('resize', initializeCanvas, false);


input_nxi.addEventListener('change', drawxiitamesh);
input_nita.addEventListener('change', drawxiitamesh);





//********************初期の関数呼び出し********************
initializeButton();
initializeCanvas();