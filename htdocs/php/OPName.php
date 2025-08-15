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
    $query = "SELECT * FROM exec_type_process";
    $data1 = $db->query($query);
	$query2 = "SELECT * FROM operation_code_name";
	$data2 = $db->query($query2);
	$d1 = $data1->fetch_all();//преобразование таблицы видов ТП в массив
	$d2 = $data2->fetch_all();//преобразование таблицы наименований операций в массив
	
    $tree = array();
	$k=0;
	$c1=count($d1);
	$c2=count($d2);
	$tree[$k]['text']='Операции';
	$tree[$k]['parent']='#';
	$tree[$k]['type']='OPBase';
	$tree[$k]['id']='j1_0';
	$tree[$k]['state']['opened']=true;
	$tree[$k]['a_attr']['href']='#';
	$k=1;
	for ($i=0; $i<$c1; $i++){
		$tree[$k]['id']='j1_'.$k;
		//$tree[$k]['data']=$d1[$i][1];
		$tree[$k]['text']=$d1[$i][1];
		$tree[$k]['parent']='j1_0';
		$tree[$k]['type']='OPGroup';
		$tree[$k]['icon']='jstree-file';
		/*$tree[$k]['state']['loaded']=true;
		$tree[$k]['state']['opened']=false;
		$tree[$k]['state']['selected']=false;
		$tree[$k]['state']['disabled']=false;
		$tree[$k]['li_attr']['id']=$tree[$k]['id'];
		$tree[$k]['a_attr']['id']=$tree[$k]['id'].'_anchor';*/
		$par=$tree[$k]['id'];
		$k++;
		for ($j=0; $j<$c2; $j++){
			if ($d2[$j][3]==$d1[$i][2]||$d2[$j][3]==$d1[$i][3]){
				$tree[$k]['id']='j1_'.$k;
				$tree[$k]['text']=$d2[$j][2];
				//$tree[$k]['data']=$d2[$j][2];
				$tree[$k]['parent']=$par;
				$tree[$k]['type']='OP';
				$tree[$k]['icon']='img/A16.png';
				$tree[$k]['data']=$d2[$j][1];
				$k++;
			}
		}
	
	}
	$data1->close();
	$data2->close();
    /*while ($row = $data->fetch_assoc()) {
        array_push($tree, array(
            'id' => $row['ID'],
            'text' => $row['Proc_kind_method'],
            'id1' => $row['ID1'],
			'id2' => $row['ID2'],
			'parent'=>'#',
			'type'=>'OPGroup'
        ));
		
		while ($row = $data2->fetch_assoc()) {
			array_push($tree, array(
				'id' => $row['ID'],
				'text' => $row['Name'],
				'parent'=>'OPGroup',
				'type'=>'OP'
			));	
		}
    }*/
	return $tree;
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
