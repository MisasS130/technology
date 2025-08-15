'use strict';
var yourObject = JSON.parse(window.localStorage.getItem('OPnameKey'));//передача поля из основного окна
/*function Search_change(){
	//$('#OPNameTree').jstree(true).show_all();
	var v=document.getElementById("search_f").value;
	$("#OPNameTree").jstree("search",v);
}*/
var sharedObject=window.opener.sharedObject;
// function to set a given theme/color-scheme
function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            document.documentElement.className = themeName;
}
function Onclk_Select(){
	var v=document.getElementById("mySelectId").value;
	$("#OPNameTree").jstree().deselect_all(true);
	$('#OPNameTree').jstree().select_node(v);
	document.getElementById(v).scrollIntoView(true);
}

function OkBut_change(){
	window.opener.document.getElementById("OPCode").value=sharedObject.var1;
	window.opener.document.getElementById("OPName").value=sharedObject.var2;
	window.opener.OPCode_change();
	window.opener.OPName_change();
	window.close();
	//alert(sharedObject.var1+' '+sharedObject.var2);
}
// Модуль приложения
//$.jstree.defaults.search=true;
var app = (function($) {

    // Инициализируем нужные переменные
    var ajaxUrl = 'php/OPName.php',
        ui = {
            $OPNames: $('#OPNameTree'),
			$comments: $('#footer')
			};

    // Инициализация дерева категорий с помощью jstree
    function _initTree(data) {
        ui.$OPNames.jstree({
            core: {
                //check_callback: true,
                //multiple: false,
                data: data
            },
			types: {
				'#' : {
				'max_children' : 1,
				'max_depth' : 3,
				'valid_children' : ['OPGroup']
				},
				'OPGroup' : {
				'valid_children' : ['OP']
				},
				'OP' : {
				'icon' : 'img/O16.png',
				'valid_children' : []
				}
				},
            plugins: ["ui","types","search"],
				/*'search':{
					'case_sensitive':false,//регистр
					'fuzzy':false,//четкий поиск
					'close_opened_onclear':true,//закрыть все узлы, открытые для отображения результатов поиска, после очистки поиска или выполнения нового поиска
					'search_leaves_only':false,//Указывает, следует ли включать в результаты поиска только листовые узлы
					'show_only_matches':true,//фильтр дерева
					'search_callback':false//Если задана функция, она будет вызываться в области действия экземпляра с двумя аргументами - поисковой строкой и узлом (где узел будет каждым узлом в структуре, поэтому используйте с осторожностью)
				}*/
			
        }).bind('changed.jstree', function(e, data) {
            //category = data.node.text;
            //ui.$goods.html('Товары из категории ' + category);
            //console.log('changed node: ', data);
			sharedObject.var1=data.node.data;
			sharedObject.var2=data.node.text;
			if (sharedObject.var1==undefined) sharedObject.var1='';
			var Comment=sharedObject.var1+' '+sharedObject.var2;
			ui.$comments.html(Comment);
		}).bind('ready.jstree', function(e, data) {// invoked after jstree has loaded
			TreeSearch(yourObject);
			document.getElementById("mySelectId").selectedIndex = 0;
			Onclk_Select();
			//$("#mySelectId option[selectedIndex = 0]").prop('selected', true);
        });
		var to = false;
		$(document).on('keyup','#search_f', function() {
		//$('#search_f').keyup(function () {
			if(to) { clearTimeout(to); }
			to = setTimeout(function () {
			var v = $('#search_f').val();
			TreeSearch(v);
			//$("#OPNameTree").jstree("search",v);
		}, 250);
		});
    }
	function TreeSearch(searchtxt){
		var v =$("#OPNameTree").jstree(true).get_json('#', {'flat': true});
		var objSel = document.getElementById("mySelectId");
		objSel.options.length = 0;//стираем
		for (var i = 0; i < v.length; i++) {
			var z = v[i];
			var ntxt=z["text"];
			var result= ntxt.toLowerCase().indexOf( searchtxt.toLowerCase() );
			//if (result>=0) alert(result+" z[text] = " + z["text"]);
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
					
					//TreeSearch(yourObject);
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
		//_initTree();
		//$('#OPNameTree').jstree(true).create_node('#', {'text':'Операции', 'type':'OPGroup'});
		//$("#TPtree").jstree(true).settings.core.data = jstd;
		//$("#TPtree").jstree(true).refresh();
	  //$('#OPNameTree').jstree().create_node('OPGroup', {'text':'Операции общего назначения', 'type':'OP'});
	}
    
    // Экспортируем наружу
    return {
        init: init
    }    

})(jQuery);

jQuery(document).ready(app.init);