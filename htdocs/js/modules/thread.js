'use strict';
//var sharedObject=window.opener.sharedObject;
var res={};
var tt='0', ts=0, d=0.25, s=0.075, tf=1, z=1, td='', t, dd='0.25';
var d1=[];
var d2=[];
var d3=[]; 
var d4=[]; 
var ei=[];
var es=[];
var ei1=[]; 
var es1=[]; 
var ei2=[];
var es2=[];
var ei3=[]; 
var es3=[];
var ei4=[]; 
var es4=[];
// function to set a given theme/color-scheme
function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            document.documentElement.className = themeName;
}
// Immediately invoked function to set the theme on initial load
(function () {
            if (localStorage.getItem('theme') === 'theme-dark') {
                setTheme('theme-dark');
            } else {
                setTheme('theme-light');
            }
})();
// Модуль приложения
var app = (function($) {

    // Инициализируем нужные переменные
    var ajaxUrl = 'php/thread.php';
	window.copyToClipboard = function(text) {
  // IE specific
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);
  }

  // all other modern
  let target = document.createElement("textarea");
  target.style.position = "absolute";
  target.style.left = "-9999px";
  target.style.top = "0";
  target.textContent = text;
  document.body.appendChild(target);
  target.focus();
  target.setSelectionRange(0, target.value.length);

  // copy the selection of fall back to prompt
  try {
    document.execCommand("copy");
    target.remove();
    console.log('Copied to clipboard: "'+text+'"');
  } catch(e) {
    console.log("Can't copy string on this browser. Try to use Chrome, Firefox or Opera.")
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }
}
Thread_kind.addEventListener('change', function(evt){//опрос радиокнопки наружная или внутренняя
  let descriptionId = evt.target.defaultValue;
  tf=descriptionId;
  	if ((Number(tt)<6)||(tt=='9')) {
		loadMT(tt, tf, s, d);
	}
	else{
		document.getElementById("tSelectId").options.length=0;
	}
});
Direct.addEventListener('change', function(evt){//опрос радиокнопки правая или левая
  let descriptionId = evt.target.defaultValue;
  td=descriptionId;
  printt();
});
Step.addEventListener('change', function(evt){//опрос радиокнопки крупный или мелкий шаг
  let descriptionId = evt.target.defaultValue;
  ts=descriptionId;
  loadMD(tt, ts)
});
function loadMD(tt, ts){//загрузка списка диаметров резьбы
	var param={};
	param[0]=tt;//тип резьбы
	param[1]=ts;//шаг крупный или мелкий
	var data = $.extend(param, {
        action:'Thread_kind'
    })
	$.ajax({
        url: ajaxUrl,
		data: data, 
		dataType: 'json',
        success: function(resp) {
            if (resp.code === 'success') {
                res=resp.result;
				if (res!=null) {
					Dnew(res);
					d=document.getElementById('dSelectId').value;
					dd=$('#dSelectId').find(":selected").text();
					loadMS(tt, ts, d);
				}
				else{
						$('#footer').html('нет данных о диаметре');
				}
            } 
			else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
            }
        },
            error: function(error) {
                console.error('Ошибка: ', error);
			}
    });
}
function loadMS(tt, ts, d){//загрузка списка шагов резьбы
	var param={};
	param[0]=tt;//тип резьбы
	param[1]=ts;//шаг крупный или мелкий
	param[2]=d;//диаметр резьбы
	var data = $.extend(param, {
        action:'selectd'
    })
	$.ajax({
        url: ajaxUrl,
		data: data, 
		dataType: 'json',
        success: function(resp) {
            if (resp.code === 'success') {
                res=resp.result;
				if (res.length!=0) {
					Snew(res);
					s=document.getElementById('sSelectId').value;
					loadMT(tt, tf, s, d);
					if (tt=='3') loadMZ( s, d); 
					printt()
				}
				else{
					Snew(res);
					$('#footer').html('нет данных о шаге');
				}
            } 
			else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
            }
        },
            error: function(error) {
                console.error('Ошибка: ', error);
			}
    });
}
function loadMT(tt, tf, s, d){//загрузка списка допусков резьбы
	var param={};
	param[0]=tt;//тип резьбы
	param[1]=tf;//тип формы резьбы наружная или внутренняя
	param[2]=s;//шаг 
	param[3]=d;//диаметр резьбы
	var data = $.extend(param, {
        action:'selects'
    })
	$.ajax({
        url: ajaxUrl,
		data: data, 
		dataType: 'json',
        success: function(resp) {
            if (resp.code === 'success') {
                res=resp.result;
				if (res.length!=0) {
					Tnew(res);
					if (tf==1) {
						$("#tSelectId option[value='6g']").attr("selected",true).trigger("change");
					}
					else{
						$("#tSelectId option[value='6H']").attr("selected",true).trigger("change");
					}
					t=document.getElementById('tSelectId').value;
					printt()
				}
				else{
					Tnew(res);
					//$('#footer').html('нет данных о допуске');
				}
            } 
			else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
            }
        },
            error: function(error) {
                console.error('Ошибка: ', error);
			}
    });
}
function loadMZ( s, d){//загрузка списка заходов резьбы
	var param={};
	param[0]=s;//шаг 
	param[1]=d;//диаметр резьбы
	var data = $.extend(param, {
        action:'selectz'
    })
	$.ajax({
        url: ajaxUrl,
		data: data, 
		dataType: 'json',
        success: function(resp) {
            if (resp.code === 'success') {
                res=resp.result;
				if (res.length!=0) {
					Znew(res);
					z=document.getElementById('zSelectId').value;
					printt()
				}
				else{
					Znew(res);
					$('#footer').html('нет данных о количестве заходов');
				}
            } 
			else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
            }
        },
            error: function(error) {
                console.error('Ошибка: ', error);
			}
    });
}
function Dnew(data){
	var objSel = document.getElementById("dSelectId");//список диаметров
	objSel.options.length = 0;//стираем
	var len=data.length;
	for (var i = 0; i < len; i++) {
		if (data[i][1]==null) data[i][1]=data[i][0];
		objSel.options[objSel.options.length] = new Option(data[i][1],data[i][0]);
	}
}
function Snew(data){
	var objSel = document.getElementById("sSelectId");//список шагов
	objSel.options.length = 0;//стираем
	var len=data.length;
	for (var i = 0; i < len; i++) {
		objSel.options[objSel.options.length] = new Option(data[i][0],data[i][0]);
		d1[i]=data[i][1];
		d2[i]=data[i][2];
		d3[i]=data[i][3];
		d4[i]=data[i][4];
	}
} 
function Tnew(data){
	var objSel = document.getElementById("tSelectId");//список допусков
	objSel.options.length = 0;//стираем
	var len=data.length;
	for (var i = 0; i < len; i++) {
		objSel.options[objSel.options.length] = new Option(data[i][0],data[i][0]);
		ei[i]=data[i][1];
		es[i]=data[i][2];
		ei1[i]=data[i][3];
		es1[i]=data[i][4];
		ei2[i]=data[i][5];
		es2[i]=data[i][6];
		ei3[i]=data[i][7];
		es3[i]=data[i][8];
		ei4[i]=data[i][9];
		es4[i]=data[i][10];
	}
}
function Znew(data){
	var objSel = document.getElementById("zSelectId");//список заходов
	objSel.options.length = 0;//стираем
	var len=data.length;
	for (var i = 0; i < len; i++) {
		objSel.options[objSel.options.length] = new Option(data[i],data[i]);0
	}
}
function TTC(tt) {
	var gost='';
	var thread;
	var zt;
	var st='';
	d=document.getElementById('dSelectId').value;
	dd=$('#dSelectId').find(":selected").text();
	s=document.getElementById('sSelectId').value;
	t=document.getElementById('tSelectId').value;
	z=document.getElementById('zSelectId').value;
	var i1=document.getElementById('sSelectId').selectedIndex
	var dd1=d1[i1];
	var dd2=d2[i1];
	var dd3=d3[i1];
	var dd4=d4[i1];
	var i2=document.getElementById('tSelectId').selectedIndex
	var ei_d=es[i2];
	var es_d=ei[i2];
	var ei_d1=es1[i2];
	var es_d1=ei1[i2];
	var ei_d2=es2[i2];
	var es_d2=ei2[i2];
	var ei_d3=es3[i2];
	var es_d3=ei3[i2];
	var ei_d4=es4[i2];
	var es_d4=ei4[i2];	
	if (ts=='1') st='x'+s;
		if (Number(z)>0) {
			zt=' P('+z+')';
		}
		else{
			zt='';
		}
	switch (tt) {
	case '0':
		thread='M'+d+st+zt+td+'-'+t;
		break;
	case '9':
		thread='MJ'+d+st+td+'-'+t;
		break;
	case '2':
		st='x'+s
		thread='Tr '+d+st+' '+td+'-'+t;
		break;
	case '3':
		st='x'+s;
		thread='Tr '+d+st+zt+' '+td+'-'+t;
		break;
	case '4':
		st='x'+s;
		thread='S'+d+st+zt+' '+td+'-'+t;
		break;
	case '10':
		st='x'+s;
		thread='S45° '+d+st+zt+' '+td;
		break;
	case '5':
		thread='G '+' '+dd+'-'+t;
		break;
	case '7':
		thread='Rc '+' '+dd;
		break;
	case '6':
		thread='MK'+d+st+td+" ГОСТ 25229-82";
		break;
	case '8':
		thread='K'+dd+" ГОСТ 6111-62";
		break;
	case '11':
		thread='Кр'+d+st+" ГОСТ 13536-68";
		break;
	}
	return [thread, dd1, dd2, dd3, dd4, es_d, ei_d, es_d1, ei_d1, es_d2, ei_d2, es_d3, ei_d3, es_d4, ei_d4 ];
}
function printt(){
	var pd="<br/><big>"+"Наружный ø"+d+"(<span><sup>"+(TTC(tt)[6]*0.001).toFixed(3)+"</sup><sub>"+(TTC(tt)[5]*0.001).toFixed(3)+"</sub></span>)</big>";
	var pd1="<br/><big>"+"Внутренний ø"+TTC(tt)[1]+"(<span><sup>"+(TTC(tt)[8]*0.001).toFixed(3)+"</sup><sub>"+(TTC(tt)[7]*0.001).toFixed(3)+"</sub></span>)</big>";
	var pd2="<br/><big>"+"Средний ø"+TTC(tt)[2]+"(<span><sup>"+(TTC(tt)[10]*0.001).toFixed(3)+"</sup><sub>"+(TTC(tt)[9]*0.001).toFixed(3)+"</sub></span>)</big>";
	var pd3="<br/><big>"+"d3="+TTC(tt)[3]+"("+(TTC(tt)[12]*0.001).toFixed(3)+"/"+(TTC(tt)[11]*0.001).toFixed(3)+")"+"</big>";
	if (tf=="0") {$('#footer').html("<big><big>"+TTC(tt)[0]+"</big></big>"+pd1+"<br>"+pd2);}
	else {$('#footer').html("<big><big>"+TTC(tt)[0]+"</big></big>"+pd+"<br>"+pd2);}
}
$('#TCopy').click(function(){//кнопка копировать
	copyToClipboard(TTC(tt)[0]);
}); 
    // Инициализация приложения
    function init() {
		loadMD(tt, ts);
		document.getElementById('Thread_type').addEventListener('change', function() {//изменение типа резьбы
			tt = this.value;
			if (tt!='0') {
				$('#Step').hide();
			}
			else {
				$('#Step').show();
			}
			if (tt!='3') document.getElementById("zSelectId").options.length=0;
			loadMD(tt, ts);
		})
		document.getElementById('dSelectId').addEventListener('change', function() {//изменение диаметра
			d = this.value;
			loadMS(tt, ts, d);
		})
		document.getElementById('sSelectId').addEventListener('change', function() {//изменение шага
			s = this.value;
			loadMT(tt, tf, s, d);
		})	
		document.getElementById('tSelectId').addEventListener('change', function() {//изменение допуска
			t = this.value;
			printt()
		})
		document.getElementById('zSelectId').addEventListener('change', function() {//изменение количества заходов
			z = this.value;
			printt()
		})
    } 
    // Экспортируем наружу
    return {
        init: init
    }    

})(jQuery);

jQuery(document).ready(app.init);