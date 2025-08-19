# Architecture

## Tech Stack

1. React - Frontend
2. Typescript - Typesafe Language
3. TailwindCSS - Styling
4. FastAPI - API Creation
5. PostgreSQL - Database
6. Alembic - Migrations
7. SQLAlchemy - Database with ORM
8. Pydantic - Typesafe Models


## Database Schema

Based on the product features and UI requirements, here's the proposed database schema:

### 1. Users Table (`users`)

Stores core user authentication information.

| Column Name     | Data Type | Constraints                 | Description                               |
| :-------------- | :-------- | :-------------------------- | :---------------------------------------- |
| `user_id`       | UUID      | PRIMARY KEY, UNIQUE         | Unique identifier for the user            |
| `email`         | VARCHAR   | UNIQUE, NOT NULL            | User's email address, used for login      |
| `password_hash` | VARCHAR   | NOT NULL                    | Hashed password for security              |
| `user_type`     | ENUM      | ('applicant', 'recruiter'), NOT NULL | Role of the user (applicant or recruiter) |
| `created_at`    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp of user creation          |
| `updated_at`    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp             |

### 2. Applicants Table (`applicants`)

Stores specific profile information for applicants.

| Column Name           | Data Type | Constraints                 | Description                                   |
| :-------------------- | :-------- | :-------------------------- | :-------------------------------------------- |
| `applicant_id`        | UUID      | PRIMARY KEY, FOREIGN KEY (users.user_id) | Unique identifier for the applicant (same as user_id) |
| `first_name`          | VARCHAR   | NOT NULL                    | Applicant's first name                        |
| `last_name`           | VARCHAR   | NOT NULL                    | Applicant's last name                         |
| `headline`            | VARCHAR   | NULLABLE                    | Short professional headline                   |
| `bio`                 | TEXT      | NULLABLE                    | A brief biography of the applicant            |
| `resume_url`          | VARCHAR   | NULLABLE                    | URL to the applicant's resume                 |
| `experience`          | JSONB     | NULLABLE                    | Structured array of work experiences          |
| `education`           | JSONB     | NULLABLE                    | Structured array of educational background    |
| `profile_picture_url` | VARCHAR   | NULLABLE                    | URL to the applicant's profile 
        |
| `updated_at`          | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp                     |

### 3. Recruiters Table (`recruiters`)

Stores specific profile information for recruiters.

| Column Name   | Data Type | Constraints                 | Description                                   |
| :------------ | :-------- | :-------------------------- | :-------------------------------------------- |
| `recruiter_id`| UUID      | PRIMARY KEY, FOREIGN KEY (users.user_id) | Unique identifier for the recruiter (same as user_id) |
| `first_name`  | VARCHAR   | NOT NULL                    | Recruiter's first name                        |
| `last_name`   | VARCHAR   | NOT NULL                    | Recruiter's last name                         |
| `company_id`  | UUID      | FOREIGN KEY (companies.company_id), NOT NULL | Company the recruiter is associated with |
| `updated_at`  | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp                     |

### 4. Companies Table (`companies`)

Stores information about companies posting jobs.

| Column Name    | Data Type | Constraints                 | Description                                   |
| :------------- | :-------- | :-------------------------- | :-------------------------------------------- |
| `company_id`   | UUID      | PRIMARY KEY, UNIQUE         | Unique identifier for the company             |
| `name`         | VARCHAR   | UNIQUE, NOT NULL            | Company's official name                       |
| `description`  | TEXT      | NULLABLE                    | Detailed description of the company           |
| `website_url`  | VARCHAR   | NULLABLE                    | Company's official website URL                |
| `logo_url`     | VARCHAR   | NULLABLE                    | URL to the company's logo                     |
| `industry`     | VARCHAR   | NULLABLE                    | Industry the company belongs to               |
| `headquarters` | VARCHAR   | NULLABLE                    | Location of the company's headquarters        |
| `created_at`   | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp of company profile creation |
| `updated_at`   | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp                     |

### 5. JobPostings Table (`job_postings`)

Stores details about job openings posted by recruiters.

| Column Name        | Data Type | Constraints                 | Description                                   |
| :----------------- | :-------- | :-------------------------- | :-------------------------------------------- |
| `job_id`           | UUID      | PRIMARY KEY, UNIQUE         | Unique identifier for the job posting         |
| `company_id`       | UUID      | FOREIGN KEY (companies.company_id), NOT NULL | Company that posted the job               |
| `recruiter_id`     | UUID      | FOREIGN KEY (recruiters.recruiter_id), NOT NULL | Recruiter who posted the job              |
| `title`            | VARCHAR   | NOT NULL                    | Job title                                     |
| `description`      | TEXT      | NOT NULL                    | Detailed job description                      |
| `requirements`     | TEXT      | NOT NULL                    | Key requirements for the role                 |
| `skills_required`  | TEXT      | NULLABLE                    | Comma-separated list of required skills or JSONB array |
| `location`         | VARCHAR   | NOT NULL                    | Job location (e.g., 'Remote', 'New York, NY') |
| `experience_level` | VARCHAR   | NULLABLE                    | Required experience level (e.g., 'Entry-level', 'Mid', 'Senior') |
| `job_type`         | ENUM      | ('full-time', 'part-time', 'internship', 'contract'), NOT NULL | Type of employment |
| `salary_range`     | VARCHAR   | NULLABLE                    | Expected salary range (e.g., '$50k - $70k')   |
| `posted_at`        | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the job was posted         |
| `expires_at`       | TIMESTAMP | NULLABLE                    | Date when the job posting expires             |
| `status`           | ENUM      | ('open', 'closed', 'draft'), NOT NULL | Current status of the job posting         |
| `updated_at`       | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp                     |

### 6. Applications Table (`applications`)

Records job applications made by applicants.

| Column Name                 | Data Type | Constraints                 | Description                                   |
| :-------------------------- | :-------- | :-------------------------- | :-------------------------------------------- |
| `application_id`            | UUID      | PRIMARY KEY, UNIQUE         | Unique identifier for the application         |
| `job_id`                    | UUID      | FOREIGN KEY (job_postings.job_id), NOT NULL | Job to which the applicant applied          |
| `applicant_id`              | UUID      | FOREIGN KEY (applicants.applicant_id), NOT NULL | Applicant who submitted the application   |
| `applied_at`                | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the application was submitted |
| `status`                    | ENUM      | ('applied', 'under review', 'shortlisted', 'rejected', 'hired'), NOT NULL | Current status of the application |
| `cover_letter`              | TEXT      | NULLABLE                    | Optional cover letter submitted with application |
| `resume_url_at_application` | VARCHAR   | NULLABLE                    | Snapshot URL of the resume at the time of application |
| `updated_at`                | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp                     |

### 7. Skills Table (`skills`)

Stores a list of available skills.

| Column Name  | Data Type | Constraints         | Description               |
| :----------- | :-------- | :------------------ | :------------------------ |
| `skill_id`   | UUID      | PRIMARY KEY, UNIQUE | Unique identifier for the skill |
| `skill_name` | VARCHAR   | UNIQUE, NOT NULL    | Name of the skill         |

### 8. ApplicantSkills Table (`applicant_skills`)

Junction table to link applicants with their skills.

| Column Name    | Data Type | Constraints                               | Description                               |
| :------------- | :-------- | :---------------------------------------- | :---------------------------------------- |
| `applicant_id` | UUID      | PRIMARY KEY, FOREIGN KEY (applicants.applicant_id) | Unique identifier for the applicant       |
| `skill_id`     | UUID      | PRIMARY KEY, FOREIGN KEY (skills.skill_id) | Unique identifier for the skill           |