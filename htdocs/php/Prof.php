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
function getData($db) {
    $query = "SELECT Code, Prof_Name FROM professions";
    $data = $db->query($query);
	$profdata= array();
    while ($row = $data->fetch_assoc()) {
        array_push($profdata, array(
            'Code' => $row['Code'],
            //'KCH' => $row['KCH'],
            'Name' => $row['Prof_Name']
			//'ETKS' => $row['ETKS_Code'],
			//'OKZ'=>$row['OKZ_Code']
        ));
    }
	return $profdata;
	$data->close();
}

try {
    // Подключаемся к базе данных
    $conn = connectDB(); 
    // Получаем данные
    $result = getData($conn);
    

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
