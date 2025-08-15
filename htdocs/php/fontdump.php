<?php
require('fpdf.php');
define('FPDF_FONTPATH','../font/');

class PDF extends FPDF

{
protected $col = 0;

function SetCol($col)
{
    // Set position on top of a column
    $this->col = $col;
    $this->SetLeftMargin(10+$col*40);
    $this->SetY(25);
}

function AcceptPageBreak()
{
    // Go to the next column
    $this->SetCol($this->col+1);
    return false;
}

function DumpFont($FontName)
{
    $this->AddPage();
    // Title
	$this->AddFont('gost_a','','gost common italic.php');
    $this->SetFont('Arial','',16);
    $this->Cell(0,6,$FontName,0,1,'C');
    // Print all characters in columns
    $this->SetCol(0);
    for($i=32;$i<=127;$i++)
    {
        $this->SetFont('Arial','',14);
        $this->Cell(12,5.5,"$i : ");
        $this->SetFont($FontName);
        $this->Cell(0,5.5,chr($i),0,1);
    }
	for($i=128;$i<=151;$i++)
    {
        $this->SetFont('Arial','',14);
        $this->Cell(12,5.5,"$i : ");
        $this->SetFont($FontName);
        $this->Cell(0,5.5,iconv('','utf-8', chr($i)),0,1);
    }
	for($i=153;$i<=255;$i++)
    {
        $this->SetFont('Arial','',14);
        $this->Cell(12,5.5,"$i : ");
        $this->SetFont($FontName);
        $this->Cell(0,5.5,iconv('','utf-8', chr($i)),0,1);
    }

    $this->SetCol(0);
}
}

$pdf = new PDF();
$pdf->DumpFont('gost_a');

$pdf->Output();
?>