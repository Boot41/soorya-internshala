# API Specification

This document outlines the RESTful API endpoints for the Internshala Clone platform, based on the product features, user stories, and database schema.

## 1. Authentication & User Management

### 1.1 Register User

- **HTTP Method:** `POST`
- **HTTP Endpoint:** `/auth/register`
- **Description:** Registers a new user (applicant or recruiter) with their email and password.
- **Required Params:** None
- **Optional Params:** None
- **Body:**

    ```json
    {
        "email": "user@example.com",
        "password": "securepassword123",
        "user_type": "applicant" // or "recruiter"
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "User registered successfully",
        "user_id": "uuid-of-new-user"
    }
    ```

- **Response Status Code:** `201 Created`
- **Expected Errors:**
  - `400 Bad Request`: `{"detail": "Email already registered"}`
  - `422 Unprocessable Entity`: `{"detail": "Invalid user_type"}`

### 1.2 Login User

- **HTTP Method:** `POST`
- **HTTP Endpoint:** `/auth/login`
- **Description:** Authenticates a user and returns an access token.
- **Required Params:** None
- **Optional Params:** None
- **Body:**

    ```json
    {
        "email": "user@example.com",
        "password": "securepassword123"
    }
    ```

- **Response Body:**

    ```json
    {
        "access_token": "jwt-token-string",
        "token_type": "bearer"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Invalid credentials"}`

### 1.3 Get Current User Profile

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/users/me`
- **Description:** Retrieves the profile information of the currently authenticated user.
- **Required Params:** None
- **Optional Params:** None
- **Body:** None
- **Response Body (Applicant):**

    ```json
    {
        "user_id": "uuid-of-applicant",
        "email": "applicant@example.com",
        "user_type": "applicant",
        "first_name": "John",
        "last_name": "Doe",
        "headline": "Software Engineer",
        "bio": "Experienced developer...",
        "resume_url": "http://example.com/resume.pdf",
        "experience": [],
        "education": [],
        "profile_picture_url": "http://example.com/profile.jpg"
    }
    ```

- **Response Body (Recruiter):**

    ```json
    {
        "user_id": "uuid-of-recruiter",
        "email": "recruiter@example.com",
        "user_type": "recruiter",
        "first_name": "Jane",
        "last_name": "Smith",
        "company_id": "uuid-of-company"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `404 Not Found`: `{"detail": "User profile not found"}`

### 1.4 Update Current User Profile

- **HTTP Method:** `PUT`
- **HTTP Endpoint:** `/users/me`
- **Description:** Updates the profile information of the currently authenticated user.
- **Required Params:** None
- **Optional Params:** None
- **Body (Applicant - partial update allowed):**

    ```json
    {
        "first_name": "John",
        "last_name": "Doe",
        "headline": "Senior Software Engineer",
        "bio": "Updated biography...",
        "resume_url": "http://example.com/new_resume.pdf",
        "experience": [
            {"title": "Software Engineer", "company": "ABC Corp"}
        ],
        "education": [
            {"degree": "B.Sc. Computer Science", "university": "XYZ Uni"}
        ],
        "profile_picture_url": "http://example.com/new_profile.jpg"
    }
    ```

- **Body (Recruiter - partial update allowed):**

    ```json
    {
        "first_name": "Jane",
        "last_name": "Smith"
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "Profile updated successfully"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `400 Bad Request`: `{"detail": "Invalid input data"}`

## 2. Company Management (Recruiter Specific)

### 2.1 Create Company Profile

- **HTTP Method:** `POST`
- **HTTP Endpoint:** `/companies`
- **Description:** Creates a new company profile for the authenticated recruiter.
- **Required Params:** None
- **Optional Params:** None
- **Body:**

    ```json
    {
        "name": "Tech Solutions Inc.",
        "description": "A leading tech company...",
        "website_url": "http://techsolutions.com",
        "logo_url": "http://techsolutions.com/logo.png",
        "industry": "Software",
        "headquarters": "San Francisco, CA"
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "Company profile created successfully",
        "company_id": "uuid-of-new-company"
    }
    ```

- **Response Status Code:** `201 Created`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Only recruiters can create companies"}`
  - `400 Bad Request`: `{"detail": "Company name already exists"}`

### 2.2 Get Company Profile

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/companies/{company_id}`
- **Description:** Retrieves a specific company's profile by ID.
- **Required Params:**
  - `company_id`: UUID (Path Parameter)
- **Optional Params:** None
- **Body:** None
- **Response Body:**

    ```json
    {
        "company_id": "uuid-of-company",
        "name": "Tech Solutions Inc.",
        "description": "A leading tech company...",
        "website_url": "http://techsolutions.com",
        "logo_url": "http://techsolutions.com/logo.png",
        "industry": "Software",
        "headquarters": "San Francisco, CA"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `404 Not Found`: `{"detail": "Company not found"}`

### 2.3 Update Company Profile

- **HTTP Method:** `PUT`
- **HTTP Endpoint:** `/companies/{company_id}`
- **Description:** Updates an existing company profile. Only accessible by the recruiter associated with the company.
- **Required Params:**
  - `company_id`: UUID (Path Parameter)
- **Optional Params:** None
- **Body (partial update allowed):**

    ```json
    {
        "description": "Updated description for the company.",
        "website_url": "http://new-techsolutions.com"
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "Company profile updated successfully"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Not authorized to update this company"}`
  - `404 Not Found`: `{"detail": "Company not found"}`
  - `400 Bad Request`: `{"detail": "Invalid input data"}`

## 3. Job Posting Management (Recruiter Specific)

### 3.1 Create Job Posting

- **HTTP Method:** `POST`
- **HTTP Endpoint:** `/jobs`
- **Description:** Creates a new job posting.
- **Required Params:** None
- **Optional Params:** None
- **Body:**

    ```json
    {
        "company_id": "uuid-of-company",
        "title": "Software Engineer Intern",
        "description": "Develop and maintain software...",
        "requirements": "Strong programming skills...",
        "skills_required": "Python, JavaScript",
        "location": "Remote",
        "experience_level": "Entry-level",
        "job_type": "internship",
        "salary_range": "$40k - $50k",
        "expires_at": "2025-12-31T23:59:59Z"
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "Job posting created successfully",
        "job_id": "uuid-of-new-job"
    }
    ```

- **Response Status Code:** `201 Created`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Only recruiters can post jobs"}`
  - `400 Bad Request`: `{"detail": "Invalid input data"}`
  - `404 Not Found`: `{"detail": "Company not found"}`

### 3.2 Get Job Posting by ID

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/jobs/{job_id}`
- **Description:** Retrieves details of a specific job posting.
- **Required Params:**
  - `job_id`: UUID (Path Parameter)
- **Optional Params:** None
- **Body:** None
- **Response Body:**

    ```json
    {
        "job_id": "uuid-of-job",
        "company_id": "uuid-of-company",
        "recruiter_id": "uuid-of-recruiter",
        "title": "Software Engineer Intern",
        "description": "Develop and maintain software...",
        "requirements": "Strong programming skills...",
        "skills_required": "Python, JavaScript",
        "location": "Remote",
        "experience_level": "Entry-level",
        "job_type": "internship",
        "salary_range": "$40k - $50k",
        "posted_at": "2025-08-19T10:00:00Z",
        "expires_at": "2025-12-31T23:59:59Z",
        "status": "open"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `404 Not Found`: `{"detail": "Job posting not found"}`

### 3.3 Get All Job Postings (for a Recruiter)

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/recruiters/me/jobs`
- **Description:** Retrieves all job postings created by the authenticated recruiter.
- **Required Params:** None
- **Optional Params:**
  - `status`: Query Parameter (e.g., `open`, `closed`, `draft`)
- **Body:** None
- **Response Body:**

    ```json
    [
        {
            "job_id": "uuid-of-job-1",
            "title": "Software Engineer",
            "status": "open"
        },
        {
            "job_id": "uuid-of-job-2",
            "title": "Data Scientist",
            "status": "closed"
        }
    ]
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Only recruiters can view their job postings"}`

### 3.4 Update Job Posting

- **HTTP Method:** `PUT`
- **HTTP Endpoint:** `/jobs/{job_id}`
- **Description:** Updates an existing job posting. Only accessible by the recruiter who created it.
- **Required Params:**
  - `job_id`: UUID (Path Parameter)
- **Optional Params:** None
- **Body (partial update allowed):**

    ```json
    {
        "description": "Updated job description.",
        "status": "closed"
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "Job posting updated successfully"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Not authorized to update this job posting"}`
  - `404 Not Found`: `{"detail": "Job posting not found"}`
  - `400 Bad Request`: `{"detail": "Invalid input data"}`

### 3.5 Delete Job Posting

- **HTTP Method:** `DELETE`
- **HTTP Endpoint:** `/jobs/{job_id}`
- **Description:** Deletes a job posting. Only accessible by the recruiter who created it.
- **Required Params:**
  - `job_id`: UUID (Path Parameter)
- **Optional Params:** None
- **Body:** None
- **Response Body:**

    ```json
    {
        "message": "Job posting deleted successfully"
    }
    ```

- **Response Status Code:** `204 No Content`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Not authorized to delete this job posting"}`
  - `404 Not Found`: `{"detail": "Job posting not found"}`

## 4. Job Listing & Application (Public/Applicant Specific)

### 4.1 Get All Job Listings

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/jobs`
- **Description:** Retrieves a list of all available job postings, with optional filtering and pagination.
- **Required Params:** None
- **Optional Params:**
  - `search`: Query Parameter (e.g., `software engineer`)
  - `location`: Query Parameter (e.g., `Remote`, `New York`)
  - `job_type`: Query Parameter (e.g., `full-time`, `internship`)
  - `experience_level`: Query Parameter (e.g., `Entry-level`, `Senior`)
  - `skills`: Query Parameter (comma-separated skills, e.g., `Python,SQL`)
  - `limit`: Query Parameter (e.g., `10`)
  - `offset`: Query Parameter (e.g., `0`)
- **Body:** None
- **Response Body:**

    ```json
    [
        {
            "job_id": "uuid-of-job-1",
            "title": "Frontend Developer",
            "company_name": "ABC Corp",
            "location": "Remote",
            "job_type": "full-time",
            "posted_at": "2025-08-18T10:00:00Z"
        },
        {
            "job_id": "uuid-of-job-2",
            "title": "Backend Engineer",
            "company_name": "XYZ Inc.",
            "location": "New York, NY",
            "job_type": "full-time",
            "posted_at": "2025-08-17T15:30:00Z"
        }
    ]
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:** None

### 4.2 Apply for Job

- **HTTP Method:** `POST`
- **HTTP Endpoint:** `/jobs/{job_id}/apply`
- **Description:** Allows an authenticated applicant to apply for a specific job.
- **Required Params:**
  - `job_id`: UUID (Path Parameter)
- **Optional Params:** None
- **Body:**

    ```json
    {
        "cover_letter": "Optional cover letter content."
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "Application submitted successfully",
        "application_id": "uuid-of-new-application"
    }
    ```

- **Response Status Code:** `201 Created`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Only applicants can apply for jobs"}`
  - `404 Not Found`: `{"detail": "Job posting not found"}`
  - `400 Bad Request`: `{"detail": "Already applied to this job"}`

### 4.3 Get My Applications

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/applicants/me/applications`
- **Description:** Retrieves all job applications submitted by the authenticated applicant.
- **Required Params:** None
- **Optional Params:**
  - `status`: Query Parameter (e.g., `applied`, `under review`, `shortlisted`, `rejected`, `hired`)
- **Body:** None
- **Response Body:**

    ```json
    [
        {
            "application_id": "uuid-of-app-1",
            "job_id": "uuid-of-job-1",
            "job_title": "Frontend Developer",
            "company_name": "ABC Corp",
            "status": "under review",
            "applied_at": "2025-08-19T11:00:00Z"
        },
        {
            "application_id": "uuid-of-app-2",
            "job_id": "uuid-of-job-2",
            "job_title": "Backend Engineer",
            "company_name": "XYZ Inc.",
            "status": "applied",
            "applied_at": "2025-08-19T09:30:00Z"
        }
    ]
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Only applicants can view their applications"}`

## 5. Applicant Management (Recruiter Specific)

### 5.1 Get Applicants for a Job Posting

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/jobs/{job_id}/applicants`
- **Description:** Retrieves a list of applicants for a specific job posting. Only accessible by the recruiter who posted the job.
- **Required Params:**
  - `job_id`: UUID (Path Parameter)
- **Optional Params:**
  - `status`: Query Parameter (e.g., `applied`, `under review`, `shortlisted`, `rejected`, `hired`)
- **Body:** None
- **Response Body:**

    ```json
    [
        {
            "application_id": "uuid-of-app-1",
            "applicant_id": "uuid-of-applicant-1",
            "applicant_name": "John Doe",
            "applicant_email": "john.doe@example.com",
            "status": "under review",
            "applied_at": "2025-08-19T11:00:00Z",
            "resume_url_at_application": "http://example.com/resume_john.pdf"
        },
        {
            "application_id": "uuid-of-app-2",
            "applicant_id": "uuid-of-applicant-2",
            "applicant_name": "Jane Smith",
            "applicant_email": "jane.smith@example.com",
            "status": "applied",
            "applied_at": "2025-08-19T09:30:00Z",
            "resume_url_at_application": "http://example.com/resume_jane.pdf"
        }
    ]
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Not authorized to view applicants for this job"}`
  - `404 Not Found`: `{"detail": "Job posting not found"}`

### 5.2 Update Application Status

- **HTTP Method:** `PUT`
- **HTTP Endpoint:** `/applications/{application_id}/status`
- **Description:** Updates the status of a specific job application. Only accessible by the recruiter who posted the job.
- **Required Params:**
  - `application_id`: UUID (Path Parameter)
- **Optional Params:** None
- **Body:**

    ```json
    {
        "status": "shortlisted" // or "under review", "rejected", "hired"
    }
    ```

- **Response Body:**

    ```json
    {
        "message": "Application status updated successfully"
    }
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:**
  - `401 Unauthorized`: `{"detail": "Not authenticated"}`
  - `403 Forbidden`: `{"detail": "Not authorized to update this application"}`
  - `404 Not Found`: `{"detail": "Application not found"}`
  - `400 Bad Request`: `{"detail": "Invalid status"}`

## 6. Skills Management

### 6.1 Get All Skills

- **HTTP Method:** `GET`
- **HTTP Endpoint:** `/skills`
- **Description:** Retrieves a list of all available skills.
- **Required Params:** None
- **Optional Params:** None
- **Body:** None
- **Response Body:**

    ```json
    [
        {
            "skill_id": "uuid-of-skill-1",
            "skill_name": "Python"
        },
        {
            "skill_id": "uuid-of-skill-2",
            "skill_name": "JavaScript"
        }
    ]
    ```

- **Response Status Code:** `200 OK`
- **Expected Errors:** None
