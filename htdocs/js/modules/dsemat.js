'use strict';
var yourObject = JSON.parse(window.localStorage.getItem('DSEMatKey'));//передача поля из основного окна
var sharedObject=window.opener.sharedObject;
// function to set a given theme/color-scheme
function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            document.documentElement.className = themeName;
}

function Onclk_Select(){
	var v=document.getElementById("mySelectId").value;
	var ch=$('#DSEMatTree').jstree().get_node(v).children[0];
	$("#DSEMatTree").jstree().deselect_all(true);
	$('#DSEMatTree').jstree().select_node(ch);
	document.getElementById(v).scrollIntoView(true);
}

function OkBut_change(){
	var str=sharedObject.var2;
	var idx1=str.indexOf('Сталь');
	var idx2=str.indexOf('Сплав');
	var logi=(idx1||idx2);
	if (logi) {var resstr=str.slice(6)}
	else {var resstr=str};
	window.opener.document.getElementById("DSEMat").value=sharedObject.var2;
	window.opener.DSEMat_change();
	window.opener.document.getElementById("M01_3").value=resstr;
	$( "#M01_3", window.opener.document ).change;
	window.localStorage.setItem('DSEMatKey', JSON.stringify(resstr));
	window.close();
}
// Модуль приложения
var app = (function($) {

    // Инициализируем нужные переменные
    var ajaxUrl = 'php/DSEMat.php',
        ui = {
            $DSEMat: $('#DSEMatTree'),
			$comments: $('#footer')
			};

    // Инициализация дерева категорий с помощью jstree
    function _initTree(data) {
        ui.$DSEMat.jstree({
			/*"search" : {
			"show_only_matches"          : true,
			"show_only_matches_children" : true
			},*/
            core: {
                data: data
            },
			//"rtl": true,
			//"animation": 0,
			types: {
				'#' : {
				'max_children' : 1,
				'max_depth' : 5,
				'valid_children' : ['Section']
				},
				'Section' : {
				'valid_children' : ['Grade']
				},
				'Class' : {
				'valid_children' : ['Brand']
				},
				'Brand' : {
				'valid_children' : ['GOST']
				},
				'GOST' : {
				'valid_children' : []
				}
				},
            plugins: ["ui","types","search"],			
        }).bind('changed.jstree', function(e, data) {
			sharedObject.var1=data.node.data;
			sharedObject.var2=data.node.text;
			if (data.node.type=='GOST') {
				var p=data.node.parent;
				var node1 = $('#DSEMatTree').jstree(true).get_node(p);
				sharedObject.var2=node1.text+' '+data.node.text;
			}
			if (sharedObject.var1==undefined) sharedObject.var1='';
			var Comment=sharedObject.var1+' '+sharedObject.var2;
			ui.$comments.html(Comment);
		}).bind('ready.jstree', function(e, data) {// invoked after jstree has loaded
			TreeSearch(yourObject);
			document.getElementById("mySelectId").selectedIndex = 0;
			Onclk_Select();
			//$(this).jstree("open_node", $(nodes[i]));
        /*}).bind("select_node.jstree", function (event, data) {
			data.inst._fix_scroll(data.rslt.obj);*/
		});
		var to = false;
		$(document).on('keyup','#search_f', function() {
		//$('#search_f').keyup(function () {
			if(to) { clearTimeout(to); }
			to = setTimeout(function () {
			var v = $('#search_f').val();
			TreeSearch(v);
		}, 250);
		});
    }
	function TreeSearch(searchtxt){
		var v =$("#DSEMatTree").jstree(true).get_json('#', {'flat': true});
		var objSel = document.getElementById("mySelectId");
		objSel.options.length = 0;//стираем
		for (var i = 0; i < v.length; i++) {
			var z = v[i];
			var ntxt=z["text"];
			var result= ntxt.toLowerCase().indexOf( searchtxt.toLowerCase() );
				if (result>=0){
					//Создаем новый объект Option и заносим его в коллекцию options
					objSel.options[objSel.options.length] = new Option(ntxt, z["id"]);
				}
		}
	}
    // Загрузка с сервера
    function _loadData() {
        $.ajax({
            url: ajaxUrl,
			dataType: 'json',
            success: function(resp) {
                // Инициализируем дерево 
                if (resp.code === 'success') {
                    _initTree(resp.result);
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
		document.getElementById("search_f").value=yourObject;
		_loadData();
		if (localStorage.getItem('theme') === 'theme-dark') setTheme('theme-dark'); else setTheme('theme-light');
    }
    // Экспортируем наружу
    return {
        init: init
    }    

})(jQuery);

jQuery(document).ready(app.init);