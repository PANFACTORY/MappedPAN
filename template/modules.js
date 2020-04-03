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
/*    ctxxiita.strokeStyle = "white";
    ctxxiita.moveTo(10, canvasxiita.height - 10);
    ctxxiita.lineTo(50, canvasxiita.height - 10);
    ctxxiita.moveTo(10, canvasxiita.height - 10);
    ctxxiita.lineTo(10, canvasxiita.height - 50);

    ctxxiita.stroke();

    //----------Draw text----------
    ctxxiita.fillStyle = "white";
    ctxxiita.font = "15px 'Times New Roman'";
    ctxxiita.textAlign = "left";
    ctxxiita.textBaseline = "top";
    ctxxiita.fillText("0", offsetxi, Number(inputnita.value)*delta + offsetita);
    ctxxiita.fillText("1", Number(inputnxi.value)*delta + offsetxi, Number(inputnita.value)*delta + offsetita);
    ctxxiita.fillText("2", Number(inputnxi.value)*delta + offsetxi, offsetita);
    ctxxiita.fillText("3", offsetxi, offsetita);

    ctxxiita.font = "15px 'Times New Roman'";
    ctxxiita.fillText("ξ", 55, canvasxiita.height - 25);
    ctxxiita.fillText("η", 5, canvasxiita.height - 70);
*/
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