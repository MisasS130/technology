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
function updateProcess($db, $data, $idDSE) {
    $query = "UPDATE process 
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
	if( !isset($_FILES) ) {
		echo '***';
		updateProcess($conn, null, $idDSE);
		exit( "files missed " );
	}
	if( isset( $_FILES )){ 
		$count1=count($_FILES);
		if ($count1==0){
			echo '{"status":"errorNULL"}';
			exit;
		}
	}
    // �����! ��� ������ ���� ��� �������� ������������ ����������� ������ � ������� ������ ���� �����


	if (isset( $_FILES)){ 
	    $uploaddir = './uploads/'; // . - ������� ����� ��� ��������� php
    
		// c������� ����� ���� � ���
		if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );
		$fname = $_FILES['drw']['name'][0] . ".png";
		move_uploaded_file($_FILES['drw']['tmp_name'][0], $uploaddir . $fname);
		$sp=$fname;
		$idDSE=1;
			updateProcess($conn, $sp, $idDSE);;
		}

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