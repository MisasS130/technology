'use strict';
var tdata1={};//шапка таблицы
var tdata2={};//данные таблицы
var sharedObject=window.opener.sharedObject;
var head_t={};
var tblname=null;//имя таблицы
var oldtbl=null;
var tblNode={};//данные выделенной строки
var RowId=0;//индекс номера строки таблицы
var yourObject = JSON.parse(window.localStorage.getItem('DSEMatKey'));//передача поля из основного окна
$('#M01_3').val(yourObject);
// function to set a given theme/color-scheme
function setTheme(themeName) {
            localStorage.setItem('theme', themeName);
            document.documentElement.className = themeName;
}
function Onclk_Select(){//Выбор элемента списка
	var v=document.getElementById("mySelectId").value;
	$("#ToolTree").jstree().deselect_all(true);
	$('#ToolTree').jstree().select_node(v);
	document.getElementById(v).scrollIntoView(true);
}
function Onclk_tbl(){//Выбор строки в таблице
	var table = $('#tbl0').DataTable();
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
		}
		else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	//alert(this.rowIndex-1);
	var txt=$(this.cells[0]).text();
	var bg=txt.indexOf(" ");
	var txt1=txt.slice(0,bg);
	var txt2=txt.slice(bg+1);
	$('#M01_1').val(txt1);
	$('#M01_2').val(txt2);
	sharedObject.s=txt1+' '+txt2+'/ '+$('#M01_3').val();
}
function OkBut_change(){//Нажатие кнопки Ок
	var txt1=$('#M01_1').val();
	var txt2=$('#M01_2').val();
	window.opener.document.getElementById("M01_1").value=txt1;
	window.opener.document.getElementById("M01_2").value=txt2;
	$( "#M01_1", window.opener.document ).change;
	window.opener.SortGet();
	window.close();
}
function CrTblH(tdata){//Получение заголовков таблицы
	var d1=tdata[0];
	var tblh=[];
	for (var i=0;i<d1.length;i++){
		var otmp=new Object();
		otmp.title=d1[i]['column_comment'];
		otmp.field=d1[i]['column_name'];
		tblh.push(otmp);
	}
	return tblh;
}
function cTbl(tdata){//создание таблицы
	const Thead=CrTblH(tdata);//заголовок таблицы
	const Tbody=tdata[1];//тело таблицы
	const sc=Thead[1].field;
var table = new Tabulator("#tblbegin", {
 	height:550, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
 	data:Tbody, //assign data to table
 	columns:Thead,
    selectable:1,
	//initialSort:[{column:sc, dir:"asc", 
		/*sorter:"number", 
		sorterParams:{
			//thousandSeparator:",",
			decimalSeparator:".",
			alignEmptyValues:"top",
		}*/
	//}]
	//selectable:true,
});
table.on("rowClick", function(e, row){ 
	//alert("Row " + row.getData().OBOZN_SORT + " Clicked!!!!");
	var txt=row.getData().OBOZN_SORT;
	var bg=txt.indexOf(" ");
	var txt1=txt.slice(0,bg);
	var txt2=txt.slice(bg+1);
	$('#M01_1').val(txt1);
	$('#M01_2').val(txt2);
	sharedObject.s=txt1+' '+txt2+'/ '+$('#M01_3').val();
});
}


function Blobtrans(tname, timg){//передача на сервер JSON данных запроса картинки
	var ajaxUrl = 'php/RIO.php';
	var param={};
	param[0]=tname; //имя таблицы
	param[1]=timg+1;//индекс строки в таблице базы данных
	var data = $.extend(param, {
            action: 'img'
        });
		$.ajax({
			type: 'POST',
            url: ajaxUrl,
            data: data, 
			dataType: 'json',
            success: function(resp) {
                if (resp.code === 'success') {
                    console.log('img ok ');//+JSON.stringify(resp.result)
					createImg(resp.result);//вывод изображения из запроса
                } else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
                }
            },
            error: function( error) {
                console.log('Ошибка: ', error);
            }
        }).done(function(msg){
		//alert('Данные загружены');
		});	
};

/*function createImg(tdata){//вывод изображения
	if (tdata!="") document.getElementById("image").src='data:image/jpg;base64,'+tdata;//вывод картинки из blob переменной
}	*/
// Модуль приложения
	var app = (function($) {
    // Инициализируем нужные переменные
    var ajaxUrl = 'php/Sortament.php',
        ui = {
            $RI: $("#ToolTree"),
			$comments: $('#footer')
			};

function Jstrans(tname){//передача на сервер JSON данных запроса имени таблицы
	var ajaxUrl = 'php/Sortament.php';
	var param={};
	param[0]=tname;//имя таблицы
	param[1]=oldtbl;//старое имя таблицы
	var data = $.extend(param, {
            action: 'tbl'
        });
		$.ajax({
			type: 'POST',
            url: ajaxUrl,
            data: data, 
			dataType: 'json',
            success: function(resp) {
                if (resp.code === 'success') {
                    console.log('ok '+JSON.stringify(resp.result));
					if (resp.result[1]!==null){
						cTbl(resp.result)//создание таблицы
						//createTable(resp.result)//создание таблицы
					}
					else {alert('Ошибка запроса')};//создание таблицы из запроса
					sharedObject.var4=resp.result[0];
                } else {
                    console.error('Ошибка получения данных с сервера: ', resp.message);
                }
            },
            error: function( error) {
                console.log('Ошибка: ', error);
            }
        }).done(function(msg){
		//alert('Данные загружены');
		});	
};

    // Инициализация дерева с помощью jstree
    function _initTree(data) {
        ui.$RI.jstree({
            core: {
                check_callback: true,
                multiple: false,
                data: data
            },
			types: {
				'#' : {
				'max_children' : 1,
				'max_depth' : 10,
				'valid_children' : ['Main']
				},
				'Main' : {
				'valid_children' : []
				},
			},
            plugins: ["ui","types","dnd"]
        }).bind('changed.jstree', function(e, data) {//изменение выделенного элемента дерева
			sharedObject.var1=data.node.id;
			sharedObject.var2=data.node.text;
			var i=sharedObject.var3.map(function(e) { return e.id; }).indexOf(data.node.id);//индекс массива дерева
			var tbltreeid='php/sortimg/img'+(sharedObject.var3[i]['id']).slice(3)+'.png';//Number()
			var myimg=document.getElementById("image").src=tbltreeid;
			image.onload = function () {
  				console.log('Done');
			};

			image.onerror = function () {
  				document.getElementById("image").src = 'img/default_image.png';
				this.onerror=null;
			};
			//document.getElementById("image").src=tbltreeid;
			var Comment=i+' '+sharedObject.var1+' '+sharedObject.var2;
			tblname=sharedObject.var3[i]['tbl'];
			oldtbl=tblname;
			if (tblname!=null){
				Comment=Comment+' '+tblname;
				

					/*while (table.firstChild) {//удаление таблицы на странице
						table.removeChild(table.firstChild);
					}*/
					//var a=15;
					//var a=document.getElementById("I").value;//количество строк в таблице
					//var b=1;//document.getElementById("M").value;;//текущий лист
				Jstrans(tblname);//обращение к базе данных за таблицей
			}
			ui.$comments.html(Comment);//вывод комментария в подвале
			var v1=data.node.parents;
			var v2=v1.length;
			var v3=true;
			for (var m = 0; m < v2; m++) {
				if (v1[m]=="j1_4") var v3=false;
			}
			if (v3){
				$(".th_hide").hide();
			}
			else $(".th_hide").show();
			head_t=sharedObject.var3[i];

        });
		var to = false;
    }
	function TreeSearch(searchtxt){//создаем список найденных элементов дерева
		var v =$("#ToolTree").jstree(true).get_json('#', {'flat': true});
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
		var params = {
            action: 'get_tree'
        };
        $.ajax({
            url: ajaxUrl,
			type: 'POST',
			data: params,
			dataType: 'json',
            success: function(resp) {
                // Инициализируем дерево 
                if (resp.code === 'success') {
                    _initTree(resp.result['tree']);
					sharedObject.var3=resp.result['sql'];
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
		$(".th_hide").hide();
		if (localStorage.getItem('theme') === 'theme-dark') {
			setTheme('theme-dark'); 
			var cssFile="css/tabulator_midnight.min.css";
			
		}
		else {
			setTheme('theme-light');
			var cssFile="css/tabulator_simple.min.css";
		}
		var cssLinkIndex=0;
		var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
		var newlink = document.createElement("link");
		newlink.setAttribute("rel", "stylesheet");
		newlink.setAttribute("type", "text/css");
		newlink.setAttribute("href", cssFile);
		document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
		/*new DataTable('#tbl0', {
		retrieve: true,
		paging: false
		} );*/
    }
    
    // Экспортируем наружу
    return {
        init: init
    }    

})(jQuery);

jQuery(document).ready(app.init);