<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
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
// Обновление базы детали
function updateDSE($db, $data, $idDSE) {
    $query = "UPDATE dse 
	SET drawing='$data'
	WHERE Id='$idDSE'";
	/*if ($db->query($query) === TRUE) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . $db->error;
	}*/
    $db->query($query);
}
try {
	$str="";
    $conn = connectDB(); 
	if( !isset($_FILES) ) exit( "files missed " );
	if( isset( $_FILES )){ 
		$count1=count($_FILES['drw']['tmp_name']);
		//echo $count1;
		if ($count1==0){
			echo '{"status":"errorNULL"}';
			exit;
		}
	}
    // ВАЖНО! тут должны быть все проверки безопасности передавемых файлов и вывести ошибки если нужно

    $uploaddir = './uploads/'; // . - текущая папка где находится .php
    
    // cоздадим папку если её нет
    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );
	for($i=0;$i<$count1;$i++){
		$fname = $_FILES['drw']['name'][$i] . ".png";
		move_uploaded_file($_FILES['drw']['tmp_name'][$i], $uploaddir . $fname);
		$str=$str.$fname.';';
	}
	$idDSE=1;
	//echo $str;
	if (isset( $_FILES)){ 
			updateDSE($conn, $str, $idDSE);
		}
	else updateDSE($conn, '', $idDSE);
	$result=json_encode(array($_FILES['drw']));
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