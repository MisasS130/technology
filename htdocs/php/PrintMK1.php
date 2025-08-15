<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
/*
// Объявляем нужные константы
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');*/
define('DB_NAME', 'ezyro_30950232_tpb');
const DIAM=array("\u{2300}",'ø');
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
// Вытаскиваем таблицу печати
function getPtbl($db) {
    $query = "
        SELECT
			*
        FROM
           `ptbl`
    ";
	if ($db->query($query) !== FALSE) {
		//echo "Record Ptbl read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);
	//$row = $res->fetch_assoc();
	$allRows = $res->fetch_all();
	//var_dump($row);
	//var_dump($allRows);
	//$db->close();
	return $allRows;
}
// Вытаскиваем данные техпроцесса из БД
function getProcess($db, $idDSE) {
    $query = "
        SELECT
			*
        FROM
           `process`
        WHERE
           `iddse`='$idDSE'
    ";
	if ($db->query($query) !== FALSE) {
		//echo "Record Process read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);
	$row = $res->fetch_assoc();
	//var_dump($row);
	//printf("doc = %s (%s)\n", $row['doc'], gettype($row['doc']));
	//printf("performer = %s (%s)\n", $row['performer'], gettype($row['performer']));
	//$db->close();
	return $row;
}
function getDSE($db, $IdDSE) {//Вытаскиваем данные о детали из БД
    $query = "
        SELECT
			*
        FROM
           `dse`
        WHERE
           `Id`='$IdDSE'
    ";
	if ($db->query($query) !== FALSE) {
		//echo "Record DSE read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);	
	$row = $res->fetch_assoc();
	//printf("designation = %s (%s)\n", $row['designation'], gettype($row['designation']));
	return $row;
	//$db->close();
}
function getMK($db) {//Вытаскиваем данные о маршруте из БД
    $query = "SELECT * FROM `MKtbl`";
	if ($db->query($query) !== FALSE) {
		//echo "Record MKtbl read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);	
	$allRows = $res->fetch_all();
	return $allRows;
	//$db->close();
}
function getOK($db, $nop) {//Вытаскиваем данные об операции из БД
    $query = "SELECT * FROM `OKtbl` WHERE NOP='$nop'";
	if ($db->query($query) !== FALSE) {
		//echo "Record OKtbl read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);	
	$allRows = $res->fetch_all();
	return $allRows;
	//$db->close();
}
function getOKdata($db, $nop) {//Вытаскиваем данные о маршруте из БД
    $query = "SELECT * FROM `operation` WHERE NOP='$nop'";
	if ($db->query($query) !== FALSE) {
		//echo "Record operation read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $resO = $db->query($query);	
	$allRowsO = $resO->fetch_all();
	return $allRowsO;
	//$db->close();
}
function getOKK($db, $nop) {//Вытаскиваем данные о карте контроля из БД
    $query = "SELECT * FROM `KKtbl` WHERE NOP='$nop'";
	if ($db->query($query) !== FALSE) {
		//echo "Record OKtbl read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);	
	$allRows = $res->fetch_all();
	return $allRows;
	//$db->close();
}
function getVO($db) {//Вытаскиваем данные о ведомости оснастки из БД
    $query = "SELECT * FROM `VOtbl` ORDER BY `NOP`,`firm`,`name`, `designation`";
	if ($db->query($query) !== FALSE) {
		//echo "Record OKtbl read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);	
	$allRows = $res->fetch_all();
	return $allRows;
	//$db->close();
}
function getStep($db, $nop) {//Вытаскиваем данные о переходах из БД
    $query = "SELECT * FROM `step` WHERE nop='$nop' AND (t1 !='' OR t2 !='' OR t3 !='' OR t4 !='' OR t5 !='' OR t6 !='' OR t7 !='' OR t8 !='' )";
	if ($db->query($query) !== FALSE) {
		//echo "Record OKtbl read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);	
	$allRows = $res->fetch_all();
	return $allRows;
	//$db->close();
}
try {
	//echo "var=".$_REQUEST['font'];
    // Подключаемся к базе данных
    $conn = connectDB();
	$IdDSE=1;
	// Получаем данные из базы
	$tbl=getPtbl($conn);//таблица печати
	$countPtbl=count($tbl);
	//var_dump($tbl);
	$tp=getProcess($conn, $IdDSE);//данные ТП
	$dse=getDSE($conn, $IdDSE);//данные ДСЕ
	define('FPDF_FONTPATH','../font/');
	require_once( "fpdf.php" );
	require( "MK1.class.php" );
	$MK1 = new MK1( 'L', 'mm','A4');
	$MK1->SetAuthor($tp['performer'],true);
	$MK1->SetTitle("Комплект технологической документации",true);
	$MK1->SetCreator("TPMaker V1.0b evgeny.razzhivin@gmail.com",true);
	$MK1->SetSubject($dse['designation']." ".$dse['name'],true);
	if($tp['font']=="GOST_Ai") $MK1->AddFont('gost_a','','GOSTmi.php'); else $MK1->AddFont('gost_a','','Arial-ItalicMT.php');
	if ($tbl[0][3]==='1') $MK1->PrintTL($tp,$dse);//печать титульного листа
	if ($tbl[0][4]==='1') {//печать МК 13/17
	$mk=getMK($conn);
	$countMK=count($mk)-1;
	//var_dump($mk);
	$pagesMK=ceil(($countMK+4)/17);//количество листов МК
	$pageMK=1;
	$MK1->PrintMK1p($tp,$dse,$pagesMK);//печать первого листа МК
	//printf("<br>"."*".$pagesMK." ".$countMK."<br>");
		if ($countMK>13) {$j=14; $mp=true;} else {$j=$countMK+1;$mp=false;};
		for ($i=0; $i<$j; $i++){
			$y=82.5+$i*8.5;//координата строки МК
			//echo " ",$i," ",$j," ",$mk[$i][0],"<br>" ;
			$MK1->PrintMKstr($mk[$i],$y);//печать строк МК
		}
		if ($mp===true){
			$m=14;
			for($k=2; $k<=$pagesMK; $k++){
				$MK1->PrintMK2p($tp,$dse,$k);//печать вторых листов МК
				$i=0;//echo "<br>";
				While(($m<=$countMK-1) && ($i<17)){			
					$m=$i+($k-2)*17+14;
					//echo " ",$m," ",$i," ",$mk[$m][0],"<br>" ;
					$y=57+$i*8.5;//координата строки МК
					$MK1->PrintMKstr($mk[$m],$y);//печать строк МК
					$i++;
				}	
			}
		}
	}	
	for ($l=0; $l<$countPtbl; $l++){//печать КЭ, OК, ОКК, КН
		if($tbl[$l][6]==='1'){//печать КЭ
			$cc1=getOKdata($conn, $tbl[$l][2]);
			$imgdt=explode(';',$cc1[0][36]);
			$countKE=count($imgdt)-1;//количество листов КЭ
			if ($tbl[$l][10]==='1'){//A3
				$MK1->PrintKEA3_1p($tp,$dse,$countKE,$cc1[0][5],$imgdt[0]);//печать первого листа КЭ
			}
			else{
				$MK1->PrintKEA4_1p($tp,$dse,$countKE,$cc1[0][5],$imgdt[0]);//печать первого листа КЭ
			}
			for ($p=1; $p<$countKE; $p++){
				//echo $imgdt[$p];
				if ($tbl[$l][10]==='1'){//A3
					$MK1->PrintKEA3_2p($tp,$dse,$p+1,$cc1[0][5],$imgdt[$p]);//печать вторых листов КЭ
				}
				else{
					$MK1->PrintKEA4_2p($tp,$dse,$p+1,$cc1[0][5],$imgdt[$p]);//печать вторых листов КЭ
				}
			}
			//$imgdata[0]='./uploads/1.jpg';
			//$imgdata[1]='./uploads/2.jpg';		
		}
		if($tbl[$l][8]==='1'){//печать КН
			$kn=getStep($conn, $tbl[$l][2]);
			$countKN=count($kn);//количество КН
			$pagesKN=ceil($countKN/4);//количество листов КН
			$MK1->PrintKN1p($tp,$dse,$pagesKN,$kn[$l][2],$kn, $countKN);//печать первого листа КН
			for ($p=1; $p<$pagesKN; $p++){
				$MK1->PrintKN2p($tp,$dse,$p,$kn[$l][2],$kn, $countKN);//печать вторых листов КН
			}		
		}
		if($tbl[$l][5]==='1'){//печать OК
			$ok=getOK($conn, $tbl[$l][2]);
			$cc1=getOKdata($conn, $tbl[$l][2]);
			$countOK=count($ok);
			$pagesOK=ceil(($countOK+5)/18);//количество листов OК 13/18
			//$pagesOK=intdiv(($countOK+5), 18)+1;
			$pageOK=1;
			$MK1->PrintOK1p($tp,$dse,$pagesOK, $cc1);//печать первого листа OК
			if ($countOK>13) {$j=13; $op2print=true;} else {$j=$countOK;$op2print=false;};
				for ($i=0; $i<$j; $i++){
				$y=86.75+$i*8.5;//координата строки OК
				$MK1->PrintOKstr($ok[$i],$y);//печать строк OК
			}
			if ($op2print===true){
				$m=13;
				for($k=2; $k<=$pagesOK; $k++){
					$MK1->PrintOK2p($tp,$dse,$k,$cc1[0][5]);//печать вторых листов OК
					$i=0;//echo "<br>";
					While(($m<$countOK-1) && ($i<18)){			
						$m=$i+($k-2)*18+13;
						$y=48.5+$i*8.5;//координата строки OК
						$MK1->PrintOKstr($ok[$m],$y);//печать строк OК
						$i++;
					}	
				}
			}
		}
		if($tbl[$l][7]==='1'){//печать OКК
		$cc1=getOKdata($conn, $tbl[$l][2]);
		$dd=getOKK($conn, $tbl[$l][2]);
		$countOKK=count($dd);
		$pagesOKK=ceil(($countOKK+4)/17);//количество листов OКК 13/17
		$pageOKK=1;
		$MK1->PrintKK1p($tp,$dse,$pagesOKK,$cc1);//печать первого листа КК
		if ($countOKK>13) {$j=13; $op=true;} else {$j=$countOKK;$op=false;};
				for ($i=0; $i<$j; $i++){
				$y=86.75+4.25+$i*8.5;//координата строки OКК
				$MK1->PrintKKstr($dd[$i],$y);//печать строк OКК
			}
		if ($op===true){
				$m=13;
				for($k=2; $k<=$pagesOKK; $k++){
					$MK1->PrintKK2p($tp,$dse,$k,$cc1[0][5]);//печать вторых листов OКК
					$i=0;//echo "<br>";
					While(($m<$countOKK-1) && ($i<17)){			
						$m=$i+($k-2)*17+13;
						$y=48.5+4.25+$i*8.5;//координата строки OКК
						$MK1->PrintKKstr($dd[$m],$y);//печать строк OКК
						$i++;
					}	
				}
			}	
		}
	}
	if ($tbl[0][9]==='1') {//печать ВО
	$vv=getVO($conn);
	$countVO=count($vv);
	$pagesVO=ceil(($countVO+1)/17);//количество листов ВО 16/17
	$pageVO=1;
	$MK1->PrintVO1p($tp,$dse,$pagesVO);//печать первого листа ВО
		if ($countVO>16) {$j=16; $vp=true;} else {$j=$countVO;$vp=false;};
		for ($i=0; $i<$j; $i++){
			$y=61.25+$i*8.5;//координата строки ВО
			$MK1->PrintVOstr($vv[$i],$y);//печать строк ВО
		}
		if ($vp===true){
			$m=16;
			for($k=2; $k<=$pagesVO; $k++){
				$MK1->PrintVO2p($tp,$dse,$k);//печать вторых листов ВО
				$i=0;//echo "<br>";
				While(($m<$countVO) && ($i<17)){		
					$y=52.75+$i*8.5;//координата строки ВО
					$MK1->PrintVOstr($vv[$m],$y);//печать строк ВО
                    $m=$i+($k-2)*17+17;
					$i++;
				}	
			}
		}
	}	
	ob_start();
	$MK1->Output();
	ob_end_flush();
}
catch (Exception $ex) {
    //Выводим сообщение об исключении.
    echo "!!".$ex->getMessage();
}
?>