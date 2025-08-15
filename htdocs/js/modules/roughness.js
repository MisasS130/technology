'use strict';
var res;
var Ra1=["0.012","0.025","0.05","0.1","0.2","0.4","0.8","1.6","3.2","6.3","12.5","25","50","100"];
var Ra2=["0.008","0.01","0.012","0.016","0.02","0.025","0.032","0.04","0.05","0.063","0.08","0.1","0.125","0.16","0.2","0.25","0.32","0.4","0.5","0.63","0.8","1","1.25","1.6","2","2.5","3.2","4","5","6.3","8","10","12.5","16","20","25","32","40","50","63","80","100"];
var Rz1=["0.025","0.05","0.1","0.2","0.4","0.8","1.6","3.2","6.3","12.5","25","50","100","200","400"];
var Rz2=["0.025","0.032","0.04","0.05","0.063","0.08","0.1","0.125","0.16","0.2","0.25","0.32","0.4","0.5","0.63","0.8","1","1.25","1.6","2","2.5","3.2","4","5","6.3","8","10","12.5","16","20","25","32","40","50","63","80","100","125","160","200","250","320","400","500","630","800","1000","1250","1600"];
var Sm=["0.002","0.003","0.004","0.005","0.006","0.008","0.01","0.0125","0.016","0.02","0.025","0.032","0.04","0.05","0.063","0.08","0.1","0.125","0.16","0.2","0.25","0.32","0.4","0.5","0.63","0.8","1","1.25","1.6","2","2.5","3.2","4","5","6.3","8","10","12.5"]; 
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
R_type.addEventListener('change', function(evt){//опрос радиокнопки Ra, Rz
  let descriptionId = evt.target.defaultValue;
  TypeSelect(descriptionId);
});
PrChk.addEventListener('change', function(evt){//опрос чекбокса предпочтительные значения
  let descriptionId = $('input[name="rtype"]:checked').val();
  TypeSelect(descriptionId);
});
function R_out(){
	if ($('#lSelectId').val()=="") {
		var R1="";
	} 
	else {
		var R1=$('#lSelectId').val()+"/";
	}
	res=R1+$('input[name="rtype"]:checked').val() +" "+ $("#R_Select").val()+$('#nSelectId').val();
	$('#footer').html("<big><big>"+ res);
}	
function TypeSelect(v){//выбор Ra Rz		
		var objSel = document.getElementById("R_Select");
		objSel.options.length = 0;//стираем
	switch(v){
	case "Ra": //Ra
		if ($("#PrChk").is(':checked')) {
			for (var i = 0; i < 14; i++) {
				objSel.options[objSel.options.length] = new Option(Ra1[i], Ra1[i]);
			}
		}
		else{
			for (var i = 0; i < 42; i++) {
				objSel.options[objSel.options.length] = new Option(Ra2[i], Ra2[i]);
			}
		}
		break;
	case "Rz":	//Rz
	case "Rmax":	//Rmax
		if ($("#PrChk").is(':checked')) {
			for (var i = 0; i < 15; i++) {
				objSel.options[objSel.options.length] = new Option(Rz1[i], Rz1[i]);
			}
		}
		else{
			for (var i = 0; i < 49; i++) {
				objSel.options[objSel.options.length] = new Option(Rz2[i], Rz2[i]);
			}
		}
		break;
	case "Sm":	//Sm
	case "S":	//S
		for (var i = 0; i < 38; i++) {
				objSel.options[objSel.options.length] = new Option(Sm[i], Sm[i]);
		}
		break;
	}
	R_out();
}  
$('#TCopy').click(function(){//кнопка копировать
	if(res==undefined) return;
	copyToClipboard(res);
}); 
    // Инициализация приложения
    function init() {
		$('#PrChk').prop('checked', true);
		TypeSelect("Ra");
		document.getElementById('R_Select').addEventListener('change', function() {//значение
			R_out();
		})
		document.getElementById('nSelectId').addEventListener('change', function() {//допуск
			R_out();
		})
		document.getElementById('lSelectId').addEventListener('change', function() {//базовая длина
			R_out();
		})
		
    } 
    // Экспортируем наружу
    return {
        init: init
    }    

})(jQuery);

jQuery(document).ready(app.init);