Add-Type -AssemblyName System.Device #Required to access System.Device.Location namespace
$GeoWatcher = New-Object System.Device.Location.GeoCoordinateWatcher #Create the required object
$GeoWatcher.Start() | out-null #Begin resolving current locaton

$CivicAddressResolver = New-Object System.Device.Location.CivicAddressResolver

while (($GeoWatcher.Status -ne 'Ready') -and ($GeoWatcher.Permission -ne 'Denied')) {
    Start-Sleep -Milliseconds 100 #Wait for discovery.
}  

if ($GeoWatcher.Permission -eq 'Denied'){
    Write-Error 'Access Denied for Location Information'
} else {
    $CivicAddressResolver.ResolveAddress($GeoWatcher.Position.Location) | out-null
    $coord = $GeoWatcher.Position.Location
    $url = "http://nominatim.openstreetmap.org/reverse?format=json&lat=$($coord.Latitude.ToString().Replace(',','.'))&lon=$($coord.Longitude.ToString().Replace(',','.'))&zoom=18&addressdetails=1"
    
    try {
        $result = Invoke-RestMethod -Uri $url
        $result.address | Select-Object -Property building,city,state,postcode,country,address26,neighbourhood | ConvertTo-Json
    }
    catch {
        Write-Warning $_.Exception.Message
    }
}