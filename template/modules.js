const canvasxiita = acgraph.create('canvasxiita');          
const inputnxi = document.getElementById('inputnxi');
const inputnita = document.getElementById('inputnita');
const canvasxy = acgraph.create('canvasxy');
const layerxycordinate = canvasxy.layer();                  //  canvasxyの座標軸描画用レイヤー
const layerxymesh = canvasxy.layer();                       //  canvasxyのメッシュ描画用レイヤー
const buttonline = document.getElementById('buttonline');


inputnxi.addEventListener('change', updatecanvasxiita);
inputnita.addEventListener('change', updatecanvasxiita);
window.addEventListener('resize', resizewindow, false);
layerxymesh.listen('click', function(){
    console.log(canvasxy.data());
});


layerxymesh.rect(10, 10, 100, 100);


function updatecanvasxiita(){
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
    cordinatexiitatextstyle = {fontFamily: 'Times New Roman', fontStyle: 'italic', fontSize: '15px', color: 'white'};
    canvasxiita.text(55, canvasxiita.height() - 25, "ξ", cordinatexiitatextstyle);
    canvasxiita.text(5, canvasxiita.height() - 75, "η", cordinatexiitatextstyle);

    //----------Draw point marker----------
    pointmarkertextstyle = {fontFamily: 'Times New Roman', fontSize: '15px', color: 'lightsalmon'};
    canvasxiita.text(offsetxi - 10, Number(inputnita.value)*delta + offsetita, '0', pointmarkertextstyle);
    canvasxiita.text(Number(inputnxi.value)*delta + offsetxi + 5, Number(inputnita.value)*delta + offsetita, '1', pointmarkertextstyle);
    canvasxiita.text(Number(inputnxi.value)*delta + offsetxi + 5, offsetita - 10, '2', pointmarkertextstyle);
    canvasxiita.text(offsetxi - 10, offsetita - 10, '3', pointmarkertextstyle);
}


function updatecanvasxy(){
    //----------Initialize canvasxy----------
    layerxycordinate.removeChildren();

    //----------Draw coordinate----------
    layerxycordinate.path()
        .moveTo(10, canvasxy.height() - 15)
        .lineTo(50, canvasxy.height() - 15)
        .stroke('red');
    layerxycordinate.path()
        .moveTo(10, canvasxy.height() - 15)
        .lineTo(10, canvasxy.height() - 55)
        .stroke('yellow');
    cordinatexytextstyle = {fontFamily: 'Times New Roman', fontStyle: 'italic', fontSize: '15px', color: 'white'};
    layerxycordinate.text(55, canvasxy.height() - 25, "x", cordinatexytextstyle);
    layerxycordinate.text(5, canvasxy.height() - 75, "y", cordinatexytextstyle);
}


function resizewindow(){
    canvasxiita.resize(document.getElementById('canvasxiita').parentNode.clientWidth, document.getElementById('canvasxiita').parentNode.clientHeight);
    updatecanvasxiita();
    canvasxy.resize(document.getElementById('canvasxy').parentNode.clientWidth, document.getElementById('canvasxy').parentNode.clientHeight);
    updatecanvasxy();
}


resizewindow();