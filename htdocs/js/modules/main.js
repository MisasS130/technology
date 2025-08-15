var Tsym="";
var A=[]; var O=[]; var T=[];//массивы значений ТП
var Log=[]; //
var Time0=[];//времена
Time0[1]=[];Time0[2]=[];Time0[3]=[];
//var Flag=true;
var sharedObject={};
var Comment='comment';
JSTreeData=new Object();
Process=new Object();//объект техпроцесса
DSE=new Object();//объект ДСЕ
Operation=new Object();//объект операций
Step=new Object();// объект переходов
Tooling=new Object();// объект инструментов
CurNode=new Object();//объект ветка дерева
var AFirst='10'; var AStep='10'; var ANum='0';//нумерация операций
var blobObject = null;
var ANew=false; var ONew=false; var TNew=false;//флаги новых объектов
var ONum='0'; var TNum='0';//нумерация объектов
Process.Variant='1';
Process.Doc='Новый техпроцесс';
DSE.Name='';
DSE.Designation='';
//var WorkFolder="C:/TP"; //рабочая папка
//var ImgFolder="C:/TP/IMG"; //папка с изображениями
var queue = {};//файлы чертежей
var queue1 = {};//файлы эскизов
'use strict';// строгий режим языка Java script
var RimageLoader = document.getElementById("RimageLoader");
var NimageLoader = document.getElementById("NimageLoader");
var imageLoader = document.getElementById("imageLoader");
var SketchLoader = document.getElementById("SketchLoader");
imageLoader.addEventListener("change", handleImage, false);
RimageLoader.addEventListener("change", handleRImage, false);
NimageLoader.addEventListener("change", handleNImage, false);
SketchLoader.addEventListener("change", handleSketch, false);
var canvas = document.getElementById("imageCanvas");
var canvas1 = document.getElementById("RCanvas");
var canvas2 = document.getElementById("SketchCanvas");
var canvas3 = document.getElementById("NCanvas");
var ctx = canvas.getContext("2d");
var ctx1 = canvas1.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var width = 0;
Draw=new Object();
var RDraw={};
var arrImg = [];//чертежи
var arrSketch=[];//эскизы
var arrTempS=[];//временные эскизы
var arrNaladki=[];//эскизы наладок
var b64Text='';
var maxFileSize=2 * 1024 * 1024; // (байт) Максимальный размер файла (2мб);
var CCP={};//copy cut paste
var tpdate=new Date();
var yyyy=tpdate.getFullYear();
var mm=tpdate.getMonth()+1;
if (mm<10) mm="0"+mm;
var dd=tpdate.getDate();
if (dd<10) dd="0"+dd;
var tzo=tpdate.getTimezoneOffset();
var hh=tpdate.getHours();
//hh=hh+tzo;
if (hh<10) hh="0"+hh;
var m=tpdate.getMinutes();
if (m<10) m="0"+m;
Process.Date=yyyy+"-"+mm+"-"+dd+"T"+hh+":"+m;
Process.MKSp=0;
Process.OKSp=0;
Process.OKSpp=0;
Process.Font="GOST_Ai";
Process.NumDet=1;
Process.UnitCode="кг";
var OText=[];
var ImgSym='<img src="img/sketch.png" height="16" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';

$("#ObozTbut")
	.mouseenter(function(){
		if (T[TNum].src!=undefined) {
			document.getElementById("ToolImg").src =T[TNum].src;
			//$('#ToolImg').fadeIn();
			$('#ToolImg').show();
		}
		if (T[TNum].tid!=undefined) {
			document.getElementById("ObozTbut").alt =T[TNum].tid;
		}
		if (T[TNum].tbl!=undefined) {
			document.getElementById("ObozT").alt =T[TNum].tbl;
		}
	}).mouseleave(function(){
		$("#ToolImg").hide();
});

$(function() {
	var an; var v1; var v2;
	var arrs1=[];
    $('#dialog').dialog({
		//title: "Операция ",
		//appendTo: "#header",
		closeText: "",
		autoOpen: false,
		modal: false,
		closeOnEscape: true,
		resizable: false,
		//maxWidth:788,
		//maxHeight:496,
		//minWidth:394,
		//minHeight:248,
		width:740,
		height:430,
		position: { my: "right top", at: "right top+470", of: window},
		draggable: true,
		buttons: [
		{
			//text: "",
			icon: "ui-icon-circle-triangle-w",
			click: function() {
				if ((v1-1)>0){
					v1--;
					var dc = document.querySelector('div.ui-dialog-buttonset');
					dc.lastChild.data=v1+" из "+v2+" ";
					$('#popupimg').attr('src', arrs1[v1-1].imgdata);
				}
				//$( this ).dialog( "close" );
			}		
		},
		{
			//text: "",
			icon: "ui-icon-circle-triangle-e",
			click: function() {
				if ((v1+1)<=v2){
					v1++;
					var dc = document.querySelector('div.ui-dialog-buttonset');
					dc.lastChild.data=v1+" из "+v2+" ";
					$('#popupimg').attr('src', arrs1[v1-1].imgdata);
				}
				//$( this ).dialog( "close" );
			}		
		}
		],

		open: function() {
			$('.ui-dialog-titlebar-close').bind('click', function() {
				$('#dialog').dialog('close');
			})
		}
	});	
	$('#bup').button().click(function(e) {
		v1=1;v2=1;
		var dc = document.querySelector('div.ui-dialog-buttonset');
		dc.lastChild.data="";
		arrs1=GetSketchArr(CurNode.ParentId);
		var nop=A.filter(function (e) {
			return e.id === CurNode.ParentId;
		});
		an = arrSketch.map(function(e) { return e.id; }).indexOf(CurNode.ParentId);//получение индеса массива операций
		v2=arrs1.length;
		if (an>=0){
			$('#popupimg').attr('src', arrSketch[an].imgdata);
			$('#dialog').dialog("open");
			$("span.ui-dialog-title").css('float','right');
			$("span.ui-dialog-title").text("Операция "+('000'+nop[0].NOP).slice(-'000'.length)+"   ");
			$("div.ui-dialog-buttonset").append(v1+" из "+v2+" ");
			
		}
    });			
});
/*var passiveEvent = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function () {
            passiveEvent = true;
        }
    });
    window.addEventListener("test", null, opts);
} catch (e) { }

// in my case I need both passive and capture set to true, change as you need it.
//    passiveEvent = passiveEvent ? { capture: true, passive: true } : true;

//if you need to handle mouse wheel scroll
//var supportedWheelEvent: string = "onwheel" in HTMLDivElement.prototype ? "wheel" :
//    document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";*/

/*document.addEventListener(//обработка нажатия клавиш
    "keydown",
    (event) => {
    const keyName = event.key;
    if (keyName === "Control") {
        // not alert when only Control key is pressed.
        return;
    }
    if (event.ctrlKey) {
        // Хотя event.key это не 'Control' (например, нажата клавиша 'a'),
        // то всё же event.ctrlKey может быть true, если ударживается клавиша Ctrl.
        //alert(`Combination of ctrlKey + ${keyName}`);
    } else {
        //alert(`Key pressed ${keyName}`);
		switch (keyName){
			case "ArrowUp": ; break; 
            case "ArrowLeft": //document.activeElement.previousElementSibling.focus(); break;
            case "ArrowDown": ; break;
            case "ArrowRight": //document.activeElement.nextElementSibling.focus(); break;
		}
    }
    },
    false,
);  */  

// function to set a given theme/color-scheme
function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
            if (localStorage.getItem('theme') === 'theme-dark') {
                setTheme('theme-light');
            } else {
                setTheme('theme-dark');
            }
}

// Immediately invoked function to set the theme on initial load
(function () {
            if (localStorage.getItem('theme') === 'theme-dark') {
                setTheme('theme-dark');
                document.getElementById('slider').checked = false;
            } else {
                setTheme('theme-light');
              document.getElementById('slider').checked = true;
            }
})();
function CTime(){
	var ct=new Date();
	var hh=ct.getHours();if (hh<10) hh="0"+hh;
	var mm=ct.getMinutes();if (mm<10) mm="0"+mm;
	var ss=ct.getSeconds();if (ss<10) ss="0"+ss;
	return hh+":"+mm+":"+ss;	
}
function MLog(a,n,v){
	var Lg={}; Lg.Act=a; Lg.Name=n; Lg.Value=v; Lg.Time=CTime(); Log.push(Lg);
	console.log(Lg.Act+" "+Lg.Name+": "+Lg.Time+" "+JSON.stringify(Lg.Value));
}

function DSE_clear(){
}
function Process_clear(){
}
function handleImage(e) {//загрузка изображения в чертеж
    var file = e.target.files[0];
	if ( !file.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
        alert( 'Изображение должно быть в формате jpg, png или gif' );
    }
    if ( file.size > maxFileSize ) {
        alert( 'Размер изображения не должен превышать 2 Мб' );
    }
    var img = new Image();
    img.src = URL.createObjectURL(file);
    URL.revokeObjectURL(file);
		img.onload = function() {
			canvas.width = this.naturalWidth;
			canvas.height = this.naturalHeight;
			//var hRatio = canvas.width / img.width    ;
			//var vRatio = canvas.height / img.height  ;
			//var ratio  = Math.min ( hRatio, vRatio );
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			//ctx.drawImage(img, 0, 0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio);
			b64Text=canvas.toDataURL("image/png");
			var fname=file.name;
			fname=fname.substr(0, fname.lastIndexOf('.'));//удаление расширения файла
			arrImg.push(Draw={fname:fname, imgdata:b64Text});
			document.getElementById("Drwimage").src=b64Text;
			var arrL=arrImg.length;
			document.getElementById("N").value=arrL;
			document.getElementById("M").value=arrL;
			//console.log(file.name);
			//document.getElementById("ImageLoader").value='';
		};
};	
function handleRImage(e) {//загрузка изображения в эмблему
    var file = e.target.files[0];
	if ( !file.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
        alert( 'Изображение должно быть в формате jpg, png или gif' );
    }
    if ( file.size > maxFileSize ) {
        alert( 'Размер изображения не должен превышать 2 Мб' );
    }
    var img = new Image();
    img.src = URL.createObjectURL(file);
    URL.revokeObjectURL(file);
		img.onload = function() {
			ctx1.clearRect(0, 0,333,102);
			var hRatio = canvas1.width / img.width    ;
			var vRatio = canvas1.height / img.height  ;
			var ratio  = Math.min ( hRatio, vRatio );
			var xc=(333-img.width*ratio)/2
			ctx1.drawImage(img, 0, 0, img.width, img.height,xc, 0, img.width*ratio, img.height*ratio);
			b64Text=canvas1.toDataURL("image/png");
			var fname=file.name;
			fname=fname.substr(0, fname.lastIndexOf('.'));//удаление расширения файла
			RDraw={fname:fname, imgdata:b64Text};
		};
};
function handleNImage(e) {//загрузка изображения в карту наладок
	Naladka_del();
    var file = e.target.files[0];
	if ( !file.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
        alert( 'Изображение должно быть в формате jpg, png или gif' );
    }
    if ( file.size > maxFileSize ) {
        alert( 'Размер изображения не должен превышать 2 Мб' );
    }
    var img = new Image();
    img.src = URL.createObjectURL(file);
    URL.revokeObjectURL(file);
		img.onload = function() {
			var hRatio = canvas3.width / img.width    ;
			var vRatio = canvas3.height / img.height  ;
			var ratio  = Math.min ( hRatio, vRatio );
			var xc=(240-img.width*ratio)/2
			ctx3.drawImage(img, 0, 0, img.width, img.height,xc, 0, img.width*ratio, img.height*ratio);
			b64Text=canvas3.toDataURL("image/png");
			//document.getElementById("NImage").src=b64Text;
			var fname=file.name;
			fname=fname.substr(0, fname.lastIndexOf('.'));//удаление расширения файла
			arrNaladki.push(Draw={id:CurNode.Id,fname:fname, imgdata:b64Text});
		};
	var $el = $('#NimageLoader');
	$el.wrap('<form>').closest('form').get(0).reset();//удалить имя фвйла
    $el.unwrap();
};
function GetSketchArr(id){//получение массива эскизов на операцию
	arrTempS.length=0;
	arrTempS=arrSketch.filter(function (e) {
		return e.id === id;
	});
	return arrTempS;
}
function GetNalArr(id){//получение наладки на операцию
	var tmp=new Object;
	tmp=arrNaladki.filter(function (e) {
		return e.id === id;
	});
	return tmp;
}
function handleSketch(e) {//загрузка изображения в эскиз
    var file = e.target.files[0];
	if ( !file.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
        alert( 'Изображение должно быть в формате jpg, png или gif' );
    }
    if ( file.size > maxFileSize ) {
        alert( 'Размер изображения не должен превышать 2 Мб' );
    }
    var img = new Image();
    img.src = URL.createObjectURL(file);
    URL.revokeObjectURL(file);
		img.onload = function() {
			canvas2.width = this.naturalWidth;
			canvas2.height = this.naturalHeight;
			ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
			ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
			b64Text=canvas2.toDataURL("image/png");
			var fname=file.name;
			fname=fname.substr(0, fname.lastIndexOf('.'));//удаление расширения файла
			arrSketch.push(Draw={id:CurNode.Id, fname:fname, imgdata:b64Text});
			document.getElementById("SketchImage").src=b64Text;
			var arrL=GetSketchArr(CurNode.Id).length;
			document.getElementById("N1").value=arrL;
			document.getElementById("M1").value=arrL;
			//console.log(file.name);
			A[ANum].SL=arrL;
			if (arrL!=0){
				var at=String($('#TPtree').jstree().get_node(CurNode.Id).text);
				at=at.replace(ImgSym, '');
				l1=at.indexOf(' ');
				if (l1>0){
					at1=at.slice(0 , l1);
					at2=at.slice(l1+1);
				}
				else {at1=at;at2=""}
				$('#TPtree').jstree().rename_node(CurNode.Id,at1+' '+ImgSym+' '+at2);
			}
		};
	var $el = $('#SketchLoader');
	$el.wrap('<form>').closest('form').get(0).reset();//удалить имя фвйла
    $el.unwrap();

};	
function drawInline(raw) {//отрисовка изображения на холсте
    var img = new Image();
    if (raw!=undefined) img.src = raw;
    img.addEventListener('load', function () {
        console.log("image onload");
		//canvas.Width = this.naturalWidth;
		//canvas.Height = this.naturalHeight;
		//ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);     
    });
}
function drawInline2(raw) {//отрисовка изображения на холсте
    var img = new Image();
    img.src = raw;
		//var canvas2 = document.querySelector("#SketchCanvas");
		//canvas2.Width = this.naturalWidth;
		//canvas2.Height = this.naturalHeight;
		//ctx2 = canvas2.getContext("2d");
    img.addEventListener('load', function () {
        console.log("image onload");
        ctx2.drawImage(this, 0, 0);     
    });
}
function drawInline3(raw) {//отрисовка изображения на холсте
    var img = new Image();
    if (raw!=undefined) img.src = raw;
	//document.getElementById("NImage").src=raw;
	img.addEventListener('load', function () {
        console.log("naladka onload");
        ctx3.drawImage(this, 0, 0);     
    });
}
function drawClear(ctx2) {//удаление изображения на холсте
    var img = new Image();
	//canvas2.width = this.naturalWidth;
	//canvas2.height = this.naturalHeight;
	document.getElementById("SketchImage").src="";
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
}
function Razrab_del(){//удаление эмблемы
	ctx1.clearRect(0, 0,333,102);
	RDraw="";
}
function Naladka_del(){//удаление эскиза наладки
	ctx3.clearRect(0, 0,240,300);
	var idx=Naladka_idx(CurNode.Id);
	if (idx!=undefined) arrNaladki.splice(idx,1);
}
function Naladka_idx(cni){//поиск индекса наладки
	var r;
	$.each( arrNaladki, function( key, data ){//перебор
		if(data.id==cni) {
			r=key;
		}
	})
	return r;
}
function Draw_del(){//удаление изображения
	var $el = $('#imageLoader');
	$el.wrap('<form>').closest('form').get(0).reset();//удалить имя файла
    $el.unwrap();
	var i=Number(document.getElementById("M").value);
	if (i>0) {
		arrImg.splice(i-1, 1);
		//URL.revokeObjectURL(arrImg[i-2]);
	}
	var arrL=arrImg.length;
	document.getElementById("N").value=arrL;
	if (i>1) {document.getElementById("M").value=i-1;} else {i=2;}
	if (arrL==0) document.getElementById("M").value=0;
	var img = new Image(); 
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//document.getElementById("imageCanvas").style.visibility="hidden";
	//img.crossOrigin = "Anonymous";
	//document.getElementById("Drwimage").src="";
	if (arrImg.length>0) var srcimg=arrImg[i-2].imgdata;
	if (srcimg==undefined) srcimg="";
	document.getElementById("Drwimage").src=srcimg;
	//var url=URL.createObjectURL(arrImg[i-2]);
	drawInline(srcimg);
	//img.src=url;
	//img.src =URL.createObjectURL(arrImg[i-2]);
	/*img.onload = function() {
		var hRatio = canvas.width / img.width    ;
		var vRatio = canvas.height / img.height  ;
		var ratio  = Math.min ( hRatio, vRatio );
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio);
		//if (arrL===1) document.getElementById("M").value=1;
	}*/
}
function Sketch_del(){//удаление эскиза
	var i=Number(document.getElementById("M1").value);
	if (i>0) {
		var z=arrSketch.indexOf(arrTempS[i-1]);
		arrSketch.splice(z, 1);
		arrTempS.splice(i-1, 1);
	}
	var arrL=arrTempS.length;
	document.getElementById("N1").value=arrL;
	if (i>1) {document.getElementById("M1").value=i-1;} else {i=2;}
	if (arrL==0) document.getElementById("M1").value=0;
	var img = new Image(); 
	drawClear(ctx2);
	//ctx.clearRect(0, 0, canvas2.width, canvas2.height);
	if (arrL!=0) var srcimg=arrTempS[i-2].imgdata;
	if (srcimg==undefined) srcimg="img/eskiz.png";
	document.getElementById("SketchImage").src=srcimg;
	if (arrL!=0) drawInline2(srcimg);
	A[ANum].SL=arrL;
	if (arrL===0){
		var at=String($('#TPtree').jstree().get_node(CurNode.Id).text);
		at=at.replace(ImgSym, '');
		$('#TPtree').jstree().rename_node(CurNode.Id,at);
	}
}
$('#NW').click(function () {//кнопка чертеж в новом окне
	var a=Number(document.getElementById("M").value);//лист
	if (a<1) return;
	var srcimg=arrImg[a-1].imgdata;
	var img = new Image(height="1920"), 
    can=document.createElement('canvas');
	//var ctx5=can.getContext("2d");
	//ctx.beginPath();
	//ctx.moveTo(0,0);
	//ctx.lineTo(300,150);
	//ctx.stroke();
	img.style.webkitTransformOrigin= "left bottom";
	img.id = "printable";
	//img.style.webkitTransform = "translateY(-100%) rotate(90deg)";
	//img.src = can.toDataURL();
	img.src =srcimg;
	var myWindow = window.open("", "Drawing", "relativeW, relativeH, resizable=yes,scrollbars=yes,status=no");
	myWindow.document.body.appendChild(img);
});
$('#Left').click(function () {//кнопка влево на чертеже
			var a=Number(document.getElementById("M").value);//лист
			var b=document.getElementById("N").value;//листов
			if (a<=b&&a>1) {
				a--;
				document.getElementById("M").value=a;
				var srcimg=arrImg[a-1].imgdata;
				document.getElementById("Drwimage").src=srcimg;
				drawInline(srcimg);	
			};	
});	
$('#Right').click(function () {//кнопка вправо на чертеже
			var a=Number(document.getElementById("M").value);//лист
			var b=document.getElementById("N").value;//листов
			if (a<b) {
				a++;
				document.getElementById("M").value=a;
				var srcimg=arrImg[a-1].imgdata;
				document.getElementById("Drwimage").src=srcimg;
				drawInline(srcimg);				
			};	
});	
$('#L1').click(function () {//кнопка влево на эскизе
			var a=Number(document.getElementById("M1").value);//лист
			var b=document.getElementById("N1").value;//листов
			if (a<=b&&a>1) {
				a--;
				document.getElementById("M1").value=a;
				var srcimg=arrTempS[a-1].imgdata;
				document.getElementById("SketchImage").src=srcimg;
				drawInline2(srcimg);	
			};	
});	
$('#R1').click(function () {//кнопка вправо на эскизе
			var a=Number(document.getElementById("M1").value);//лист
			var b=document.getElementById("N1").value;//листов
			if (a<b) {
				a++;
				document.getElementById("M1").value=a;
				var srcimg=arrTempS[a-1].imgdata;
				document.getElementById("SketchImage").src=srcimg;
				drawInline2(srcimg);				
			};	
});	
$('#NW1').click(function () {//кнопка эскиз в новом окне
	var a=Number(document.getElementById("M1").value);//лист
	if (a<1) return;
	var srcimg=arrTempS[a-1].imgdata;
	var img = new Image(width=1240,height=720), 
    can=document.createElement('canvas');
	img.style.webkitTransformOrigin= "left bottom";
	img.id = "printable";
	img.src =srcimg;
	var myWindow2 = window.open("", "Shape", "width=1250, height=740, resizable=yes, scrollbars=no, status=no");
	var dbody=myWindow2.document.body;
	var img=myWindow2.document.body.appendChild(img);
	if (localStorage.getItem('theme') === 'theme-dark'){
		var iimg=1;var bkc="#2a2c2d";
	}
	else {
		var iimg=0;var bkc="#fbfbfe";
	}
	dbody.style.backgroundColor=bkc;
	img.style.filter="invert("+iimg+")";
});
$('#A3').change(function () {//кнопка A4/A3
	if (document.getElementById("A3").value=='A3'){
		A[ANum].A3=true;
	}
	else A[ANum].A3=false;
});
$('#Help').click(function () {//кнопка помощь
	window.open('Help.html',"Помощь","width=800,height=600").focus();
});	
$('#Ln').change(function () {//длина инструмента в наладке
	O[ONum].Ln=document.getElementById('Ln').value;
	ANew=false;
});	
$('#Diam').click(function () {//кнопка вставить знак диаметра
	var pos1=getCursorPosition( document.getElementById('DSEDim') );
	var txt1=document.getElementById('DSEDim').value;
	var ch1='ø';
	txt1=insert(txt1,ch1,pos1);
	document.getElementById('DSEDim').value=txt1;
	DSEDim_change();
});	
$('#Renum').click(function () {//кнопка ренумеровать
	var d=[]; var n=Number(AFirst);
	d=$("#TPtree").jstree(true)._model.data['j1_0'].children;//id операций по порядку
	for (i=0; i<d.length; i++){//цикл
		var s=String($('#TPtree').jstree().get_node(d[i]).text);
		if (s.indexOf(' ') !== -1) {
			var t = s.slice(0, s.indexOf(' '))
			}
		else t=s;
		var str2=('000'+n).slice(-'000'.length);
		var str1 = s.replace(t, str2);
		
		$('#TPtree').jstree().rename_node(d[i],str1);
			$.each( A, function( key, data ){//перебор операций с заменой номера операции
				if(data.id==d[i]) {
					data.NOP=n;
					$.each( O, function( key1, data1 ){//перебор переходов с заменой номера операции
						if(data1.parent==d[i]) {
							data1.nop=n;
						}
					} )
					RenameONode(data.id);
				}
			} )
		var n=Number(n)+Number(AStep);
	}
});	
$('#Copy').click(function () {//кнопка Копировать
	/*switch(CurNode.Type){
		case 'TP':break;//запрет на копирование корневой ветки
		case 'A':{
			var A_copy=new Object();
			A_copy=$('#TPtree').jstree().get_selected( true);
			window.localStorage.setItem('ACopy', JSON.stringify(A_copy));
			
			
		};
		break;
		case 'O':{};
		break;
		case 'T':{};
		break;
	}*/
	CCP.m="copy";CCP.Id=CurNode.Id;CCP.type=CurNode.Type;
	$('#TPtree').jstree().copy(CurNode.Id);
	if (this.className =="Copy") document.getElementById("Copy").className="selected"
	else document.getElementById("Copy").className="Copy";
	document.getElementById("Cut").className="Cut";
});	
$('#Cut').click(function () {//кнопка Вырезать
	CCP.m="cut";CCP.Id=CurNode.Id;CCP.type=CurNode.Type;
	$('#TPtree').jstree().cut(CurNode.Id);
	if (this.className =="Cut") document.getElementById("Cut").className="selected"
	else document.getElementById("Cut").className="Cut";
	document.getElementById("Copy").className="Copy";
});
$('#Paste').click(function () {//кнопка Вставить
	var mobj=$('#TPtree').jstree().get_selected(true)[0];
	//alert( localStorage.ACopy );
	switch(CurNode.Type){//по выбранной ветке
		case 'TP':
			if (CCP.type=="A") {//если скопированный узел операция
				$('#TPtree').jstree().deselect_all();
				$('#TPtree').jstree().select_node(mobj.children[0]);	
				$('#TPtree').jstree().paste(CurNode.ParentId,0);	
			}
			break;
		case 'A'://если текущий выбор операция
			if (CCP.type=="A") {//если скопированный узел операция
				//var aa=GetANodeIdx();//получаeм массив операций
				var aa=GetONodeIdx(CurNode.ParentId);
				var ANum1 = aa.map(function(e) { return e.id; }).indexOf(CurNode.Id);//индекс текущей операции в массиве
				$('#TPtree').jstree().paste(CurNode.ParentId,ANum1+1);
							
			}
			if (CCP.type="O") {//если скопированный узел переход
				if (CCP.m=="copy") $('#TPtree').jstree().copy_node(CCP.Id,CurNode.Id,0);
				if (CCP.m=="cut") $('#TPtree').jstree().move_node(CCP.Id,CurNode.Id,0);
				//$('#TPtree').jstree().paste(CurNode.Id,'last');				
			}
			break;
		case 'O':{};
			if (CCP.type=="O") {//если скопированный узел переход
				var oo=GetONodeIdx(CurNode.ParentId);//получаeм массив переходов
				var ONum1 = oo.map(function(e) { return e.id; }).indexOf(CurNode.Id);//индекс текущего перехода в массиве
				$('#TPtree').jstree().paste(CurNode.ParentId,ONum1+1);	
			}
			if (CCP.type=="T") {//если скопированный узел инструмент
				if (CCP.m=="copy") $('#TPtree').jstree().copy_node(CCP.Id,CurNode.Id,0);
				if (CCP.m=="cut") $('#TPtree').jstree().move_node(CCP.Id,CurNode.Id,0);
				//$('#TPtree').jstree().paste(CurNode.Id,'last');				
			}
		break;
		case 'T':{};
			if (CCP.type=="T") {//если скопированный узел инструмент
				var tt=GetONodeIdx(CurNode.ParentId);//получаeм массив инструментов
				var TNum1 = tt.map(function(e) { return e.id; }).indexOf(CurNode.Id);//индекс текущего инструмента в массиве
				$('#TPtree').jstree().paste(CurNode.ParentId,TNum1);			
			}
		break;
	}
	/*if(CCP=="copy"){
	var yourObject = JSON.parse(window.localStorage.getItem('ACopy'));
	//$('#TPtree').jstree().copy_node(yourObject.id,CurNode.ParentId);
	//$('#TPtree').jstree().paste(yourObject.id,CurNode.ParentId);
	}*/
	document.getElementById("Cut").className="Cut";
	document.getElementById("Copy").className="Copy";
});
function zeroPad(num,digits){ return ((num/Math.pow(10,digits))+'').slice(2) } ;//форматирование числа
function GetElmnt(VarFrm,ArrId){//получение значения из HTML формы
	var fl='';
	if (ArrId !== undefined) {document.getElementById(VarFrm).value = ArrId;}
	else {
		/*switch(VarFrm){
			case 'EN':fl='1';break;
			case 'Party':fl='1';break;
			//case 'Aotl':fl='4';break;
		}*/
	document.getElementById(VarFrm).value = fl;
	};//стирает значение value формы
}
/*function WorkFolder_change(){
	WorkFolder==document.getElementById("WorkFolder").value;
}*/
function Boss_change(){
	Process.Boss=document.getElementById("Boss").value;
}
/*function ImgFolder_change(){
	ImgFolder==document.getElementById("ImgFolder").value;
}*/
function Product_change(){//Обозначение изделия или классификационного кода
	Process.Product=document.getElementById("Product").value;
}
function Docum_change(){//Обозначение технической документации
	Process.Doc=document.getElementById("Docum").value;
	var td1=Process.Doc;
	if (td1===undefined) {td1=''};
	var td2=DSE.Name;
	if (td2===undefined) {td2=''};
	var td3=DSE.Designation;
	if (td3===undefined) {td3=''};
	$('#TPtree').jstree().rename_node('j1_0',td1+' ('+td2+' '+td3+')');
}
function TPVar_change(){//Вариант техпроцесса
	Process.Variant=document.getElementById("TPVar").value;
}
function Performer_change(){//Исполнитель
	Process.Performer=document.getElementById("Performer").value;
}
function Date_change(){//Дата
	Process.Date=document.getElementById("TPDate").value;
}
function Checking_change(){//Проверил
	Process.Checking=document.getElementById("Checking").value;
}
function Approving_change(){//Утвердил
	Process.Approving=document.getElementById("Approving").value;
}
function Normcontrol_change(){//Нормоконтроль
	Process.Normcontrol=document.getElementById("Normcontrol").value;
}
function Letter1_change(){//Стадия проектирования 1
	Process.Letter1=document.getElementById("Letter1").value;
}
function Letter2_change(){//Стадия проектирования 2
	Process.Letter2=document.getElementById("Letter2").value;
}
function Letter3_change(){//Стадия проектирования 3
	Process.Letter3=document.getElementById("Letter3").value;
}
function Designation_change(){//Обозначение изделия (детали, сборочной единицы) по основному конструкторскому документу
	DSE.Designation=document.getElementById("Designation").value;
	var td1=Process.Doc;
	if (td1===undefined) {td1=''};
	var td2=DSE.Name;
	if (td2===undefined) {td2=''};
	var td3=DSE.Designation;
	if (td3===undefined) {td3=''};
	$('#TPtree').jstree().rename_node('j1_0',td1+' ('+td2+' '+td3+')');
}
function DSEName_change(){//Наименование изделия (детали, сборочной единицы) по основному конструкторскому документу
	DSE.Name=document.getElementById("DSEName").value;
	var td1=Process.Doc;
	if (td1===undefined) {td1=''};
	var td2=DSE.Name;
	if (td2===undefined) {td2=''};
	var td3=DSE.Designation;
	if (td3===undefined) {td3=''};
	$('#TPtree').jstree().rename_node('j1_0',td1+' ('+td2+' '+td3+')');
}
function DSEMat_change(){//Марка материала по ГОСТ, ТУ
	DSE.Material=document.getElementById("DSEMat").value;
}
function DSEMat_dbl(){//Марка материала по ГОСТ, ТУ
	if (DSE.Material==undefined) DSE.Material="";
	window.localStorage.setItem('DSEMatKey', JSON.stringify(DSE.Material));
	window.open('dsemat.html',"Марка материала","width=800,height=600").focus();
}
function AnProgram_change(){//Количество ДСЕ, выпускаемых за год
	DSE.AnnualProgram=document.getElementById("AnProgram").value;
}
function ProcessNote_change(){//Комментарий к технологии
	Process.Note=document.getElementById("ProcessNote").value;
	//Process.Note=NormText(Process.Note, 272);
}
/*function M01_change(){//Наименование, сортамент, размер и марка материала, ГОСТ, ТУ
	Process.M01=document.getElementById("M01").value;
}*/
$('#M01_1').change(function () {//Наименование, сортамент, размер и марка материала, ГОСТ, ТУ
	var M01_1=document.getElementById("M01_1").value;
	var M01_2=document.getElementById("M01_2").value;
	var M01_3=document.getElementById("M01_3").value;
	if (document.getElementById("M01_2").value==="") Process.M01=""; else	Process.M01=M01_1+' '+M01_2+'/ '+M01_3;
});
$('#M01_2').change(function () {//Наименование, сортамент, размер и марка материала, ГОСТ, ТУ
	var M01_1=document.getElementById("M01_1").value;
	var M01_2=document.getElementById("M01_2").value;
	var M01_3=document.getElementById("M01_3").value;
	if (document.getElementById("M01_2").value==="") Process.M01=""; else	Process.M01=M01_1+' '+M01_2+'/ '+M01_3;
});
$('#M01_3').change(function () {//Наименование, сортамент, размер и марка материала, ГОСТ, ТУ
	var M01_1=document.getElementById("M01_1").value;
	var M01_2=document.getElementById("M01_2").value;
	var M01_3=document.getElementById("M01_3").value;
	if (document.getElementById("M01_2").value==="") Process.M01=""; else	Process.M01=M01_1+' '+M01_2+'/ '+M01_3;
	//Process.M01=M01_1+' '+M01_2+'/ '+M01_3;
	window.localStorage.setItem('DSEMatKey', JSON.stringify(M01_3));
});
function SortGet(){
	var M01_1=document.getElementById("M01_1").value;
	var M01_2=document.getElementById("M01_2").value;
	var M01_3=document.getElementById("M01_3").value;
	Process.M01=M01_1+' '+M01_2+'/ '+M01_3;
}
function MatCode_change(){//Код материала по классификатору
	Process.MatCode=document.getElementById("MatCode").value;
}
function UnitCode_change(){//Код единицы величины (массы, длины, площади и т.п.) детали, заготовки, материала
	Process.UnitCode=document.getElementById("UnitCode").value;
}
function Mass_change(){//Масса детали по конструкторскому документу
	Process.Mass=document.getElementById("Mass").value;
}
function StandartUnit_change(){//Единица нормирования, на которую установлена норма расхода материала или времени
	Process.StandartUnit=document.getElementById("StandartUnit").value;
}
function MatRate_change(){//Норма расхода материала
	Process.MatRate=document.getElementById("MatRate").value;
}
function KIM_change(){//Коэффициент использования материала
	Process.KIM=document.getElementById("KIM").value;
}
function BlankCode_change(){//Код заготовки по классификатору
	Process.BlankCode=document.getElementById("BlankCode").value;
}
function DSEDim_change(){//Профиль и размеры заготовки
	Process.Dimensions=document.getElementById("DSEDim").value;
}
function NumDet_change(){//Количество деталей, изготовляемых из одной заготовки
	Process.NumDet=document.getElementById("NumDet").value;
}
function BlankMass_change(){//Масса заготовки
	Process.BlankMass=document.getElementById("BlankMass").value;
}
function Hardness_change(){//Твердость ДСЕ
	Process.Hardness=document.getElementById("Hardness").value;
}
function DiamDSE_change(){//Диаметр ДСЕ
	DSE.Diameter=document.getElementById("DiamDSE").value;
}
function LenDSE_change(){//Длина ДСЕ
	DSE.Len=document.getElementById("LenDSE").value;
}
function HeightDSE_change(){//Высота ДСЕ
	DSE.Height=document.getElementById("HeightDSE").value;
}
function WidthDSE_change(){//Ширина ДСЕ
	DSE.Width=document.getElementById("WidthDSE").value;
}
function iso513_change(){//Материал ДСЕ по ИСО
	Process.ISO513=document.getElementById("iso513").value;
}
function MyFirm_change(){//Краткое наименование или условное обозначение (код) организации (предприятия) - разработчика документа (документов)
	Process.FLabel=document.getElementById("MyFirm").value;
}
function AFirst_change(){//Номер первой операции
	AFirst=document.getElementById("AFirst").value;
}
function AStep_change(){//Шаг номеров операций
	AStep=document.getElementById("AStep").value;
}
function NOP_change(){//Номер операции
	$txtval=document.getElementById("NOPtxt").value
	//$ids=A.findIndex(Operation => Operation.id === CurNode.Id);
	$ids = A.map(function(e) { return e.id; }).indexOf(CurNode.Id);
	A[$ids].NOP=$txtval;//input text value
	var op2=A[$ids].Name;
	if (op2===undefined) {op2=''};
	var op3=A[$ids].EqModel;
	if (op3===undefined) {op3=''};
	if (A[$ids].SL>0) op2=ImgSym+" "+op2;
	$('#TPtree').jstree().rename_node(CurNode.Id,('000'+A[$ids].NOP).slice(-'000'.length)+' '+op2+' ('+op3+')');
	RenameONode(CurNode.Id,$ids);
		$.each( O, function( key, data ){//перебор переходов с заменой номера операции
			if(data.parent==A[$ids].id) {
				data.nop=A[$ids].NOP;
			}
		} )
	ANew=false;
}
function ShopNum_change(){//Номер цеха, в котором выполняется операция
	A[ANum].Shop=document.getElementById("ShopNum").value;
	ANew=false;
}
function OPCode_change(){//Код операции по классификатору
	A[ANum].Code=document.getElementById("OPCode").value;
	ANew=false;
}
function UchNum_change(){//Номер участка, на котором выполняется операция
	A[ANum].Site=document.getElementById("UchNum").value;
	ANew=false;
}
function OPName_change(){//Наименование операции
	A[ANum].Name=document.getElementById("OPName").value;
	var op2=A[ANum].Name;
	if (op2===undefined) {op2=''};
	var op3=A[ANum].EqModel;
	if (op3===undefined) {op3=''};
	if (A[ANum].SL>0) op2=ImgSym+" "+op2;
	$('#TPtree').jstree().rename_node(CurNode.Id,('000'+A[ANum].NOP).slice(-'000'.length)+' '+op2+' ('+op3+')');
	ANew=false;
}
function OPName_dbl(){//Наименование операции
	var on=A[ANum].Name; if (on==undefined) on="";
	window.localStorage.setItem('OPnameKey', JSON.stringify(on));
	window.open('OPName.html',"Операции","width=800,height=600").focus();
}

function RM_change(){//Рабочее место
	A[ANum].Workplace=document.getElementById("RM").value;
	ANew=false;
}
function IOT_change(){//Обозначение документов, инструкций по охране труда, применяемых при выполнении данной операции
	A[ANum].IOT=document.getElementById("IOT").value;
	ANew=false;
}
function ADoc_change(){//Обозначение документов, инструкций по охране труда, применяемых при выполнении данной операции
	A[ANum].Document=document.getElementById("ADoc").value;
	ANew=false;
}
function KOID_change(){//Количество одновременно обрабатываемых деталей
	A[ANum].KOID=document.getElementById("KOID").value;
	ANew=false;
}
function UP_change(){//Обозначение управляющей программы
	A[ANum].CNCProgram=document.getElementById("UP").value;
	ANew=false;
}
function Coolant_change(){//СОЖ
	A[ANum].CuttingFluid=document.getElementById("Coolant").value;
	ANew=false;
}
function OPNote_change(){//Примечание
	A[ANum].Note=document.getElementById("OPNote").value;
	ANew=false;
	//var str=NormText(A[ANum].Note, 272);
	//A[ANum].Note=str;
}
function EqFirm_change(){//Фирма изготовитель оборудования
	A[ANum].EqFirm=document.getElementById("EqFirm").value;
	ANew=false;
}
function EqName_change(){//Наименование оборудования
	A[ANum].Equipment=document.getElementById("EqName").value;
	ANew=false;
}
function EqModel_change(){//Модель оборудования
	A[ANum].EqModel=document.getElementById("EqModel").value;
	var op2=A[ANum].Name;
	if (op2===undefined) {op2=''};
	var op3=A[ANum].EqModel;
	if (op3===undefined) {op3=''};
	if (A[ANum].SL>0) op2=ImgSym+" "+op2;
	$('#TPtree').jstree().rename_node(CurNode.Id,('000'+A[ANum].NOP).slice(-'000'.length)+' '+op2+' ('+op3+')');
	ANew=false;
}
function EqCNC_change(){//Система ЧПУ
	A[ANum].CNC=document.getElementById("EqCNC").value;
	ANew=false;
}
function EqNum_change(){//Инвентарный номер оборудования
	A[ANum].EqNum=document.getElementById("EqNum").value;
	ANew=false;
}
function EqCode_change(){//Код оборудования
	A[ANum].EqCode=document.getElementById("EqCode").value;
	ANew=false;
}
function Razr_change(){//Разряд работы
	A[ANum].Category=document.getElementById("Razr").value;
	ANew=false;
}
function Oplata_change(){//Система оплаты труда
	A[ANum].WageSystem=document.getElementById("Oplata").value;
	ANew=false;
}
function Norm_change(){//Код вида нормы
	A[ANum].KindSt=document.getElementById("Norm").value;
	ANew=false;
}
function SM_change(){//Степень механизации
	A[ANum].Mechanization=document.getElementById("SM").value;
	ANew=false;
}
function UT_change(){//Код условий труда по классификатору ОКПДТР и код вида нормы
	A[ANum].Conditions=document.getElementById("UT").value;
	ANew=false;
}
function KR_change(){//Количество исполнителей, занятых при выполнении операции
	A[ANum].PerfNum=document.getElementById("KR").value;
	ANew=false;
}
function KP_change(){//Код профессии по классификатору
	A[ANum].ProfCode=document.getElementById("KP").value;
	ANew=false;
}
function Prof_change(){//Наименование профессии по классификатору
	A[ANum].Profession=document.getElementById("Prof").value;
	ANew=false;
}
function Prof_dbl(){//Наименование профессии по классификатору
	var pr=A[ANum].Profession; if (pr==undefined) pr="";
	window.localStorage.setItem('ProfKey', JSON.stringify(pr));
	window.open('Prof.html',"Профессии","width=500,height=200").focus();
}
function EN_change(){//Единица нормирования, на которую установлена норма расхода материала или времени
	A[ANum].StandartUnit=document.getElementById("EN").value;
	ANew=false;
}
function Party_change(){//Объем производственной партии в штуках
	A[ANum].Party=document.getElementById("Party").value;
	var Tpz1=Number(PntRpls(A[ANum].SetupTime));
	var OP1=Number(A[ANum].Party);
	var Tst1=Number(A[ANum].TimePerPiece);
	if (isNaN(OP1)) {OP1=1};
	if (isNaN(Tst1)) {Tst1=0};
	if (isNaN(Tpz1)) {Tpz1=0};
	var Tstk1=Tpz1/OP1+Tst1;
	document.getElementById("Tstk").value=Tstk1;
	Tstk_change();
	ANew=false;
}
function Kst_change(){//Коэффициент штучного времени при многостаночном обслуживании
	A[ANum].TimePerPieceK=document.getElementById("Kst").value;
	ANew=false;
}
function PntRpls(str1){//замена запятой на точку
	if (/,/.test(str1)){
		str1=str1.replace(",",".");
	}
	return str1;
}
function Aotl_change(){//Процент времени на отдых и личные надобности
	A[ANum].PerRestTime=document.getElementById("Aotl").value;
	var Toln=Number(PntRpls(A[ANum].PerRestTime));
	var To1=Number(PntRpls(A[ANum].BaseCycleTime));
	var Tv1=Number(PntRpls(A[ANum].AuxiliaryTime));
	if (isNaN(To1)) {To1=0};
	if (isNaN(Tv1)) {Tv1=0};
	var Tst1=To1+Tv1;
	Tst1=Tst1+Tst1*Toln/100;
	document.getElementById("Tst").value=Tst1;
	Tst_change();
	ANew=false;
}
function To_change(){//Норма основного времени на операцию
	A[ANum].BaseCycleTime=document.getElementById("To").value;
	var To1=Number(PntRpls(A[ANum].BaseCycleTime));
	var Tv1=Number(PntRpls(A[ANum].AuxiliaryTime));
	if (isNaN(Tv1)) {Tv1=0};
	var Tst1=To1+Tv1
	var Toln=Number(PntRpls(A[ANum].PerRestTime));
	if (isNaN(Toln)) {Toln=0};
	Tst1=Tst1+Tst1*Toln/100;
	document.getElementById("Tst").value=Tst1.toFixed(2);
	Tst_change();
	ANew=false;
}
function Tv_change(){//Норма вспомогательного времени на операцию
	A[ANum].AuxiliaryTime=document.getElementById("Tv").value;
	var To1=Number(PntRpls(A[ANum].BaseCycleTime));
	var Tv1=Number(PntRpls(A[ANum].AuxiliaryTime));
	if (isNaN(To1)) {To1=0};
	var Tst1=To1+Tv1
	var Toln=Number(PntRpls(A[ANum].PerRestTime));
	if (isNaN(Toln)) {Toln=0};
	Tst1=Tst1+Tst1*Toln/100;
	document.getElementById("Tst").value=Tst1.toFixed(2);
	Tst_change();
	ANew=false;
}
$('#Tpz_but').click(function () {//кнопка Tпз
	window.open('Tpz.html',"Тпз","width=700px,height=550px").focus();
});	
function Tpz_change(){//Норма подготовительно-заключительного времени на операцию
	A[ANum].SetupTime=document.getElementById("Tpz").value;
	var Tpz1=Number(PntRpls(A[ANum].SetupTime));
	var OP1=Number(A[ANum].Party);
	var Tst1=Number(A[ANum].TimePerPiece);
	if (isNaN(OP1)) {OP1=1};
	if (isNaN(Tst1)) {Tst1=0};
	var Tstk1=Tpz1/OP1+Tst1;
	if (isNaN(Tstk1)) {Tstk1=0};
	document.getElementById("Tstk").value=Tstk1.toFixed(2);
	Tstk_change();
	ANew=false;
}
function Tst_change(){//Норма штучного времени на операцию
	A[ANum].TimePerPiece=document.getElementById("Tst").value;
	var Tpz1=Number(PntRpls(A[ANum].SetupTime));
	var OP1=Number(A[ANum].Party);
	var Tst1=Number(A[ANum].TimePerPiece);
	if (isNaN(OP1)) {OP1=1};
	if (isNaN(Tst1)) {Tst1=0};
	if (isNaN(Tpz1)) {Tpz1=0};
	var Tstk1=Tpz1/OP1+Tst1;
	if (isNaN(Tstk1)) {Tstk1=0};
	document.getElementById("Tstk").value=Tstk1.toFixed(2);
	Tstk_change();
	ANew=false;
}
function Tstk_change(){//Норма штучно-калькуляционного времени
	A[ANum].TimePerPieceCalc=document.getElementById("Tstk").value;
	ANew=false;
}
function SumBut_change(){//сумма времени по переходам
	var To1=0;var Tv1=0;
	var bct=0;var at=0;var it=0;var tt=0;
	var To112=0, To212=0, To113=0, To313=0, To223=0, To323=0, To1123=0, To2123=0, To3123=0; 
	
	for (i=0; i<O.length; i++){//цикл по всем переходам
		if (O[i].parent===CurNode.Id) {//выборка по текущей операции
			bct=Number(PntRpls(O[i].BaseCycleTime));//То
			if (isNaN(bct)) {bct=0};
			at=Number(PntRpls(O[i].AuxiliaryTime));//Тв
			if (isNaN(at)) {at=0};
			it=Number(PntRpls(O[i].IndlingTime));//Тхх
			if (isNaN(it)) {it=0};
			tt=Number(PntRpls(O[i].ToolChangeTime));//Тсм
			if (isNaN(tt)) {tt=0};
			//To1=To1+bct+it+tt;//То сумма То+Тхх+Тсм
			Tv1=Tv1+at;//Тв сумма
			switch (O[i].Sync){
						case "1-2":
							if (O[i].WorkBody=="1") To112=To112+bct+it+tt;
							if (O[i].WorkBody=="2") To212=To212+bct+it+tt;
							break;
						case "1-3":
							if (O[i].WorkBody=="1") To113=To113+bct+it+tt;
							if (O[i].WorkBody=="3") To313=To313+bct+it+tt;
							break;
						case "2-3":
							if (O[i].WorkBody=="2") To223=To223+bct+it+tt;
							if (O[i].WorkBody=="3") To323=To323+bct+it+tt;
							break;
						case "1-2-3":
							if (O[i].WorkBody=="1") To1123=To1123+bct+it+tt;
							if (O[i].WorkBody=="2") To2123=To2123+bct+it+tt;
							if (O[i].WorkBody=="3") To3123=To3123+bct+it+tt;
							break;
						default:
							To1=To1+bct+it+tt;//То сумма То+Тхх+Тсм
					}
		}		
	}
	To112=Math.max(Number(To112),Number(To212));
	To113=Math.max(To113,To313);
	To223=Math.max(To223,To323);
	To1123=Math.max(To1123,To2123,To3123);
	To1=To1+To112+To113+To223+To1123;
	document.getElementById("To").value=To1.toFixed(2);
	document.getElementById("Tv").value=Tv1.toFixed(2);
	To_change();
	Tv_change();
}
function insert(str, substr, pos) {//вставка символа в строку
  var array = str.split('');
  array.splice(pos, 0, substr);
  return array.join('');
}
function Button5_click(){//кнопка вставки символа в строку содержания перехода
	var pos1=getCursorPosition( document.getElementById('PerContent') );
	var txt1=document.getElementById('PerContent').value;
	var ch1=document.getElementById('sym').value;
	txt1=insert(txt1,ch1,pos1);
	document.getElementById('PerContent').value=txt1;
	PerContent_change();
	//alert (pos1+' '+ch1);
}
function Button6_click(){//кнопка вставки символа в строку наименования инструмента
	var pos1=getCursorPosition( document.getElementById('NameT') );
	var txt1=document.getElementById('NameT').value;
	var ch1=document.getElementById('sym2').value;
	txt1=insert(txt1,ch1,pos1);
	document.getElementById('NameT').value=txt1;
	NameT_change();
}
function Button7_click(){//кнопка Допуск
	window.open('toolerance.html',"Допуск","width=180,height=180").focus();
}
function Button8_click(){//кнопка Шероховатость
	window.open('roughness.html',"Шероховатость","width=400,height=520").focus();
}
function Button9_click(){//кнопка Резьба
	window.open('thread.html',"Резьба","width=280,height=260").focus();
}
/*$('.editor').click(function() {	
	let $this = $(this);
  let isEditing = $this.hasClass('editing');
 
  if (!isEditing) {
  	let val = $this.html();
  
    let $input = $('<input type="text" class="editor-input">');
    $input.blur(function() {
    	let $this = $(this);
      let val = $this.val();
      $this.closest('.editor').html(val).removeClass('editing');
    })
    $input.val(val);
    $this.html($input);
    $input.focus();
  }
  $this.addClass('editing');
});*/
function getCursorPosition( ctrl ) {//получение позиции курсора
        var CaretPos = 0;
        if ( document.selection ) {
            ctrl.focus ();
            var Sel = document.selection.createRange();
            Sel.moveStart ('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        } else if ( ctrl.selectionStart || ctrl.selectionStart == '0' ) {
            CaretPos = ctrl.selectionStart;
        }
        return CaretPos;
}

function PerContent_change(){//Содержание перехода
	O[ONum].Content=document.getElementById("PerContent").value;
	$('#TPtree').jstree().rename_node(CurNode.Id,O[ONum].num+'. '+O[ONum].Content);
	ONew=false;
	var str1=O[ONum].num+'. ';
	var str2=str1+O[ONum].Content;
	//str2=NormText(str2, 233);
	O[ONum].Content=str2.replace(str1,"");
}
/*function Vmo_change(){//Вид механической обработки
	O[ONum].CutType=document.getElementById("Vmo").value;
	ONew=false;
	/*switch (O[ONum].CutType){
		case "1"://Точение
		break;
		case "2"://Фрезерование
		break;
	}*/
	/*var jfn="json/"+O[ONum].CutType+".json";
	if (jfn===undefined) jfn="json/0.json";
	$.getJSON(jfn, function(data) {
		OText=data;
	});	
}*/
$(function() {//json загрузка списка переходов

	var jfn="json/op.json";
	$.getJSON(jfn, function(data) {
		OText=data;
	});
		$('#PerContent').autocomplete({//jquery ui
			source: function(request, response) {
                    var term = request.term;
                    var pattern = new RegExp("^" + term, "i");
                    
                    var results = $.map(OText, function(elem) {                       
                        if (pattern.test(elem)) {
                            return elem;
                        }
                    })                    
                    response(results);
				},
			position: {
				//my: "center bottom", 
				//at: "center bottom",
				delay: 500,
				minlength: 0
			}
		});
	//});
});
$('#ETo').click(function () {//кнопка калькуляция То
	if (O[ONum].So>0) document.getElementById("Top").value=(O[ONum].i*O[ONum].L/O[ONum].n/O[ONum].So).toFixed(2);
	Top_change();
});	
function Top_change(){//Норма основного времени на переход
	O[ONum].BaseCycleTime=document.getElementById("Top").value;
	ONew=false;
}
function Tvp_change(){//Норма вспомогательного времени на переход
	O[ONum].AuxiliaryTime=document.getElementById("Tvp").value;
	ONew=false;
}
function Thh_change(){//Норма времени холостых ходов
	O[ONum].IndlingTime=document.getElementById("Thh").value;
	ONew=false;
}
function Tsm_change(){//Норма времени смены инструмента
	O[ONum].ToolChangeTime=document.getElementById("Tsm").value;
	ONew=false;
}
function SPD_change(){//Шпиндель
	O[ONum].Spindle=document.getElementById("SPD").value;
	ONew=false;
}
function PK_change(){//Процент контроля
	O[ONum].PK=document.getElementById("PK").value;
	ONew=false;
}
function RO_change(){//Рабочий орган
	O[ONum].WorkBody=document.getElementById("RO").value;
	ONew=false;
}
function Ksnh_change(){//Код синхронизации
	O[ONum].Sync=document.getElementById("Ksnh").value;
	ONew=false;
}
function Pin_change(){//Номер позиции инструментальной наладки
	O[ONum].ToolPosition=document.getElementById("Pin").value;
	ONew=false;
}
function D1_change(){//Расчетный размер диаметра обрабатываемой детали
	O[ONum].D=document.getElementById("D1").value;
	//var Dsr=(O[ONum].D+O[ONum].Dmin)/2;
	if (O[ONum].D>0&&O[ONum].V>0) document.getElementById("n").value=(1000*O[ONum].V/3.14/O[ONum].D).toFixed(0);
	O[ONum].n=document.getElementById("n").value;
	if (O[ONum].So>0) document.getElementById("Sm").value=(O[ONum].So*O[ONum].n).toFixed(0);
	O[ONum].Sm=document.getElementById("Sm").value;
	ONew=false;
}
function D2_change(){//Минимальный диаметр обработки
	O[ONum].Dmin=document.getElementById("D2").value;
	ONew=false;
}
function L_change(){//Расчетный размер длины рабочего хода
	O[ONum].L=document.getElementById("L").value;
	ONew=false;
}
function t_change(){//Глубина резания
	O[ONum].t=document.getElementById("t").value;
	ONew=false;
}
function i_change(){//Количество проходов
	O[ONum].i=document.getElementById("i").value;
	ONew=false;
}
function z_change(){//Количество пластин на инструменте
	O[ONum].z=document.getElementById("z").value;
	if (O[ONum].Sz>0) document.getElementById("So").value=(O[ONum].z*O[ONum].Sz).toFixed(2);
	So_change();
	ONew=false;
}
function So_change(){//Подача, мм/об
	O[ONum].So=document.getElementById("So").value;
	if (O[ONum].n>0) document.getElementById("Sm").value=(O[ONum].So*O[ONum].n).toFixed(0);
	O[ONum].Sm=document.getElementById("Sm").value;
	ONew=false;
}
function Sz_change(){//Подача, мм/зуб
	O[ONum].Sz=document.getElementById("Sz").value;
	if (O[ONum].z>0) document.getElementById("So").value=(O[ONum].z*O[ONum].Sz).toFixed(2);
	So_change();
	ONew=false;
}
function Sm_change(){//Подача, мм/мин
	O[ONum].Sm=document.getElementById("Sm").value;
	ONew=false;
}
function n_change(){//Число оборотов шпинделя, об/мин
	O[ONum].n=document.getElementById("n").value;
	if (O[ONum].n>0) document.getElementById("V").value=(3.14*O[ONum].D*O[ONum].n/1000).toFixed(0);
	if (O[ONum].So>0) document.getElementById("Sm").value=(O[ONum].So*O[ONum].n).toFixed(0);
	O[ONum].V=document.getElementById("V").value;
	O[ONum].Sm=document.getElementById("Sm").value;
	ONew=false;
}
function V_change(){//Скорость резания, м/мин
	O[ONum].V=document.getElementById("V").value;
	if (O[ONum].D>0) {
		document.getElementById("n").value=(1000*O[ONum].V/3.14/O[ONum].D).toFixed(0);
		O[ONum].n=document.getElementById("n").value;
		if (O[ONum].So>0) document.getElementById("Sm").value=(O[ONum].So*O[ONum].n).toFixed(0);
	}
	if (document.getElementById("Sm").value>0) O[ONum].Sm=document.getElementById("Sm").value;
	ONew=false;
}
function ae_change(){//Ширина обработки
	O[ONum].ae=document.getElementById("ae").value;
	ONew=false;
}
function VTS(Sym){//загрузка изображения вида оснастки
	switch(Sym) {
		case 'СЗ':Tsym='<img src="img/SZ.png" height="18" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';
		break;
		case 'ПР':Tsym='<img src="img/PR.png" height="18" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';
		break;
		case 'ВИ':Tsym='<img src="img/VI.png" height="18" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';
		break;
		case 'РИ':Tsym='<img src="img/RI.png" height="18" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';
		break;
		case 'СЛ':Tsym='<img src="img/SL.png" height="18" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';
		break;
		case 'СИ':Tsym='<img src="img/SI.png" height="18" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';
		break;
		case 'ВМ':Tsym='<img src="img/VM.png" height="18" style="vertical-align: middle;filter: invert(var(--invert-image));"/>';
		break;
		default: Tsym='';
	}
	return Tsym;
}
function VidT_change(){//Вид оснастки
	//TNum=T.findIndex( currentValue => currentValue.id == CurNode.Id);
	T[TNum].ToolType=document.getElementById("VidT").value;
	var Tsym=VTS(T[TNum].ToolType);
	var t1=T[TNum].Designation;
	if (t1===undefined) {t1=''};
	var t2=T[TNum].Name;
	if (t2===undefined) {t2=''};
	var t3=T[TNum].Firm;
	if (t3===undefined) {t3='';T[TNum].Firm='';};
	$('#TPtree').jstree().rename_node(CurNode.Id,Tsym+t1+' '+t2+' '+t3);
	TNew=false;
}
function FirmT_change(){//Производитель оснастки
	T[TNum].Firm=document.getElementById("FirmT").value;
	var t1=T[TNum].Designation;
	if (t1===undefined) {t1=''};
	var t2=T[TNum].Name;
	if (t2===undefined) {t2=''};
	var t3=T[TNum].Firm;
	var Tsym=VTS(T[TNum].ToolType);
	$('#TPtree').jstree().rename_node(CurNode.Id,Tsym+' '+t1+' '+t2+' '+t3);
	TNew=false;
}
function KodT_change(){//Код заказа оснастки
	T[TNum].ToolId=document.getElementById("KodT").value;
	TNew=false;
}
function NumT_change(){//Количество инструмента на одну позицию
	T[TNum].Quantity=document.getElementById("NumT").value;
	TNew=false;
}
function NameT_change(){//Наименование оснастки
	//TNum=T.findIndex( currentValue => currentValue.id == CurNode.Id);
	//if (TNew===false) {TNum = T.map(function(e) { return e.id; }).indexOf(CurNode.Id);}//получение индекса массива инструментов			
	T[TNum].Name=document.getElementById("NameT").value;
	var t1=T[TNum].Designation;
	if (t1===undefined) {t1=''};
	var t2=T[TNum].Name;
	if (t2===undefined) {t2=''};
	var t3=T[TNum].Firm;
	if (t3===undefined) {t3='';T[TNum].Firm='';};
	var Tsym=VTS(T[TNum].ToolType);
	$('#TPtree').jstree().rename_node(CurNode.Id,Tsym+' '+t1+' '+t2+' '+t3);
	TNew=false;
	MRCT_change();KPT_change();KKT_change();VylT_change();DiaT_change();TNote_change();
}
function ObozT_change(){//Обозначение оснастки
	T[TNum].Designation=document.getElementById("ObozT").value;
	T[TNum].src=document.getElementById("ObozTbut").src;
	T[TNum].tid=document.getElementById("ObozTbut").alt;
	T[TNum].tbl=document.getElementById("ObozT").alt;
	var t1=T[TNum].Designation;
	if (t1===undefined) {t1=''};
	var t2=T[TNum].Name;
	if (t2===undefined) {t2=''};
	var t3=T[TNum].Firm;
	if (t3===undefined) {t3='';T[TNum].Firm='';};
	$('#TPtree').jstree().rename_node(CurNode.Id,Tsym+' '+t1+' '+t2+' '+t3);
	TNew=false;
}
function ObozT_dbl(){//Обозначение оснастки
	window.open('RIO.html',"РИО","width=1200,height=860").focus();
}
function M1_dbl(){//Сортамент
	window.open('Sortament.html',"Сортамент","width=1200,height=700").focus();
}
function URLT_dbl(){//www tool
	if (T[TNum].URL!=undefined) window.open(T[TNum].URL,"","width=1200,height=700").focus();
}
function MRCT_change(){//Материал режущей части
	T[TNum].CutMaterial=document.getElementById("MRCT").value;
	TNew=false;
}
function KPT_change(){//Количество пластин на инструменте
	T[TNum].z=document.getElementById("KPT").value;
	TNew=false;
}
function KKT_change(){//Количество режущих кромок на пластине
	T[TNum].NumEdges=document.getElementById("KKT").value;
	TNew=false;
}
function StoiT_change(){//Стойкость одной режущей кромки, минут
	T[TNum].LifeTime=document.getElementById("StoiT").value;
	TNew=false;
}
function VylT_change(){//Вылет режущей части инструмента из оправки или цанги, мм
	T[TNum].Len=document.getElementById("VylT").value;
	TNew=false;
}
function DiaT_change(){//Диаметр инструмента
	T[TNum].Diameter=document.getElementById("DiaT").value;
	TNew=false;
}
function TNote_change(){//Примечание
	T[TNum].Note=document.getElementById("TNote").value;
	TNew=false;
}
function TURL_change(){//www
	T[TNum].URL=document.getElementById("TURL").value;
	TNew=false;
}
function A_inc(){//создание новой операции
	ANew=true;
	switch (CurNode.Type){
//alert(CurNode.isParent+'  '+CurNode.ParentId+'  '+CurNode.Type+'  '+CurNode.Id);
		case 'TP': {$('#TPtree').jstree().create_node(CurNode.Id, {'text':'New node TPA', 'type':'A'});};//создание новой операции из корня дерева
		case 'A': {$('#TPtree').jstree().create_node(CurNode.ParentId, {'text':'New node AA', 'type':'A'}) ;//создание новой операции из предыдущей операции
		//$('#TPtree').jstree().open_node(CurNode.Id, false, false);
		//$temp=(CurNode.NewId).split('_',2);//извлечение кода ветки n из формата j1_n
		//$temp2=$temp[1];//присвоение переменной правой части строки n 
		A.push(Operaton={id:CurNode.NewId}); //добавление в массив новой операции
		$('#TPtree').jstree().activate_node(CurNode.NewId);//перемещение указателя на созданную ветку (активация)
		ANum = A.map(function(e) { return e.id; }).indexOf(CurNode.Id);//получение индеса массива операций
		if (ANum===0) {A[ANum].NOP=AFirst;} else {A[ANum].NOP=Number(A[ANum-1].NOP)+Number(AStep);};//заносим в массив номер операции
		document.getElementById('NOPtxt').value = A[ANum].NOP;//заносим значение в поле формы
		A[ANum].Idx=ANum;//заносим значение порядкового номера в поле формы
		//A[ANum].Name='';
		$('#TPtree').jstree().rename_node(CurNode.NewId,('000'+A[ANum].NOP).slice(-'000'.length));//переименовываем ветку дерева
		$(':input','#A_tab')
		.not(':button, :submit, :reset, :hidden')
		.val('');
		Put_ADoc(ANum);
		MLog("New","A",A[ANum]);
		//var Lg={}; Lg.Name="A";Lg.Value=A[ANum]; Lg.Time=CTime(); Lg.Act="New";Log.push(Lg);
		//console.log(Lg);
		}
	}
}
function O_inc(){//создание нового перехода
	ONew=true;
	
	switch (CurNode.Type){
	case 'A': {Num = GetONum(CurNode.NewId);//получение индеса массива переходов
		$('#TPtree').jstree().create_node(CurNode.Id, {'text':'New node AO', 'type':'O'});//создание нового перехода из операции
		Num = GetONum(CurNode.Id);//получение индеса массива переходов
		};
		O.push(Step={id:CurNode.NewId, parent:CurNode.NewParent, num:Num, nop:A[ANum].NOP});//добавление в массив нового перехода
		$('#TPtree').jstree().activate_node(CurNode.NewId);//перемещение указателя на созданную ветку (активация)
		$('#TPtree').jstree().rename_node(CurNode.NewId,Num+'. ');
		RenameONode(CurNode.NewParent);
		break;
	case 'O': {$('#TPtree').jstree().create_node(CurNode.ParentId, {'text':'New node OO', 'type':'O'});//создание нового перехода из предыдущего перехода
		//$('#TPtree').jstree().open_node(CurNode.Id, false, false);
		ANum = A.map(function(e) { return e.id; }).indexOf(CurNode.ParentId);//получение индеса массива операций
		Num = GetONum(CurNode.ParentId);//получение индекса массива переходов
		}
		//alert(Num);
		O.push(Step={id:CurNode.NewId, parent:CurNode.NewParent, num:Num, nop:A[ANum].NOP});//добавление в массив нового перехода
		$('#TPtree').jstree().activate_node(CurNode.NewId);//перемещение указателя на созданную ветку (активация)
		$('#TPtree').jstree().rename_node(CurNode.NewId,Num+'. ');
		RenameONode(CurNode.NewParent);
	}
	$(':input','#O_tab')
	.not(':button, :submit, :reset, :hidden')
	.val('');
	Put_ODoc(ONum);
	document.getElementById('sym').value = "ø";
	MLog("New","O",O[ONum]);
	//var Lg={};Lg.Name="O";Lg.Value=O[ONum]; Lg.Time=CTime(); Lg.Act="New";Log.push(Lg);
	//console.log(Lg);
}
function T_inc(){//создание нового инструмента
	if (CurNode.Type==='A'||CurNode.Type==='TP') return;
	TNew=true;var num1;
	//alert(CurNode.isParent+'  '+CurNode.ParentId+'  '+CurNode.Type+'  '+CurNode.Id);
	if (CurNode.Type==='O') {$('#TPtree').jstree().create_node(CurNode.Id, {'text':'', 'type':'T'}); num1=O.map(function(e) { return e.id; }).indexOf(CurNode.Id);}//создание нового инструмента из перехода
	else {$('#TPtree').jstree().create_node(CurNode.ParentId, {'text':'', 'type':'T'});num1=O.map(function(e) { return e.id; }).indexOf(CurNode.ParentId);};//создание нового инструмента из предыдущего инструмента
	//$('#TPtree').jstree().open_node(CurNode.Id, false, false);
	
	T.push(Tooling={id:CurNode.NewId, parent:CurNode.NewParent, step:O[num1].num});//добавление в массив нового инструмента
	$('#TPtree').jstree().activate_node(CurNode.NewId);//перемещение указателя на созданную ветку (активация)
	$(':input','#T_tab')
	.not(':button, :submit, :reset, :hidden')
	.val('');
	Put_TDoc(TNum);
	document.getElementById('sym2').value = "ø";
	document.getElementById('NumT').value = "1";
	document.getElementById('ObozTbut').src = "";
	document.getElementById('ObozTbut').alt = "";
	document.getElementById('ObozT').alt = "";
	MLog("New","T",T[TNum]);
	//var Lg={};Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="New";Log.push(Lg);
	//console.log(Lg);
}

function GetONum(ParentId){//получение количества переходов в операции
	var j=1;
	for (i=0; i<O.length; ++i){
		if (O[i].parent===ParentId) {++j;
		};
	};
	return j;
}
function NormText(IText, Maxl, Cutl){//преобразование текста перехода
	IText = IText.replace(/\r|\n/g, '');//удалить спецсимволы, в т.ч. перевод строки
	var nl=TextLength(IText);//получаем длину строки в мм
	//const Maxl=273; //максимальная длина строки в мм
	var str=[];//объявляем массив
	str=IText.split('');//получаем массив символов
	var str_copy=JSON.parse(JSON.stringify(str));//копия массива символов
	var cpos=0;//позиция перевода строки
	if (Cutl==undefined) Cutl=Maxl;//если не определена длина обрезки строки, принимаем ее равной длине строки
	if (nl<=Maxl&&nl>Cutl) str.push('\n');//если длина строки меньше равна максимальной и больше минимальной, вставляем перевод строки
	while (nl>Maxl){//пока длина строки больше максимальной
		var pos=GetPosMaxL(str_copy, Maxl);//позиция последнего символа в ограниченном участке строки
		var eols=str_copy.indexOf('\n');//позиция символа перевода строки
		if (eols>0 && eols<pos) {//если позиция перевода строки >0 и меньше позиции последнего символа
			str_copy.splice(0,eols+2);//если в тексте есть перевод строки, удаляем все до него
			cpos=cpos+eols+2;//позиция перевода строки
		}
		else {//ищем пробел
			var j=pos; var e2=0;//j=позиция последнего символа
			while ((str_copy[j]!==' ') && (j>=0)){//ищем с конца строки
				var e2=j;//получаем позицию пробела
				j--;//уменьшаем счетчик
			}
			if (e2<=0) e2=pos;//если нет пробела, получаем позицию последнего символа
			cpos=cpos+e2;//позиция перевода строки
			if (str[cpos]===" ") cpos++;//если новая строка начинается с пробела, переставить начало
			str.splice(cpos,0,'\n');//иначе добавляем перевод строки	
			str_copy.splice(0,e2);//обрезаем строку
		}
		var nl=TextLength(str_copy);//получаем длину строки в мм
		if (nl<=Maxl) {//проверяем последний кусок
			if (nl>Cutl) {
				str.push('\n');//Maxl=Cutl;//если nl>Cutl, то добавляем перевод строки
			}
		}
	}
	result=(str.join(''));
	if (str[result.length-1]==='\n') result=result.slice(0, -1);//удаляем последний перевод строки
	return result;
}
function TextLength(str){//получаем длину строки в мм для шрифта GOST Common Italic 12 размера
//массив ширины символа с CHR(0) до CHR(255)
var arrs=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 1.0414, 0.9398, 1.8796, 2.8236333333333, 2.1971, 3.4501666666667, 2.8236333333333, 1.0964333333333, 1.2530666666667, 1.2530666666667, 2.0701, 2.1971, 1.0964333333333, 2.1971, 0.9398, 2.1971, 2.1971, 1.5663333333333, 2.1971, 2.1971, 2.5061333333333, 2.1971, 2.1971, 2.1971, 2.1971, 2.1971, 0.9398, 1.0964333333333, 2.1971, 2.1971, 2.1971, 2.1971, 3.4501666666667, 2.8236333333333, 2.5061333333333, 2.1971, 2.5061333333333, 2.1971, 2.1971, 2.5061333333333, 2.5061333333333, 0.9398, 1.8796, 2.5061333333333, 2.1971, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.8236333333333, 3.4501666666667, 2.8236333333333, 2.8236333333333, 2.5061333333333, 1.2530666666667, 2.1971, 1.2530666666667, 1.8796, 2.8236333333333, 1.5663333333333, 2.1971, 2.1971, 1.8796, 2.1971, 2.1971, 1.8796, 2.1971, 2.1971, 0.9398, 0.9398, 2.1971, 1.2530666666667, 2.8236333333333, 2.1971, 2.1971, 2.1971, 2.1971, 1.8796, 2.1971, 1.8796, 2.1971, 2.1971, 2.8236333333333, 2.1971, 2.1971, 2.1971, 1.5663333333333, 0.9398, 1.5663333333333, 2.1971, 1.3758333333333, 2.9802666666667, 2.1971, 1.0964333333333, 2.1971, 1.8796, 2.5061333333333, 2.1971, 2.1971, 3.4501666666667, 3.4501666666667, 3.4501666666667, 1.5663333333333, 3.4501666666667, 2.5061333333333, 2.9802666666667, 2.5061333333333, 2.667, 1.0964333333333, 1.0964333333333, 1.8796, 1.8796, 1.2530666666667, 2.5061333333333, 3.1369, 1.3758333333333, 3.4501666666667, 2.9802666666667, 1.5663333333333, 2.9802666666667, 2.1971, 2.667, 2.1971, 1.0414, 2.5061333333333, 2.1971, 1.8796, 2.8236333333333, 2.1971, 0.9398, 1.8796, 2.1971, 3.4501666666667, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.1928666666667, 3.4501666666667, 1.8796, 1.7314333333333, 2.1971, 0.9398, 0.9398, 2.0362333333333, 2.1971, 2.8236333333333, 1.2530666666667, 2.1971, 3.7634333333333, 2.1971, 2.5061333333333, 0.9398, 2.5061333333333, 2.1971, 1.8796, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.1971, 2.8236333333333, 2.1971, 3.1369, 2.3537333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.1971, 2.5061333333333, 2.5061333333333, 3.1369, 2.8236333333333, 2.8236333333333, 2.5061333333333, 3.1369, 3.4501666666667, 3.1369, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.9802666666667, 2.5061333333333, 2.5061333333333, 2.1971, 2.1928666666667, 2.1971, 2.1971, 2.1971, 2.8236333333333, 2.0362333333333, 2.1971, 2.1971, 2.1971, 2.1971, 2.5061333333333, 2.1971, 2.1971, 2.1971, 2.1971, 1.8796, 2.8236333333333, 2.1971, 2.8236333333333, 2.1971, 2.5061333333333, 2.1971, 2.8236333333333, 3.1369, 2.667, 2.5061333333333, 2.1971, 2.1971, 2.667, 2.1971];
var arial=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1768666666667, 1.1768666666667, 1.5028333333333, 2.3537333333333, 2.3537333333333, 3.7634333333333, 2.8236333333333, 0.80856666666667, 1.4097, 1.4097, 1.6467666666667, 2.4722666666667, 1.1768666666667, 1.4097, 1.1768666666667, 1.1768666666667, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 1.1768666666667, 1.1768666666667, 2.4722666666667, 2.4722666666667, 2.4722666666667, 2.3537333333333, 4.2968333333333, 2.8236333333333, 2.8236333333333, 3.0564666666667, 3.0564666666667, 2.8236333333333, 2.5865666666667, 3.2935333333333, 3.0564666666667, 1.1768666666667, 2.1166666666667, 2.8236333333333, 2.3537333333333, 3.5263666666667, 3.0564666666667, 3.2935333333333, 2.8236333333333, 3.2935333333333, 3.0564666666667, 2.8236333333333, 2.5865666666667, 3.0564666666667, 2.8236333333333, 3.9962666666667, 2.8236333333333, 2.8236333333333, 2.5865666666667, 1.1768666666667, 1.1768666666667, 1.1768666666667, 1.9854333333333, 2.3537333333333, 1.4097, 2.3537333333333, 2.3537333333333, 2.1166666666667, 2.3537333333333, 2.3537333333333, 1.1768666666667, 2.3537333333333, 2.3537333333333, 0.9398, 0.9398, 2.1166666666667, 0.9398, 3.5263666666667, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 1.4097, 2.1166666666667, 1.1768666666667, 2.3537333333333, 2.1166666666667, 3.0564666666667, 2.1166666666667, 2.1166666666667, 2.1166666666667, 1.4139333333333, 1.1006666666667, 1.4139333333333, 2.4722666666667, 3.175, 3.5687, 2.3029333333333, 0.9398, 1.6002, 1.4097, 4.2333333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 4.2333333333333, 4.5127333333333, 1.4097, 4.1571333333333, 2.4934333333333, 3.5729333333333, 3.0649333333333, 2.3537333333333, 0.9398, 0.9398, 1.4097, 1.4097, 1.4816666666667, 2.3537333333333, 4.2333333333333, 3.175, 4.2333333333333, 3.8523333333333, 1.4097, 3.5052, 1.9981333333333, 2.3537333333333, 2.3537333333333, 1.1768666666667, 2.7051, 2.1166666666667, 2.1166666666667, 2.5865666666667, 2.0828, 1.1006666666667, 2.3537333333333, 2.8236333333333, 3.1199666666667, 2.9972, 2.3537333333333, 2.4722666666667, 1.4097, 3.1199666666667, 1.1768666666667, 1.6933333333333, 2.3241, 1.1768666666667, 0.9398, 1.4351, 2.4384, 2.2733, 1.4097, 2.3537333333333, 4.5847, 2.0997333333333, 2.3537333333333, 0.9398, 2.8236333333333, 2.1166666666667, 0.9398, 2.8236333333333, 2.7559, 2.8236333333333, 2.3029333333333, 2.9802666666667, 2.8236333333333, 3.8819666666667, 2.5992666666667, 3.0268333333333, 3.0268333333333, 2.4934333333333, 2.9040666666667, 3.5263666666667, 3.0564666666667, 3.2935333333333, 3.0691666666667, 2.8236333333333, 3.0564666666667, 2.5865666666667, 2.7051, 3.3655, 2.8236333333333, 3.0776333333333, 2.8490333333333, 3.8946666666667, 3.9073666666667, 3.4078333333333, 3.7507333333333, 2.7559, 2.9379333333333, 4.3264666666667, 2.8871333333333, 2.3537333333333, 2.3833666666667, 2.2098, 2.0870333333333, 2.3410333333333, 2.3537333333333, 2.9125333333333, 1.9685, 2.3537333333333, 2.3537333333333, 1.9981333333333, 2.3876, 2.9040666666667, 2.3283333333333, 2.3537333333333, 2.3283333333333, 2.3537333333333, 2.1166666666667, 3.5263666666667, 2.1166666666667, 3.5348333333333, 2.1166666666667, 2.4214666666667, 2.1928666666667, 3.5136666666667, 3.6025666666667, 2.6289, 3.1157333333333, 2.2267333333333, 2.0828, 3.1834666666667, 2.2606];
var result=0;
	if (str!==undefined) {
		for(var i=0;i<str.length;i++) {
			var s=str[i].charCodeAt(0);//код Unicode равен ASCII для индексов до 127
			if (s>0xFF) s-=0x350;//если индекс больше 127, прибавить смещение для Unicode
			if (s===7622) s=185; // знак №
			if (s===7364) s=45;// тире длинное
			if (s===7382) s=133;// троеточие
			//if (s===34) s=126; // знак " меняем на ~
			//if (s===39) s=180; // знак ' меняем на `
			if (s>255) {s=0; console.log(str[i]+' '+s);}//проверка на вхождение символа в диапазон 0...255
			if (Process.Font=="GOST_Ai") result = result + arrs[s]; else result = result + arial[s];
		}
	}
  return result;
}
function GetPosMaxL(str, maxl){//получаем позицию символа для заданной максимальной длины строки в мм
var arrs=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 1.0414, 0.9398, 1.8796, 2.8236333333333, 2.1971, 3.4501666666667, 2.8236333333333, 1.0964333333333, 1.2530666666667, 1.2530666666667, 2.0701, 2.1971, 1.0964333333333, 2.1971, 0.9398, 2.1971, 2.1971, 1.5663333333333, 2.1971, 2.1971, 2.5061333333333, 2.1971, 2.1971, 2.1971, 2.1971, 2.1971, 0.9398, 1.0964333333333, 2.1971, 2.1971, 2.1971, 2.1971, 3.4501666666667, 2.8236333333333, 2.5061333333333, 2.1971, 2.5061333333333, 2.1971, 2.1971, 2.5061333333333, 2.5061333333333, 0.9398, 1.8796, 2.5061333333333, 2.1971, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.8236333333333, 3.4501666666667, 2.8236333333333, 2.8236333333333, 2.5061333333333, 1.2530666666667, 2.1971, 1.2530666666667, 1.8796, 2.8236333333333, 1.5663333333333, 2.1971, 2.1971, 1.8796, 2.1971, 2.1971, 1.8796, 2.1971, 2.1971, 0.9398, 0.9398, 2.1971, 1.2530666666667, 2.8236333333333, 2.1971, 2.1971, 2.1971, 2.1971, 1.8796, 2.1971, 1.8796, 2.1971, 2.1971, 2.8236333333333, 2.1971, 2.1971, 2.1971, 1.5663333333333, 0.9398, 1.5663333333333, 2.1971, 1.3758333333333, 2.9802666666667, 2.1971, 1.0964333333333, 2.1971, 1.8796, 2.5061333333333, 2.1971, 2.1971, 3.4501666666667, 3.4501666666667, 3.4501666666667, 1.5663333333333, 3.4501666666667, 2.5061333333333, 2.9802666666667, 2.5061333333333, 2.667, 1.0964333333333, 1.0964333333333, 1.8796, 1.8796, 1.2530666666667, 2.5061333333333, 3.1369, 1.3758333333333, 3.4501666666667, 2.9802666666667, 1.5663333333333, 2.9802666666667, 2.1971, 2.667, 2.1971, 1.0414, 2.5061333333333, 2.1971, 1.8796, 2.8236333333333, 2.1971, 0.9398, 1.8796, 2.1971, 3.4501666666667, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.1928666666667, 3.4501666666667, 1.8796, 1.7314333333333, 2.1971, 0.9398, 0.9398, 2.0362333333333, 2.1971, 2.8236333333333, 1.2530666666667, 2.1971, 3.7634333333333, 2.1971, 2.5061333333333, 0.9398, 2.5061333333333, 2.1971, 1.8796, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.1971, 2.8236333333333, 2.1971, 3.1369, 2.3537333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.5061333333333, 2.1971, 2.5061333333333, 2.5061333333333, 3.1369, 2.8236333333333, 2.8236333333333, 2.5061333333333, 3.1369, 3.4501666666667, 3.1369, 2.8236333333333, 2.5061333333333, 2.5061333333333, 2.9802666666667, 2.5061333333333, 2.5061333333333, 2.1971, 2.1928666666667, 2.1971, 2.1971, 2.1971, 2.8236333333333, 2.0362333333333, 2.1971, 2.1971, 2.1971, 2.1971, 2.5061333333333, 2.1971, 2.1971, 2.1971, 2.1971, 1.8796, 2.8236333333333, 2.1971, 2.8236333333333, 2.1971, 2.5061333333333, 2.1971, 2.8236333333333, 3.1369, 2.667, 2.5061333333333, 2.1971, 2.1971, 2.667, 2.1971];
var arial=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.1768666666667, 1.1768666666667, 1.5028333333333, 2.3537333333333, 2.3537333333333, 3.7634333333333, 2.8236333333333, 0.80856666666667, 1.4097, 1.4097, 1.6467666666667, 2.4722666666667, 1.1768666666667, 1.4097, 1.1768666666667, 1.1768666666667, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 1.1768666666667, 1.1768666666667, 2.4722666666667, 2.4722666666667, 2.4722666666667, 2.3537333333333, 4.2968333333333, 2.8236333333333, 2.8236333333333, 3.0564666666667, 3.0564666666667, 2.8236333333333, 2.5865666666667, 3.2935333333333, 3.0564666666667, 1.1768666666667, 2.1166666666667, 2.8236333333333, 2.3537333333333, 3.5263666666667, 3.0564666666667, 3.2935333333333, 2.8236333333333, 3.2935333333333, 3.0564666666667, 2.8236333333333, 2.5865666666667, 3.0564666666667, 2.8236333333333, 3.9962666666667, 2.8236333333333, 2.8236333333333, 2.5865666666667, 1.1768666666667, 1.1768666666667, 1.1768666666667, 1.9854333333333, 2.3537333333333, 1.4097, 2.3537333333333, 2.3537333333333, 2.1166666666667, 2.3537333333333, 2.3537333333333, 1.1768666666667, 2.3537333333333, 2.3537333333333, 0.9398, 0.9398, 2.1166666666667, 0.9398, 3.5263666666667, 2.3537333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 1.4097, 2.1166666666667, 1.1768666666667, 2.3537333333333, 2.1166666666667, 3.0564666666667, 2.1166666666667, 2.1166666666667, 2.1166666666667, 1.4139333333333, 1.1006666666667, 1.4139333333333, 2.4722666666667, 3.175, 3.5687, 2.3029333333333, 0.9398, 1.6002, 1.4097, 4.2333333333333, 2.3537333333333, 2.3537333333333, 2.3537333333333, 4.2333333333333, 4.5127333333333, 1.4097, 4.1571333333333, 2.4934333333333, 3.5729333333333, 3.0649333333333, 2.3537333333333, 0.9398, 0.9398, 1.4097, 1.4097, 1.4816666666667, 2.3537333333333, 4.2333333333333, 3.175, 4.2333333333333, 3.8523333333333, 1.4097, 3.5052, 1.9981333333333, 2.3537333333333, 2.3537333333333, 1.1768666666667, 2.7051, 2.1166666666667, 2.1166666666667, 2.5865666666667, 2.0828, 1.1006666666667, 2.3537333333333, 2.8236333333333, 3.1199666666667, 2.9972, 2.3537333333333, 2.4722666666667, 1.4097, 3.1199666666667, 1.1768666666667, 1.6933333333333, 2.3241, 1.1768666666667, 0.9398, 1.4351, 2.4384, 2.2733, 1.4097, 2.3537333333333, 4.5847, 2.0997333333333, 2.3537333333333, 0.9398, 2.8236333333333, 2.1166666666667, 0.9398, 2.8236333333333, 2.7559, 2.8236333333333, 2.3029333333333, 2.9802666666667, 2.8236333333333, 3.8819666666667, 2.5992666666667, 3.0268333333333, 3.0268333333333, 2.4934333333333, 2.9040666666667, 3.5263666666667, 3.0564666666667, 3.2935333333333, 3.0691666666667, 2.8236333333333, 3.0564666666667, 2.5865666666667, 2.7051, 3.3655, 2.8236333333333, 3.0776333333333, 2.8490333333333, 3.8946666666667, 3.9073666666667, 3.4078333333333, 3.7507333333333, 2.7559, 2.9379333333333, 4.3264666666667, 2.8871333333333, 2.3537333333333, 2.3833666666667, 2.2098, 2.0870333333333, 2.3410333333333, 2.3537333333333, 2.9125333333333, 1.9685, 2.3537333333333, 2.3537333333333, 1.9981333333333, 2.3876, 2.9040666666667, 2.3283333333333, 2.3537333333333, 2.3283333333333, 2.3537333333333, 2.1166666666667, 3.5263666666667, 2.1166666666667, 3.5348333333333, 2.1166666666667, 2.4214666666667, 2.1928666666667, 3.5136666666667, 3.6025666666667, 2.6289, 3.1157333333333, 2.2267333333333, 2.0828, 3.1834666666667, 2.2606];
var result=0; var pos=0;
	if (str!==undefined) {
		for(var i=0;i<str.length;i++) {
			var s=str[i].charCodeAt(0);//код Unicode равен ASCII для индексов до 127
			if (s>0xFF) s-=0x350;//если индекс больше 127, прибавить смещение для Unicode
			if (s===7622) s=185; // знак №
			if (s>255) s=32;//alert(str[i]+' '+s);//проверка на вхождение символа в диапазон 0...255
			if (Process.Font=="GOST_Ai") result = result + arrs[s]; else result = result + arial[s];
			if (result>=maxl){var pos=i; break;}
		}
	}
  return pos;
}
function GetANodeIdx(){//получение таблицы номеров операций
	var i;var j;var aa=[];var k; aaobj=new Object;
		for (i=0; i<A.length; ++i){
			for (j=0; j<A.length; ++j){
				k=Number(A[j].Idx);
				if (k===i) {aa.push(aaobj={idx: j, id:A[j].id});}
			}
			//alert('aa['+i+']='+aa[i].id);
			//aa[A[i].Idx]=i;//alert('aa['+A[i].Idx+']='+i);
		};
	return aa;
}
function NodePos(NodeArr,Id){
	for (i=0; i<NodeArr.length; i++){
		if (NodeArr[i].id==Id) return i;
	}	
}
function GetONodeIdx(ParentId){//получение таблицы номеров переходов
	var d={}; obj=new Object;var oo=[];
	d=$('#TPtree').jstree().get_node(ParentId).children;//переходы
	for (const [key, value] of Object.entries(d)){
		oo.push(obj={idx: key, id:value});
	}
	/*var i;var j;var oo=[]; obj=new Object; var k;
	//var n=GetONum(ParentId)-1;
		for (i=0; i<O.length; ++i){
			for (j=0; j<O.length; ++j){
				if (Number(O[j].num)===(i+1) && O[j].parent===ParentId) {oo.push(obj={idx: j, id:O[j].id});}
			}
			//alert('oo['+i+']='+oo[i].id+' idx='+oo[i].idx);
		};*/
		//console.log('oo='+oo);
	return oo;
}
function RenameONode(ParentId){//перенумерация переходов
	var d={}; var str;
	d=$('#TPtree').jstree().get_node(ParentId).children;//переходы
	for (const [key, value] of Object.entries(d)){
		ONum = O.map(function(e) { return e.id; }).indexOf(value);//получение индекса массива переходов
		O[ONum].num=Number(key)+1;//перенумерация переходов
		str=O[ONum].Content;
		if (str===undefined) {str=''};
		$('#TPtree').jstree().rename_node(value,O[ONum].num+'. '+str);
	};
	/*var i; var j; var str;
	var n=GetONum(ParentId)-1;
		for (i=0; i<n; ++i){
			for (j=0; j<O.length; ++j){
				if (Number(O[j].num)===(i+1) && O[j].parent===ParentId) {
					str=O[j].Content;
					if (str===undefined) {str=''};
					$('#TPtree').jstree().rename_node(O[j].id,O[j].num+'. '+str);
					if (nn!=undefined) {O[j].nop=A[nn].NOP};
				}
			}
		};*/
}
function RenumTNode(){//ренумерация инструмента
	for (j=0; j<O.length; ++j){
		for (var m=0; m<T.length; ++m){
			if (O[j].id===T[m].parent){
				T[m].step=O[j].num;
				var t1=T[m].Designation;
				if (t1===undefined) {t1=''};
				var t2=T[m].Name;
				if (t2===undefined) {t2=''};
				var t3=T[m].Firm;
				if (t3===undefined) {t3='';T[m].Firm='';};
				var Tsym=VTS(T[m].ToolType);
				$('#TPtree').jstree().rename_node(T[m].id,Tsym+' '+t1+' '+t2+' '+t3);
			}
		};
	};
}
function Node_del(){//удаление ветки
	switch(CurNode.Type){
		case 'TP':break;//запрет на удаление корневой ветки
		case 'A':{ANew=true;var i;var j;var aa=GetANodeIdx();var k; var l; var m; var DI;
			for (i=0; i<A.length; ++i){
				if (aa[i].id===CurNode.Id) {
					if (i>0) {$tmp=aa[i-1].id} else {$tmp=CurNode.ParentId;};
					DI=aa[i].idx;k=i;//alert('DelItem='+DI+' Item='+k+' Length='+A.length);
					for (j=A.length-1;j>k;--j){A[aa[j].idx].Idx=A[aa[j-1].idx].Idx;
						//alert('j='+j+' '+aa[j-1]+' '+aa[j]);
					};
					for (l=O.length; l>0; --l){
						if (O[l-1].parent===CurNode.Id) {
							for (m=T.length; m>0; --m){
								if (T[m-1].parent===O[l-1].id) {
									T.splice(m-1,1);
								};
                            	for (k=arrNaladki.length; k>0; k--){//удаление наладок
							        if (arrNaladki[k-1].id===O[l-1].id) {
								        arrNaladki.splice(k-1, 1);
							        };
						        };
							};//alert(O[l].parent);
						O.splice(l-1,1);				
						};
					};
					A.splice(DI,1)
				};
			};
			for (i=arrSketch.length; i>0; i--){//удаление эскизов
				if (arrSketch[i-1].id===CurNode.Id) {
					arrSketch.splice(i-1, 1);
				};
			};
		};
		$('#TPtree').jstree().delete_node(CurNode.Id);
		CurNode.Id=$tmp;
		break;
		case 'O':{ONew=true;var i;var j;var m; var k;
			var oo=GetONodeIdx(CurNode.ParentId);
			var n=GetONum(CurNode.ParentId)-1;
			for (i=0; i<O.length; ++i){
				if (O[i].id===CurNode.Id) {
					if (i>0) {$tmp=O[i-1].id} else {$tmp=CurNode.ParentId;};
					for (j=0; j<n; ++j) {if (oo[j].id===CurNode.Id) {k=j}};
					for (j=n-1; j>k; --j) {
						O[oo[j].idx].num=O[oo[j].idx].num-1;
						};
					for (m=T.length; m>0; --m){
						if (T[m-1].parent===O[i].id) {
							T.splice(m-1,1);
						};
					};
                	for (k=arrNaladki.length; k>0; k--){//удаление наладок
						if (arrNaladki[k-1].id===CurNode.Id) {
							arrNaladki.splice(k-1, 1);
						};
					};
				O.splice(i,1);
				};
			};
		
		};
		$('#TPtree').jstree().delete_node(CurNode.Id);
		RenameONode(CurNode.ParentId);
		RenumTNode();
		CurNode.Id=$tmp;
		break;
		case 'T':{TNew=true;var i;
			for (i=0; i<T.length; ++i){
				if (T[i].id===CurNode.Id) {
					if (i>0) {$tmp=T[i-1].id} else {$tmp=CurNode.ParentId;};
					T.splice(i,1);
				};
			};
		};
		$('#TPtree').jstree().delete_node(CurNode.Id);
		CurNode.Id=$tmp;
	};
	$('#TPtree').jstree().activate_node(CurNode.ParentId);
}
$(function(){//чертеж
	$('#tab03').click(function(e){
		var arrL=arrImg.length;
		drawClear(ctx);
		if (arrL==0) {
			document.getElementById("N").value=0;
			document.getElementById("M").value=0;
		}
		else{
			document.getElementById("Drwimage").src=arrImg[0].imgdata;
			drawInline( arrImg[0].imgdata);
			document.getElementById("N").value=arrImg.length;
			document.getElementById("M").value=1;
		}
	});
});	
$(function(){//эмблема
	$('#tab04').click(function(e){
	var img = new Image();
    if (RDraw.imgdata!=undefined) img.src = RDraw.imgdata;
    img.addEventListener('load', function () {
        console.log("image onload");
		//canvas.Width = this.naturalWidth;
		//canvas.Height = this.naturalHeight;
		//ctx = canvas.getContext("2d");
        ctx1.drawImage(this, 0, 0,333,102);     
    });
	});
});
$(function(){//наладка
	$('#tabO2').click(function(e){
	var idx=Naladka_idx(CurNode.Id);
	ctx3.clearRect(0, 0,300,300);
	if (idx!=undefined) drawInline3(arrNaladki[idx].imgdata);
	NTools();
	});
});
$(function(){//эскизы
	$('#tabA5').click(function(e){
		arrTempS=GetSketchArr(CurNode.Id);
		var arrL=arrTempS.length;
		drawClear(ctx2);
		if (arrL==0) {
			document.getElementById("N1").value=0;
			document.getElementById("M1").value=0;
			document.getElementById("SketchImage").src="img/eskiz.png";
		}
		else{
			document.getElementById("SketchImage").src=arrTempS[0].imgdata;
			drawInline2(arrTempS[0].imgdata);
			document.getElementById("N1").value=arrTempS.length;
			document.getElementById("M1").value=1;
		}
		document.getElementById("A3").value="A4";
		if (A[ANum].A3==true) document.getElementById("A3").value="A3";
	});
});
$(function(){//формирование таблицы печати комплекта документации
	$('#tab05').click(function(e){
	var table = $('table[name="tblprnt"]');	
	table.children().remove();//удалить чекбоксы
	//var aa=GetANodeIdx();
	for (var j=0; j<A.length; j++){
		//var ANum1 = A.map(function(e) { return e.id; }).indexOf(aa[j].id);//получение индеса массива операций
		var tdId = A[j].NOP;
		var tdTitle = $('<input />', {'class' : 'form-control formInput', 'type': 'text'});
		var tdCheckBox1 = $('<input />', {'value':j,'disabled':'disabled','class' : 'form-control', 'type' : 'checkbox', 'name' : 'check1','checked':'checked'});
		var tdCheckBox2 = $('<input />', {'value':j,'disabled':'disabled','class' : 'form-control', 'type' : 'checkbox', 'name' : 'check2','checked':'checked'});
		var tdCheckBox3 = $('<input />', {'value':tdId,'class' : 'form-control', 'type' : 'checkbox', 'name' : 'check3_'+j,'checked':A[j].OK});
		var tdCheckBox4 = $('<input />', {'value':tdId,'class' : 'form-control', 'type' : 'checkbox', 'name' : 'check4_'+j,'checked':A[j].KE});
		var tdCheckBox5 = $('<input />', {'value':tdId,'class' : 'form-control', 'type' : 'checkbox', 'name' : 'check5_'+j,'checked':A[j].OKK});
		var tdCheckBox7 = $('<input />', {'value':tdId,'class' : 'form-control', 'type' : 'checkbox', 'name' : 'check7_'+j,'checked':A[j].KN});
		var tdCheckBox6 = $('<input />', {'value':j,'disabled':'disabled','class' : 'form-control', 'type' : 'checkbox', 'name' : 'check6','checked':'checked'});	
		newRow(table,[tdId,tdCheckBox1,tdCheckBox2,tdCheckBox3,tdCheckBox4,tdCheckBox5,tdCheckBox7,tdCheckBox6]);
	}
	});
});	
function newRow($table,cols){//создать строку чекбоксов
    $row = $('<tr/>');
    for(var i=0; i<cols.length; i++){
        $col = $('<td/>');
        $col.append(cols[i]);
        $row.append($col);
    }
    $table.append($row);
}
//function ComplDoc_click(){
	//var form = document.getElementById("f1");
	//form.submit();Jstrans(true);
//}
function NTools(){//формирование списка инструментов в наладке
	var t0=[]; 
	t0=$("#TPtree").jstree(true)._model.data[CurNode.Id].children;//id операций по порядку
	var lent=t0.length;
	ONum = O.map(function(e) { return e.id; }).indexOf(CurNode.Id);//получение индекса массива переходов
	GetElmnt("Ln",O[ONum].Ln);//длина инструмента в наладке (вылет)
	if (ONum!=-1){
		for (var j = 1; j <= 8; j++) {
			var s="PIT"+j;
			var objSel = document.getElementById(s);//список 
			objSel.options.length = 0;//стираем
			objSel.options[objSel.options.length] = new Option('','');
			for (var i = 0; i < lent; i++) {
				var st=$("#TPtree").jstree().get_node(t0[i]).text;//описание инструмента из дерева техпроцесса
				st=st.slice(st.indexOf('>')+1);//убираем изображение
				objSel.options[objSel.options.length] = new Option(st,t0[i]);//добавляем строку в список
				if (O[ONum].KIT!==undefined){
					if (t0[i]==O[ONum].KIT[j-1]){
						document.getElementById(s).options[i+1].selected=true;
					}
				}
			}
		}
	}
}
function TPexp_click(){	
}

$('select[name="PIT"]')//обработка выбора инструмента в наладке
	.change(function () {
		ONum = O.map(function(e) { return e.id; }).indexOf(CurNode.Id);//получение индекса массива переходов
		var arr=["","","","","","","",""];
		var arr2=["","","","","","","",""];
		var spid="#"+this.id;//id списка
		var npid=Number(spid.slice(4));//№ списка
		var s=$(spid).val();//получение выбранного элемента из списка
		var s2=$(spid+' option:selected').text();
		//if(s!=="")
		if (ONum!=-1){
			if (O[ONum].KIT!=undefined) arr=O[ONum].KIT;
			if (O[ONum].KITT!=undefined) arr2=O[ONum].KITT;
			arr[npid-1]=s;
			O[ONum].KIT=arr;
			arr2[npid-1]=s2;
			O[ONum].KITT=arr2;
			console.log(npid+' '+s+' '+s2);
		}
})
	.change();
$("#tblprn").change(function(){//изменение таблицы печати
	for (var j=0; j<A.length; j++){
		if ($("input[name=check3_"+j+"]").is(':checked')){A[j].OK=true;} else {A[j].OK=false;};
		if ($("input[name=check4_"+j+"]").is(':checked')){A[j].KE=true;} else {A[j].KE=false;};
		if ($("input[name=check5_"+j+"]").is(':checked')){A[j].OKK=true;} else {A[j].OKK=false;};
		if ($("input[name=check7_"+j+"]").is(':checked')){A[j].KN=true;} else {A[j].KN=false;};
	}
	//alert(n);
});
$('#ch1').click(function(){//Титульный лист
    if ($(this).is(':checked')){
		$("input[name=check1]").prop('checked', true);
        //$('#information_json_1[2]').prop('checked', true);
    } else {
		/*alert($("input[name=check1]:checked").map(
		function () {return this.value;}).get().join(","));*/
		//$("input[name=check1]:checked").prop('checked', false);
		$("input[name=check1]").prop('checked', false);
    }
});
$('#ch2').click(function(){//Маршрутная карта
    if ($(this).is(':checked')){
		$("input[name=check2]").prop('checked', true);
    } else {
		$("input[name=check2]").prop('checked', false);
    }
});
$('#ch3').click(function(){//Операционная карта
	for (var j=0; j<A.length; j++){
		if ($(this).is(':checked')){
			$("input[name=check3_"+j+"]").prop('checked', true);
			A[j].OK=true;
		} else {
			$("input[name=check3_"+j+"]").prop('checked', false);
			A[j].OK=false;
		}
	}
});
$('#ch4').click(function(){//Карта эскизов
	for (var j=0; j<A.length; j++){
		if ($(this).is(':checked')){
			$("input[name=check4_"+j+"]").prop('checked', true);
			A[j].KE=true;
		} else {
			$("input[name=check4_"+j+"]").prop('checked', false);
			A[j].KE=false;
		}
	}
});
$('#ch5').click(function(){//Операционная карта контроля
	for (var j=0; j<A.length; j++){
		if ($(this).is(':checked')){
			$("input[name=check5_"+j+"]").prop('checked', true);
			A[j].OKK=true;
		} else {
			$("input[name=check5_"+j+"]").prop('checked', false);
			A[j].OKK=false;
		}
	}
});
$('#ch6').click(function(){//Ведомость оснастки
    if ($(this).is(':checked')){
		$("input[name=check6]").prop('checked', true);
    } else {
		$("input[name=check6]").prop('checked', false);
    }
});
$('#ch7').click(function(){//Карта наладки
	for (var j=0; j<A.length; j++){
		if ($(this).is(':checked')){
			$("input[name=check7_"+j+"]").prop('checked', true);
			A[j].KN=true;
		} else {
			$("input[name=check7_"+j+"]").prop('checked', false);
			A[j].KN=false;
		}
	}
});
$('#chmks').click(function(){//наличие пробелов в маршрутной карте
    if ($(this).is(':checked')){
		Process.MKSp=1;
    } else {
		Process.MKSp=0;
    }
});
$('#choks').click(function(){//наличие пробелов в операционной карте
    if ($(this).is(':checked')){
		Process.OKSp=1;
    } else {
		Process.OKSp=0;
    }
});
$('#chokp').click(function(){//наличие режимов в операционной карте
    if ($(this).is(':checked')){
		Process.OKSpp=1;
    } else {
		Process.OKSpp=0;
    }
});
$('#TPFont').change(function(){//выбор шрифта
	Process.Font=document.getElementById("TPFont").value;
	window.localStorage.setItem('TPFont', JSON.stringify(Process.Font));
});
function TblData(){//таблица вывода на печать
/*$("#tblprn").change(function(){
	if ($(this).is(':checked')){
		//$('#controls input:checkbox').prop('checked', true);
	} else {
		
		//$('#controls input:checkbox').prop('checked', false);
	}
	/*alert($("input[name=check1]:checked").map(
		function () {return this.value;}).get().join(","));*/
		/*var abc=$("input[name=check1]:checked").map(
		function () {return this.value;}).get().join(",");
		alert(abc);*/
		if ($('#ch1').is(':checked')) var TLcheck=true;
		if ($('#ch2').is(':checked')) var MKcheck=true;
		if ($('#ch6').is(':checked')) var VOcheck=true;
		var OKcheck = [];var KEcheck = [];var OKKcheck = [];var KNcheck = []; var A3_KE=[];
		for (var j=0; j<A.length; j++){
			if (A[j].OK) OKcheck.push(this.A[j].NOP);
			if (A[j].KE) KEcheck.push(this.A[j].NOP);
			if (A[j].OKK) OKKcheck.push(this.A[j].NOP);
			if (A[j].KN) KNcheck.push(this.A[j].NOP);
			if (A[j].A3) A3_KE.push(this.A[j].NOP);
		}
		/*var OKcheck = [];
		$("input[name=check3]:checked").each(function() {//$(".form-control:checked").each(function() {
		OKcheck.push(this.value);
		});
		var KEcheck = [];
		$("input[name=check4]:checked").each(function() {
		KEcheck.push(this.value);
		});
		var OKKcheck = [];
		$("input[name=check5]:checked").each(function() {
		OKKcheck.push(this.value);
		});*/
		//alert ('OKcheck: '+OKcheck+' KEcheck: '+KEcheck+' OKKcheck: '+OKKcheck);
		return {TL:TLcheck, MK:MKcheck, OK:OKcheck, KE:KEcheck, OKK:OKKcheck, VO:VOcheck, KN:KNcheck, A3:A3_KE};
//});
}
$("#Homebut").click(function(){
	$('#A_tab').hide();$('#O_tab').hide();$('#T_tab').hide();//скрытие лишних вкладок
	$('#tab01').prop('checked',true);
	$('#Home_tab').show();//показ домашней владки
	$('#TPtree').jstree("close_all");
	$('#TPtree').jstree().open_node('j1_0');
	}).mouseup(function(){
		clearTimeout(pressTimer);
		return false;
	}).mousedown(function(){
		pressTimer=window.setTimeout(function(){
		setTimeout(() => { $('#TPtree').jstree("open_all"); }, 500);			
	},500);
	return false;	
});
/*function Home_Button(){//нажатие кнопки "домой"
	$('#A_tab').hide();$('#O_tab').hide();$('#T_tab').hide();//скрытие лишних вкладок
	$('#tab01').prop('checked',true);
	$('#Home_tab').show();//показ домашней владки
	//$('#TPtree').jstree().deselect_node(CurNode.Id);//снятие выбора с текущей ветки
	//$('#TPtree').jstree().select_node('j1_0');//выбор корневой ветки
	$('#TPtree').jstree("close_all");
	$('#TPtree').jstree().open_node('j1_0');
}*/
function Put_ADoc(anum){//Заполнение формы операции
	GetElmnt("NOPtxt",A[anum].NOP);//номер операции
	GetElmnt("OPCode",A[anum].Code);//код операции
	GetElmnt("OPName",A[anum].Name);//название операции
	GetElmnt("ADoc",A[anum].Document);//документы
	GetElmnt("IOT",A[anum].IOT);//ИОТ
	GetElmnt("Coolant",A[anum].CuttingFluid);//СОЖ
	GetElmnt("ShopNum",A[anum].Shop);//номер цеха
	GetElmnt("UchNum",A[anum].Site);//номер участка
	GetElmnt("RM",A[anum].Workplace);//рабочее место
	if (A[anum].KOID==undefined) A[anum].KOID=1;
	GetElmnt("KOID",A[anum].KOID);//КОИД
	GetElmnt("UP",A[anum].CNCProgram);//УП
	//GetElmnt("OPNote",A[anum].Note);//примечание к операции
	//GetElmnt("Hardn",A[anum].Hardness);//Твердость
	GetElmnt("OPNote",A[anum].Note);//Примечание к операции
	GetElmnt("EqFirm",A[anum].EqFirm);//Фирма-изготовитель оборудования
	GetElmnt("EqName",A[anum].Equipment);//Наименование оборудования
	GetElmnt("EqModel",A[anum].EqModel);//Модель оборудования
	GetElmnt("EqCNC",A[anum].CNC);//Система ЧПУ
	GetElmnt("EqNum",A[anum].EqNum);//Инвентарный номер оборудования
	GetElmnt("EqCode",A[anum].EqCode);//Код оборудования
	GetElmnt("Razr",A[anum].Category);//Разряд работы
	GetElmnt("Oplata",A[anum].WageSystem);//Система оплаты труда
	GetElmnt("Norm",A[anum].KindSt);//Код вида нормы
	if (A[anum].Mechanization==undefined) A[anum].Mechanization=2;
	GetElmnt("SM",A[anum].Mechanization);//Степень механизации
	if (A[anum].Conditions==undefined) A[anum].Conditions=1;
	GetElmnt("UT",A[anum].Conditions);// условий труда по классификатору ОКПДТР и код вида нормы
	if (A[anum].PerfNum==undefined) A[anum].PerfNum=1;
	GetElmnt("KR",A[anum].PerfNum);//Количество исполнителей, занятых при выполнении операции
	GetElmnt("KP",A[anum].ProfCode);//Код профессии по классификатору
	GetElmnt("Prof",A[anum].Profession);// Наименование профессии по классификатору
	if (A[anum].StandartUnit==undefined) A[anum].StandartUnit=1;
	GetElmnt("EN",A[anum].StandartUnit);// Единица нормирования, на которую установлена норма расхода материала или времени
	if (A[anum].Party==undefined) A[anum].Party=1;
	GetElmnt("Party",A[anum].Party);// Объем производственной партии в штуках
	if (A[anum].TimePerPieceK==undefined) A[anum].TimePerPieceK=1;
	GetElmnt("Kst",A[anum].TimePerPieceK);// Коэффициент штучного времени при многостаночном обслуживании
	if (A[anum].PerRestTime==undefined) A[anum].PerRestTime=4;
	GetElmnt("Aotl",A[anum].PerRestTime);//Процент времени на отдых и личные надобности
	GetElmnt("To",A[anum].BaseCycleTime);//Норма основного времени на операцию
	GetElmnt("Tv",A[anum].AuxiliaryTime);//Норма вспомогательного времени на операцию
	GetElmnt("Tpz",A[anum].SetupTime);//Норма подготовительно-заключительного времени на операцию
	GetElmnt("Tst",A[anum].TimePerPiece);//Норма штучного времени на операцию
	if (A[anum].TimePerPieceCalc!=undefined) A[anum].TimePerPieceCalc=parseFloat(A[anum].TimePerPieceCalc).toFixed(2);
	GetElmnt("Tstk",A[anum].TimePerPieceCalc);//Норма штучно-калькуляционного времени
	
}
function Put_ODoc(onum){//Заполнение формы перехода
	if (O[onum].Content!=undefined) GetElmnt("PerContent",O[onum].Content);//Содержание перехода
	//GetElmnt("Vmo",O[onum].CutType);//Вид механической обработки
	GetElmnt("Top",O[onum].BaseCycleTime);//Норма основного времени на переход
	GetElmnt("Tvp",O[onum].AuxiliaryTime);//Норма вспомогательного времени на переход
	GetElmnt("Thh",O[onum].IndlingTime);//Норма времени холостых ходов
	GetElmnt("Tsm",O[onum].ToolChangeTime);//Норма времени смены инструмента
	if (O[onum].Spindle==undefined) O[onum].Spindle="1";
	GetElmnt("SPD",O[onum].Spindle);//Шпиндель
	if (O[onum].WorkBody==undefined) O[onum].WorkBody="1";
	GetElmnt("RO",O[onum].WorkBody);//Рабочий орган
	GetElmnt("Ksnh",O[onum].Sync);//Код синхронизации
	GetElmnt("Pin",O[onum].ToolPosition);//Номер позиции инструментальной наладки
	GetElmnt("D1",O[onum].D);//Расчетный размер диаметра обрабатываемой детали
	GetElmnt("D2",O[onum].Dmin);//Минимальный диаметр обработки
	GetElmnt("L",O[onum].L);//Расчетный размер длины рабочего хода
	GetElmnt("t",O[onum].t);//Глубина резания
	GetElmnt("i",O[onum].i);//Количество проходов
	GetElmnt("z",O[onum].z);//Количество пластин на инструменте
	GetElmnt("So",O[onum].So);//Подача, мм/об
	GetElmnt("Sz",O[onum].Sz);//Подача, мм/зуб
	GetElmnt("Sm",O[onum].Sm);//Подача, мм/мин
	GetElmnt("n",O[onum].n);//Число оборотов шпинделя, об/мин
	GetElmnt("V",O[onum].V);//Скорость резания, м/мин
	GetElmnt("ae",O[onum].ae);//Ширина обработки
	if (O[onum].PK==undefined) O[onum].PK="100";
	GetElmnt("PK",O[onum].PK);//% контроля
	GetElmnt("Ln",O[onum].Ln);//длина инструмента в наладке (вылет)
}
function Put_TDoc(tnum){//Заполнение формы инструмента
	document.getElementById("ObozTbut").src=T[TNum].src;
	document.getElementById("ObozTbut").alt=T[TNum].tid;
	document.getElementById("ObozT").alt=T[TNum].tbl;
	GetElmnt("VidT",T[tnum].ToolType);//Вид оснастки
	GetElmnt("FirmT",T[tnum].Firm);//Производитель оснастки
	GetElmnt("KodT",T[tnum].ToolId);//Код заказа оснастки
	if (T[tnum].Quantity==undefined) T[tnum].Quantity=1;
	GetElmnt("NumT",T[tnum].Quantity);//Количество инструмента на одну позицию
	GetElmnt("NameT",T[tnum].Name);//Наименование оснастки
	GetElmnt("ObozT",T[tnum].Designation);//Обозначение оснастки
	GetElmnt("MRCT",T[tnum].CutMaterial);//Материал режущей части
	GetElmnt("KPT",T[tnum].z);//Количество пластин на инструменте
	GetElmnt("StoiT",T[tnum].LifeTime);//Стойкость одной режущей кромки, минут
	GetElmnt("VylT",T[tnum].Len);//Вылет режущей части инструмента из оправки или цанги, мм
	GetElmnt("DiaT",T[tnum].Diameter);//Диаметр инструмента
	GetElmnt("TNote",T[tnum].Note);//Примечание
	GetElmnt("KKT",T[tnum].NumEdges);//Количество режущих кромок на инструменте
	GetElmnt("TURL",T[tnum].URL);//www
}
function Put_Process(){//Заполнение формы техпроцесса
	GetElmnt("TPVar",Process.Variant);
	GetElmnt("Product",Process.Product);
	GetElmnt("Docum",Process.Doc);
	GetElmnt("TPDate",Process.Date);
	GetElmnt("Letter1",Process.Letter1);
	GetElmnt("Letter2",Process.Letter2);
	GetElmnt("Letter3",Process.Letter3);
	GetElmnt("Performer",Process.Performer);
	GetElmnt("Checking",Process.Checking);
	GetElmnt("Approving",Process.Approving);
	GetElmnt("Normcontrol",Process.Normcontrol);
	if (Process.M01!=undefined){
		var MOstr=Process.M01;
		var Mstr=[];
		Mstr=MOstr.split(" / ");
		GetElmnt("M01_3",Mstr[1]);
		MOstr=MOstr.replace(" / "+Mstr[1],"");
		Mstr=Mstr[0].split(" ");
		GetElmnt("M01_1",Mstr[0]);
		MOstr=MOstr.replace(Mstr[0],"");
		GetElmnt("M01_2",MOstr);
		//GetElmnt("M01",Process.M01_1+' '+Process.M01_2+' / '+Process.M01_3);
	}
	GetElmnt("MatCode",Process.MatCode);
	GetElmnt("Mass",Process.Mass);
	GetElmnt("UnitCode",Process.UnitCode);
	GetElmnt("StandartUnit",Process.StandartUnit);
	GetElmnt("MatRate",Process.MatRate);
	GetElmnt("BlankCode",Process.BlankCode);
	GetElmnt("DSEDim",Process.Dimensions);
	GetElmnt("NumDet",Process.NumDet);
	if (Process.NumDet==undefined) Process.NumDet=1;
	GetElmnt("BlankMass",Process.BlankMass);
	GetElmnt("ProcessNote",Process.Note);
	GetElmnt("Hardness",Process.Hardness);
	GetElmnt("MyFirm",Process.FLabel);
	GetElmnt("Boss",Process.Boss);
	GetElmnt("iso513",Process.ISO513);
	GetElmnt("KIM",Process.KIM);
	if (Process.Font==undefined) Process.Font="GOST_Ai"; 
	GetElmnt("TPFont",Process.Font);
	if (Process.OKSpp==undefined) Process.OKSpp=1; 
	
}
function Put_DSE(){//Заполнение формы ДСЕ
	GetElmnt("Designation",DSE.Designation);
	GetElmnt("DSEName",DSE.Name);
	GetElmnt("DSEMat",DSE.Material);
	GetElmnt("DiamDSE",DSE.Diameter);
	GetElmnt("LenDSE",DSE.Len);
	GetElmnt("WidthDSE",DSE.Width);
	GetElmnt("HeightDSE",DSE.Height);
	GetElmnt("AnProgram",DSE.AnnualProgram);
}
// Модуль приложения=================================================================================
var app = (function($) {

    // Инициализируем нужные переменные
    var //ajaxUrl = '\php',
        ui = {
            $TP: $('#TPtree'),
			$mytabs: $('#contents'),
            $comments: $('#footer')
        };
	 
function convertURIToImageData(dataURI) {
// convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);
// separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
// write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type:mimeString});
}
function Img1Ajax(){//отправка Ajax с файлами чертежей
	//event.stopPropagation(); // остановка всех текущих JS событий
	//event.preventDefault();  // остановка дефолтного события для текущего элемента - клик для <a> тега
    //var formData = new FormData();
	//var base64ImageContent = arrImg[0].replace(/^data:image\/(png|jpg);base64,/, "");
		//let blob = convertURIToImageData(arrImg[0].imgdata);
    //console.log(blob);
	//var base64ImageContent = blob;
	var formData = new FormData();
	for (var i = 0; i < arrImg.length; i++) {
		let blob = convertURIToImageData(arrImg[i].imgdata);
		//formData.append('fname[]', arrImg[i].fname);
		formData.append('drw[]', blob, arrImg[i].fname);
	}


    //for (var id in queue) {
        //formData.append('images[]', queue[id]);
    //}

	if (arrImg.length>0) { 
         $.ajax({
            url: 'php/drw.php',
            type: 'POST',
            data: formData, 
			dataType:'json',
            async: false,
             /*success: function (res) {
                 alert(res)
             },*/
            cache: false,
            contentType: false,// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
            processData: false, // отключаем обработку передаваемых данных, пусть передаются как есть
			// функция успешного ответа сервера
			success: function( respond, status, jqXHR ){
				// ОК - файлы загружены
				if( typeof respond.error === 'undefined' ){
					// выведем пути загруженных файлов в блок '.ajax-reply'
					/*var files_path = respond.files;
					var html = '';
					$.each( files_path, function( key, val ){
						html += val +'<br>';
					} )

					$('.ajax-reply').html( html );*/
					console.log(respond.result);
				}
				// ошибка
				else {
					console.log('ОШИБКА: ' + respond.error );
				}
			},
			// функция ошибки ответа сервера
			error: function( jqXHR, status, errorThrown ){
				console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
			}
		 });
         return false;
	}
}	
function Img2Ajax(){//отправка Ajax с файлами эскизов
	//event.stopPropagation(); // остановка всех текущих JS событий
	//event.preventDefault();  // остановка дефолтного события для текущего элемента - клик для <a> тега
    var formData = new FormData();
	for (var i = 0; i < arrSketch.length; i++) {
		var z=A.filter(function (e) {
			return e.id === arrSketch[i].id;
		});
		let blob = convertURIToImageData(arrSketch[i].imgdata);
		formData.append('drw[]', blob, z[0].NOP+"_"+arrSketch[i].fname);
	}
	if (arrSketch.length>0) {formData.append( 'sketch', 1 );
	//цикл добавления номеров операций
	//for (var i=0; i<A.length; ++i) {
	//	if	(!A[i].img=='') formData.append( 'Aimg[]', A[i].NOP+'*'+A[i].img );
	//};
         $.ajax({
            url: 'php/sketch.php',
            type: 'POST',
            data: formData, 
			dataType:'json',
            async: false,
             /*success: function (res) {
                 alert(res)
             },*/
            cache: false,
            contentType: false,// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
            processData: false, // отключаем обработку передаваемых данных, пусть передаются как есть
			// функция успешного ответа сервера
			success: function( respond, status, jqXHR ){
				// ОК - файлы загружены
				if( typeof respond.error === 'undefined' ){
					console.log(respond.result);
				}
				// ошибка
				else {
					console.log('ОШИБКА: ' + respond.error );
				}
			},
			// функция ошибки ответа сервера
			error: function( jqXHR, status, errorThrown ){
				console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
			}
		 });
         return false;
	}
}
function Img3Ajax(){//отправка Ajax с файлом эмблемы
	var formData = new FormData();
	if (RDraw.imgdata!=undefined) {
		let blob = convertURIToImageData(RDraw.imgdata);
		formData.append('drw[]', blob, RDraw.fname);
	}
	//if (RDraw.imgdata!=undefined) { 
         $.ajax({
            url: 'php/emblem.php',
            type: 'POST',
            data: formData, 
			dataType:'json',
            async: false,
            cache: false,
            contentType: false,// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
            processData: false, // отключаем обработку передаваемых данных, пусть передаются как есть
			// функция успешного ответа сервера
			success: function( respond, status, jqXHR ){
				// ОК - файлы загружены
				if( typeof respond.error === 'undefined' ){
					console.log(respond.result);
				}
				// ошибка
				else {
					console.log('ОШИБКА: ' + respond.error );
				}
			},
			// функция ошибки ответа сервера
			error: function( jqXHR, status, errorThrown ){
				console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
			}
		 });
         return false;
	//}
}	
function Img4Ajax(){//отправка Ajax с файлами наладок
    var formData = new FormData();
	for (var i = 0; i < arrNaladki.length; i++) {
		var z=O.filter(function (e) {
			return e.id === arrNaladki[i].id;
		});
		let blob = convertURIToImageData(arrNaladki[i].imgdata);
		formData.append('drw[]', blob, z[0].nop+"="+z[0].num+"_"+arrNaladki[i].fname);
	}
	if (arrNaladki.length>0) {formData.append( 'naladka', 1 );
         $.ajax({
            url: 'php/naladka.php',
            type: 'POST',
            data: formData, 
			dataType:'json',
            async: false,
            cache: false,
            contentType: false,// отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
            processData: false, // отключаем обработку передаваемых данных, пусть передаются как есть
			// функция успешного ответа сервера
			success: function( respond, status, jqXHR ){
				// ОК - файлы загружены
				if( typeof respond.error === 'undefined' ){
					console.log(respond.result);
				}
				// ошибка
				else {
					console.log('ОШИБКА: ' + respond.error );
				}
			},
			// функция ошибки ответа сервера
			error: function( jqXHR, status, errorThrown ){
				console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
			}
		 });
         return false;
	}
}
function TextFormat(){//форматирование текста переходаs
	var tl; var len1, len2;
	if (Process.Font=="GOST_Ai") {
		len1=272; len2=265; len3=233;
	}
	else{
		len1=270; len2=263; len3=230;
	}
	if (Process.Note!=undefined) Process.Note=NormText(Process.Note,len1)	
	for (var prop in A){
		if (A[prop].Note!=undefined) A[prop].Note=NormText(A[prop].Note, len1);//272
	}
	for (var prop in O){
		tl=len2;
		if (O[prop].BaseCycleTime!=undefined||O[prop].AuxiliaryTime!=undefined){
			tl=len3;
		}
		if (O[prop].Content!=undefined) O[prop].Content=NormText(O[prop].Content,len2,len3);//265
	}
}	
var sort_by = function(field, reverse, primer){//функция сортировки
   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};
   reverse = !reverse ? 1 : -1;
   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}
$(function Jstrans(v){//передача на сервер JSON данных
	//$('#tpexp').click(function(e){
	$('#ComplDoc').off('click').click(function(e){
	TextFormat();
	var ajaxUrl = 'php/ajax.php';
	var data0={};
	data0[0]=DSE;//деталь
	data0[1]=Process;//технология
	data0[2]=A;//операции
	data0[2].sort(sort_by('NOP', false, parseInt));
	data0[3]=O;//переходы
	data0[3].sort(sort_by('num', false, parseInt));
	data0[4]=T;//инструмент
	data0[4].sort(sort_by('step', false, parseInt));
	data0[5]=TblData();//таблица печати
	var data = $.extend(data0, {
            action: 'tprocess'
        });
		$.ajax({
			type: 'POST',
            url: ajaxUrl,
            data: data, 
			//contentType: "application/json; charset=utf-8",
			dataType: 'json',
			//asinс: false,//нужно подожлать ответ перед формированием отчета
			//cache: false,
			//isLocal:true,
            success: function(resp) {
                if (resp.code === 'success') {
                    console.log('ok tprocess');//+JSON.stringify(resp.result));
                } else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
                }
            },
            error: function( error) {
                console.log('Ошибка: ', error);
            }
        }).done(function(msg){
		console.log( "Data Saved: " + JSON.stringify(msg) );
		Img1Ajax();//чертежи
		Img2Ajax();//эскизы
		Img3Ajax();//эмблема
		Img4Ajax();//наладки
		//alert('Данные загружены в базу');
			var form = document.getElementById("f1");
			form.submit();Jstrans(true);
		});
		//$.post(ajaxUrl,data,'json');
		
	});
	//<?php require("PrintMK1.php");  ?>	
});

function createDownloadLink(anchorSelector, str, fileName){//создание ссылки для загрузки файла
	//<input  type="button"  onclick="readFile('C:\Test\TestFile.txt')">
	if(window.navigator.msSaveOrOpenBlob) {
		var fileData = [str];
		blobObject = new Blob(fileData);
		$(anchorSelector).click(function(){
			window.navigator.msSaveOrOpenBlob(blobObject, fileName);
		});
	} else {
		var url = "data:text/plain;charset=utf-8,%EF%BB%BF" + encodeURIComponent(str);
		//$(anchorSelector).attr("download", fileName);               
        $(anchorSelector).attr("href", url);
	}
}
var saveData = (function () {//получение наименования файла, сохранение
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
            var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());
$(function(){ //сохранение текстового файла
$('#export').click(function(e){
	var OldVersion=false;
	var v = $("#TPtree").jstree(true).get_json('#', {flat:true});
	var data0=JSON.stringify(DSE);
	var data1=JSON.stringify(Process);
	var data2=JSON.stringify(A);
	var data3=JSON.stringify(O);
	var data4=JSON.stringify(T);
	var data5 = JSON.stringify(v);
	var data6 = JSON.stringify(arrImg);
	var data7 = JSON.stringify(arrSketch);
	var data8 = JSON.stringify(RDraw);
	/*if ($('#chver').is(':checked')){//проверка галочки в кнопке 'Старая версия'
		OldVersion=true;
		var data=data0+'\n'+data1+'\n'+data2+'\n'+data3+'\n'+data4+'\n'+data5+'\n'+data6+'\n'+data7+'\n'+data8;
	} 
	else {
		OldVersion=false;
		var data9 = JSON.stringify(arrNaladki);//наладки
		var data=data0+'\n'+data1+'\n'+data2+'\n'+data3+'\n'+data4+'\n'+data5+'\n'+data6+'\n'+data7+'\n'+data8+'\n'+data9;
	}	*/
	var data9 = JSON.stringify(arrNaladki);//наладки
	var data=data0+'\n'+data1+'\n'+data2+'\n'+data3+'\n'+data4+'\n'+data5+'\n'+data6+'\n'+data7+'\n'+data8+'\n'+data9;
	fileName = "tp_"+DSE.Designation+".json";
	//createDownloadLink("#export",data,"tp.json");
	//document.write(
    //'<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(text) + '" download="tp.json">tp.json</a>'
	saveData(data, fileName);
	alert('файл .json ,будет сохранен');
	    e.stopPropagation();
        e.preventDefault();
	//)
	//<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(data) + '" download="tp.txt">tp.txt</a>'
	});
});
$(function (){//создание нового техпроцесса

$('#newTP').click(function(e){//новый ТП
	var children = $("#TPtree").jstree().get_node('#').children;
	$("#TPtree").jstree().delete_node(children);
	$('#TPtree').jstree().create_node('#', {'text':'Новый техпроцесс','id':'j1_0', 'type':'TP'});
	$('#A_tab').hide();$('#O_tab').hide();$('#T_tab').hide();//скрытие вкладок
	Process_clear;
	DSE_clear;
	arrImg.length=0;arrSketch.length=0;RDraw="";
	if (A.length>0) A.splice(0, A.length); 
	if (O.length>0) O.splice(0,O.length); 
	if (T.length>0) T.splice(0,T.length);
	$(':input','#Home_tab')
	.not(':button, :submit, :reset, :hidden')
	.val('');
	Process.Variant='1';
	Process.Doc='Новый техпроцесс';
	Process.NumDet=1;
	DSE.Name='';
	DSE.Designation='';
	GetElmnt("AFirst",AFirst);
	GetElmnt("AStep",AStep);
	GetElmnt("Docum",'Новый техпроцесс');
	//$('#TPtree').jstree().rename_node('j1_0','Новый техпроцесс');
	//$('#TPtree').jstree().activate_node('j1_0');
	//$('#tab05').prop('checked',false);
	$('#tab01').prop('checked',true);
	$('#Home_tab').show();//показ домашней владки
	});
});
$(function(){ //загрузка файла
$('#import').change(function(e){
	var selectedFile = document.getElementById('import').files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
             var FileContent = e.target.result;
             parseContent(FileContent);
    };
    reader.readAsText(selectedFile);
	var $el = $('#import');
	$el.wrap('<form>').closest('form').get(0).reset();//удалить имя фвйла
    $el.unwrap();
	});
});
function parseContent(content) {//преобразование содержимого файла
		$temp=(content).split('\n',10);
		if ($temp.length>9) arrNaladki=JSON.parse($temp[9]);//наладки
		 //$temp=(content).split('\n',9);
	//if (A.length>0) A.splice(0, A.length); 
	//if (O.length>0) O.splice(0,O.length); 
	//if (T.length>0) T.splice(0,T.length);
		 DSE=JSON.parse($temp[0]);//деталь
		 Process=JSON.parse($temp[1]);//техпроцесс
		 A=JSON.parse($temp[2]);//операции
		 O=JSON.parse($temp[3]);//переходы
		 T=JSON.parse($temp[4]);//инструмент
		 JSTreeData=JSON.parse($temp[5]);//дерево
		 arrImg=JSON.parse($temp[6]);//чертежи
		 arrSketch=JSON.parse($temp[7]);//эскизы
		 RDraw=JSON.parse($temp[8]);//эмблема
		 Make_MyTree(JSTreeData);//создать дерево
}		
function Make_MyTree(jstd){//создание дерева
	//var children = $("#TPtree").jstree().get_node('j1_0').children;
	//$("#TPtree").jstree().delete_node(children);
	$(':input','#Home_tab')
	.not(':button, :submit, :reset, :hidden')
	.val('');
	$("#TPtree").jstree(true).settings.core.data = jstd;
	//$('#TPtree').jstree(true).redraw(true);
	$("#TPtree").jstree(true).refresh();
	//$('#TPtree').jstree(true).activate_node('j1_0');
	Put_Process(); 
	Put_DSE();
	//GetElmnt("WorkFolder",WorkFolder);
	//GetElmnt("ImgFolder",ImgFolder);
	GetElmnt("AFirst",AFirst);
	GetElmnt("AStep",AStep);
	//GetElmnt("TPFont",Process.Font);
	$('#A_tab').hide();$('#O_tab').hide();$('#T_tab').hide();//скрытие вкладок
	$('#tab01').prop('checked',true);
	//GetElmnt("TPDate",Process.Date);
	$('#Home_tab').show();//показ домашней владки
}
function buf_save(node){//Сохранить в буфер
	switch(node.type){
		case 'TP':break;//запрет на сохранение корневой ветки
		case 'A':{
			localStorage.removeItem('OCopy');//удалить из буфера переход
			localStorage.removeItem('NCopy');//удалить из буфера наладку
			window.localStorage.setItem('Kob', "A");//сохранить в буфер вид объекта
			var A_copy=new Object();
			ANum=A.findIndex( currentValue => currentValue.id == node.id );
			A_copy=A[ANum];
			window.localStorage.setItem('ACopy', JSON.stringify(A_copy));//сохранить в буфер операцию
			var E_copy=new Object();
			E_copy=GetSketchArr(node.id);//массив скопированных эскизов
			window.localStorage.setItem('ECopy', JSON.stringify(E_copy));//сохранить в буфер эскизы
			var N_copy=new Object();
			var Oarr=[];var Tarr=[]; var Narr=[];
			for (var i=0; i<O.length; i++){
				if(O[i].parent==A_copy.id) {
					Oarr.push(O[i]);
					N_copy=JSON.parse(JSON.stringify(GetNalArr(O[i].id)));
					if (N_copy.length!=0) Narr.push(N_copy);//массив скопированных наладок
					//var idxN=Naladka_idx(O[i].id);
					for (var j=0; j<T.length; j++){
						if (T[j].parent==O[i].id) Tarr.push(T[j])
					}
				}
			}
			if (Oarr.length>0) window.localStorage.setItem('OCopy', JSON.stringify(Oarr));//сохранить в буфер переходы
			if (Narr.length>0) window.localStorage.setItem('NCopy', JSON.stringify(Narr));//сохранить в буфер эскизы наладок
			if (Tarr.length>0) window.localStorage.setItem('TCopy', JSON.stringify(Tarr));//сохранить в буфер инструмент
		};
		MLog("Save","A",A[ANum]);
		//var Lg={}; Lg.Name="A";Lg.Value=A[ANum]; Lg.Time=CTime(); Lg.Act="Save";Log.push(Lg);
		//console.log(Lg);
		break;
		case 'O':{
			localStorage.removeItem('ACopy');//удалить из буфера операцию
			localStorage.removeItem('NCopy');//удалить из буфера наладку
			localStorage.removeItem('TCopy');//удалить из буфера инструмент
			window.localStorage.setItem('Kob', "O");//сохранить в буфер вид объекта
			var O_copy=new Object();
			ONum=O.findIndex( currentValue => currentValue.id == node.id );
			O_copy=O[ONum];
			window.localStorage.setItem('OCopy', JSON.stringify(O_copy));//сохранить в буфер переход
			var N_copy=GetNalArr(O_copy.id);
			if (N_copy.length>0) window.localStorage.setItem('NCopy', JSON.stringify(N_copy));//сохранить в буфер эскизы наладок
			var Tarr=[];
			for (var i=0; i<T.length; i++){
				if(T[i].parent==O_copy.id) {
					Tarr.push(T[i]);
				}
			}	
			if (Tarr.length>0) window.localStorage.setItem('TCopy', JSON.stringify(Tarr));//сохранить в буфер инструмент
		};
		MLog("Save","O",O[ONum]);
		//var Lg={}; Lg.Name="O";Lg.Value=O[ONum]; Lg.Time=CTime(); Lg.Act="Save";Log.push(Lg);
		//console.log(Lg);
		break;
		case 'T':{
			localStorage.removeItem('ACopy');//удалить из буфера операцию
			localStorage.removeItem('OCopy');//удалить из буфера переход
			localStorage.removeItem('NCopy');//удалить из буфера наладку
			window.localStorage.setItem('Kob', "T");//сохранить в буфер вид объекта
			var T_copy=new Object();
			TNum = T.map(function(e) { return e.id; }).indexOf(node.id);//получение индекса массива инструментов
			T_copy=T[TNum];
			window.localStorage.setItem('TCopy', JSON.stringify(T_copy));
			MLog("Save","T",T[TNum]);
			//var Lg={}; Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="Save";Log.push(Lg);
			//console.log(Lg);
		};
		break;
	}
}
function buf_load(node){//Загрузить из буфера
	switch(node.type){
		case 'TP':{
			if (localStorage.Kob=="A"){
				var A_copy = JSON.parse(localStorage.ACopy);
				var E_copy = JSON.parse(localStorage.ECopy);
				var aarr=[];
				aarr=GetONodeIdx(node.id);
				var op1=('000'+A_copy.NOP).slice(-'000'.length);
				if (A_copy.EqModel===undefined) {op2='';A_copy.EqModel='';};
				var op2=A_copy.EqModel;
				if (op2===undefined) {op2='';A_copy.EqModel='';};
				var op3=A_copy.EqFirm;
				if (op3===undefined) {op3='';A_copy.EqFirm='';};
				var op4=A_copy.Equipment;
				if (op4===undefined) {op4='';A_copy.Equipment='';};
				var op5=A_copy.Name;
				if (op5===undefined) {op5='';A_copy.Name='';};
				var Comment=op1+' '+op5+' ('+op2+' '+op3+' '+op4+')';
				$('#TPtree').jstree().create_node(node.id,{'text':Comment, 'type':'A'}, 0);
				A_copy.id=CurNode.NewId;
				A.push(Operaton=A_copy);//добавление в массив новой операции
				for (var i=0; i<E_copy.length; ++i){
						var ts=JSON.parse(JSON.stringify(E_copy[i]));
						ts.id=A_copy.id;
						arrSketch.push(ts);
				};//копирование эскизов
				ANum=A.findIndex( currentValue => currentValue.id == A_copy.id );
				MLog("Load","A",A[ANum]);
				//var Lg={}; Lg.Name="A";Lg.Value=A[ANum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
				//console.log(Lg);
				if (localStorage.OCopy===undefined) break;
				var O_copy = JSON.parse(localStorage.OCopy);
				if (O_copy.length>0){
					O_copy.sort(sort_by('num', false, parseInt));
					for (var i=0; i<O_copy.length; i++){
						O_copy[i].nop=A_copy.NOP;
						O_copy[i].parent=A_copy.id;
						$('#TPtree').jstree().create_node(A_copy.id, {'text':O_copy[i].num+'. '+O_copy[i].Content, 'type':'O'},i);
						var OldId=O_copy[i].id;
						O_copy[i].id=CurNode.NewId;
						if (localStorage.NCopy!=undefined) {
							var N_copy = JSON.parse(localStorage.NCopy);
							var x1=N_copy.length;
							if (x1==1){
								var ttn=N_copy[0];
									if (ttn[x].id==OldId) {
										ttn[x].id=CurNode.NewId;
										arrNaladki.push(ttn[x]);
									}
							}
							else{
								for (var x=0; x<x1; x++){
									var ttn1=N_copy[x];
									var ttn=ttn1[0];
									if (ttn.id==OldId) {
										ttn.id=CurNode.NewId;
										arrNaladki.push(ttn);
									}
								 }
							}
						};
						O.push(Step=O_copy[i]);//добавление в массив нового перехода
						ONum=O.findIndex( currentValue => currentValue.id == O_copy[i].id );
						MLog("Load","O",O[ONum]);
						//var Lg={}; Lg.Name="O";Lg.Value=O[ONum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
						//console.log(Lg);
						var TCopy;
						if (localStorage.TCopy!=undefined) Tcopy = JSON.parse(localStorage.TCopy);
						if (Tcopy.length>0){
							for (var j=0; j<Tcopy.length; j++){
								if(Tcopy[j].step==O_copy[i].num){
									Tcopy[j].parent=O_copy[i].id;
									var Tsym=VTS(Tcopy[j].ToolType);
									$('#TPtree').jstree().create_node(O_copy[i].id, {'text':Tsym+Tcopy[j].Designation+' '+Tcopy[j].Name+' '+Tcopy[j].Firm, 'type':'T'});
									var OldId=Tcopy[j].id;
									Tcopy[j].id=CurNode.NewId;
									T.push(Tooling=Tcopy[j]);//добавление в массив нового инструмента
									var ol=O.length-1;
									if (O[ol].KIT!==undefined){
										for (ii=0; ii<8; ii++){
											if (O[ol].KIT[ii]==OldId) {
												O[ol].KIT[ii]=Tcopy[j].id;
											}
										}
									}
									TNum=T.findIndex( currentValue => currentValue.id == Tcopy[j].id );
									MLog("Load","T",T[TNum]);
									//var Lg={}; Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
									//console.log(Lg);
								}
							}
						}
					}
				}
			}
		}
		break;
		case 'A':{
			if (localStorage.Kob=="A"){
				var A_copy = JSON.parse(localStorage.ACopy);
				var E_copy;
				if (localStorage.ECopy!=undefined)  E_copy= JSON.parse(localStorage.ECopy);
				ANum=A.findIndex( currentValue => currentValue.id == node.id );
				//A_copy.NOP=A[ANum].NOP;
				var aarr=[];
				aarr=GetONodeIdx(node.parent);
				var Apos=NodePos(aarr,node.id);
				var op1=('000'+A_copy.NOP).slice(-'000'.length);
				if (A[ANum].EqModel===undefined) {op2='';A[ANum].EqModel='';};
				var op2=A_copy.EqModel;
				if (op2===undefined) {op2='';A_copy.EqModel='';};
				var op3=A_copy.EqFirm;
				if (op3===undefined) {op3='';A_copy.EqFirm='';};
				var op4=A_copy.Equipment;
				if (op4===undefined) {op4='';A_copy.Equipment='';};
				var op5=A_copy.Name;
				if (op5===undefined) {op5='';A_copy.Name='';};
				var Comment=op1+' '+op5+' ('+op2+' '+op3+' '+op4+')';
				$('#TPtree').jstree().create_node(node.parent,{'text':Comment, 'type':'A'}, Apos+1);
				A_copy.id=CurNode.NewId;
				A.push(Operaton=A_copy);//добавление в массив новой операции
				for (var i=0; i<E_copy.length; ++i){
						var ts=JSON.parse(JSON.stringify(E_copy[i]));
						ts.id=A_copy.id;
						arrSketch.push(ts);
				};//копирование эскизов
				ANum=A.findIndex( currentValue => currentValue.id == A_copy.id );
				MLog("Load","A",A[ANum]);
				//var Lg={}; Lg.Name="A";Lg.Value=A[ANum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
				//console.log(Lg);
				if (localStorage.OCopy===undefined) break;
				var O_copy = JSON.parse(localStorage.OCopy);
				//O_copy.sort(function(a, b) { return a - b; });
				if (O_copy.length>0){
					O_copy.sort(sort_by('num', false, parseInt));
					for (var i=0; i<O_copy.length; i++){
						O_copy[i].nop=A_copy.NOP;
						O_copy[i].parent=A_copy.id;
						$('#TPtree').jstree().create_node(A_copy.id, {'text':O_copy[i].num+'. '+O_copy[i].Content, 'type':'O'},i);
						var OldId1=O_copy[i].id;
						O_copy[i].id=CurNode.NewId;
						if (localStorage.NCopy!=undefined) {
							var N_copy = JSON.parse(localStorage.NCopy);
							var x1=N_copy.length;
							if (x1==1){
								var ttn=N_copy[0];
									if (ttn[x].id==OldId1) {
										ttn[x].id=CurNode.NewId;
										arrNaladki.push(ttn[x]);
									}
							}
							else{
								for (var x=0; x<x1; x++){
									var ttn1=N_copy[x];
									var ttn=ttn1[0];
									if (ttn.id==OldId1) {
										ttn.id=CurNode.NewId;
										arrNaladki.push(ttn);
									}
								 }
							}
						};
						O.push(Step=O_copy[i]);//добавление в массив нового перехода
						ONum=O.findIndex( currentValue => currentValue.id == O_copy[i].id );
						MLog("Load","O",O[ONum]);
						//var Lg={}; Lg.Name="O";Lg.Value=O[ONum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
						//console.log(Lg);
						if (localStorage.TCopy!=undefined){
							var Tcopy = JSON.parse(localStorage.TCopy);
							if (Tcopy.length>0){
								for (var j=0; j<Tcopy.length; j++){
									if(Tcopy[j].step==O_copy[i].num){
										Tcopy[j].parent=O_copy[i].id;
										var Tsym=VTS(Tcopy[j].ToolType);
										$('#TPtree').jstree().create_node(O_copy[i].id, {'text':Tsym+Tcopy[j].Designation+' '+Tcopy[j].Name+' '+Tcopy[j].Firm, 'type':'T'});
										var OldId=Tcopy[j].id;
										Tcopy[j].id=CurNode.NewId;
										T.push(Tooling=Tcopy[j]);//добавление в массив нового инструмента
										var ol=O.length-1;
										if (O[ol].KIT!==undefined){
											for (ii=0; ii<8; ii++){
												if (O[ol].KIT[ii]==OldId) {
													O[ol].KIT[ii]=Tcopy[j].id;
												}
											}
										}
										TNum=T.findIndex( currentValue => currentValue.id == Tcopy[j].id );
									MLog("Load","T",T[TNum]);
									//var Lg={}; Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
									//console.log(Lg);
									}
								}
							}
						}
					}
				}

			}
			if (localStorage.Kob=="O"){
				var O_copy = JSON.parse(localStorage.OCopy);
				ANum=A.findIndex( currentValue => currentValue.id == node.id );
				O_copy.num=1;
				O_copy.nop=A[ANum].NOP;
				O_copy.parent=A[ANum].id;
				var oarr=[];
				oarr=GetONodeIdx(node.id);
				$('#TPtree').jstree().create_node(node.id, {'text':O_copy.num+'. '+O_copy.Content, 'type':'O'},0);
				O_copy.id=CurNode.NewId;
				if (localStorage.NCopy!=undefined) { 
					var N_copy = JSON.parse(localStorage.NCopy);
					N_copy[0].id=CurNode.NewId;
					arrNaladki.push(N_copy[0]);
				};
				O.push(Step=O_copy);//добавление в массив нового перехода
				RenameONode(node.id);
				//ONum=O.findIndex( currentValue => currentValue.id == O_copy[i].id );
				MLog("Load","O",O[ONum]);
				//var Lg={}; Lg.Name="O";Lg.Value=O[ONum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
				//console.log(Lg);
				if (localStorage.TCopy!=undefined) {
					var Tcopy = JSON.parse(localStorage.TCopy);
					if (Tcopy.length>0){
						for (var i=0; i<Tcopy.length; i++){
							Tcopy[i].parent=O_copy.id;
							Tcopy[i].step=O_copy.num;
							var Tsym=VTS(Tcopy[i].ToolType);
							$('#TPtree').jstree().create_node(O_copy.id, {'text':Tsym+Tcopy[i].Designation+' '+Tcopy[i].Name+' '+Tcopy[i].Firm, 'type':'T'});
							var OldId=Tcopy[i].id;
							Tcopy[i].id=CurNode.NewId;
							T.push(Tooling=Tcopy[i]);//добавление в массив нового инструмента
							var ol=O.length-1;
								if (O[ol].KIT!==undefined){
									for (ii=0; ii<8; ii++){
										if (O[ol].KIT[ii]==OldId) {
											O[ol].KIT[ii]=Tcopy[i].id;
										}
									}
								}
							//TNum=T.findIndex( currentValue => currentValue.id == Tcopy[j].id );
							MLog("Load","T",T[TNum]);
							//var Lg={}; Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
							//console.log(Lg);
						}
					}
				}
			}		
		}
		break;
		case 'O':{
			if (localStorage.Kob=="O"){
				var O_copy = JSON.parse(localStorage.OCopy);
				ONum=O.findIndex( currentValue => currentValue.id == node.id );
				O_copy.num=O[ONum].num+1;
				O_copy.nop=O[ONum].nop;
				O_copy.parent=O[ONum].parent;
				var oarr=[];
				oarr=GetONodeIdx(node.parent);
				var Opos=NodePos(oarr,node.id);
				$('#TPtree').jstree().create_node(node.parent, {'text':O_copy.num+'. '+O_copy.Content, 'type':'O'},Opos+1);
				O_copy.id=CurNode.NewId;
				//var N_copy = new Object;
				if (localStorage.NCopy!=undefined) {
					var N_copy=JSON.parse(localStorage.NCopy);
					N_copy[0].id=CurNode.NewId;
					arrNaladki.push(N_copy[0]);
				}
				O.push(Step=O_copy);//добавление в массив нового перехода
				RenameONode(node.parent);
				//ONum=O.findIndex( currentValue => currentValue.id == O_copy[i].id );
				MLog("Load","O",O[ONum]);
				//var Lg={}; Lg.Name="O";Lg.Value=O[ONum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
				//console.log(Lg);
				if (localStorage.TCopy!=undefined) {
				var Tcopy = JSON.parse(localStorage.TCopy);
					if (Tcopy.length>0){
						for (var i=0; i<Tcopy.length; i++){
							Tcopy[i].parent=O_copy.id;
							Tcopy[i].step=O_copy.num;
							var Tsym=VTS(Tcopy[i].ToolType);
							$('#TPtree').jstree().create_node(O_copy.id, {'text':Tsym+Tcopy[i].Designation+' '+Tcopy[i].Name+' '+Tcopy[i].Firm, 'type':'T'});
							var OldId=Tcopy[i].id;
							Tcopy[i].id=CurNode.NewId;
							T.push(Tooling=Tcopy[i]);//добавление в массив нового инструмента
								var ol=O.length-1;
									if (O[ol].KIT!==undefined){
										for (ii=0; ii<8; ii++){
											if (O[ol].KIT[ii]==OldId) {
												O[ol].KIT[ii]=Tcopy[i].id;
											}
										}
									}
							TNum=T.findIndex( currentValue => currentValue.id == Tcopy[i].id );
							MLog("Load","T",T[TNum]);
							//var Lg={}; Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
							//console.log(Lg);
						}
					}
				}
			}
			if (localStorage.Kob=="T"){
				var Tcopy = JSON.parse(localStorage.TCopy);
				ONum=O.findIndex( currentValue => currentValue.id == node.id );
				Tcopy.parent=node.id;
				Tcopy.step=O[ONum].num;
				var Tsym=VTS(Tcopy.ToolType);
				$('#TPtree').jstree().create_node(node.id, {'text':Tsym+Tcopy.Designation+' '+Tcopy.Name+' '+Tcopy.Firm, 'type':'T'},0);
				var OldId=Tcopy.id;
				Tcopy.id=CurNode.NewId;
				T.push(Tooling=Tcopy);//добавление в массив нового инструмента
									var ol=O.length-1;
									if (O[ol].KIT!==undefined){
										for (ii=0; ii<8; ii++){
											if (O[ol].KIT[ii]==OldId) {
												O[ol].KIT[ii]=Tcopy[i].id;
											}
										}
									}
				TNum=T.findIndex( currentValue => currentValue.id == Tcopy.id );
				MLog("Load","T",T[TNum]);
				//var Lg={}; Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
				//console.log(Lg);
			}
		}
		break;
		case 'T':{
			if (localStorage.Kob=="T"){
				var Tcopy = JSON.parse(localStorage.TCopy);
				ONum=O.findIndex( currentValue => currentValue.id == node.parent );
				Tcopy.parent=node.parent;
				Tcopy.step=O[ONum].num;
				var Tsym=VTS(Tcopy.ToolType);
				var tarr=[];
				tarr=GetONodeIdx(node.parent);
				var Tpos=NodePos(tarr,node.id);
				$('#TPtree').jstree().create_node(node.parent, {'text':Tsym+Tcopy.Designation+' '+Tcopy.Name+' '+Tcopy.Firm, 'type':'T'},Tpos+1);
				Tcopy.id=CurNode.NewId;
				T.push(Tooling=Tcopy);//добавление в массив нового инструмента
				TNum=T.findIndex( currentValue => currentValue.id == Tcopy.id );
				MLog("Load","T",T[TNum]);
				//var Lg={}; Lg.Name="T";Lg.Value=T[TNum]; Lg.Time=CTime(); Lg.Act="Load";Log.push(Lg);
				//console.log(Lg);
			}
		}
		break;
	}
}
function customMenu(node) {//пользовательское меню
    // The default set of all items
    var items = {
        saveItem: { // 
			"separator_before": false,
            "separator_after": false,
			"icon": 'img/icons8-сохранить-32.png',
            label: "Сохранить в буфер",
            action: function () {buf_save(node)}
        },
        loadItem: { // 
			"separator_before": false,
            "separator_after": false,
			"icon": 'img/icons8-добавить-список-32.png',
            label: "Загрузить из буфера",
			//"_disabled": function () {buf_check(node)},     // clicking the item won't do a thing
            action: function () {buf_load(node)}
        }
    };

    /*if (node.type=="TP") {// Delete menu item
        delete items.saveItem;
		//delete items.loadItem;
    }*/
	switch(node.type){
		case 'TP':{
			delete items.saveItem;
			if (localStorage.Kob=="T"||localStorage.Kob=="O") delete items.loadItem;
		}
		break;
		case 'A':{
			if (localStorage.Kob=="T") delete items.loadItem;		
		}
		break;
		case 'O':{
			if (localStorage.Kob=="A") delete items.loadItem;
		}
		break;
		case 'T':{
			if (localStorage.Kob=="A"||localStorage.Kob=="O") delete items.loadItem;
		}
		break;
	}
    return items;
}		
    // Инициализация дерева категорий с помощью jstree
    function _initTree(data) {
		var NodeCopy=false;
        var category;
        ui.$TP.jstree({
			'contextmenu' : {
				'items' : customMenu
			},
            core: {
                check_callback: function (op, node, parent, position, more){
					switch (op){
						case 'move_node':{
							if (node.type && node.type == "TP")return false;
							if (NodeCopy==true) {
								NodeCopy=false;
								return false;
								}
							else {return true};
							}
							break;
						case 'copy_node':{
							switch (node.type){
								case 'O':{
								$('#PerContent').blur();
								//PerContent_change();
								}
								break;
							}
							if (node.type && node.type == "TP")return false;
							NodeCopy=true;
							return true;
							}
							break;
						default:
							{NodeCopy=false;
								return true;
							}
					}
					/*if ((op === "move_node" || op === "copy_node")&& node.type && node.type == "TP") {
						return false;}
					if (op === "copy_node" ) {
						NodeCopy=true; 
						return true;};
					if (op === "move_node" && NodeCopy) {
						NodeCopy=false; 
						return false;};
					return true;*/
				},
                multiple: false,
                data: data
            },
			types: {
				'#' : {
				'max_children' : 1,
				'max_depth' : 4,
				'valid_children' : ['TP']
				},
				'TP' : {
				'icon' : 'img/ТП32.png',
				'valid_children' : ['A']
				},
				'A' : {
				'icon' : 'img/A32.png',
				'valid_children' : ['O']
				},
				'O' : {
				'icon' : 'img/O32.png',
				'valid_children' : ['T'] 
				},
				'T' : {
				'icon' : 'img/T32.png',
				'valid_children' : []
				}
			},
			//state : {'key':'TPTree'},
            plugins: [
			'dnd',
			//'wholerow',
			'types',
			//'state'
			'contextmenu'
			]
		//}).bind('delete_node.jstree', function(e, data) {
		/*}).bind('dehover_node.jstree', function(e, data) {
				switch (data.node.type){
					case 'O':{
						$('#PerContent').blur();
						//PerContent_change();
					}
					break;
				}*/
		/*}).bind('hover_node.jstree', function(e,data){//навести мышь
			var $node = $("#" + data.node.id);
			//var url=data.node.id;
            //$("#" + data.node.id).prop('title', url);
			//debugger
                //get the mouse position
                var y = $node.position().top + 20;
                var x = $node.position().left;
                $('.popupimg').css({ 'top': y + 'px', 'left': x + 'px' });
                $('.popupimg').attr('src', "img/болт.png");
				/*$($node)
					.on('mouseenter', function() {
						$('.popupimg').fadeIn('slow','linear');
						//$(this).addClass("hovering");
				})
					.on('mouseleave', function() {
						$('.popupimg').fadeOut();
						//$(this).removeClass("hovering");
				});*/
				/*switch(data.node.type){
					case "T":{
						$('.popupimg').fadeIn('slow','linear');
						break;
					}
					default: break;
				}
			/*setTimeout(() => {
				$("#popup").show();
			}, 2000);*/
		/*}).bind('dehover_node.jstree', function(e,data){//отвести мышь
			//$("#popup").hide();
			$('.popupimg').fadeOut('fast');*/
		}).bind('create_node.jstree', function(e, data) {//создать
			CurNode.NewId = data.node.id;
			CurNode.NewParent = data.parent;
			CurNode.NewType = data.node.type;
			//CurNode.Children=data.children;
			//$('#TPtree').jstree().active_node(data.node.id,false, false);
        }).bind('changed.jstree', function(e, data) {//изменить
			$("#popup").hide();
			//CurNode.Position = data.position;
            //category = data.node.text;
			//CurNode.isParent=data.instance.is_parent(data.node);//Check if a node has children
			if (data.node !== undefined) {CurNode.ParentId=data.node.parent;//Node Parent ID
			CurNode.Type=data.node.type;//Node Type
			CurNode.Id=data.node.id;//Node Id
			//CurNode.Children=data.node.children;
			//CurNode.ChildNum=
			switch (data.node.type){
			case 'TP': {//Home_Button();
				$('#A_tab').hide();$('#O_tab').hide();$('#T_tab').hide();//скрытие лишних вкладок
				$('#tab01').prop('checked',true);
				$('#Home_tab').show();//показ домашней владки
					var td1=Process.Doc;
					if (td1===undefined) {td1=''; Process.Doc='';};
					var td2=DSE.Name;
					if (td2===undefined) {td2=''; DSE.Name='';};
					var td3=DSE.Designation;
					if (td3===undefined) {td3=''; DSE.Designation='';};
					Comment=CurNode.Id+' '+td1+'<b>'+' ('+td2+' '+td3+')'+'</b>';
			break;};
			case 'A':  {
				$('#Home_tab').hide();$('#O_tab').hide();$('#T_tab').hide();$('#A_tab').show();
				$('#tabA1').prop('checked',true);
				//document.getElementById('NOPtxt').addEventListener("click", function () {ANew = true;});
				if (ANew==false){
				//alert(CurNode.Id);
					ANum = A.map(function(e) { return e.id; }).indexOf(CurNode.Id);//получение индекса массива операций
					if (ANum<0) break; 
					Put_ADoc(ANum);
					}
				ANew=false;
				if (ANew==false){ANum = A.map(function(e) { return e.id; }).indexOf(CurNode.Id);}//получение индекса массива операций
				};
				if (ANum<0) break;
					var op1=('000'+A[ANum].NOP).slice(-'000'.length);
					//var op1=zeroPad(v1,3);
					if (A[ANum].Name===undefined) {op2='';A[ANum].Name='';};
					var op2='<b>'+A[ANum].Name+'</b>';
					if (op2===undefined) {op2='';A[ANum].EqModel='';};
					var op3=A[ANum].EqModel;
					if (op3===undefined) {op3='';A[ANum].EqModel='';};
					var op4=A[ANum].Equipment;
					if (op4===undefined) {op4='';A[ANum].Equipment='';};
				Comment=CurNode.Id+' '+op1+' '+op2+' (<i>'+op4+' '+op3+'</i>)';
				/*$("#" + data.node.id).click(function(){
					}).mouseup(function(){
						clearTimeout(pressTimer);
						return false;
					}).mousedown(function(){
						pressTimer=window.setTimeout(function(){
						var y = $("#" + data.node.id).position().top + 20;
						var x = $("#" + data.node.id).position().left;
						$('.popupimg').css({ 'top': y + 'px', 'left': x + 'px' });
						var an = arrSketch.map(function(e) { return e.id; }).indexOf(CurNode.Id);//получение индеса массива операций
						$('.popupimg').attr('src', arrSketch[an].imgdata);
						setTimeout(() => { $('.popupimg').fadeIn('slow','linear'); }, 500);			
					},500);
					return false;										
				});*/
			break;
			case 'O':{
				$('#Home_tab').hide();$('#A_tab').hide();$('#T_tab').hide();$('#O_tab').show();/* $('input[name="tab-group3"]').attr('checked',true);*/};
				$('#tabO1').prop('checked',true);
				if (ONew===false){
					ONum = O.map(function(e) { return e.id; }).indexOf(CurNode.Id);//получение индекса массива переходов
					if (ONum<0) break;
				Put_ODoc(ONum);
				};
				ONew=false;
				if (ONew===false){ONum = O.map(function(e) { return e.id; }).indexOf(CurNode.Id);}//получение индекса массива переходов
				if (ONum<0) break;
				if (O[ONum].Content===undefined) {O[ONum].Content='';};
				Comment=CurNode.Id+'/P'+O[ONum].nop+'('+CurNode.ParentId+') '+O[ONum].num+' '+'<b><i>'+O[ONum].Content+'</i></b>';
			break;
			case 'T': {
				$('#Home_tab').hide();$('#A_tab').hide();$('#O_tab').hide();$('#T_tab').show(); /*$('input[#T_tab"]').attr('checked',true);*/};
				if (TNew===false) {
					TNum = T.map(function(e) { return e.id; }).indexOf(CurNode.Id);//получение индекса массива инструментов
					if (TNum<0) break;
					//alert(TNum);
				Put_TDoc(TNum);
				};
				TNew=false;
				if (TNew===false) {TNum = T.map(function(e) { return e.id; }).indexOf(CurNode.Id);}//получение индекса массива инструментов	
					if (TNum<0) break;
					var t1=T[TNum].Designation;
					if (t1===undefined) {t1='';T[TNum].Designation='';};
					var t2=T[TNum].Name;
					if (t2===undefined) {t2='';T[TNum].Name='';};
					var t3=T[TNum].Firm;
					if (t3===undefined) {t3='';T[TNum].Firm='';};
					Comment=CurNode.Id+'/P'+T[TNum].step+'('+T[TNum].parent+') '+'<b>'+t1+'</b>'+'<i> '+t2+'</i> '+t3;
			}
			//var newObject = new Object();
			//newObject.id = ($.isNumeric(data.node.id) ? parseInt(data.node.id) : parseInt(data.node.id.split('_')[1]));  + ' - ' + newObject.id
            //$tmp=GetPrevNode(CurNode);
			//var ww='wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww';
			ui.$comments.html(Comment);
			//data.node.id + ' P' + data.node.parent + ' - ' + data.node.type);// + '***' + A[data.node.id].NOP);
            //console.log('changed node: ', data);
			//$str = JSON.stringify(Process);
			//alert($str); 
			}
        }).bind('move_node.jstree', function(e, data) {
            var params = {
                id: data.node.id,
				old_parent: data.old_parent,
                new_parent: data.parent,
                old_position: +data.old_position,
                new_position: +data.position,
				type: data.node.type
            };
            //_moveCategory(params);
            //console.log('move_node params', params);
			//alert(params.old_position+' '+params.new_position);
			var p1=params.new_position; var par1=params.new_parent;
			var p2=params.old_position; var par2=params.old_parent;
			//alert('new '+p1+' old '+p2);
			switch(params.type){
				case 'A':{
					if (p1<p2){var i;var aa=GetANodeIdx();//вверх по дереву
							A[aa[p2].idx].Idx=p1;//alert('old='+p2+' aa[p2]='+aa[p2].idx+' A[aa[p2]].Idx='+A[aa[p2].idx].Idx);
							for (i=p1; i<p2; ++i) {A[aa[i].idx].Idx=(i+1);
							//alert('i='+i+' aa[i]='+aa[i].idx+' A[i].Idx='+A[i].Idx);
							};
					}
					else{var i; var j=p2+1; var aa=GetANodeIdx();//вниз по дереву
							//for (i=p2; i<p1; ++i) aa[i]=A[GetANodeIdx(i)].Idx;
							A[aa[p2].idx].Idx=p1;//alert(p2+' '+aa[p2]+' '+A[aa[p2]].Idx);
							//alert('old='+p2+' aa[p2]='+aa[p2].idx+' A[aa[p2]].Idx='+A[aa[p2].idx].Idx);
							for (i=p2+1; i<=p1; ++i) {A[aa[i].idx].Idx=(i-1);
							//alert('i='+i+' aa[i]='+aa[i].idx+' A[i].Idx='+A[i].Idx);
							};
							//A[GetANodeIdx(l)].Idx=p1;
					};
				};
				ANum = A.map(function(e) { return e.id; }).indexOf(params.id);//получение индекса массива операций
				MLog("Move","O",O[ONum]);
				//var Lg={}; Lg.Name="O";Lg.Value=params; Lg.Time=CTime(); Lg.Act="Move";Log.push(Lg);
				//console.log(Lg);
				break;
				case 'O':{
					var oo=GetONodeIdx(par1);
					ONum = O.map(function(e) { return e.id; }).indexOf(params.id);//получение индекса массива переходов
					//if (ONum==-1) ONum=0;
					ANum = A.map(function(e) { return e.id; }).indexOf(par1);//получение индекса массива операций
					//if (ANum==-1) ANum=0;
					if (par1 !== par2) {//переходы находятся в разных операциях
						O[ONum].parent=par1;
						O[ONum].nop=A[ANum].NOP;
						/*var n=GetONum(par2)-1;
						for (j=0; j<n; ++j) {if (oo[j].id===CurNode.Id) {var k=j}};
						for (j=n-1; j>k; --j) {O[oo[j].idx].num=O[oo[j].idx].num-1};
						oo=GetONodeIdx(par1); n=GetONum(par1)-1;
						for (j=p1; j<n; ++j) {O[oo[j].idx].num=O[oo[j].idx].num+1};
						O[ONum].parent=par1; O[ONum].num=p1+1;O[ONum].nop=A[ANum].NOP;*/
						RenameONode(par1);
						RenameONode(par2);
						RenumTNode();
					}
					else{//переходы находятся в одной операции
						/*if (p1<p2){var i;//вверх по дереву
							O[oo[p2].idx].num=p1+1;
							//$('#TPtree').jstree().rename_node(O[oo[p2].idx].Id,O[oo[p2].idx].num+'. '+O[oo[p2].idx].Content);
								for (i=p1; i<p2; ++i) {
									O[oo[i].idx].num=(i+1+1);
									RenumTNode();
									//$('#TPtree').jstree().rename_node(O[oo[p2].idx].Id,O[oo[p2].idx].num+'. '+O[oo[p2].idx].Content);
								}
						}
						else{var i; var j=p2+1;;//вниз по дереву
							O[oo[p2].idx].num=p1+1;
							//$('#TPtree').jstree().rename_node(O[oo[p2].idx].Id,O[oo[p2].idx].num+'. '+O[oo[p2].idx].Content);
								for (i=p2+1; i<=p1; ++i) {
									O[oo[i].idx].num=(i-1+1);
									RenumTNode();
									//$('#TPtree').jstree().rename_node(O[oo[p2].idx].Id,O[oo[p2].idx].num+'. '+O[oo[p2].idx].Content);
								}
						}*/
					RenameONode(par1);//RenameONode(CurNode.ParentId);
					RenameONode(par2);
					RenumTNode();
					}
				};
				MLog("Move","O",params);
				//var Lg={}; Lg.Name="O";Lg.Value=params; Lg.Time=CTime(); Lg.Act="Move";Log.push(Lg);
				//console.log(Lg);
				break;
				case 'T':{
					TNum = T.map(function(e) { return e.id; }).indexOf(params.id);//получение индекса массива инструментов
					//if (TNum==-1) TNum=0;
					ONum = O.map(function(e) { return e.id; }).indexOf(par1);//получение индекса массива переходов
					//if (ONum==-1) ONum=0;
					T[TNum].parent=par1;
					T[TNum].step=O[ONum].num;
					//RenumTNode();
					MLog("Move","T",params);
					//var Lg={}; Lg.Name="T";Lg.Value=params; Lg.Time=CTime(); Lg.Act="Move";Log.push(Lg);
					//console.log(Lg);
				}
			};
        }).bind('copy_node.jstree', function(e, data) {
            var params = {
                id: data.node.id,
				oldid:data.original.id,
                new_parent: data.parent,
				old_parent: data.old_parent,
                new_position: data.position,
				old_position: data.old_position,
				text: data.node.text,
				type: data.node.type
            };
            //_copyCategory(params);
            //console.log('copy_node params', params);
			var p1=params.new_position; var par1=params.new_parent;
			var p2=params.old_position; var par2=params.old_parent;		
			switch(params.type){//CurNode.Type){
				case 'A':{
					if (p1<p2){var i;var aa=GetONodeIdx(par1);//вверх по дереву
						var Acopy = JSON.parse(JSON.stringify(A[aa[p2-1].idx]));//создание независимой копии объекта
						for (i=p1; i<p2; ++i) {A[aa[i].idx].Idx=(i+1);
						};
					}
					else{var i;  var aa=GetONodeIdx(par1); var j=aa.length-1;//вниз по дереву
						var Acopy = JSON.parse(JSON.stringify(A[aa[p2].idx]));//создание независимой копии объекта
						for (i=p1; i<j; ++i) {
							var ti=aa[i].idx;
							A[ti].Idx=(i+1);
						};
					};
					var OldAid=Acopy.id;
					Acopy.id=params.id;//корректировка id объекта
					A.splice(p1,0,Operaton=Acopy);//вставка элемента массива
					A[p1].Idx=p1;//корректировка индекса объекта
					arrTempS=GetSketchArr(OldAid);//массив скопированных эскизов
					for (i=0; i<arrTempS.length; ++i){
						var ts=JSON.parse(JSON.stringify(arrTempS[i]));
						ts.id=params.id;
						arrSketch.push(ts);
					};//копирование эскизов
					//var d1={};
					//d1=JSON.parse(JSON.stringify(data.new_instance._model.data));//дерево
					//delete d1['#'];
					var d2={};d3={};d4={};d5={};
					d2=data.new_instance._model.data[OldAid].children;//скопированные переходы
					for (var prop in d2) {d3[prop]={id:d2[prop],T:data.new_instance._model.data[d2[prop]].children}};//скопированные переходы и инструмент
					d4=data.new_instance._model.data[Acopy.id].children;//новые переходы
					for (var prop in d4) {d5[prop]={id:d4[prop],T:data.new_instance._model.data[d4[prop]].children}};//новые переходы и инструмент
					for (const [key, value] of Object.entries(d3)){
						//console.log(`${key} ${value}`);
						ONum = O.map(function(e) { return e.id; }).indexOf(value['id']);//получение индекса массива переходов
						var Ocopy = JSON.parse(JSON.stringify(O[ONum]));//создание независимой копии объекта
						Ocopy.id=d4[key];
						Ocopy.parent=Acopy.id;
						O.push(Step=Ocopy);//добавление в массив нового перехода
						var idxN=Naladka_idx(d2[key]);
						if (arrNaladki[idxN]!=undefined) {
							var NalCopy=JSON.parse(JSON.stringify(arrNaladki[idxN]));
							NalCopy.id=d4[key];
							arrNaladki.push(NalCopy);
						};
							for (const [key2, value2] of Object.entries(value['T'])) {
								var cn=d5[key]['T'][key2];
								TNum = T.map(function(e) { return e.id; }).indexOf(value2);//получение индекса массива переходов
								var Tcopy = JSON.parse(JSON.stringify(T[TNum]));//создание независимой копии объекта
								Tcopy.id=cn;
								Tcopy.parent=Ocopy.id;
								T.push(Step=Tcopy);//добавление в массив нового инструмента
									var ol=O.length-1;
									if (O[ol].KIT!==undefined){
										for (ii=0; ii<8; ii++){
											if (O[ol].KIT[ii]==value2) {
												O[ol].KIT[ii]=Tcopy.id;
											}
										}
									}
							};
					};
					RenumTNode();
				};
				ANum = A.map(function(e) { return e.id; }).indexOf(params.id);//получение индекса массива операций
				MLog("Copy","A",params);
				//var Lg={}; Lg.Name="A";Lg.Value=params; Lg.Time=CTime(); Lg.Act="Copy";Log.push(Lg);
				//console.log(Lg);
				break;
				case 'O':{
					ANum = A.map(function(e) { return e.id; }).indexOf(par1);//получение индекса массива операций
					ONum = O.map(function(e) { return e.id; }).indexOf(params.oldid);//получение индекса массива переходов
					//if (ONum==-1) ONum=0;
					var d=$("#TPtree").jstree(true)._model.data[params.id].children_d[0];
					if (d!=undefined) var mti=parseInt(d.split('_')[1])-1; else var mti=0;
					var tl=T.length;//общее количество инструментов
					if (par1 !== par2) {//переходы находятся в разных операциях
						var oo=GetONodeIdx(par1); //таблица переходов новой родительской операции
						var n=oo.length;//количество переходов в новой родительской операции
						for (var j=p1; j<n; ++j) {O[oo[j].idx].num=O[oo[j].idx].num+1};//увеличение нумерации последующих переходов
						var Ocopy = JSON.parse(JSON.stringify(O[ONum]));//создание независимой копии объекта
						Ocopy.id=params.id;//новый id
						Ocopy.parent=par1;//новый родитель
						Ocopy.num=p1+1;
						Ocopy.nop=A[ANum].NOP;
						O.push(Step=Ocopy);//добавление в массив нового перехода
						var idxN=Naladka_idx(params.oldid);
						if (arrNaladki[idxN]!=undefined) {
							var NalCopy=JSON.parse(JSON.stringify(arrNaladki[idxN]));
							NalCopy.id=params.id;
							arrNaladki.push(NalCopy);
						};
						var nTid=mti; //parseInt(params.id.split('_')[1]);
							for (var m=0; m<tl; ++m){
								if (T[m].parent===O[ONum].id) {
									var Tcopy = JSON.parse(JSON.stringify(T[m]));//создание независимой копии объекта
									nTid=nTid+1;
									Tcopy.id='j1_'+nTid;
									Tcopy.parent=Ocopy.id;
									T.push(Tooling=Tcopy);//добавление в массив нового инструмента
									var ol=O.length-1;
									if (O[ol].KIT!==undefined){
										for (ii=0; ii<8; ii++){
											if (O[ol].KIT[ii]==T[m].id) {
												O[ol].KIT[ii]=Tcopy.id;
											}
										}
									}
								};
							};
						//RenameONode(par1);//ренумерация переходов
					}
					else{//переходы находятся в одной операции
						if (p1<p2){var i;//вверх по дереву
						var oo=GetONodeIdx(par1); //таблица переходов 
							for (i=p1; i<p2; ++i) {
								O[oo[i].idx].num=(i+1+1);
							}
						}
						else{//вниз по дереву
							var oo=GetONodeIdx(par1); //таблица переходов
							for (var i=p2; i<oo.length-1; ++i) {
								O[oo[i].idx].num=(i+1);
							}
						}
						var Ocopy = JSON.parse(JSON.stringify(O[ONum]));//создание независимой копии объекта
						Ocopy.id=params.id;//новый id
						Ocopy.num=p1+1;
						O.push(Step=Ocopy);//добавление в массив нового перехода
						var idxN=Naladka_idx(params.oldid);
						if (arrNaladki[idxN]!=undefined) {
							var NalCopy=JSON.parse(JSON.stringify(arrNaladki[idxN]));
							NalCopy.id=params.id;
							arrNaladki.push(NalCopy);
						};
						var Toldch=[];
						Toldch=data.original.children;//список копируемых инструментов
						var nTid=mti;//=parseInt(params.id.split('_')[1]);
						$.each( Toldch, function( key, data ){//перебор инструмента копируемого перехода
							$.each( T, function( key1, data1 ){//перебор инструмента 
								if(data1.id==data) {
									var Tcopy = JSON.parse(JSON.stringify(T[key1]));//создание независимой копии объекта
									nTid=nTid+1;
									Tcopy.id='j1_'+nTid;
									Tcopy.parent=Ocopy.id;
									T.push(Tooling=Tcopy);//добавление в массив нового инструмента
									var ol=O.length-1;
									if (O[ol].KIT!==undefined){
										for (ii=0; ii<8; ii++){
											if (O[ol].KIT[ii]==data) {
												O[ol].KIT[ii]=Tcopy.id;
											}
										}
									}
								}
							})
						} )
						
							/*for (var m=0; m<tl; ++m){
								if (T[m].parent===O[ONum].id) {
									var Tcopy = JSON.parse(JSON.stringify(T[m]));//создание независимой копии объекта
									nTid=nTid+1;
									Tcopy.id='j1_'+nTid;
									Tcopy.parent=Ocopy.id;
									T.push(Tooling=Tcopy);//добавление в массив нового инструмента
								};
							};*/
						//RenameONode(par2);//ренумерация переходов
					}
				RenameONode(par1);
				RenameONode(par2);
				RenumTNode();
				};
				MLog("Copy","O",params);
				//var Lg={}; Lg.Name="O";Lg.Value=params; Lg.Time=CTime(); Lg.Act="Copy";Log.push(Lg);
				//console.log(Lg);
				break;
				case 'T':{
					if (params.oldid==params.id) TNum = T.map(function(e) { return e.id; }).indexOf(params.id);//получение индекса массива инструментов
					if (params.oldid!=params.id) TNum = T.map(function(e) { return e.id; }).indexOf(params.oldid);//получение индекса массива инструментов
					//if (TNum==-1) TNum=0;
					var Tcopy = JSON.parse(JSON.stringify(T[TNum]));//создание независимой копии объекта
					Tcopy.parent=par1;
					Tcopy.id=params.id;
					T.push(Tooling=Tcopy);//добавление в массив нового инструмента
					//RenumTNode();
					//T[TNum].parent=par1;
					MLog("Copy","T",params);
					//var Lg={}; Lg.Name="T";Lg.Value=params; Lg.Time=CTime(); Lg.Act="Copy";Log.push(Lg);
					//console.log(Lg);
				}
			};
        });
    }

    // Инициализация приложения
    function init() {
    //    _loadData();
	_initTree();
	//$temp=$('#TPtree').jstree().get_node('#').text;
	//alert($temp);
	//if ($temp===undefined)  {
	$('#TPtree').jstree().create_node('#', {'text':'Новый техпроцесс','id':'j1_0', 'type':'TP'});
	//$('#TPtree').jstree().activate_node('j1_0');
	GetElmnt("TPDate",Process.Date);
	$('#A_tab').hide();$('#O_tab').hide();$('#T_tab').hide();//скрытие вкладок
    }
    
    // Экспортируем наружу
    return {
        init: init
    } 

})(jQuery);

jQuery(document).ready(app.init);