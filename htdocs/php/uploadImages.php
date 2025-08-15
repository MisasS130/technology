<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
//header('Content-Type: text/html; charset=UTF-8');
//var_dump($_POST);
// ����������� �������
$allowed = array('png', 'jpg', 'gif','zip');
/*
// ��������� ������ ���������
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');*/
define('DB_NAME', 'ezyro_30950232_tpb');

require_once('pass.php');
// ������������ � ���� ������
function connectDB() {
    $errorMessage = '���������� ������������ � ������� ���� ������';
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
// ���������� ���� ������
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
// ���������� ���� �����������
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
    // �����! ��� ������ ���� ��� �������� ������������ ����������� ������ � ������� ������ ���� �����

    $uploaddir = './uploads/'; // . - ������� ����� ��� ��������� submit.php
    
    // c������� ����� ���� � ���
    if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );


    
//var_dump($_FILES[$i]);
    $files      = $_FILES; // ���������� �����
	$original_files = array();
    $done_files = array();
	$str='';
	for($i=0;$i<$count1;$i++){
    // ���������� ����� �� ��������� ���������� � ���������
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
	// ������������ � ���� ������
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
    $data = $str ? array('files' => $str ) : array('error' => '������ �������� ������.');
    
    die( json_encode( $data ) );
}
    


## �������������� ������������ ��������
function cyrillic_translit( $title ){
    $iso9_table = array(
        '�' => 'A', '�' => 'B', '�' => 'V', '�' => 'G', '�' => 'G',
        '�' => 'G', '�' => 'D', '�' => 'E', '�' => 'YO', '�' => 'YE',
        '�' => 'ZH', '�' => 'Z', '�' => 'Z', '�' => 'I', '�' => 'J',
        '�' => 'J', '�' => 'I', '�' => 'YI', '�' => 'K', '�' => 'K',
        '�' => 'L', '�' => 'L', '�' => 'M', '�' => 'N', '�' => 'N',
        '�' => 'O', '�' => 'P', '�' => 'R', '�' => 'S', '�' => 'T',
        '�' => 'U', '�' => 'U', '�' => 'F', '�' => 'H', '�' => 'TS',
        '�' => 'CH', '�' => 'DH', '�' => 'SH', '�' => 'SHH', '�' => '',
        '�' => 'Y', '�' => '', '�' => 'E', '�' => 'YU', '�' => 'YA',
        '�' => 'a', '�' => 'b', '�' => 'v', '�' => 'g', '�' => 'g',
        '�' => 'g', '�' => 'd', '�' => 'e', '�' => 'yo', '�' => 'ye',
        '�' => 'zh', '�' => 'z', '�' => 'z', '�' => 'i', '�' => 'j',
        '�' => 'j', '�' => 'i', '�' => 'yi', '�' => 'k', '�' => 'k',
        '�' => 'l', '�' => 'l', '�' => 'm', '�' => 'n', '�' => 'n',
        '�' => 'o', '�' => 'p', '�' => 'r', '�' => 's', '�' => 't',
        '�' => 'u', '�' => 'u', '�' => 'f', '�' => 'h', '�' => 'ts',
        '�' => 'ch', '�' => 'dh', '�' => 'sh', '�' => 'shh', '�' => '',
        '�' => 'y', '�' => '', '�' => 'e', '�' => 'yu', '�' => 'ya'
    );

    $name = strtr( $title, $iso9_table );
    $name = preg_replace('~[^A-Za-z0-9\'_\-\.]~', '-', $name );
    $name = preg_replace('~\-+~', '-', $name ); // --- �� -
    $name = preg_replace('~^-+|-+$~', '', $name ); // ��� - �� ������

    return $name;
}
?>