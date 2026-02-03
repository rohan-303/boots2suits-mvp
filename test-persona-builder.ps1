
# Test-PersonaBuilder.ps1
# Tests the User Profile Update API for the Persona Builder

$baseUrl = "http://localhost:5000/api"

# 1. Login as Veteran to get Token
$veteranUser = @{
    email = "veteran.test@example.com"
    password = "password123"
}

try {
    Write-Host "Logging in as Veteran..." -ForegroundColor Cyan
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body ($veteranUser | ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login Successful. Token received." -ForegroundColor Green
}
catch {
    Write-Host "Login Failed. Attempting Registration..." -ForegroundColor Yellow
    $registerUser = @{
        firstName = "Veteran"
        lastName = "Test"
        email = "veteran.test@example.com"
        password = "password123"
        role = "veteran"
        militaryBranch = "Army"
    }
    try {
        $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body ($registerUser | ConvertTo-Json) -ContentType "application/json"
        $token = $registerResponse.token
        Write-Host "Registration Successful. Token received." -ForegroundColor Green
    } catch {
        Write-Host "Registration Failed." -ForegroundColor Red
        Write-Host $_.Exception.Message
        exit
    }
}

# 2. Define Persona Data Payload
$personaPayload = @{
    persona = @{
        role = "Infantry Squad Leader"
        yearsOfService = "8"
        skills = @("Leadership", "Risk Management", "Training")
        goals = "Project Management in Tech"
        bio = "A dedicated veteran with 8 years of service as Infantry Squad Leader."
    }
}

# 3. Update Profile (Save Persona)
try {
    Write-Host "Updating Profile with Persona Data..." -ForegroundColor Cyan
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/users/profile" -Method Put -Headers @{ Authorization = "Bearer $token" } -Body ($personaPayload | ConvertTo-Json) -ContentType "application/json"
    
    if ($updateResponse.persona.role -eq "Infantry Squad Leader") {
        Write-Host "Persona Saved Successfully!" -ForegroundColor Green
        Write-Host "Role: $($updateResponse.persona.role)"
        Write-Host "Bio: $($updateResponse.persona.bio)"
    } else {
        Write-Host "Persona update returned unexpected data." -ForegroundColor Yellow
        Write-Host ($updateResponse | ConvertTo-Json -Depth 5)
    }
}
catch {
    Write-Host "Update Profile Failed." -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
