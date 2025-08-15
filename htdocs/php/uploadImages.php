<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
//header('Content-Type: text/html; charset=UTF-8');
//var_dump($_POST);
// разрешенные форматы
$allowed = array('png', 'jpg', 'gif','zip');
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
// Обновление базы техпроцесса
function updateOperation($db, $nop, $img, $idProcess) {
	//$imgs = explode(";", $data);//filenames
    $query = "UPDATE operation 
	SET img='$img'
	WHERE IdProcess='$idProcess' AND nop='$nop'";
	/*if ($db->query($query) === TRUE) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . $db->error;
	}*/
    $db->query($query);
}
if( !isset($_FILES) ) exit( "files missed " );
//var_dump($_FILES['images']);

if( isset( $_FILES['images']['name'] )){ 
	$count1=count($_FILES['images']['name']);
	if ($count1==0){
			echo '{"status":"errorNULL"}';
			exit;
	}
    // ВАЖНО! тут должны быть все проверки безопасности передавемых файлов и вывести ошибки если нужно

    $uploaddir = './uploads/'; // . - текущая папка где находится submit.php
    
    // cоздадим папку если её нет
    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );


    
//var_dump($_FILES[$i]);
    $files      = $_FILES; // полученные файлы
	$original_files = array();
    $done_files = array();
	$str='';
	for($i=0;$i<$count1;$i++){
    // переместим файлы из временной директории в указанную
	//foreach( $files as $file ){
		//$f1=$_FILES['images'];
		//var_dump($f1);
		//var_dump($_FILES['images']['name'][$i]);
		
		//$extension = pathinfo($file['name'][$i], PATHINFO_EXTENSION);
		$extension = pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION);
		if(!in_array(strtolower($extension), $allowed)){
			echo '{"status":"errorEXT"}';
			exit;
		}
		$original_files[$i] = $_FILES['images']['name'][$i];
		//if(move_uploaded_file($file['tmp_name'][$i], './uploads/'.$file['name'][$i])){
		if(move_uploaded_file($_FILES['images']['tmp_name'][$i], './uploads/'.$_FILES['images']['name'][$i])){
			echo '{"status":"success"}';
			//exit;
		}
        //$file_name = cyrillic_translit( $file['name'][$i] );
		$file_name = cyrillic_translit( $_FILES['images']['name'][$i] );

        //if( move_uploaded_file( $_FILES['images']['tmp_name'][$i], "$uploaddir/$file_name" ) ){
            //$done_files[$i] = realpath( "$uploaddir$file_name" ));
			//echo ($done_files[$i]);
			$done_files[$i]="$uploaddir$file_name";
        //}
		$str=$str.$done_files[$i].';';
    }
	// Подключаемся к базе данных
    $conn = connectDB();
	$idDSE=1;$idProcess=1;
	if (isset( $_POST['my_file_upload'] )){ 
			updateDSE($conn, $str, $idDSE);
		}
	if (isset( $_POST['my_file_upload2'] )){
		$arr=$_POST['Aimg'];
		//var_dump($_POST);
		//$a1=array();
		$count2=count($_POST['Aimg']);
		/*foreach ($arr as $value) {
			$pcs = explode("*", $value);//$pcs[0]=NOP, $pcs[1]=filenames
			//array_push($a1, $pcs[0], $pcs[1]);
			updateOperation($conn, $pcs[0], $pcs[1], $idProcess);
		}*/
		$str='';
		for($j=0;$j<$count2;$j++){
			$pcs = explode("*", $_POST['Aimg'][$j]);//$pcs[0]=NOP, $pcs[1]=filenames
			//echo ($pcs[1]);
			for($k=0;$k<$count1;$k++){
				if (strpos($pcs[1], $original_files[$k]) !== false) {
					//str_replace($original_files[$k],$done_files[$k],$pcs[1]);
					$str=$str.$done_files[$k].';';
				}
			}
			updateOperation($conn, $pcs[0], $str, $idProcess);
		}
		
	}
	if (isset($str)) $str='';
    $data = $str ? array('files' => $str ) : array('error' => 'Ошибка загрузки файлов.');
    
    die( json_encode( $data ) );
}
    


## Транслитирация кирилических символов
function cyrillic_translit( $title ){
    $iso9_table = array(
        'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Ѓ' => 'G',
        'Ґ' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'YO', 'Є' => 'YE',
        'Ж' => 'ZH', 'З' => 'Z', 'Ѕ' => 'Z', 'И' => 'I', 'Й' => 'J',
        'Ј' => 'J', 'І' => 'I', 'Ї' => 'YI', 'К' => 'K', 'Ќ' => 'K',
        'Л' => 'L', 'Љ' => 'L', 'М' => 'M', 'Н' => 'N', 'Њ' => 'N',
        'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
        'У' => 'U', 'Ў' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'TS',
        'Ч' => 'CH', 'Џ' => 'DH', 'Ш' => 'SH', 'Щ' => 'SHH', 'Ъ' => '',
        'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'YU', 'Я' => 'YA',
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'ѓ' => 'g',
        'ґ' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'є' => 'ye',
        'ж' => 'zh', 'з' => 'z', 'ѕ' => 'z', 'и' => 'i', 'й' => 'j',
        'ј' => 'j', 'і' => 'i', 'ї' => 'yi', 'к' => 'k', 'ќ' => 'k',
        'л' => 'l', 'љ' => 'l', 'м' => 'm', 'н' => 'n', 'њ' => 'n',
        'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
        'у' => 'u', 'ў' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'ts',
        'ч' => 'ch', 'џ' => 'dh', 'ш' => 'sh', 'щ' => 'shh', 'ъ' => '',
        'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu', 'я' => 'ya'
    );

    $name = strtr( $title, $iso9_table );
    $name = preg_replace('~[^A-Za-z0-9\'_\-\.]~', '-', $name );
    $name = preg_replace('~\-+~', '-', $name ); // --- на -
    $name = preg_replace('~^-+|-+$~', '', $name ); // кил - на концах

    return $name;
}
?>