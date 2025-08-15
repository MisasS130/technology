<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=UTF-8');
define('FPDF_FONTPATH','../font/');
require_once( "fpdf.php" );
$pdf = new FPDF( 'L', 'mm','A4');
$pdf->AddFont('gost_a','','GOSTmi.php');
//$pdf->AddFont('gost_a','','Arial-ItalicMT.php');
$pdf->SetFont('gost_a','',12);
//$pdf->SetAutoPageBreak(true,0);
//$pdf->SetMargins(5.5,0,5.5);
	
//$pdf->SetTextColor( 0, 0, 0);
$pdf->AddPage();

/*for($i=32;$i<256;$i++){
	$str=chr($i);
	$lstr=($pdf->GetStringWidth($str));
	echo $lstr.', ';
}*/

/*for($i=32;$i<256;$i++){
	$str=chr($i);
	$lstr=($pdf->GetStringWidth($str));
	echo $i."'".iconv('', 'UTF-8', chr($i))."' => ".$lstr.', ';
}
/*$str='АБВ';
//$str=iconv('', 'UTF-8', chr(192)).iconv('', 'UTF-8', chr(193)).iconv('', 'UTF-8', chr(194));
$pdf->SetXY(5.5,6);
$pdf->Write(0,$str);
$pdf->SetXY(5.5,12);
$lstr=($pdf->GetStringWidth($str));
$pdf->Write(0,$pdf->GetStringWidth($str[0]).'+'.$pdf->GetStringWidth($str[1]).'+'.$pdf->GetStringWidth($str[2]).'='.$lstr);
$pdf->SetXY(5.5,18);
$pdf->Write(0,ord($str[0]).' '.ord($str[1]).' '.ord($str[2]).' '.ord($str[3]).' '.ord($str[4]).' '.ord($str[5]));
*/
for($i=32;$i<127;$i++){
	$str=chr($i);
	$lstr=($pdf->GetStringWidth($str));
	$pdf->Write(1, $str);
}
$pdf->SetXY(20,15);
for($i=128;$i<152;$i++){$pdf->Cell(10,5, $i,1);
}
$pdf->SetXY(20,20);
for($i=128;$i<152;$i++){
	$str=chr($i);
	$strutf=iconv('windows-1251', 'utf-8', $str);
	$lstr=($pdf->GetStringWidth($str));
	//$pdf->Write(1, $strutf);
	$pdf->Cell(10,5, $strutf,1);
}
$pdf->SetXY(20,25);
for($i=153;$i<177;$i++){$pdf->Cell(10,5, $i,1);
}
$pdf->SetXY(20,30);
for($i=153;$i<177;$i++){
	$str=chr($i);
	$strutf=iconv('windows-1251', 'utf-8' , $str);
	$lstr=($pdf->GetStringWidth($str));
	//$pdf->Write(1, $strutf);
	$pdf->Cell(10,5, $strutf,1);
}
$pdf->SetXY(20,35);
for($i=177;$i<201;$i++){$pdf->Cell(10,5, $i,1);
}
$pdf->SetXY(20,40);
for($i=177;$i<201;$i++){
	$str=chr($i);
	$strutf=iconv('windows-1251', 'utf-8' , $str);
	$lstr=($pdf->GetStringWidth($str));
	//$pdf->Write(1, $strutf);
	$pdf->Cell(10,5, $strutf,1);
}
$pdf->ln();
$pdf->SetXY(20,45);
for($i=201;$i<224;$i++){$pdf->Cell(10,5, $i,1);
}
$pdf->SetXY(20,50);
for($i=201;$i<224;$i++){
	$str=chr($i);
	$strutf=iconv('windows-1251', 'utf-8', $str);
	$lstr=($pdf->GetStringWidth($str));
	//$pdf->Write(1, $strutf);
	$pdf->Cell(10,5, $strutf,1);
}
$pdf->ln();
$pdf->SetXY(20,55);
for($i=224;$i<248;$i++){$pdf->Cell(10,5, $i,1);
}
$pdf->SetXY(20,60);
for($i=224;$i<248;$i++){
	$str=chr($i);
	$strutf=iconv('windows-1251', 'utf-8' , $str);
	$lstr=($pdf->GetStringWidth($str));
	//$pdf->Write(1, $strutf);
	$pdf->Cell(10,5, $strutf,1);
}
$pdf->SetXY(20,65);
for($i=248;$i<256;$i++){$pdf->Cell(10,5, $i,1);
}
$pdf->SetXY(20,70);
for($i=248;$i<256;$i++){
	$str=chr($i);
	$strutf=iconv('windows-1251', 'utf-8' , $str);
	$lstr=($pdf->GetStringWidth($str));
	//$pdf->Write(1, $strutf);
	$pdf->Cell(10,5, $strutf,1);
}

/***
  Выводим PDF
***/
$pdf->Output( "report.pdf", "I" );
?>