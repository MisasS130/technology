<?php
/*
// Объявляем нужные константы
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');*/
define('DB_NAME', 'ezyro_30950232_cdb');

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

// Вытаскиваем из БД
function getDataISO($db, $n,$l,$t,$f) {
    $query = "SELECT es, ei FROM rdm_dimensions WHERE '$n' BETWEEN minsize AND maxsize AND letter='$l' AND qualityid='$t' AND formtype='$f'";
    $data = $db->query($query);
	$esei = mysqli_fetch_array($data,MYSQLI_ASSOC);
	/*$esei= array();
    while ($row = $data->fetch_assoc()) {
        array_push($esei, array(
            'es' => $row['es'],
            'ei' => $row['ei']
        ));
    }*/
	return $esei;
	$data->close();
}
function getDataOST($db, $n,$l,$t,$f) {
    $query = "SELECT es, ei FROM ost_dimensions WHERE '$n' BETWEEN minsize AND maxsize AND letter='$l' AND qualityid='$t' AND formtype='$f'";
    $data = $db->query($query);
	$esei = mysqli_fetch_array($data,MYSQLI_ASSOC);
	/*$esei= array();
    while ($row = $data->fetch_assoc()) {
        array_push($esei, array(
            'es' => $row['es'],
            'ei' => $row['ei']
        ));
    }*/
	return $esei;
	$data->close();
}
try {
    // Подключаемся к базе данных
    $conn = connectDB(); 
	$action = $_REQUEST['action'];
	switch ($action) {
    // Получаем данные
	case 'ISO':
		if (isset($_REQUEST)) $result = getDataISO($conn, $_REQUEST['size'], $_REQUEST['toolerance'], $_REQUEST['IT'], $_REQUEST['type']);
		break;
	case 'OST':
		if (isset($_REQUEST)) $result = getDataOST($conn, $_REQUEST['size'], $_REQUEST['toolerance'], $_REQUEST['IT'], $_REQUEST['type']);
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
