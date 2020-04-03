const containerxiita = document.getElementById('containerxiita');
const canvasxiita = document.getElementById('canvasxiita');
const ctxxiita = canvasxiita.getContext('2d');
const inputnxi = document.getElementById('inputnxi');
const inputnita = document.getElementById('inputnita');
const containerxy = document.getElementById('containerxy');
const canvasxy = document.getElementById('canvasxy');
const ctxxy = canvasxy.getContext('2d');


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
    ctxxiita.clearRect(0, 0, canvasxiita.width, canvasxiita.height);
    
    //----------Draw mesh----------
    ctxxiita.strokeStyle = "aqua";
    ctxxiita.lineWidth = 1;
    ctxxiita.beginPath();
    var delta = 0.8*Math.min(canvasxiita.width/Number(inputnxi.value), canvasxiita.height/Number(inputnita.value));
    var offsetxi = 0.5*(canvasxiita.width - delta*Number(inputnxi.value));
    var offsetita = 0.5*(canvasxiita.height - delta*Number(inputnita.value));
    for(var v = 0; v < Number(inputnxi.value) + 1; v++){
        ctxxiita.moveTo(v*delta + offsetxi, offsetita);
        ctxxiita.lineTo(v*delta + offsetxi, Number(inputnita.value)*delta + offsetita);
    }
    for(var v = 0; v < Number(inputnita.value) + 1; v++){
        ctxxiita.moveTo(offsetxi, v*delta + offsetita);
        ctxxiita.lineTo(Number(inputnxi.value)*delta + offsetxi, v*delta + offsetita);
    }

    ctxxiita.stroke();

    ctxxiita.beginPath();

    //----------Draw coordinate----------
    ctxxiita.strokeStyle = "white";
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
}


function drawxy(e){
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - Math.floor(rect.left);
    var y = e.clientY - Math.floor(rect.top);
}


function resizewindow(){
    canvasxiita.width = containerxiita.clientWidth;
    canvasxiita.height = containerxiita.clientHeight;
    
    canvasxy.width = containerxy.clientWidth;
    canvasxy.height = containerxy.clientHeight;
    
    updatenxiita();
}

 
resizewindow();