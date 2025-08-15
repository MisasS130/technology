<?php
/*
// Объявляем нужные константы
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');*/
define('DB_NAME', 'ezyro_30950232_mdb');

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

// Вытаскиваем дерево из БД
function getData($db) {
    $query = "SELECT * FROM sort ORDER BY `sort`.`TEXT` ASC";
    $data = $db->query($query);
	$tooldata= array();
	$d = $data->fetch_all();
	$count=count($d);
	for ($i=0; $i<$count; $i++){
		$tooldata['tree'][$i]['id']='j1_'.$d[$i][0];
		$tooldata['tree'][$i]['text']=$d[$i][1];
		$tooldata['tree'][$i]['parent']='j1_'.$d[$i][2];
		if ($tooldata['tree'][$i]['parent']==='j1_'){
			$tooldata['tree'][$i]['parent']='#';
			$tooldata['tree'][$i]['type']='Main';
		}
		$tooldata['sql'][$i]['tbl']=$d[$i][3];
		//$tooldata['sql'][$i]['img']=base64_encode($d[$i][4]);
		$tooldata['sql'][$i]['id']='j1_'.$d[$i][0];
	}
	return $tooldata;
	$data->close();
}
// Вытаскиваем заголовок таблицы из БД
function getTblTop($db,$t) {//база, таблица
	$rows= array();
	$query = "SELECT column_name,column_type,column_comment FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$t' and table_schema = 'ezyro_30950232_mdb'";
	$data = $db->query($query);
	$count = 0;//mysqli_num_rows($data);
	while($row = mysqli_fetch_assoc($data)) { 
		$rows[0][] = $row; 
		$count++;
	} 
	$rows[1]='';
	for ($j=0; $j<$count; $j++) {
		if($rows[0][$j]['column_type']!='blob'){
			 $rows[1]=$rows[1].$rows[0][$j]['column_name'].', ';
		}
	}
	$rows[1] = trim($rows[1], ", ");//формирование списка наименований столбцов
	return $rows; // $rows[0]-заголовки, $rows[1]- список для запроса
	$data->close();
}
// Вытаскиваем количество строк из БД
function getNTbl($db,$t) {
	if (!$data = $db->query("SELECT COUNT(*) FROM `$t`")) {
		die ('При извлечении записей возникла ошибка: '.$db->errno.' - '.$db->error);
	}
	$count = $data->fetch_row();
	return $count;  
	$data->close();
}
// Вытаскиваем таблицу из БД
function getTbl($db,$t) {//база, таблица
	//$rows= array();
	$query = "SELECT * FROM `$t` ORDER BY 2";
	$data = $db->query($query);
    /*for ($i=0; $i<count($data); $i++) {
		 $rows[$i] = mysqli_fetch_array($data,MYSQLI_ASSOC);//MYSQLI_NUM
    }*/
	//while($row = mysqli_fetch_assoc($data)) { 
	//	$rows[1][] = $row; 
	//}
		if ($db->query($query) !== FALSE) {
		//echo "Record Process read successfully ";
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
    $res = $db->query($query);
	$rows = $res->fetch_all(MYSQLI_ASSOC);
	return $rows;  
	$data->close();
}
// Вытаскиваем изображение
function getImg($db,$t,$im) {
	$d=array();
	$i=(int)$im;
	//$query = "SELECT `IMG` FROM `gost166_89_calipers` WHERE `ID`=2";
	$query = "SELECT IMG FROM `$t` WHERE ID=$i";
	$data = $db->query($query);
	$d = mysqli_fetch_array($data,MYSQLI_ASSOC);
	$img=base64_encode($d['IMG']);
	return $img;
	$data->close();
}
// Фильтруем таблицу
function getFilter($db,$t,$a,$b) {
	$b="'%"."$b"."%'";
	$query = "DROP TABLE `tmp_table`";
	$data = $db->query($query);
	$query = "CREATE  TABLE `tmp_table` SELECT * FROM `$t` WHERE $a LIKE $b";//TEMPORARY
	$data = $db->query($query);
	//$data->close();
}
try {
    // Подключаемся к базе данных
    $conn = connectDB(); 
    // Получаем данные из массива GET
    $action = $_POST['action'];
    switch ($action) {
        // Получаем дерево
        case 'get_tree':
			$result = getData($conn);
            break;
        // Получаем таблицу
        case 'tbl':
			$res0 = getTblTop($conn,$_POST[1]);//Заголовок таблицы
			$result[0]=$res0[0];
            $result[1] = getTbl($conn,$_POST[0]);//Таблица	
			break;
        // Получаем таблицу
        case 'img':
            $result = getImg($conn,$_POST[0],$_POST[1]);
			break;
        // Действие по умолчанию, ничего не делаем
        default:
            $result = 'unknown action';
            break;
    }

    // Возвращаем клиенту успешный ответ
    echo json_encode(array(
        'code' => 'success',
        'result' => $result
    ));
}
catch (Exception $e) {
    // Возвращаем клиенту ответ с ошибкой
    echo json_encode(array(
        'code' => 'error',
        'message' => $e->getMessage()
    ));
}
?>