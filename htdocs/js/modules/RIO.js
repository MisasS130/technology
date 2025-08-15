'use strict';
var tdata1={};//шапка таблицы
var tdata2={};//данные таблицы
var sharedObject=window.opener.sharedObject;
var head_t={};
var tblname=null;//имя таблицы
var oldtbl=null;
var tblNode={};//данные выделенной строки
var RowId=0;//индекс номера строки таблицы
var tbltreeid;
var isrc=window.opener.document.getElementById("ObozTbut").alt;
var itab=window.opener.document.getElementById("ObozT").alt;
if ( isrc===undefined ) isrc="1";
var numEl = parseInt(isrc.match(/\d+/))

$("#CallTurl").click( function(){
	if (head_t['URL']!=undefined) tblNode['URL']=head_t['URL'];
	if (tblNode['URL']!=undefined) window.open(tblNode['URL'],"","width=1200,height=700").focus();
})
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
function Onclk_tbl(RowId,tdata){//Выбор строки в таблице
	tblNode['GOST']=head_t['gost'];
	tblNode['Firm']=head_t['gost'];
	tblNode['Designation']=tdata['tbody'][RowId]['Designation'];
	tblNode['Name']=tdata['tbody'][RowId]['Name'];
	tblNode['Note']=head_t['note'];
	tblNode['URL']=head_t['URL'];
	if (tdata['tbody'][RowId]['z']!=undefined) {tblNode['z']=tdata['tbody'][RowId]['z']} else {tblNode['z']=head_t['ni']};
	if (tdata['tbody'][RowId]['L']!=undefined) {tblNode['L']=tdata['tbody'][RowId]['L']} else {tblNode['L']=null};
	if (tdata['tbody'][RowId]['D']!=undefined) {tblNode['D']=tdata['tbody'][RowId]['D']} else {tblNode['D']=null};
	if (tdata['tbody'][RowId]['Numeges']!=undefined) {tblNode['Numeges']=tdata['tbody'][RowId]['Numeges']} else {tblNode['Numeges']=head_t['ne']};
	if (tdata['tbody'][RowId]['Cutmaterial']!=undefined) {tblNode['Cutmaterial']=tdata['tbody'][RowId]['Cutmaterial']} else {tblNode['Cutmaterial']=head_t['cm']};
	if (tdata['tbody'][RowId]['GOST']!=undefined) tblNode['Firm']=tdata['tbody'][RowId]['GOST'];
	if (tdata['tbody'][RowId]['Firm']!=undefined) tblNode['Firm']=tdata['tbody'][RowId]['Firm'];
	if (tdata['tbody'][RowId]['Code']!=undefined) {tblNode['Code']=tdata['tbody'][RowId]['Code'];} else {tblNode['Code']=null;};
	if (tdata['tbody'][RowId]['Note']!=undefined) {tblNode['Note']=tdata['tbody'][RowId]['Note'];} else {tblNode['Note']=head_t['note'];};
	if (tdata['tbody'][RowId]['URL']!=undefined) {tblNode['URL']=tdata['tbody'][RowId]['URL'];} else {tblNode['URL']=head_t['URL'];};
	}
function OkBut_change(){//Нажатие кнопки Ок
	window.opener.document.getElementById("ObozT").value=tblNode['Designation'];
	window.opener.document.getElementById("ObozTbut").src=$('#image').attr('src');
	window.opener.document.getElementById("ObozTbut").alt=tbltreeid;
	window.opener.document.getElementById("ObozT").alt=RowId;
	window.opener.document.getElementById("NameT").value=tblNode['Name'];
	window.opener.document.getElementById("FirmT").value=tblNode['Firm'];
	window.opener.document.getElementById("KodT").value=tblNode['Code'];
	window.opener.document.getElementById("KPT").value=tblNode['z'];
	window.opener.document.getElementById("KKT").value=tblNode['Numeges'];
	window.opener.document.getElementById("NumT").value=1;
	window.opener.document.getElementById("VylT").value=tblNode['L'];
	window.opener.document.getElementById("DiaT").value=tblNode['D'];
	window.opener.document.getElementById("MRCT").value=tblNode['Cutmaterial'];
	window.opener.document.getElementById("TNote").value=tblNode['Note'];
	window.opener.document.getElementById("TURL").value=tblNode['URL'];
	var selectedNodes = $('#ToolTree').jstree(true).get_selected();
	var a = $('#ToolTree').jstree(true).get_node(selectedNodes[0]);
	var b =a.parents;
	var c=b.length;
	b=b[c-2].slice(3)-1;
	window.opener.document.getElementById("VidT").selectedIndex=b;
	window.opener.VidT_change();
	window.opener.ObozT_change();
	window.opener.NameT_change();
	window.opener.FirmT_change();
	window.opener.KodT_change();
	window.opener.NumT_change();
	window.opener.TNote_change();
	window.opener.TURL_change();
	window.close();
}
function SelBut_change(){//Нажатие кнопки Выбрать
	window.opener.document.getElementById("ObozT").value=tblNode['Designation'];
	window.opener.document.getElementById("ObozTbut").src=$('#image').attr('src');
	window.opener.document.getElementById("ObozTbut").alt=tbltreeid;
	window.opener.document.getElementById("ObozT").alt=RowId;
	window.opener.document.getElementById("NameT").value=tblNode['Name'];
	window.opener.document.getElementById("FirmT").value=tblNode['Firm'];
	window.opener.document.getElementById("KodT").value=tblNode['Code'];
	window.opener.document.getElementById("KPT").value=tblNode['z'];
	window.opener.document.getElementById("KKT").value=tblNode['Numeges'];
	window.opener.document.getElementById("NumT").value=1;
	window.opener.document.getElementById("VylT").value=tblNode['L'];
	window.opener.document.getElementById("DiaT").value=tblNode['D'];
	window.opener.document.getElementById("MRCT").value=tblNode['Cutmaterial'];
	window.opener.document.getElementById("TNote").value=tblNode['Note'];
	window.opener.document.getElementById("TURL").value=tblNode['URL'];
	var selectedNodes = $('#ToolTree').jstree(true).get_selected();
	var a = $('#ToolTree').jstree(true).get_node(selectedNodes[0]);
	var b =a.parents;
	var c=b.length;
	b=b[c-2].slice(3)-1;
	window.opener.document.getElementById("VidT").selectedIndex=b;
	window.opener.VidT_change();
	window.opener.ObozT_change();
	window.opener.NameT_change();
	window.opener.FirmT_change();
	window.opener.KodT_change();
	window.opener.NumT_change();
	window.opener.TNote_change();
	window.opener.TURL_change();
	window.opener.T_inc();
	alert("Данные переданы в ТП, добавлен новый инструмент.");
}
function SelectBut_change(){//Нажатие кнопки Выбрать
	window.opener.document.getElementById("ObozT").value=tblNode['Designation'];
	window.opener.document.getElementById("ObozTbut").src=$('#image').attr('src');
	window.opener.document.getElementById("ObozTbut").alt=tbltreeid;
	window.opener.document.getElementById("ObozT").alt=RowId;
	window.opener.document.getElementById("NameT").value=tblNode['Name'];
	window.opener.document.getElementById("FirmT").value=tblNode['Firm'];
	window.opener.document.getElementById("KodT").value=tblNode['Code'];
	window.opener.document.getElementById("KPT").value=tblNode['z'];
	window.opener.document.getElementById("KKT").value=tblNode['Numeges'];
	window.opener.document.getElementById("NumT").value=1;
	window.opener.document.getElementById("VylT").value=tblNode['L'];
	window.opener.document.getElementById("DiaT").value=tblNode['D'];
	window.opener.document.getElementById("MRCT").value=tblNode['Cutmaterial'];
	window.opener.document.getElementById("TNote").value=tblNode['Note'];
	window.opener.document.getElementById("TURL").value=tblNode['URL'];
	var selectedNodes = $('#ToolTree').jstree(true).get_selected();
	var a = $('#ToolTree').jstree(true).get_node(selectedNodes[0]);
	var b =a.parents;
	var c=b.length;
	b=b[c-2].slice(3)-1;
	window.opener.document.getElementById("VidT").selectedIndex=b;
	window.opener.VidT_change();
	window.opener.ObozT_change();
	window.opener.NameT_change();
	window.opener.FirmT_change();
	window.opener.KodT_change();
	window.opener.NumT_change();
	window.opener.TNote_change();
	window.opener.TURL_change();
	alert("Данные переданы в ТП.");
}

function CrTblH(tdata){//Получение заголовков таблицы
	var tblh=[];
	for (var i=0;i<tdata.length;i++){
		var otmp=new Object();
		otmp.title=tdata[i]['column_comment'];
		otmp.field=tdata[i]['column_name'];
		if (otmp.field==='IMG') otmp.visible=false;
        if (otmp.field==='IMG_flag') otmp.visible=false;
		tblh.push(otmp);
	}
	return tblh;
}
function cTbl(tdata){//создание таблицы
	const Thead=CrTblH(tdata['thead']);//заголовок таблицы
	const Tbody=tdata['tbody'];//тело таблицы
	var table = new Tabulator("#tblbegin", {
 	data:Tbody, //assign data to table
 	columns:Thead,
	renderVerticalBuffer:900,
	renderHorizontal:"virtual",
	pagination:"local",
    paginationSize:5,
	paginationSizeSelector:[5, 10, 15, 20, true],
    paginationCounter:"rows",
	locale: true,
	langs:{
        "ru-ru":{ //Russian language definition
            "pagination":{
				"page_title":"Страница",
				"page_size":"Размер страницы",
                "first":"Начало",
                "first_title":"Первая станица",
                "last":"Конец",
                "last_title":"Последняя страница",
                "prev":"Пред.",
                "prev_title":"Предыдущая страница",
                "next":"След.",
                "next_title":"Следующая страница",
                "all":"Все",
				"counter":{
                    "showing": "Показано",
                    "of": "из",
                    "rows": "строк",
                    "pages": "страниц",
                }
            },
		},
	}
	});
table.on("rowClick", function(e, row){ 
	$(".tabulator-row[role='row']").removeClass("tabulator-selected");
	$(e.target.parentElement).addClass("tabulator-selected");
	var row1=row.getData();
    if (row1.IMG_flag==undefined) row1.IMG_flag=0;
	if (row1.IMG_flag!=0) {
		var src2='php/treeimg/'+tblname+'/'+row1.ID+'.png';
		document.getElementById("image").src=src2;
	}
	RowId=row1.ID-1;//индекс строки в таблице страницы
	Onclk_tbl(RowId,tdata);
});
table.on("tableBuilt",function(){
	var pageSize = table.getPageSize();
	var i=Math.trunc(itab/pageSize);
	var j=i*pageSize;
	var k=itab-j;
	var s=".tabulator-row[role='row']:eq("+k+")";
	table.setPage(i+1);
	$(s).addClass("tabulator-selected");
	itab=0;
});
}


function createImg(tdata){//вывод изображения
	if (tdata!="") document.getElementById("image").src='data:image/jpg;base64,'+tdata;//вывод картинки из blob переменной
}	
// Модуль приложения
	var app = (function($) {
    // Инициализируем нужные переменные
    var ajaxUrl = 'php/RIO.php',
        ui = {
            $RI: $("#ToolTree"),
			$comments: $('#footer')
			};
function Jstrans(tname,a,b){//передача на сервер JSON данных запроса имени таблицы
	var ajaxUrl = 'php/RIO.php';
	var param={};
	param[0]=tname;//имя таблицы
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
					if (resp.result!==null){cTbl(resp.result)} else {alert('Ошибка запроса')};//создание таблицы из запроса
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
            plugins: ["ui","types","dnd"]//,"search"
        }).bind('changed.jstree', function(e, data) {//изменение выделенного элемента дерева
			sharedObject.var1=data.node.id;
			sharedObject.var2=data.node.text;
			var i=sharedObject.var3.map(function(e) { return e.id; }).indexOf(data.node.id);//индекс массива дерева
			tbltreeid=(sharedObject.var3[i]['id']).slice(3);
			var myimg='php/treeimg/img'+tbltreeid+'.png';//Number()
			document.getElementById("image").src=myimg;
			image.onload = function () {
  				console.log('Done');
			};
			image.onerror = function () {
  				document.getElementById("image").src = 'img/default_image.png';
				this.onerror=null;
			};
			var Comment=i+' '+sharedObject.var1+' '+sharedObject.var2;
			tblname=sharedObject.var3[i]['tbl'];
			oldtbl=tblname;
			if (tblname!=null){
				Comment=Comment+' '+tblname;
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
			$("#gost").html(sharedObject.var3[i]['gost']);
			$("#cutmaterial").html(sharedObject.var3[i]['cm']);
			$("#coating").html(sharedObject.var3[i]['co']);
			$("#shank").html(sharedObject.var3[i]['sh']);
			$("#Pt").html(sharedObject.var3[i]['p']);
			$("#Mt").html(sharedObject.var3[i]['m']);
			$("#Kt").html(sharedObject.var3[i]['k']);
			$("#Nt").html(sharedObject.var3[i]['n']);
			$("#St").html(sharedObject.var3[i]['s']);
			$("#Ht").html(sharedObject.var3[i]['h']);
			$("#z").html(sharedObject.var3[i]['ni']);
			$("#numeges").html(sharedObject.var3[i]['ne']);
			$("#note").html(sharedObject.var3[i]['note']);
			$("#URL").html(sharedObject.var3[i]['URL']);
        }).bind('ready.jstree', function(e, data) {//дерево создано
			$('#ToolTree').jstree().select_node('j1_'+numEl);
		});
		var to = false;
		$(document).on('keyup','#search_f', function() {
		//$('#search_f').keyup(function () {//изменение поля ввода поиска
			if(to) { clearTimeout(to); }
			to = setTimeout(function () {
			var v = $('#search_f').val();
			TreeSearch(v);
		}, 250);
		});
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
		//if (localStorage.getItem('theme') === 'theme-dark') setTheme('theme-dark'); else setTheme('theme-light');
		var cssLinkIndex=0;
		var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
		var newlink = document.createElement("link");
		newlink.setAttribute("rel", "stylesheet");
		newlink.setAttribute("type", "text/css");
		newlink.setAttribute("href", cssFile);
		document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
    }   
    // Экспортируем наружу
    return {
        init: init
    }    
	
})(jQuery);

jQuery(document).ready(app.init);