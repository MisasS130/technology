<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
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
    // �����! ��� ������ ���� ��� �������� ������������ ����������� ������ � ������� ������ ���� �����

    $uploaddir = './uploads/'; // . - ������� ����� ��� ��������� .php
    
    // c������� ����� ���� � ���
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
    // ���������� ������� �������� �����
    echo json_encode(array(
        'code' => 'success',
        'result' => $result
    ));
}
catch (Exception $e) {
    // ���������� ������� ����� � �������
    echo json_encode(array(
        'code' => 'error',
        'message' => $e->getMessage()
    ));
}
?>