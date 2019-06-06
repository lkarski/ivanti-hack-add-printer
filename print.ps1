Param(
[string] $Printer
)
$process = Start-Process -WindowStyle hidden -FilePath ".\assets\1.pdf" -Verb PrintTo $Printer -PassThru | %{sleep 15;$_} | kill