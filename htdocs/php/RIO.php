<?php
/*
// Объявляем нужные константы
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');*/
define('DB_NAME', 'ezyro_30950232_tdb');

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
function data_control($db,$t,$head){//проверка таблицы на картинки
	$path = "../php/treeimg/".$t;//путь к файлам изображений
	//проверка заголовка таблицы
	$cons=false;
	$count=count($head);
	for ($i=0; $i<$count; $i++){
		//echo $head[(string)$i]['column_name'];
		if ($head[(string)$i]['column_name']==='IMG_flag') {$cons=true;break;}//проверяем наличие столбца
	}
	//echo $cons;
	if (!$cons){//если столбца нет, создаем его
		$query = "ALTER TABLE `$t` ADD IMG_flag BIT(1) DEFAULT 0 COMMENT 'Наличие изображения'";
 		if ($db->query($query) === TRUE) {
			//echo "Столбец успешно создан";
		} else {
			echo "Ошибка создание столбца" . $db->error;
		}
		$db->close();
	}
	else{
		if(!is_dir($path)) {//проверяем наличие папки
			mkdir($path, 0777, true);
		}
		$query = "SELECT ID, IMG FROM `$t`";
		//$data = $db->query($query);
		if ($db->query($query) !== FALSE) {
			$result = $db->query($query);
		while ($row = $result->fetch_assoc()) {
			if (isset($row['IMG'])){
				$image = $row['IMG'];
				if ($image!=null){
					$sql="UPDATE `$t` SET IMG_flag=1 WHERE ID=".$row['ID'];
					//echo $sql;
					$db->query($sql);
					$name = "/".$row['ID'].".png";
					$file = fopen($path."/".$name,"w");
					//echo "File name: ".$path."$name\n";
					fwrite($file, $image);
					fclose($file);
				}
			}
		}
			//echo "Record Process read successfully ";
		} else {
			return;
			echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
		}
		
		//$data->close();
	}
}
// Вытаскиваем дерево из БД
function getData($db) {
    $query = "SELECT * FROM tooltree ORDER BY `tooltree`.`TEXT` ASC";
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
		$tooldata['sql'][$i]['img']=base64_encode($d[$i][4]);
		$tooldata['sql'][$i]['id']='j1_'.$d[$i][0];
		$tooldata['sql'][$i]['cm']=$d[$i][5];
		$tooldata['sql'][$i]['co']=$d[$i][6];
		$tooldata['sql'][$i]['sh']=$d[$i][7];
		$tooldata['sql'][$i]['ne']=$d[$i][8];
		$tooldata['sql'][$i]['ni']=$d[$i][9];
		$tooldata['sql'][$i]['p']=$d[$i][10];
		$tooldata['sql'][$i]['m']=$d[$i][11];
		$tooldata['sql'][$i]['k']=$d[$i][12];
		$tooldata['sql'][$i]['n']=$d[$i][13];
		$tooldata['sql'][$i]['s']=$d[$i][14];
		$tooldata['sql'][$i]['h']=$d[$i][15];
		$tooldata['sql'][$i]['gost']=$d[$i][16];
		$tooldata['sql'][$i]['note']=$d[$i][17];
		$tooldata['sql'][$i]['URL']=$d[$i][18];
	}
	return $tooldata;
	$data->close();
}
// Вытаскиваем заголовок таблицы из БД
function getTblTop($db,$t) {//база, таблица
	$rows= array();
	$query = "SELECT column_name,column_type,column_comment FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$t' and table_schema = 'ezyro_30950232_tdb'";
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
	//$db=connectDB($conn);
	//$query = "USE ".$conn;
	//$db->query($query);
	$rows= array();
	$query = "SELECT column_name,column_type,column_comment FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$t' and table_schema = 'ezyro_30950232_tdb'";
	if ($db->query($query) !== FALSE) {
		$data = $db->query($query);
		while($row = mysqli_fetch_assoc($data)) { 
			$rows['thead'][] = $row; 
		}
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
	$data->close();
	$query = "SELECT * FROM `$t` ";
	//$data = mysqli_query($db,$query);
	if ($db->query($query) !== FALSE) {
		$data = $db->query($query);
		//$rows = $data->fetch_all();
		$c=0;
		while($row = mysqli_fetch_assoc($data)) { 
			$rows['tbody'][] = $row; //BLOB!!!!error
			for ($i=0; $i<count($rows['thead']); $i++){
				if ($rows['thead'][$i]['column_type']=="blob") {
					$tmp=$rows['tbody'][$c][$rows['thead'][$i]['column_name']];
					//var_dump($rows['tbody'][$c][$rows['thead'][$i]['column_name']]);
					$rows['tbody'][$c][$rows['thead'][$i]['column_name']]=base64_encode($tmp);
				}
			}
		$c++;
		}
	} else {
		echo "Ошибка чтения базы: " .$query."<br>" . $db->error;
	}
	//var_dump($rows['tbody']);
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
			$res0 = getTblTop($conn,$_POST[0]);//Заголовок таблицы
			//data_control($conn,$_POST[0],$res0[0]);
			//$result[0]=$res0[0];
			//$result[3] = getNTbl($conn,$_POST[0]);//Количество строк в таблице
            $result = getTbl($conn,$_POST[0]);//Таблица	
			
			break;
        // Получаем таблицу
        case 'img':
            //$result = getImg($conn,$_POST[0],$_POST[1]);
			break;
		// Получаем таблицу
        case 'filter':
			getFilter($conn,$_POST[0],$_POST[1],$_POST[2]);
			$res0 = getTblTop($conn,$_POST[0]);//Заголовок таблицы
			$result[0]=$res0[0];
            $result[3] = getNTbl($conn,'tmp_table');//Количество строк в таблице
			$result[1] = getTbl($conn,'tmp_table',$_POST[3],1,$res0[1]);//Таблица	
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