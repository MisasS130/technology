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
// Обновление базы техпроцесса
function updateOperation($db, $nop, $img, $idProcess) {
	//$imgs = explode(";", $data);//filenames
    $query = "UPDATE operation 
	SET img='$img'
	WHERE IdProcess='$idProcess' AND nop='$nop'";
    $db->query($query);
}
try {
	$str="";
	$idProcess=1;
	$oldnop=0;
    $conn = connectDB(); 
	if( !isset($_FILES) ) exit( "files missed " );
	if( isset( $_FILES )){ 
		$count1=count($_FILES['drw']['tmp_name']);
		if ($count1==0){
			echo '{"status":"errorNULL"}';
			exit;
		}
	}
    // ВАЖНО! тут должны быть все проверки безопасности передавемых файлов и вывести ошибки если нужно

    $uploaddir = './uploads/'; // . - текущая папка где находится submit.php
    
    // cоздадим папку если её нет
    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );
	for($i=0;$i<$count1;$i++){
		$fname = $_FILES['drw']['name'][$i] . ".png";
		move_uploaded_file($_FILES['drw']['tmp_name'][$i], $uploaddir . $fname);
		$sl=(int)strpos($fname,"_");
		$nop=(int)substr($fname,0,$sl);
		if ($nop!=$oldnop) {
			$str=$uploaddir.$fname.';';
		}
		else{
			$str=$str.$uploaddir.$fname.';';
		}
		$oldnop=$nop;
		updateOperation($conn, $nop, $str, $idProcess);
	}

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