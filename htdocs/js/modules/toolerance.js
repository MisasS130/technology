'use strict';
//var sharedObject=window.opener.sharedObject;
var res={};
var d, l="H", t="14", f='2';
var SIT=["a","b","c","cd","d","de","e","ef","f","fg","g","h","j","js","k","m","n","p","r","s","t","u","v","x","y","z","za","zb","zc"];
var HIT=["A","B","C","CD","D","DE","E","EF","F","FG","G","H","J","JS","K","M","N","P","R","S","T","U","V","X","Y","Z","ZA","ZB","ZC"];
var dig=["01","0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"];
var HIT2=["А"];
var SIT2=["В","Г","Гр","Д","Л","Н","П","Пл","Пр","Пр1","Пр2","Пр3","С","Т","Тх","Х","Ш"];
var dig2=["1","2","2а","3","3а","4","5","7","8","9"];   
var HIT3=["f","m","c","v","t1","t2","t3","t4"];

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
    var ajaxUrl = 'php/toolerance.php';
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
ISO_check.addEventListener('change', function(evt){//опрос радиокнопки ISO или ОСТ
  let descriptionId = $('input[name="itype"]:checked').val();
  TypeSelect(descriptionId);
});
search_f.addEventListener('change', function(evt){//опрос радиокнопки вал или отверстие
  let descriptionId = evt.target.defaultValue;
  TypeSelect(descriptionId);
});
	// Загрузка с сервера
function _loadData(d,l,t,f) {
	var param={};
	var act=$('input[name="ctype"]:checked').val();
	//if (act=="ISO") {t=t-1};
	param[0]=d; param[1]=l; param[2]=t; param[3]=f; 
	var data = $.extend(param, {
            action: act,
			size: d,
			toolerance: l,
			IT: t,
			type:f
    });
	if(data!=undefined){
        $.ajax({
            url: ajaxUrl,
			data: data, 
			dataType: 'json',
            success: function(resp) {
                if (resp.code === 'success') {
                    res=resp.result;
					if (res!=null) {
						if(res['es']>0)res['es']='+'+res['es'];
						if(res['ei']>0)res['ei']='+'+res['ei'];
						$('#footer').html("<big><big>"+d+"(<span><sup>"+res['es']+"</sup><sub>"+res['ei']+"</sub></span>)</big></big>");
					}
					else{
						$('#footer').html('нет данных');
					}
                } else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
                }
            },
            error: function(error) {
                console.error('Ошибка: ', error);
            }
        });
	}	
} 
function TypeSelect(v){//выбор вал или отверстие		
		var objSel = document.getElementById("iSelectId");
		var objSel2 = document.getElementById("nSelectId");
		objSel.options.length = 0;//стираем
		objSel2.options.length = 0;//стираем
		var iso_c=$("#ISO").is(':checked');
	switch(iso_c){
	case true: //ISO
		for (var i = 0; i < 20; i++) {
			objSel2.options[objSel2.options.length] = new Option(dig[i], dig[i]);
		}
		$("#nSelectId option[value='14']").attr("selected",true).trigger("change");t=14;
		for (var i = 0; i < 29; i++) {
			if (v=="val"){
				//Создаем новый объект Option и заносим его в коллекцию options
				objSel.options[objSel.options.length] = new Option(SIT[i], SIT[i]);
			}
			if (v=="otv"){
				//Создаем новый объект Option и заносим его в коллекцию options
				objSel.options[objSel.options.length] = new Option(HIT[i], HIT[i]);
			}
		}
		if (v=="val") {$("#iSelectId option[value='h']").attr("selected",true).trigger("change");f="1";l="h"}
		if (v=="otv") {$("#iSelectId option[value='H']").attr("selected",true).trigger("change");f="2";l="H"}
		if(d!=undefined) _loadData(d,l,t,f);
		break;
	case false:	//ОСТ
		for (var i = 0; i < 10; i++) {
			objSel2.options[objSel2.options.length] = new Option(dig2[i], i);t=7;
		}
		$("#nSelectId option[value='7']").attr("selected",true).trigger("change");		
		switch(v){
			case "val":
				for (var i = 0; i < 17; i++) {
					objSel.options[objSel.options.length] = new Option(SIT2[i], SIT2[i]);
				}
			break;
			case "otv":
				objSel.options[objSel.options.length] = new Option(HIT2[0], HIT2[0]);
			break;
		}
		if (v=="val") {$("#iSelectId option[value='В']").attr("selected",true).trigger("change");f="1";l="В"}
		if (v=="otv") {$("#iSelectId option[value='А']").attr("selected",true).trigger("change");f="2";l="А"}
		if(d!=undefined) _loadData(d,l,t,f);
		break;
	}
}  
$('#TCopy').click(function(){//кнопка копировать
	if(res==undefined) return;
	if (res['es']==0) copyToClipboard(d+"("+res['ei']+")");
	if (res['ei']==0) copyToClipboard(d+"("+res['es']+")");
	if (l=='JS'||l=='js'){
		copyToClipboard(d+"±"+res['es'].replace("+",""));
	}
	else{
	if ((res['es']!=0)&&(res['ei']!=0))copyToClipboard(d+"("+res['es']+"/"+res['ei']+")");
	}
}); 
    // Инициализация приложения
    function init() {
		TypeSelect("otv");
		$("#iSelectId option[value='H']").attr("selected",true).trigger("change");
		var objSel = document.getElementById("nSelectId");
		objSel.options.length = 0;//стираем
		var to = false;
		for (var i = 0; i < 20; i++) {
			objSel.options[objSel.options.length] = new Option(dig[i], i);
		}
		$("#nSelectId option[value='15']").attr("selected",true).trigger("change");
		$('#digit').keyup(function () {//номинальное значение размера
			if(to) { clearTimeout(to); }
			to = setTimeout(function () {
				d = $('#digit').val();
				if(d!=undefined) _loadData(d,l,t,f);
			}, 250);
		});
		$('#digit').click (function () {
			d = $('#digit').val();
			if(d!=undefined) _loadData(d,l,t,f);
		});
		document.getElementById('iSelectId').addEventListener('change', function() {//допуск
			l = this.value;
			if(d!=undefined) _loadData(d,l,t,f);
		})
		document.getElementById('nSelectId').addEventListener('change', function() {//квалитет
			t = this.selectedIndex;
			if ($('input[name="ctype"]:checked').val()=="ISO") {t=t-1}
			if(d!=undefined) _loadData(d,l,t,f);
		})
		
    } 
    // Экспортируем наружу
    return {
        init: init
    }    

})(jQuery);

jQuery(document).ready(app.init);