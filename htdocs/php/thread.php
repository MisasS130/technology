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
function getDataD($db, $tt, $ts) {
	
	if ($tt==0) {
		$query = "SELECT DISTINCT d, obozn_d FROM rdm_thread_d_step WHERE vrtype='$tt' AND typestep='$ts'";
	}
	else {
		$query = "SELECT DISTINCT d, obozn_d FROM rdm_thread_d_step WHERE vrtype='$tt' ";
	}
	if ($tt==3) $query = "SELECT DISTINCT d FROM rdm_thread_countstart";
    $data = $db->query($query);
	$ds = $data->fetch_all();
	return $ds;
	$data->close();
}
function getDataS($db, $tt, $ts, $d) {
	if ($tt==3) $tt=2;
	if ($tt==0) {
		$query = "SELECT step, d1, d2, d3, d4 FROM rdm_thread_d_step WHERE d='$d' AND vrtype='$tt' AND typestep='$ts'";
	}
	else {
		$query = "SELECT step, d1, d2, d3, d4 FROM rdm_thread_d_step WHERE d='$d' AND vrtype='$tt'";
	}
    $data = $db->query($query);
	$ds = $data->fetch_all();
	return $ds;
	$data->close();
}
function getDataT($db, $tt, $tf, $st, $d) {
	if ($tt==3) $tt=2;
    $query = "SELECT tolerance, ei_d, es_d, ei_d1, es_d1, ei_d2, es_d2, ei_d3, es_d3, ei_d4, es_d4 FROM rdm_thread_tolerance WHERE vrtype='$tt' AND step='$st' AND typeform='$tf' AND '$d' BETWEEN d_min AND d_max";
    $data = $db->query($query);
	$ds = $data->fetch_all();
	return $ds;
	$data->close();
}
function getDataZ($db, $s, $d) {
    $query = "SELECT countstart FROM rdm_thread_countstart WHERE d='$d' AND step='$s'";
    $data = $db->query($query);
	$ds = $data->fetch_all();
	return $ds;
	$data->close();
}
try {
    // Подключаемся к базе данных
    $conn = connectDB(); 
	$action = $_REQUEST['action'];
	switch ($action) {
    // Получаем данные
	case 'Thread_kind':
		if (isset($_REQUEST)) $result = getDataD($conn, $_REQUEST[0], $_REQUEST[1]);
		break;
	case 'selectd':
		if (isset($_REQUEST)) $result = getDataS($conn, $_REQUEST[0], $_REQUEST[1], $_REQUEST[2]);
		break;
	case 'selects':
		if (isset($_REQUEST)) $result = getDataT($conn, $_REQUEST[0], $_REQUEST[1], $_REQUEST[2], $_REQUEST[3]);
		break;
	case 'selectz':
		if (isset($_REQUEST)) $result = getDataZ($conn, $_REQUEST[0], $_REQUEST[1]);
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