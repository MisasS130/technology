<?php
/*
// Объявляем нужные константы
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');*/
define('DB_NAME', 'ezyro_30950232_mdb');

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
    $query = "SELECT * FROM material_class_section ORDER BY `material_class_section`.`id` ASC";
    $data1 = $db->query($query);
	$query2 = "SELECT * FROM material_classification ";
	$data2 = $db->query($query2);
	$query3 = "SELECT * FROM materials";
	$data3 = $db->query($query3);
	$query4 = "SELECT * FROM material_gost";
	$data4 = $db->query($query4);	
	$d1 = $data1->fetch_all();//преобразование таблицы разделов материалов
	$d2 = $data2->fetch_all();//преобразование таблицы классов материалов
	$d3 = $data3->fetch_all();//преобразование таблицы марок материалов
	$d4 = $data4->fetch_all();//преобразование таблицы ГОСТов материалов
    $tree = array();
	$k=0;
	$c1=count($d1);
	$c2=count($d2);
	$c3=count($d3);
	$c4=count($d4);
	$tree[$k]['text']='Материал';
	$tree[$k]['parent']='#';
	$tree[$k]['type']='Root';
	$tree[$k]['id']='j1_0';
	$tree[$k]['state']['opened']=true;
	$tree[$k]['a_attr']['href']='#';
	$k=1;
	for ($i=0; $i<$c1; $i++){
		$tree[$k]['id']='j1_'.$k;
		$tree[$k]['text']=$d1[$i][1];
		$tree[$k]['parent']='j1_0';
		$tree[$k]['type']='Section';
		$par=$tree[$k]['id'];
		$k++;
		for ($j=0; $j<$c2; $j++){
			if ($d2[$j][2]==$d1[$i][0]){
				$tree[$k]['id']='j1_'.$k;
				$tree[$k]['text']=$d2[$j][1];
				$tree[$k]['parent']=$par;
				$tree[$k]['type']='Grade';
				$par1=$tree[$k]['id'];
				$k++;
				for ($l=0; $l<$c3; $l++){
					if ($d3[$l][3]==$d2[$j][0]){
						$tree[$k]['id']='j1_'.$k;
						$tree[$k]['text']=$d3[$l][1].' '.$d3[$l][2];
						$tree[$k]['parent']=$par1;
						$tree[$k]['type']='Brand';
						$par2=$tree[$k]['id'];
						$k++;
						for ($m=0; $m<$c4; $m++){
							$str=explode(";", $d3[$l][4]);
							$c5=count($str);
							for ($n=0; $n<$c5; $n++){
								if ($str[$n]==$d4[$m][0]){
									$tree[$k]['id']='j1_'.$k;
									$tree[$k]['text']=$d4[$m][1];
									$tree[$k]['parent']=$par2;
									$tree[$k]['type']='GOST';
									$tree[$k]['icon']='jstree-file';
									$tree[$k]['data']=$d4[$m][2];
									$k++;
								}
							}
						}
					}
				}
			}
		}
	
	}
	$data1->close();
	$data2->close();
	$data3->close();
	$data4->close();
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
