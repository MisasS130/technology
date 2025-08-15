'use strict';
var yourObject = JSON.parse(window.localStorage.getItem('ProfKey'));//передача поля профессия из основного окна
var sharedObject=window.opener.sharedObject;
var profdata={};
// function to set a given theme/color-scheme
function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            document.documentElement.className = themeName;
}
function Onclk_Select(){
	var sel=document.getElementById("mySelectId").selectedIndex;
	var options=document.getElementById("mySelectId").options;
	sharedObject.var1=options[sel].value;
	sharedObject.var2=options[sel].text;
	var p=document.getElementById("footer");
	p.innerHTML=sharedObject.var1+' '+sharedObject.var2;
}

function OkBut_change(){
	window.opener.document.getElementById("KP").value=sharedObject.var1;
	window.opener.document.getElementById("Prof").value=sharedObject.var2;
	window.opener.KP_change();
	window.opener.Prof_change();
	window.close();
	//alert(sharedObject.var1+' '+sharedObject.var2);
}
function TreeSearch(searchtxt){		
		var objSel = document.getElementById("mySelectId");
		objSel.options.length = 0;//стираем
		for (var i = 0; i < profdata.length; i++) {
			var z = profdata[i];
			var ntxt=z["Name"];
			var result= ntxt.toLowerCase().indexOf( searchtxt.toLowerCase() );
			//if (result>=0) alert(result+" z[text] = " + z["text"]);
				if (result>=0){
					//Создаем новый объект Option и заносим его в коллекцию options
					objSel.options[objSel.options.length] = new Option(ntxt, z["Code"]);
				}
		}
}
    

// Модуль приложения
var app = (function($) {

    // Инициализируем нужные переменные
    var ajaxUrl = 'php/Prof.php';
        //ui = {
        //    $comments: $('#footer')
		//	};
	var to = false;
	$(document).on('keyup','#search_f', function() {
	//$('#search_f').keyup(function () {
		if(to) { clearTimeout(to); }
		to = setTimeout(function () {
			var v = $('#search_f').val();
			TreeSearch(v);
		}, 250);
	});
	$('#search_f').click (function () {
		var v = $('#search_f').val();
		TreeSearch(v);
	});
	// Загрузка с сервера
	function _loadData() {
        $.ajax({
            url: ajaxUrl,
			dataType: 'json',
			//asinс: false,
            success: function(resp) {
                if (resp.code === 'success') {
                    profdata=resp.result;
					document.getElementById("search_f").value=yourObject;
					TreeSearch(yourObject);
                } else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
                }
            },
            error: function(error) {
                console.error('Ошибка: ', error);
            }
        });
}    
    // Инициализация приложения
    function init() {
		_loadData();
		if (localStorage.getItem('theme') === 'theme-dark') setTheme('theme-dark'); else setTheme('theme-light');
    } 
    // Экспортируем наружу
    return {
        init: init
    }    

})(jQuery);

jQuery(document).ready(app.init);