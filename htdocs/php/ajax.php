<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=UTF-8');
/*
// Объявляем нужные константы
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');*/
define('DB_NAME', 'ezyro_30950232_tpb');

require_once('pass.php');

// Подключаемся к базе данных
function connectDB() {
    $errorMessage = 'Невозможно подключиться к серверу базы данных';
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if (!$conn)
        throw new Exception($errorMessage);
    else {
        $query = $conn->query('set names utf8');
        if (!$query)
            throw new Exception($errorMessage);
        else
            return $conn;
    }
}
function sortArrayByKey(&$array,$key,$string = false,$asc = true){
    if($string){
        usort($array,function ($a, $b) use(&$key,&$asc)
        {
            if($asc)    return strcmp(strtolower($a[$key]), strtolower($b[$key]));
            else        return strcmp(strtolower($b[$key]), strtolower($a[$key]));
        });
    }else{
        usort($array,function ($a, $b) use(&$key,&$asc)
        {
            if($a[$key] == $b[$key]){return 0;}
            if($asc) return ($a[$key] < $b[$key]) ? -1 : 1;
            else     return ($a[$key] > $b[$key]) ? -1 : 1;

        });
    }
}
// Обновление таблицы печати
function updatePTbl($db, $data) {
	/*if (isset ($data['TL'])) {$TL=true;} else { $TL=false;};
	if (isset ($data['MK'])) {$MK=true;} else { $MK=false;};
	if (isset ($data['VO'])) {$VO=true;} else { $VO=false;};*/
	//$query =("DELETE FROM ptbl");
	//$db->query($query);
	$query = "DROP TABLE `ptbl`";
	$db->query($query);
	$query = "CREATE TABLE `ptbl` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, idA INT(11) COMMENT 'Индекс операции',". 
	"NOP INT(11) COMMENT 'Номер операции', TL BIT(1) COMMENT 'Титульный лист', MK BIT(1) COMMENT 'Маршрутная карта',". 
	"OK BIT(1) COMMENT 'Операционная карта', KE BIT(1) COMMENT 'Карта эскизов', OKK BIT(1) COMMENT 'Операционная карта контроля',". 
	"KN BIT(1) COMMENT 'Карта наладки', VO BIT(1) COMMENT 'Ведомость оснастки', A3 BIT(1) COMMENT 'A3') COMMENT 'Таблица вывода документов на печать'";
	$db->query($query);
	/*$qA="SELECT * FROM `operation`";
	/*if ($db->query($qA) !== FALSE) {
		echo "Record A read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$qA."<br>" . $db->error;
	}*/
    /*$resA = $db->query($qA);	
	$allRows = $resA->fetch_all();
	$countA=count($allRows);
	for ($i=0; $i<$countA; $i++){
		$OK=false; $KE=false; $OKK=false;
		if (isset ($data['OK'])) {
			for($j=0; $j<count($data['OK']); $j++){
				if ($data['OK'][$j]==$allRows[$i][5]) $OK=true;
			}
		}
		if (isset ($data['KE'])) {
			for($j=0; $j<count($data['KE']); $j++){
				if ($data['KE'][$j]==$allRows[$i][5]) $KE=true;
			}
		}
		if (isset ($data['OKK'])) {
			for($j=0; $j<count($data['OKK']); $j++){
				if ($data['OKK'][$j]==$allRows[$i][5]) $OKK=true;
			}
		}	*/	
	//$count=count($data);
	//var_dump($data);
	for ($i=0; $i<count($data); $i++){
		$idA=$data[$i]['idA'];
		$NOP=(int)$data[$i]['NOP'];
		$TL=$data[$i]['TL'];
		$MK=$data[$i]['MK'];
		$VO=$data[$i]['VO'];
		$OK=0;$KE=0;$OKK=0;$KN=0;$A3=0;
		if (isset ($_REQUEST[5]['OK'])) $OK=$data[$i]['OK'];
		if (isset ($_REQUEST[5]['KE'])) $KE=$data[$i]['KE'];
		if (isset ($_REQUEST[5]['OKK'])) $OKK=$data[$i]['OKK'];
		if (isset ($_REQUEST[5]['KN'])) $KN=$data[$i]['KN'];
		if (isset ($_REQUEST[5]['A3'])) $A3=$data[$i]['A3'];
		if ($OK==null) $OK=0;
		if ($KE==null) $KE=0;
		if ($OKK==null) $OKK=0;
		if ($KN==null) $KN=0;
		if ($A3==null) $A3=0;
		$query = "INSERT INTO ptbl (idA, NOP, TL, MK, OK, KE, OKK, KN, VO, A3)
			VALUES ('$idA','$NOP',$TL,$MK,$OK,$KE,$OKK,$KN,$VO,$A3)";
		
		/*if ($db->query($query) !== FALSE) {
		echo "Record TBL read successfully ";
		} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
		}*/
		$db->query($query);
	}
}

// Обновление базы деталей
function updateDSE($db, $data, $idDSE) {
	if (isset ($data['Designation'])) {$des=$data['Designation'];} else { $des=NULL;};//обозначение
	if (isset ($data['Name'])) {$name=$data['Name'];} else { $name=NULL;};//наименование
	if (isset ($data['Material'])) {$mat=$data['Material'];} else { $mat=NULL;};//материал
	if (isset ($data['StandartUnit'])) {$dsu=$data['StandartUnit'];} else { $dsu=1;};//единица нормирования
	if (isset ($data['Diameter'])) {$d=(float)str_replace(',', '.', $data['Diameter']);} else { $d=0;};//диаметр
	if (isset ($data['Len'])) {$l=(float)str_replace(',', '.', $data['Len']);} else { $l=0;};//длина
	if (isset ($data['Width'])) {$w=(float)str_replace(',', '.', $data['Width']);} else { $w=0;};//ширина
	if (isset ($data['Height'])) {$h=(float)str_replace(',', '.', $data['Height']);} else { $h=0;};//высота
	if (isset ($data['AnnualProgram'])) {$prog=(int)$data['AnnualProgram'];} else { $prog=0;};//программа выпуска
	$img=NULL;
    $query = "UPDATE dse 
	SET designation='$des', name='$name', material='$mat', standartunit='$dsu', 
	diameter='$d', length='$l' , width='$w', height='$h', annualprogram='$prog', drawing='$img'
	WHERE Id='$idDSE'";
	/*if ($db->query($query) === TRUE) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . $db->error;
	}*/
    $db->query($query);
	    return json_encode(array(
        'code' => 'success'
    ));
}
// Обновление базы техпроцесса
function updateProcess($db, $data, $idDSE) {
	if (isset ($data['Variant'])) {$variant=(int)$data['Variant'];} else { $variant=NULL;};//Вариант техпроцесса
	if (isset ($data['Doc'])) {$doc=(string)$data['Doc'];} else {$doc=NULL;};//Обозначение технической документации
	if (isset ($data['Product'])) {$product=$data['Product'];} else { $product=NULL;};//Обозначение изделия или классификационного кода
	if (isset ($data['Letter1'])) {$let1=$data['Letter1'];} else { $let1=NULL;};//Стадия проектирования 1
	if (isset ($data['Letter2'])) {$let2=$data['Letter2'];} else { $let2=NULL;};//Стадия проектирования 2
	if (isset ($data['Letter3'])) {$let3=$data['Letter3'];} else { $let3=NULL;};//Стадия проектирования 3
	if (isset ($data['Hardness'])) {$hard=$data['Hardness'];} else { $hard=NULL;};//Твердость
	if (isset ($data['Performer'])) {$perf=$data['Performer'];} else { $perf=NULL;};//Исполнитель
	if (isset ($data['Checking'])) {$check=$data['Checking'];} else { $check=NULL;};//Проверил
	if (isset ($data['Approving'])) {$appr=$data['Approving'];} else { $appr=NULL;};//Утвердил
	if (isset ($data['Normcontrol'])) {$norm=$data['Normcontrol'];} else { $norm=NULL;};//Нормоконтроль
	if (isset ($data['M01'])) {$m01=$data['M01'];} else { $m01=NULL;};//Наименование, сортамент, размер и марка материала, ГОСТ, ТУ
	if (isset ($data['MatCode'])) {$mc=$data['MatCode'];} else { $mc=NULL;};//Код материала по классификатору
	if (isset ($data['Mass'])) {$mass=(float)str_replace(',', '.', $data['Mass']);} else { $mass=0;};//Масса детали по конструкторскому документу
	if (isset ($data['UnitCode'])) {$uc=$data['UnitCode'];} else { $uc=NULL;};//Код единицы величины (массы, длины, площади и т.п.) детали, заготовки, материала
	if (isset ($data['StandartUnit'])) {$su=$data['StandartUnit'];} else { $su=1;};//Единица нормирования, на которую установлена норма расхода материала или времени
	if (isset ($data['MatRate'])) {$mr=(float)str_replace(',', '.', $data['MatRate']);} else { $mr=0;};//Норма расхода материала
	if (isset ($data['KIM'])) {$kim=(float)str_replace(',', '.', $data['KIM']);} else { $kim=0;};//Коэффициент использования материала
	if (isset ($data['BlankCode'])) {$bc=$data['BlankCode'];} else { $bc=NULL;};//Код заготовки по классификатору
	if (isset ($data['Dimensions'])) {$dim=$data['Dimensions'];} else { $dim=NULL;};//Профиль и размеры заготовки
	if (isset ($data['NumDet'])) {$nd=(int)$data['NumDet'];} else { $nd=0;};//Количество деталей, изготовляемых из одной заготовки
	if (isset ($data['BlankMass'])) {$bm=(float)str_replace(',', '.', $data['BlankMass']);} else { $bm=0;};//Масса заготовки
	if (isset ($data['ISO513'])) {$iso=$data['ISO513'];} else { $iso=NULL;};//Обозначение материала по ИСО
	if (isset ($data['FLabel'])) {$firm=$data['FLabel'];} else { $firm=NULL;};//Краткое наименование или условное обозначение (код) организации (предприятия) - разработчика документа (документов)
	if (isset ($data['Note'])) {$comm=$data['Note'];} else { $comm=NULL;};//Примечания
	if (isset ($data['Boss'])) {$boss=$data['Boss'];} else { $boss=NULL;};//Вышестоящая организация
	if (isset ($data['Font'])) {$font=$data['Font'];} else { $font="GOST_Ai";};//Шрифт
	if (isset ($data['Date'])) {$tpdate=$data['Date'];} else { $tpdate=date('Y-m-d H:i:s');};//Дата
	$img=NULL;//
	//$timestamp = strtotime(new DateTime());
    //$tpdate = date('Y-m-d H:i:s');
    $query = "UPDATE process 
	SET variant='$variant', product='$product', doc='$doc', letter1='$let1', letter2='$let2', letter3='$let3',
	hardness='$hard', performer='$perf' , cheсking='$check', approving='$appr', normcontrol='$norm', m01='$m01', 
	matcode='$mc', mass='$mass', unitcode='$uc',
	standartunit='$su', matrate='$mr', kim='$kim', blankcode='$bc', dimensions='$dim', numdet='$nd',
	blankmass='$bm', iso513='$iso', flabel='$firm', boss='$boss',comment='$comm', tpdate='$tpdate',drawing='$img',font='$font'
	WHERE iddse='$idDSE'";
	/*if ($db->query($query) === TRUE) {
		echo "Record updated successfully";
	} 
    else {
		echo "Error updating record: " . $db->error;
	}*/
    $db->query($query);
	
	/*return json_encode(array(
    'code' => 'success'
    ));*/
}
//Стирание таблицы операций
function clearA($db){
	//$query =("DELETE FROM operation");
	//$db->query($query);
	$query = "DROP TABLE `operation`";
	$db->query($query);
	$query = "CREATE TABLE `operation` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT'№', IdProcess INT(11) COMMENT'№ техпроцесса', shop VARCHAR(11) COMMENT'Цех', site VARCHAR(11) COMMENT'Участок', workplace VARCHAR(11) COMMENT'Рабочее место', nop INT(11) COMMENT'№ операции', name VARCHAR(255) COMMENT'Наименование операции', code VARCHAR(255) COMMENT'Код операции', document VARCHAR(255) COMMENT'Документ', iot VARCHAR(255) COMMENT'ИОТ', equipment VARCHAR(255) COMMENT'Наименование оборудования', eqcode VARCHAR(255) COMMENT'Код оборудования', eqmodel VARCHAR(255) COMMENT'Модель оборудования', cnc VARCHAR(255)COMMENT'ЧПУ',
	eqnum VARCHAR(255)COMMENT'Инвентарный номер', eqfirm VARCHAR(255)COMMENT'Производитель оборудования', mechanization INT(11)COMMENT'Степень механизации', profcode VARCHAR(255)COMMENT'Код профессии', profession VARCHAR(255)COMMENT'Наименование профессии', category VARCHAR(255)COMMENT'Разряд работ', wagesystem VARCHAR(255)COMMENT'Система оплаты', kindst VARCHAR(255)COMMENT'Код вида нормы', conditions VARCHAR(255)COMMENT'Условия труда', perfnum INT(11)COMMENT'Кол-во исполнителей', koid INT(11)COMMENT'Кол-во одновр. изг. дет.', standartunit INT(11) COMMENT'Ед.нормирования', party INT(11) COMMENT'Объем партии', timeperpiecek FLOAT COMMENT'Коэф. многостаночности', setuptime FLOAT COMMENT'Тпз',
	timeperpiece FLOAT COMMENT'Тшт', basecycletime FLOAT COMMENT'То', auxiliarytime FLOAT COMMENT'Тв', cncprogram VARCHAR(255) COMMENT'Управляющая программа', cuttingfluid VARCHAR(255) COMMENT'СОЖ', hardness VARCHAR(255) COMMENT'Твердость', note TEXT COMMENT'Примечание', img TEXT COMMENT'Эскиз') COMMENT 'Таблица операций'";
	$db->query($query);
		/*if ($db->query($query) === TRUE) {
			echo "Record updated successfully";
		} else {
			echo "Error updating record A: " . $db->error;
		}*/
}
// Обновление базы операций
function updateA($db, $data, $i, $idProcess) {
		if (isset ($data[$i]['Shop'])) {$sh=$data[$i]['Shop'];} else { $sh=NULL;};//Номер цеха, в котором выполняется операция
		if (isset ($data[$i]['Site'])) {$site=$data[$i]['Site'];} else { $site=NULL;};//Номер участка, на котором выполняется операция
		if (isset ($data[$i]['Workplace'])) {$wp=$data[$i]['Workplace'];} else { $wp=NULL;};//Рабочее место
		if (isset ($data[$i]['NOP'])) {$nop=(int)$data[$i]['NOP'];} else { $nop=NULL;};//Номер операции
		if (isset ($data[$i]['Name'])) {$name=$data[$i]['Name'];} else { $name=NULL;};//Наименование операции
		if (isset ($data[$i]['Code'])) {$code=$data[$i]['Code'];} else { $code=NULL;};//Код операции по классификатору
		if (isset ($data[$i]['Document'])) {$doc=$data[$i]['Document'];} else { $doc=NULL;};//Обозначение документов, инструкций по охране труда, применяемых при выполнении данной операции
		if (isset ($data[$i]['IOT'])) {$iot=$data[$i]['IOT'];} else { $iot=NULL;};//Обозначение документов, инструкций по охране труда, применяемых при выполнении данной операции
		if (isset ($data[$i]['Equipment'])) {$eq=$data[$i]['Equipment'];} else { $eq=NULL;};//Наименование оборудования
		if (isset ($data[$i]['EqCode'])) {$eqc=$data[$i]['EqCode'];} else { $eqc=NULL;};//Код оборудования
		if (isset ($data[$i]['EqModel'])) {$eqm=$data[$i]['EqModel'];} else { $eqm=NULL;};//Модель оборудования
		if (isset ($data[$i]['CNC'])) {$cnc=$data[$i]['CNC'];} else { $cnc=NULL;};//Система ЧПУ
		if (isset ($data[$i]['EqNum'])) {$eqn=$data[$i]['EqNum'];} else { $eqn=NULL;};//Инвентарный номер оборудования
		if (isset ($data[$i]['EqFirm'])) {$eqf=$data[$i]['EqFirm'];} else { $eqf=NULL;};//Фирма изготовитель оборудования
		if (isset ($data[$i]['Mechanization'])) {$mec=(int)$data[$i]['Mechanization'];} else { $mec=0;};//Степень механизации
		if (isset ($data[$i]['ProfCode'])) {$pc=$data[$i]['ProfCode'];} else { $pc=NULL;};//Код профессии по классификатору
		if (isset ($data[$i]['Profession'])) {$pro=$data[$i]['Profession'];} else { $pro=NULL;};//Наименование профессии по классификатору
		if (isset ($data[$i]['Category'])) {$cat=$data[$i]['Category'];} else { $cat=NULL;};//Разряд работы
		if (isset ($data[$i]['WageSystem'])) {$ws=$data[$i]['WageSystem'];} else { $ws=NULL;};//Система оплаты труда
		if (isset ($data[$i]['KindSt'])) {$kst=$data[$i]['KindSt'];} else { $kst=NULL;};//Код вида нормы
		if (isset ($data[$i]['Conditions'])) {$con=$data[$i]['Conditions'];} else { $con=NULL;};//Код условий труда по классификатору ОКПДТР и код вида нормы
		if (isset ($data[$i]['PerfNum'])) {$pn=(int)$data[$i]['PerfNum'];} else { $pn=0;};//Количество исполнителей, занятых при выполнении операции
		if (isset ($data[$i]['KOID'])) {$koid=(int)$data[$i]['KOID'];} else { $koid=0;};//Количество одновременно изготавливаемых деталей
		if (isset ($data[$i]['StandartUnit'])) {$asu=(int)$data[$i]['StandartUnit'];} else { $asu=0;};//Единица нормирования
		if (isset ($data[$i]['Party'])) {$party=(int)$data[$i]['Party'];} else { $party=0;};//Объем производственной партии в штуках
		if (isset ($data[$i]['TimePerPieceK'])) {$tppk=(float)str_replace(',', '.',$data[$i]['TimePerPieceK']);} else { $tppk=0;};//Коэффициент штучного времени при многостаночном обслуживании
		if (isset ($data[$i]['SetupTime'])) {$ts=(float)str_replace(',', '.',$data[$i]['SetupTime']);} else { $ts=0;};//Норма подготовительно-заключительного времени на операцию
		if (isset ($data[$i]['TimePerPiece'])) {$tpp=(float)str_replace(',', '.',$data[$i]['TimePerPiece']);} else { $tpp=0;};//Норма штучного времени на операцию
		if (isset ($data[$i]['BaseCycleTime'])) {$to=(float)str_replace(',', '.',$data[$i]['BaseCycleTime']);} else { $to=0;};//Норма основного времени на операцию
		if (isset ($data[$i]['AuxiliaryTime'])) {$ta=(float)str_replace(',', '.',$data[$i]['AuxiliaryTime']);} else { $ta=0;};//Норма вспомогательного времени на операцию
		if (isset ($data[$i]['CNCProgram'])) {$prog=$data[$i]['CNCProgram'];} else { $prog=NULL;};//Программа ЧПУ
		if (isset ($data[$i]['CuttingFluid'])) {$cf=$data[$i]['CuttingFluid'];} else { $cf=NULL;};//СОЖ
		if (isset ($data[$i]['Hardness'])) {$hard=$data[$i]['Hardness'];} else { $hard=NULL;};//Твердость
		if (isset ($data[$i]['Note'])) {$note=$data[$i]['Note'];} else { $note=NULL;};//Примечание
		
		$query = "INSERT INTO operation( idProcess, shop, site, workplace, nop, name, code, document, iot, equipment, eqcode, eqmodel, cnc, eqnum, eqfirm, mechanization, profcode, profession, category, wagesystem,kindst, conditions, perfnum, koid, standartunit, party, timeperpiecek, setuptime, timeperpiece, basecycletime, auxiliarytime, cncprogram, cuttingfluid, hardness, note) VALUES ('$idProcess', '$sh','$site','$wp','$nop','$name','$code','$doc','$iot','$eq','$eqc','$eqm','$cnc','$eqn','$eqf','$mec','$pc','$pro','$cat','$ws','$kst','$con','$pn','$koid','$asu','$party','$tppk','$ts','$tpp','$to','$ta','$prog','$cf','$hard','$note')";
		/*if ($db->query($query) === TRUE) {
			echo "Record updated successfully";
		} else {
			echo "Error updating record A: " . $db->error;
		}*/
		$db->query($query);
		$query = "SELECT Id FROM operation WHERE nop='$nop'";
		$res=$db->query($query);
		$row = $res->fetch_assoc();
		return $row["Id"];
		//$db->close();
			return json_encode(array(
			'code' => 'success','result' => $row
			));
}
//Стирание таблицы наладок
/*function clearN($db){
	$query = "DROP TABLE `kntbl`";
	$db->query($query);
	$query = "CREATE TABLE `kntbl` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT'№', idA INT(11) COMMENT'Код операции', nop INT(11) COMMENT'№ операции',".
	"num INT(11) COMMENT'№ перехода', basecycletime VARCHAR(8) COMMENT'To', toolposition INT(11) COMMENT'ПИ',".
	"img TEXT COMMENT'Наладки',t1 VARCHAR(64) COMMENT'T1',  t2 VARCHAR(64) DEFAULT NULL COMMENT'T2', t3 VARCHAR(64) DEFAULT NULL COMMENT'T1',".
	"t4 VARCHAR(64) DEFAULT NULL COMMENT'T4',t5 VARCHAR(64) DEFAULT NULL COMMENT'T5', t6 VARCHAR(64) DEFAULT NULL COMMENT'T6',".
	"t7 VARCHAR(64) DEFAULT NULL COMMENT'T7',t8 VARCHAR(64) DEFAULT NULL COMMENT'T8',ln FLOAT DEFAULT NULL COMMENT'Вылет') COMMENT 'Таблица наладок'";
	$db->query($query);	
}
// Обновление базы наладок
function updateN($db, $data, $j, $idA) {
	
}*/
//Стирание таблицы переходов
function clearO($db){
	//$query =("DELETE FROM step");
	//$db->query($query);
	$query = "DROP TABLE `step`";
	$db->query($query);
	$query = "CREATE TABLE `step` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT'№', idA INT(11) COMMENT'Код операции', nop INT(11) COMMENT'№ операции',".
	"num INT(11) COMMENT'№ перехода', content TEXT COMMENT'Содержание перехода', basecycletime VARCHAR(8) COMMENT'To', auxiliarytime VARCHAR(8) COMMENT'Тв',".
	"indlingtime VARCHAR(255) COMMENT'Тхх', toolchangetime VARCHAR(255) COMMENT'Тсм', toolposition INT(11) COMMENT'ПИ', d FLOAT COMMENT'D',".
	"dmin FLOAT COMMENT'Dmin', l FLOAT COMMENT'L', t FLOAT COMMENT't', ae FLOAT COMMENT'ae', i INT(11) COMMENT'i', sz FLOAT COMMENT'Sзуб',".
	"z INT(11) COMMENT'z', so FLOAT COMMENT'So', sm FLOAT COMMENT'Sмин', n FLOAT COMMENT'Обороты', v FLOAT COMMENT'Скорость', spindle VARCHAR(3) COMMENT'Шпиндель',".
	"workbody INT(3) COMMENT'РО', sync VARCHAR(8) COMMENT'Синхр', note VARCHAR(255) COMMENT'Примечание', cuttype VARCHAR(32) COMMENT'Тип обработки',".
	"img TEXT COMMENT'Наладки',t1 VARCHAR(64) COMMENT'T1',  t2 VARCHAR(64) DEFAULT NULL COMMENT'T2', t3 VARCHAR(64) DEFAULT NULL COMMENT'T1',".
	"t4 VARCHAR(64) DEFAULT NULL COMMENT'T4',t5 VARCHAR(64) DEFAULT NULL COMMENT'T5', t6 VARCHAR(64) DEFAULT NULL COMMENT'T6',".
	"t7 VARCHAR(64) DEFAULT NULL COMMENT'T7',t8 VARCHAR(64) DEFAULT NULL COMMENT'T8',ln FLOAT DEFAULT NULL COMMENT'Вылет') COMMENT 'Таблица переходов'";
	$db->query($query);
		/*if ($db->query($query) === TRUE) {
			echo "Record updated successfully";
		} else {
			echo "Error updating record O: " . $db->error;
		}*/
}
// Обновление базы переходов
function updateO($db, $data, $j, $idA) {
		if (isset ($data[$j]['nop'])) {$nop=(int)$data[$j]['nop'];} else { $nop=0;};//Номер операции
		if (isset ($data[$j]['num'])) {$num=(int)$data[$j]['num'];} else { $num=0;};//Номер перехода
		if (isset ($data[$j]['Content'])) {$con=addslashes($data[$j]['Content']);} else { $con=NULL;};//Содержание перехода
		if (isset ($data[$j]['BaseCycleTime'])) {$to=(float)str_replace(',', '.',$data[$j]['BaseCycleTime']);} else { $to=0;};//То
		if (isset ($data[$j]['AuxiliaryTime'])) {$tv=(float)str_replace(',', '.',$data[$j]['AuxiliaryTime']);} else { $tv=0;};//Тв
		if (isset ($data[$j]['IndlingTime'])) {$thh=(float)str_replace(',', '.',$data[$j]['IndlingTime']);} else { $thh=0;};//Тхх
		if (isset ($data[$j]['ToolChangeTime'])) {$tsm=(float)str_replace(',', '.',$data[$j]['ToolChangeTime']);} else { $tsm=0;};//Тсм.и.
		if (isset ($data[$j]['ToolPosition'])) {$tpos=(int)$data[$j]['ToolPosition'];} else { $tpos=0;};//ПИ
		if (isset ($data[$j]['D'])) {$d=(float)str_replace(',', '.',$data[$j]['D']);} else { $d=0;};//Расчетный размер диаметра обрабатываемой детали
		if (isset ($data[$j]['Dmin'])) {$dmin=(float)str_replace(',', '.',$data[$j]['Dmin']);} else { $dmin=0;};//Минимальный диаметр обработки
		if (isset ($data[$j]['L'])) {$l=(float)str_replace(',', '.',$data[$j]['L']);} else { $l=0;};//Расчетный размер длины рабочего хода
		if (isset ($data[$j]['t'])) {$t=(float)str_replace(',', '.',$data[$j]['t']);} else { $t=0;};//Глубина резания
		if (isset ($data[$j]['ae'])) {$ae=(float)str_replace(',', '.',$data[$j]['ae']);} else { $ae=0;};//Ширина резания
		if (isset ($data[$j]['i'])) {$i=(int)$data[$j]['i'];} else { $i=0;};//Количество проходов
		if (isset ($data[$j]['Sz'])) {$sz=(float)str_replace(',', '.',$data[$j]['Sz']);} else { $sz=0;};//Подача, мм/зуб
		if (isset ($data[$j]['z'])) {$z=(int)$data[$j]['z'];} else { $z=0;};//Количество пластин на инструменте
		if (isset ($data[$j]['So'])) {$so=(float)str_replace(',', '.',$data[$j]['So']);} else { $so=0;};//Подача, мм/об
		if (isset ($data[$j]['Sm'])) {$sm=(float)str_replace(',', '.',$data[$j]['Sm']);} else { $sm=0;};//Подача, мм/мин
		if (isset ($data[$j]['n'])) {$n=(float)str_replace(',', '.',$data[$j]['n']);} else { $n=0;};//Число оборотов шпинделя, об/мин
		if (isset ($data[$j]['V'])) {$v=(float)str_replace(',', '.',$data[$j]['V']);} else { $v=0;};//Скорость резания, м/мин
		if (isset ($data[$j]['Spindle'])) {$sp=$data[$j]['Spindle'];} else { $sp=NULL;};//Шпиндель
		if (isset ($data[$j]['WorkBody'])) {$wb=(int)$data[$j]['WorkBody'];} else { $wb=0;};//Рабочий орган
		if (isset ($data[$j]['Sync'])) {$sync=$data[$j]['Sync'];} else { $sync=NULL;};//Код синхронизации
		if (isset ($data[$j]['CutType'])) {$ct=$data[$j]['CutType'];} else { $ct=NULL;};//Вид механической обработки
		if (isset ($data[$j]['Ln'])) {$ln=(float)str_replace(',', '.',$data[$j]['Ln']);} else { $ln=0;};//Вылет
		if (isset ($data[$j]['KITT'])) {//Инструменты в наладке
			for ($i1=0; $i1<8; $i1++){
				$kit[$i1]=$data[$j]['KITT'][$i1];
			}
		} 
		else { 
			$kit=array_fill(0,8,NULL);
		};

		$query = "INSERT INTO step (idA, nop, num, content, basecycletime, auxiliarytime, indlingtime, toolchangetime, toolposition, d, ".
		"dmin, l, t, ae, i, sz, z, so, sm, n, v, spindle, workbody, sync, cuttype, ln, t1, t2, t3, t4, t5, t6, t7, t8) ".
		"VALUES ('$idA', '$nop', '$num', '$con', '$to','$tv','$thh','$tsm','$tpos','$d','$dmin','$l','$t',".
		"'$ae','$i','$sz','$z','$so','$sm','$n','$v','$sp','$wb','$sync','$ct','$ln','$kit[0]','$kit[1]','$kit[2]','$kit[3]','$kit[4]','$kit[5]','$kit[6]','$kit[7]')";
		
		/*if ($db->query($query) === TRUE) {
			echo "Record updated successfully";
		} else {
			echo "Error updating record O: " . $db->error;
		}*/
		
		$db->query($query);
		$query = "SELECT Id FROM step WHERE idA='$idA' AND num='$num'";
		$res=$db->query($query);
		$row = $res->fetch_assoc();
		return $row["Id"];
			/*return json_encode(array(
			'code' => 'success'
			));*/
}
//Стирание таблицы инструментов
function clearT($db){
	//$query =("DELETE FROM tooling");
	//$db->query($query);
	$query = "DROP TABLE `tooling`";
	$db->query($query);
	$query = "CREATE TABLE `tooling` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	idO INT(11), step INT(11), Ttable VARCHAR(255), tableid INT(11), tooltype VARCHAR(255), 
	quantity INT(11), length FLOAT, designation VARCHAR(255), name VARCHAR(255), firm VARCHAR(255), 
	toolid VARCHAR(255), cutmaterial VARCHAR(255), note VARCHAR(255), machineside VARCHAR(255), 
	partside VARCHAR(255), d VARCHAR(255), z INT(11), numedges INT(11), lifetime FLOAT, 
	minorder INT(11), valute VARCHAR(255), price FLOAT, img VARCHAR(255)) COMMENT 'Таблица инструментов'";
	$db->query($query);	
		/*if ($db->query($query) === TRUE) {
			echo "Record updated successfully";
		} else {
			echo "Error updating record T: " . $db->error;
		}*/
	
}
// Обновление базы инструментов
function updateT($db, $data, $k, $idO) {
		if (isset ($data[$k]['step'])) {$st=$data[$k]['step'];} else { $st=NULL;};//переход
		if (isset ($data[$k]['ToolType'])) {$tt=$data[$k]['ToolType'];} else { $tt=NULL;};//тип инструмента
		if (isset ($data[$k]['Quantity'])) {$q=(int)$data[$k]['Quantity'];} else { $q=0;};//количество
		if (isset ($data[$k]['Len'])) {$l=(float)str_replace(',', '.',$data[$k]['Len']);} else { $l=0;};//длина
		if (isset ($data[$k]['Designation'])) {$de=$data[$k]['Designation'];} else { $de=NULL;};//Обозначение
		if (isset ($data[$k]['Name'])) {$nam=addslashes($data[$k]['Name']);} else { $nam=NULL;};//Наименование
		if (isset ($data[$k]['Firm'])) {$f=$data[$k]['Firm'];} else { $f=NULL;};//фирма изготовитель
		if (isset ($data[$k]['ToolId'])) {$tid=$data[$k]['ToolId'];} else { $tid=NULL;};//Код инструмента
		if (isset ($data[$k]['CutMaterial'])) {$cm=$data[$k]['CutMaterial'];} else { $cm=NULL;};//Материал режущей части
		if (isset ($data[$k]['Note'])) {$not=addslashes($data[$k]['Note']);} else { $not=NULL;};//Примечание
		if (isset ($data[$k]['Diameter'])) {$d=$data[$k]['Diameter'];} else { $d=NULL;};//Диаметр
		if (isset ($data[$k]['z'])) {$z=(int)$data[$k]['z'];} else { $z=0;};////Количество пластин на инструменте
		if (isset ($data[$k]['NumEdges'])) {$ne=(int)$data[$k]['NumEdges'];} else { $ne=0;};//Количество режущих кромок на пластине
		if (isset ($data[$k]['LifeTime'])) {$lt=(float)str_replace(',', '.',$data[$k]['LifeTime']);} else { $lt=0;};//Стойкость режущей кромки

		$query = "INSERT INTO tooling (idO, step, tooltype, quantity, length, designation, name, firm, toolid, cutmaterial, note, d, z, numedges, lifetime) 
		VALUES ('$idO', '$st', '$tt', '$q','$l','$de','$nam','$f','$tid','$cm','$not','$d','$z','$ne','$lt')";
		/*if ($db->query($query) === TRUE) {
			echo "Record updated successfully";
		} else {
			echo "Error updating record T: " . $db->error;
		}*/
		$db->query($query);
			return json_encode(array(
			'code' => 'success'
			));
}
//Создание таблицы маршрутной карты
function MK($db, $pt, $data){
	if (isset ($data['Note'])) {$comm=$data['Note'];} else { $comm=NULL;};
	$query = "DROP TABLE `MKtbl`";
	$db->query($query);
	$query = "CREATE TABLE `MKtbl` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Sym TEXT(1), N TEXT(2), Sh TEXT(4), ".
    "Site TEXT(4), WP TEXT(4), NOP TEXT(5), OPt TEXT(47), Doc TEXT(59), M TEXT(64), SM TEXT(4), Pro TEXT(7), ".
    "R TEXT(4), UT TEXT(5), KR TEXT(4), EN TEXT(5), KOID TEXT(5), OP TEXT(5), Ksh FLOAT, Tpz FLOAT, Tsh FLOAT, Nt TEXT(100),
	O TEXT, T TEXT)COMMENT 'Маршрутная карта'";
	$db->query($query);
	/*$Asort=array();
	foreach ($data as $key=>$row)
	{
		$Asort[$key]=$row['NOP'];
	}
	array_multisort($Asort, SORT_ASC, $data);*/
	$j=3;
	if ($comm!==NULL){//вставка комментария к ТП
	$strC=explode("\n",addslashes($comm));
	$lC=count($strC);
		for ($t=0;$t<$lC;$t++){
			$lstr=ltrim($strC[$t]," ");
			$query = "INSERT INTO `MKtbl`(Sym, N, O) VALUES ('','$j','$lstr')";
			$db->query($query);
			$j++;
		}
	}
	$qA="SELECT * FROM `operation`";
	/*if ($db->query($qA) !== FALSE) {
		echo "Record A read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$qA."<br>" . $db->error;
	}*/
    $resA = $db->query($qA);//получение таблицы операций	
	$allRows = $resA->fetch_all();//преобразование таблицы операций в массив
	$countA=count($allRows);//счетчик количества операций
	for ($i=0; $i<$countA; $i++){

		//вставка строки А
		$query = "INSERT INTO `MKtbl` (Sym, N, Sh, Site, WP, NOP, OPt, Doc, Nt) 
		VALUES ('А','$j','".$allRows[$i][2]."','".$allRows[$i][3]."','".$allRows[$i][4]."','".$allRows[$i][5]."','".$allRows[$i][6]."','".$allRows[$i][8]." ".$allRows[$i][9]."','". $allRows[$i][35]."')";
		$db->query($query);
		$j++;
		//вставка строки Б
		$query = "INSERT INTO `MKtbl` (Sym, N, M, Sm, Pro, r, UT, KR, EN, KOID, OP, Ksh, Tpz, Tsh)
		VALUES ('Б','$j', '".$allRows[$i][11].' '.$allRows[$i][15].' '.$allRows[$i][12]."', '".$allRows[$i][16]."','".
		$allRows[$i][17]."','".$allRows[$i][19].$allRows[$i][20]."','".$allRows[$i][22].$allRows[$i][21].
		"','".$allRows[$i][23]."','".$allRows[$i][25]."','".$allRows[$i][24]."','".$allRows[$i][26]."','".$allRows[$i][27]."','".$allRows[$i][28]."','".$allRows[$i][29]."')";
		$db->query($query);
		$j++;
		//вставка комментария к операции
		$commA=addslashes($allRows[$i][35]);
		if ($commA!==''){
			$strC=explode("\n",$commA);
			$lC=count($strC);
			for ($t=0;$t<$lC;$t++){
				$lstr=ltrim($strC[$t]," ");
				$query = "INSERT INTO `MKtbl`(Sym, N, O) VALUES ('','$j','$lstr')";
				$db->query($query);
				$j++;
			}
		}
		//проверка вывода
		//var_dump($pt);
		$OIns=false;
		if (($pt[$i]['OK'])||($pt[$i]['OKK'])) $OIns=true;
		//if (isset($pt['OK'])){
			//for($l=0; $l<count($pt['OK']); $l++){
					//if ((($pt['OK'][$l]==$allRows[$i][5]))||(($pt['OKK'][$l]==$allRows[$i][5]))) $OIns=true;
			//}
		//}
		if (!$OIns){
			//вставка строки O, Т
			$idA=$allRows[$i][0];
			$qO="SELECT * FROM `step` WHERE idA='$idA'";
			$resO = $db->query($qO);	
			$aRO = $resO->fetch_all();
			$countO=count($aRO);
			for ($k=0; $k<$countO; $k++){
				//$string1=$aRO[$k][4];
				//list($a,,$b) = imageftbbox( 12, 0, '../font/GOST Common Italic.ttf', $string1);
				//echo 'lenO='.($b - $a);
				$strO1=addslashes($aRO[$k][3].'. '.$aRO[$k][4]);
				//$lO1=strlen($strO1);
				$strO2=explode("\n",$strO1);
				$lO2=count($strO2);
				for ($t=0;$t<$lO2;$t++){//вставка строки O
					$query = "INSERT INTO `MKtbl`(Sym, N, O) VALUES ('О','$j','$strO2[$t]')";
					$j++;
					$db->query($query);
				}
				//$j++;
				//вставка строки Т
				$idO=$aRO[$k][0];
				$qT="SELECT * FROM `tooling` WHERE idO='$idO'";
				$resT = $db->query($qT);	
				$aRT = $resT->fetch_all();
				$countT=count($aRT);
				for ($m=0; $m<$countT; $m++){
					$query = "INSERT INTO `MKtbl`(Sym, N, T) VALUES ('Т','$j','".$aRT[$m][8].' '.$aRT[$m][9].' '.$aRT[$m][10]."')";
					$db->query($query);
					$j++;
				}
				if (isset ($_REQUEST[1]['OKSp'])){//вставка пустой строки
					$spv=($j-intdiv($j, 17)*17);
					if ($_REQUEST[1]['OKSp']&&($spv!=0)){
						$query = "INSERT INTO `MKtbl`(Sym, N) VALUES ('','$j')";
						$db->query($query);
						$j++;
					};
				}
			}
		}
		if (isset ($_REQUEST[1]['MKSp'])){// вставка пустой строки
			$spv=($j-intdiv($j, 17)*17);
			if ($_REQUEST[1]['MKSp']&&($spv!=0)){
				$query = "INSERT INTO `MKtbl`(Sym, N) VALUES ('','$j')";
				$db->query($query);
				$j++;
			};
		}
	}
}
//Создание таблицы операционной карты
function OK($db, $pt){
	$query = "DROP TABLE `OKtbl`";
	$db->query($query);
	$query = "CREATE TABLE `OKtbl` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, NOP INT(11), Sym TEXT(1), N TEXT(2), O TEXT, T TEXT, 
	toolposition INT(3),d FLOAT, ae FLOAT, l FLOAT, ap FLOAT,  i INT(11), so FLOAT, sm FLOAT, Vn FLOAT, v FLOAT, 
	basecycletime FLOAT, auxiliarytime FLOAT)COMMENT 'Операционная карта'";
	$db->query($query);
	$j=1;
	$qA="SELECT * FROM `operation`";
	/*if ($db->query($qA) !== FALSE) {
		echo "Record OK read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$qA."<br>" . $db->error;
	}*/
    $resA = $db->query($qA);//получение таблицы операций	
	$allRows = $resA->fetch_all();//преобразование таблицы операций в массив
	$countA=count($allRows);//счетчик количества операций
	$oldnop=0;
	for ($i=0; $i<$countA; $i++){
		$OIns=false;
		//if (isset($pt['OK'])){
			for($l=0; $l<count($pt['OK']); $l++){
					if (($pt['OK'][$l])==($allRows[$i][5])) $OIns=true;
			}
		//}
		if ($OIns){
			//вставка строки O, Т, Р
			$idA=$allRows[$i][0];
			$qO="SELECT * FROM `step` WHERE idA='$idA'";
			$resO = $db->query($qO);	
			$aRO = $resO->fetch_all();
			$countO=count($aRO);
			
			
			for ($k=0; $k<$countO; $k++){
				
				//$string1=$aRO[$k][4];
				//list($a,,$b) = imageftbbox( 12, 0, '../font/GOST Common Italic.ttf', $string1);
				//echo 'lenO='.($b - $a);
				$strO1=addslashes($aRO[$k][3].'. '.$aRO[$k][4]);
				//$lO1=strlen($strO1);
				$strO2=explode("\n",$strO1);
				$lO2=count($strO2);
				$nop=$aRO[$k][2];
				if ($oldnop!=$nop) {
					$j=1;
					$oldnop=$nop;
				}
				$basecycletime=$aRO[$k][5];
				if ($basecycletime==NULL) $basecycletime=0;
				$auxiliarytime=$aRO[$k][6];
				if ($auxiliarytime==NULL) $auxiliarytime=0;
				for ($t=0;$t<$lO2;$t++){//вставка строки O
					if ($t===($lO2-1)){
						$query = "INSERT INTO `OKtbl`(NOP, Sym, N, O, basecycletime, auxiliarytime) VALUES ('$nop','О','$j','$strO2[$t]', '$basecycletime', '$auxiliarytime')";
					}
					else{
						$query = "INSERT INTO `OKtbl`(NOP, Sym, N, O, basecycletime, auxiliarytime) VALUES ('$nop','О','$j','$strO2[$t]', NULL, NULL)";
					}
					$j++;
					$db->query($query);
				}
				//$j++;
				//вставка строки Т
				$idO=$aRO[$k][0];
				$qT="SELECT * FROM `tooling` WHERE idO='$idO'";
				$resT = $db->query($qT);	
				$aRT = $resT->fetch_all();
				$countT=count($aRT);
				for ($m=0; $m<$countT; $m++){
					$query = "INSERT INTO `OKtbl`(NOP, Sym, N, T) VALUES 
					('$nop','Т','$j','".$aRT[$m][8].' '.$aRT[$m][9].' '.$aRT[$m][10]."')";
					$db->query($query);
					$j++;
				}
				//вставка строки Р
				if (!isset ($_REQUEST[1]['OKSpp'])) $OKSpp=1; else $OKSpp=$_REQUEST[1]['OKSpp'];
					if ($OKSpp==0||$aRO[$k][14]==0&&$aRO[$k][12]==0&&$aRO[$k][13]==0&&$aRO[$k][15]==0&&$aRO[$k][18]==0&&$aRO[$k][19]==0&&$aRO[$k][20]==0&&$aRO[$k][21]==0){
						//$query = "INSERT INTO `OKtbl`(NOP, Sym) VALUES ('$nop', NULL)";
					}
					else{
						$query = "INSERT INTO `OKtbl`(NOP, Sym, N, toolposition, d, ae, l, ap, i, so, sm, Vn, v) 
						VALUES ('$nop','Р','$j','".$aRO[$k][9]."','".$aRO[$k][10]."','".$aRO[$k][14]."','".$aRO[$k][12]."','".$aRO[$k][13]."','".$aRO[$k][15]."','".$aRO[$k][18]."','".$aRO[$k][19]."','".$aRO[$k][20]."','".$aRO[$k][21]."')";
						$db->query($query);
						$j++;
					}
					
				//toolposition[9], d[10], ae[14], l[12], ap[13], i[15], so[18], sm[19], Vn[20], v[21]
				if (isset ($_REQUEST[1]['OKSp'])){//вставка пустой строки
				$spv=(($j+4)-intdiv(($j+4), 18)*18);
					if ($_REQUEST[1]['OKSp']&&($spv!=0)){
						$query = "INSERT INTO `OKtbl`(NOP, N) VALUES ('$nop','$j')";
						$db->query($query);
						$j++;
					};
				}
			}
		}
	}
}
function KK($db, $data){//Создание таблицы карты контроля
	$query = "DROP TABLE `KKtbl`";
	$db->query($query);
	$query = "CREATE TABLE `KKtbl` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, NOP INT(11) COMMENT 'Номер операции', 
	OPt VARCHAR(255) COMMENT 'Содержание операции', designation VARCHAR(255) COMMENT 'Код средств ТО', 
	name VARCHAR(255) COMMENT 'Наименование средств ТО', PK INT(11) COMMENT 'процент контроля', 
	basecycletime FLOAT COMMENT 'То', auxiliarytime FLOAT COMMENT 'Тв') COMMENT 'Операционная карта контроля'";
	$db->query($query);
	$count=count($data);
	for ($i=0; $i<$count; $i++){
		if (isset ($data[$i]['NOP'])) {$nop=(int)$data[$i]['NOP'];} else { $nop=0;};//Номер операции
		if (isset ($data[$i]['Content'])) {$content=addslashes($data[$i]['Content']);} else { $content=NULL;};//Содержание перехода
		if (isset ($data[$i]['Designation'])) {$designation=$data[$i]['Designation'];} else { $designation=NULL;};//Обозначение
		if (isset ($data[$i]['Name'])) {$name=$data[$i]['Name'];} else { $name=NULL;};//Наименование
		if (isset ($data[$i]['PK'])) $pk=($data[$i]['PK']);
		if (isset ($data[$i]['BaseCycleTime'])) {$basecycletime=(float)str_replace(',', '.',$data[$i]['BaseCycleTime']);} else { $basecycletime=0;};//То
		if (isset ($data[$i]['AuxiliaryTime'])) {$auxiliarytime=(float)str_replace(',', '.',$data[$i]['AuxiliaryTime']);} else { $auxiliarytime=0;};//Тв
		if (!isset ($data[$i]['Content'])){$pk=null;$basecycletime=null;$auxiliarytime=null;}
		$query = "INSERT INTO `KKtbl`(NOP, OPt,designation, name, PK, basecycletime, auxiliarytime) VALUES ('$nop','$content','$designation','$name','$pk','$basecycletime','$auxiliarytime')";
		$db->query($query);
	}
}
//
//Создание таблицы ведомости оснастки
function VOD($db,$data){
	$stack=array();
	$query = "DROP TABLE `VOtbl`";
	$db->query($query);
	$query = "CREATE TABLE `VOtbl` (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, NOP INT(11), designation VARCHAR(255), quantity INT(11), name VARCHAR(255), firm VARCHAR(255)) COMMENT 'Ведомость оснастки'";
	$db->query($query);
	$countT=count($data);
	for($i = 0; $i < $countT; $i++){
		if (!isset ($data[$i]['nopVO'])) $data[$i]['nopVO']=0;
		if (!isset ($data[$i]['obozn'])) $data[$i]['obozn']=NULL;
		if (!isset ($data[$i]['kolvo'])) $data[$i]['kolvo']=0;
		if (!isset ($data[$i]['naimen'])) {$data[$i]['naimen']=NULL;} else {$data[$i]['naimen']=addslashes($data[$i]['naimen']);};
		if (!isset ($data[$i]['firma'])) $data[$i]['firma']=NULL;
    }
	//sortArrayByKey($data,'firma',true,false);//сортировка массива
	//sortArrayByKey($data,'nopVO');//сортировка массива
	//$crvT=array_count_values(array_column($data,'obozn'));
	$k=0;
	for($i=0; $i<$countT; $i++){
        for($j=$i+1; $j<$countT; $j++){
            if(($data[$i]['nopVO'])==($data[$j]['nopVO'])&&($data[$i]['obozn'])==($data[$j]['obozn'])&&($data[$i]['naimen'])==($data[$j]['naimen'])&&($data[$i]['firma'])==($data[$j]['firma'])){
                 $data[$i]['kolvo']=(int)$data[$i]['kolvo']+(int)$data[$j]['kolvo'];
				 //$data[$j]['obozn']=null;
				 //$data[$j]['obozn']=null;
				 $data[$j]['kolvo']=0;
				 //array_splice($data[$j],1,-4);
				 //unset($data[$j][0]);
				 //$countT=count($data);
				 //$j--;
            }
        }
		if(($data[$i]['kolvo'])!==0) {$stack[$k]=$data[$i];$k++;};
    }
	$countT=count($stack);
	//https://overcoder.net/q/120/%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C-%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2-%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%BE%D0%B2-%D0%BF%D0%BE-%D0%BF%D0%BE%D0%BB%D1%8F%D0%BC-%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%B0
	//sortArrayByKey($stack,'firma',true,false);//сортировка массива
	//sortArrayByKey($stack,'naimen',true,false);//сортировка массива
	//sortArrayByKey($stack,'nopVO');//сортировка массива
	sortArrayByKey($stack,'nopVO');//сортировка массива
	for ($m=0; $m<$countT; $m++){//вставка строки Т
		/*if (isset ($data[$m]['nopVO'])) {$nop=(int)$data[$m]['nopVO'];} else { $nop=0;};
		if (isset ($data[$m]['obozn'])) {$de=$data[$m]['obozn'];} else { $de=NULL;};
		if (isset ($data[$m]['naimen'])) {$nam=$data[$m]['naimen'];} else { $nam=NULL;};
		if (isset ($data[$m]['firma'])) {$f=$data[$m]['firma'];} else { $f=NULL;};
		if (isset ($data[$m]['kolvo'])) {$q=(int)$data[$m]['kolvo'];} else { $q=0;};
		$nam=$nam.' '.$f;*/
		$nop=$stack[$m]['nopVO'];$de=$stack[$m]['obozn'];$q=$stack[$m]['kolvo'];$nam=$stack[$m]['naimen'];$f=$stack[$m]['firma'];
		$query = "INSERT INTO `VOtbl`(NOP, designation, quantity, name, firm) VALUES 
		('$nop','$de','$q','$nam','$f')";
		
		$db->query($query);
	}
}
try {
if ($_POST){
    // Подключаемся к базе данных
    $conn = connectDB();
	// Получаем данные из массива 
    $action = $_POST['action'];
    switch ($action) {
	case 'tprocess':
		if (isset ($_REQUEST)) {		
			$js=json_decode(json_encode($_REQUEST), true);
			$idDSE=1; $idProcess=1;
			$countA=count($_REQUEST[2]);//количество операций
			for ($i = 0; $i < $countA; $i++) {
				$TTtab[$i]['OK']=0;$TTtab[$i]['KE']=0;$TTtab[$i]['OKK']=0;$TTtab[$i]['KN']=0;$TTtab[$i]['A3']=0;
			}
			for ($i = 0; $i < $countA; $i++) {
				$TTtab[$i]['idA']=$i+1;
				$TTtab[$i]['NOP']=$_REQUEST[2][$i]['NOP'];
				
				if (isset($_REQUEST[5]['TL'])){
					$TTtab[$i]['TL']=1;} 
				else{$TTtab[$i]['TL']=0;}				
				if (isset($_REQUEST[5]['MK'])){
					$TTtab[$i]['MK']=1;}
					else{$TTtab[$i]['MK']=0;}		
				if (isset($_REQUEST[5]['VO'])){
					$TTtab[$i]['VO']=1;}
					else{$TTtab[$i]['VO']=0;}
					
				if (isset($_REQUEST[5]['OK'])){ 
					for ($j = 0; $j < count($_REQUEST[5]['OK']); $j++){
						if ($_REQUEST[5]['OK'][$j]==$_REQUEST[2][$i]['NOP']){$TTtab[$i]['OK']=1;}
					}
				}
				if (isset($_REQUEST[5]['KE'])){ 
					for ($j = 0; $j < count($_REQUEST[5]['KE']); $j++){
						if ($_REQUEST[5]['KE'][$j]==$_REQUEST[2][$i]['NOP']){$TTtab[$i]['KE']=1;}
					}
				}
				if (isset($_REQUEST[5]['OKK'])){ 
					for ($j = 0; $j < count($_REQUEST[5]['OKK']); $j++){
						if ($_REQUEST[5]['OKK'][$j]==$_REQUEST[2][$i]['NOP']){$TTtab[$i]['OKK']=1;}
					}
				}
				if (isset($_REQUEST[5]['KN'])){ 
					for ($j = 0; $j < count($_REQUEST[5]['KN']); $j++){
						if ($_REQUEST[5]['KN'][$j]==$_REQUEST[2][$i]['NOP']){$TTtab[$i]['KN']=1;}
					}
				}
				if (isset($_REQUEST[5]['A3'])){ 
					for ($j = 0; $j < count($_REQUEST[5]['A3']); $j++){
						if ($_REQUEST[5]['A3'][$j]==$_REQUEST[2][$i]['NOP']){$TTtab[$i]['A3']=1;}
					}
				}
			}
			if (isset ($_REQUEST[5])) updatePTbl($conn, $TTtab);//обновление таблицы печати документов
			if (isset ($_REQUEST[0])) updateDSE($conn, $_REQUEST[0], $idDSE);//обновление таблицы DSE
			if (isset ($_REQUEST[1])) updateProcess($conn, $_REQUEST[1], $idDSE);//обновление таблицы техпроцесса
			//echo json_encode(array('code' => 'success', 'result' => $js));
			if (isset ($_REQUEST[2])){//если заполнена таблица операций
				$countO=0;
				$countT=0;
				if (isset ($_REQUEST[3])) $countO=count($_REQUEST[3]);//количество переходов
				if (isset ($_REQUEST[4])) $countT=count($_REQUEST[4]);//количество инструментов
				clearA($conn); //Очистка таблицы операций
				clearO($conn); //Очистка таблицы переходов
				clearT($conn);//Очистка таблицы инструментов
				//clearN($conn);//Очистка таблицы наладок
				$c1=0;
				for ($i = 0; $i < $countA; $i++) {
					$idA=(int)updateA($conn, $_REQUEST[2], $i, $idProcess);//Заполнение таблицы операций
					if ($TTtab[$i]['OKK']){$pKK[$c1]['NOP']=$TTtab[$i]['NOP'];}
					for ($j = 0; $j < $countO; $j++) {
						if ($_REQUEST[2][$i]['id']===$_REQUEST[3][$j]['parent']){
							$idO=(int)updateO($conn, $_REQUEST[3], $j, $idA);//Заполнение таблицы переходов
							if ($TTtab[$i]['OKK']){//Заполнение карты контроля
								$pKK[$c1]['NOP']=$TTtab[$i]['NOP'];//Присвоение номера выводимой операции в массив КК
								if (isset($_REQUEST[3][$j]['Content'])) {$pKK[$c1]['Content']=$_REQUEST[3][$j]['Content'];}else{$pKK[$c1]['Content']==null;}//содержание перехода КК
								if (isset($_REQUEST[3][$j]['BaseCycleTime'])) {$pKK[$c1]['BaseCyleTime']=$_REQUEST[3][$j]['BaseCycleTime'];} else {$pKK[$c1]['BaseCycleTime']=0;}//То
								if (isset($_REQUEST[3][$j]['AuxiliaryTime'])) {$pKK[$c1]['AuxiliaryTime']=$_REQUEST[3][$j]['AuxiliaryTime'];}else {$pKK[$c1]['AuxiliaryTime']=0;}//Тв
								if (isset($_REQUEST[3][$j]['PK'])){$pKK[$c1]['PK']=$_REQUEST[3][$j]['PK'];} else  {$pKK[$c1]['PK']=100;};//% контроля
								$c1++;
							}
							for ($k = 0; $k < $countT; $k++) {
								if ($_REQUEST[3][$j]['id']===$_REQUEST[4][$k]['parent']){
									updateT($conn, $_REQUEST[4], $k, $idO);//Заполнение таблицы инструментов
									//if (isset($_REQUEST[2][$i]['NOP'])) 
									$objVO[$k]['nopVO']=$_REQUEST[2][$i]['NOP'];//Заполнение ведомости оснастки
									if (isset($_REQUEST[4][$k]['Designation'])) $objVO[$k]['obozn']=$_REQUEST[4][$k]['Designation'];
									if (isset($_REQUEST[4][$k]['Quantity'])) $objVO[$k]['kolvo']=$_REQUEST[4][$k]['Quantity'];
									if (isset($_REQUEST[4][$k]['Name'])) $objVO[$k]['naimen']=$_REQUEST[4][$k]['Name'];
									if (isset($_REQUEST[4][$k]['Firm'])) $objVO[$k]['firma']=$_REQUEST[4][$k]['Firm'];
									if ($TTtab[$i]['OKK']){//Заполнение карты контроля
										$pKK[$c1]['NOP']=$TTtab[$i]['NOP'];//Присвоение номера выводимой операции в массив КК										
										if (isset($_REQUEST[4][$k]['Designation'])) {$pKK[$c1]['Designation']=$_REQUEST[4][$k]['Designation'];}else {$pKK[$c1]['Designation']=null;}//Обозначение
										if (isset($_REQUEST[4][$k]['Name'])) {$pKK[$c1]['Name']=$_REQUEST[4][$k]['Name'];}else{$pKK[$c1]['Name']=null;}//Наименование
										if (isset($_REQUEST[4][$k]['Firm'])) {$pKK[$c1]['Name']=$_REQUEST[4][$k]['Name']." ".$_REQUEST[4][$k]['Firm'];}//ГОСТ
										$c1++;
									}
								}
							}
						}
					}
				//$c1++;
				}
			}
			//var_dump($_REQUEST[5]);
			if (isset($_REQUEST[5]['MK'])) MK($conn, $TTtab, $_REQUEST[1]);//обновление таблицы маршрутной карты
			if (isset($_REQUEST[5]['OK'])) OK($conn, $_REQUEST[5]);//обновление таблицы операционной карты
			if (isset($_REQUEST[5]['OKK'])) KK($conn, $pKK);//обновление таблицы операционной карты контроля
			if (isset($_REQUEST[5]['VO'])&&isset ($_REQUEST[4])) VOD($conn, $objVO);//обновление таблицы ведомости оснастки
			echo json_encode(array('code' => 'success', 'result' => '$js'));
		}
	}
}
}
catch (Exception $e) {
    // Возвращаем клиенту ответ с ошибкой
    echo json_encode(array(
        'code' => 'error',
        'message' => $e->getMessage()
    ));
}
?>