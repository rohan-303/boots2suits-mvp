# Test Application Flow
$baseUrl = "http://127.0.0.1:5000/api"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$employerEmail = "employer_$timestamp@test.com"
$veteranEmail = "veteran_$timestamp@test.com"

function Test-Request {
    param (
        [string]$Method,
        [string]$Uri,
        [hashtable]$Body,
        [hashtable]$Headers
    )
    try {
        $params = @{
            Method = $Method
            Uri = $Uri
            ContentType = "application/json"
        }
        if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }
        if ($Headers) { $params.Headers = $Headers }
        
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Host "Error calling $Uri" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host "Response Body: $($reader.ReadToEnd())" -ForegroundColor Red
        }
        return $null
    }
}

# 1. Register Employer
Write-Host "1. Registering Employer ($employerEmail)..." -ForegroundColor Cyan
$employerLogin = Test-Request -Method POST -Uri "$baseUrl/auth/register" -Body @{
    firstName = "Test"
    lastName = "Employer"
    email = $employerEmail
    password = "password123"
    role = "employer"
    companyName = "Tech Corp"
}
$employerToken = $employerLogin.token
if (-not $employerToken) {
    Write-Host "Employer Registration Failed!" -ForegroundColor Red
    exit
}
Write-Host "Employer Token: $employerToken" -ForegroundColor Green

# 2. Post a Job
Write-Host "`n2. Posting a Job..." -ForegroundColor Cyan
$job = Test-Request -Method POST -Uri "$baseUrl/jobs" -Headers @{ Authorization = "Bearer $employerToken" } -Body @{
    title = "Senior React Developer $timestamp"
    company = "Tech Corp"
    location = "Remote"
    type = "Full-time"
    description = "We need a React expert."
    requirements = @("React", "TypeScript", "Node.js")
}
if (-not $job) {
    Write-Host "Job Posting Failed!" -ForegroundColor Red
    exit
}
$jobId = $job._id
Write-Host "Job Created: $jobId" -ForegroundColor Green

# 3. Register Veteran
Write-Host "`n3. Registering Veteran ($veteranEmail)..." -ForegroundColor Cyan
$veteranLogin = Test-Request -Method POST -Uri "$baseUrl/auth/register" -Body @{
    firstName = "John"
    lastName = "Doe"
    email = $veteranEmail
    password = "password123"
    role = "veteran"
    militaryBranch = "Army"
}
$veteranToken = $veteranLogin.token
if (-not $veteranToken) {
    Write-Host "Veteran Registration Failed!" -ForegroundColor Red
    exit
}
Write-Host "Veteran Token: $veteranToken" -ForegroundColor Green

# 3b. Create a Resume (Mock) for Veteran
# We need to create a resume so the employer sees something
Write-Host "`n3b. Creating Mock Resume..." -ForegroundColor Cyan
$resume = Test-Request -Method POST -Uri "$baseUrl/resume" -Headers @{ Authorization = "Bearer $veteranToken" } -Body @{
    title = "Software Engineer Resume"
    militaryHistory = @{
        branch = "Army"
        rank = "Captain"
        mosCode = "25A"
        yearsOfService = 8
        description = "Signal Officer"
    }
    generatedSummary = "Experienced leader..."
    generatedSkills = @("Leadership", "Communication", "React")
    generatedExperience = @("Led team of 50")
}
if ($resume) {
    Write-Host "Resume Created." -ForegroundColor Green
} else {
    Write-Host "Resume Creation Failed." -ForegroundColor Yellow
}

# 4. Apply for Job
Write-Host "`n4. Applying for Job..." -ForegroundColor Cyan
$application = Test-Request -Method POST -Uri "$baseUrl/applications/$jobId" -Headers @{ Authorization = "Bearer $veteranToken" }
if ($application) {
    Write-Host "Applied successfully!" -ForegroundColor Green
} else {
    Write-Host "Application failed" -ForegroundColor Red
    exit
}

# 5. Employer Views Applications
Write-Host "`n5. Employer Viewing Applications..." -ForegroundColor Cyan
$apps = Test-Request -Method GET -Uri "$baseUrl/applications/job/$jobId" -Headers @{ Authorization = "Bearer $employerToken" }
if ($apps -and $apps.Count -gt 0) {
    Write-Host "Found $($apps.Count) applications." -ForegroundColor Green
    $firstApp = $apps[0]
    Write-Host "Applicant: $($firstApp.applicant.firstName)"
    if ($firstApp.resume) {
        Write-Host "Resume Found: $($firstApp.resume.title)" -ForegroundColor Green
    } else {
        Write-Host "No Resume Attached!" -ForegroundColor Red
    }
} else {
    Write-Host "No applications found!" -ForegroundColor Red
}

# 6. Veteran Views My Applications
Write-Host "`n6. Veteran Viewing My Applications..." -ForegroundColor Cyan
$myApps = Test-Request -Method GET -Uri "$baseUrl/applications/my" -Headers @{ Authorization = "Bearer $veteranToken" }
if ($myApps -and $myApps.Count -gt 0) {
    Write-Host "Found $($myApps.Count) my applications." -ForegroundColor Green
    Write-Host "Job Title: $($myApps[0].job.title)"
} else {
    Write-Host "No my applications found!" -ForegroundColor Red
}
