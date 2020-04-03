const canvasxiita = acgraph.create('canvasxiita');
const inputnxi = document.getElementById('inputnxi');
const inputnita = document.getElementById('inputnita');
const canvasxy = acgraph.create('canvasxy');


inputnxi.addEventListener('change', updatenxiita);
inputnita.addEventListener('change', updatenxiita);
window.addEventListener('resize', resizewindow, false);
canvasxy.addEventListener('click', drawxy);


function updatenxiita(){
    //----------Initialize canvas----------
    if(Number(inputnxi.value) == 0){
        inputnxi.value = 1;
    }
    if(Number(inputnita.value) == 0){
        inputnita.value = 1;
    }
    canvasxiita.removeChildren();

    //----------Draw mesh----------
    var delta = 0.8*Math.min(canvasxiita.width()/Number(inputnxi.value), canvasxiita.height()/Number(inputnita.value));
    var offsetxi = 0.5*(canvasxiita.width() - delta*Number(inputnxi.value));
    var offsetita = 0.5*(canvasxiita.height() - delta*Number(inputnita.value));
    
    for(var v = 0; v < Number(inputnxi.value) + 1; v++){
        canvasxiita.path()
            .moveTo(v*delta + offsetxi, offsetita)
            .lineTo(v*delta + offsetxi, Number(inputnita.value)*delta + offsetita)
            .stroke('aqua');
    }
    for(var v = 0; v < Number(inputnita.value) + 1; v++){
        canvasxiita.path()
            .moveTo(offsetxi, v*delta + offsetita)
            .lineTo(Number(inputnxi.value)*delta + offsetxi, v*delta + offsetita)
            .stroke('aqua');
    }

    //----------Draw coordinate----------
    canvasxiita.path()
        .moveTo(10, canvasxiita.height() - 15)
        .lineTo(50, canvasxiita.height() - 15)
        .stroke('red');
    canvasxiita.path()
        .moveTo(10, canvasxiita.height() - 15)
        .lineTo(10, canvasxiita.height() - 55)
        .stroke('yellow');
    cordinatexitextstyle = {fontFamily: 'Times New Roman', fontSize: '15px', color: 'white'};
    canvasxiita.text(55, canvasxiita.height() - 25, "ξ", cordinatexitextstyle);
    cordinateitatextstyle = {fontFamily: 'Times New Roman', fontSize: '15px', color: 'white'};
    canvasxiita.text(5, canvasxiita.height() - 75, "η", cordinateitatextstyle);

    //----------Draw point marker----------
    pointmarkertextstyle = {fontFamily: 'Times New Roman', fontSize: '15px', color: 'lightsalmon'};
    canvasxiita.text(offsetxi - 10, Number(inputnita.value)*delta + offsetita, '0', pointmarkertextstyle);
    canvasxiita.text(Number(inputnxi.value)*delta + offsetxi + 5, Number(inputnita.value)*delta + offsetita, '1', pointmarkertextstyle);
    canvasxiita.text(Number(inputnxi.value)*delta + offsetxi + 5, offsetita - 10, '2', pointmarkertextstyle);
    canvasxiita.text(offsetxi - 10, offsetita - 10, '3', pointmarkertextstyle);
}


function resizewindow(){
    canvasxiita.resize(document.getElementById('canvasxiita').parentNode.clientWidth, document.getElementById('canvasxiita').parentNode.clientHeight);
    updatenxiita();
}


function drawxy(e){
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - Math.floor(rect.left);
    var y = e.clientY - Math.floor(rect.top);
}


resizewindow();