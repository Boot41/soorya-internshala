# Product

My Product is a platform where recruiters can post job openings of their companies and applicants can apply for those openings.

## Features

Here are some of the base features for the prototype:

- **User Authentication:** Separate login and registration for Applicants and Recruiters.
- **Job Listings:** A public page to display all job openings with filtering options.
- **Recruiter Dashboard:**
  - Create and manage company profiles.
  - Post new job openings.
  - View applicants for their jobs.
- **Applicant Dashboard:**
  - Create and manage their profiles (skills, experience, resume).
  - Apply for jobs.
  - View the status of their applications.

## User Stories

1. Opportunity Listings in Landing Page - As a applicant i want to see the list the applications so that I can see all the Opportunity

2. Authentication - As an User, I want to Login as an Applicant or as an Recruiter so that I can apply to an Opportunity or post an Opportunity respectively.

3. Profile Management - As an applicant, I want to Update my Skills, experience, Basic 1. Opportunity Listings in Landing Page - As a applicant i want to see the list the applications so that I can see all the Opportunity

4. Posting Opportunity - As a recruiter, I want to Create a new Opportunity with required skills and experience so that I can hire a relevant candidate.

5. View and Apply to Opportunities - As an applicant, I want apply to an Opportunity so that I can take part in hiring process.

6. Status of Application - As an applicant, I want to see the Status of my application so that I can get to know if there is any updates on that application.

7. View Applicants - As a recruiter, I want to view the Applicants applied for the Opportunity so that I can decide the right candidate.Information and Resume so that my profile stays upto date.

## UI Pages

Based on the features and user stories, the following UI pages will be required:

### Public Pages

- **Landing Page:** Displays a brief overview of the platform, calls to action for applicants and recruiters, and a prominent search bar for job listings.
- **Job Listings Page:** Shows all available job openings with filters (e.g., by skill, location, experience level) and search functionality. Each listing will be a clickable card.
- **Job Detail Page:** Displays detailed information about a specific job opening, including description, requirements, company details, and an "Apply Now" button.
- **Login Page:** Separate login forms for applicants and recruiters.
- **Registration Page:** Separate registration forms for applicants and recruiters.

### Applicant Pages (Applicant Dashboard)

- **Applicant Profile Page:** Allows applicants to view and edit their personal information, skills, experience, education, and upload/update their resume.
- **My Applications Page:** Lists all jobs the applicant has applied for, with their current status (e.g., Applied, Under Review, Shortlisted, Rejected).

### Recruiter Pages (Recruiter Dashboard)

- **Recruiter Dashboard Home:** A personalized dashboard showing a summary of posted jobs, company profile status, and quick links.
- **Company Profile Page:** Allows recruiters to create, view, and edit their company's profile, including name, description, logo, and contact information.
- **Post New Job Page:** A form to create and publish new job openings with fields for title, description, requirements, skills, location, and experience.
- **My Job Postings Page:** Lists all job openings posted by the recruiter, with options to view, edit, or close postings.
- **View Applicants Page:** For a specific job posting, displays a list of all applicants, with options to view their profiles and application status.

## Navigation

### Global Navigation (Header/Footer)

- **Home/Logo:** Links to the Landing Page.
- **Job Listings:** Links to the Job Listings Page.
- **Login:** Links to the Login Page.
- **Register:** Links to the Registration Page.
- **Dashboard (Conditional):** Appears after login, leading to either Applicant Dashboard Home or Recruiter Dashboard Home based on user role.

### Applicant Dashboard Navigation

- **Dashboard Home:** Link to Applicant Dashboard Home.
- **My Profile:** Link to Applicant Profile Page.
- **My Applications:** Link to My Applications Page.
- **Logout:** Logs the user out.

### Recruiter Dashboard Navigation

- **Dashboard Home:** Link to Recruiter Dashboard Home.
- **Company Profile:** Link to Company Profile Page.
- **Post New Job:** Link to Post New Job Page.
- **My Job Postings:** Link to My Job Postings Page.
- **Logout:** Logs the user out.

## Key Components

- **Header:** Contains global navigation, logo, and user authentication links.
- **Footer:** Contains copyright information, privacy policy, and other general links.
- **Search Bar:** For searching job listings by keywords.
- **Filter/Sort Options:** For refining job listings (e.g., by location, salary, experience).
- **Job Card:** A reusable component to display a summary of a job opening on the Job Listings Page.
- **Form Fields:** Standard input fields (text, textarea, dropdowns, file upload) for registration, login, profile management, and job posting.
- **Buttons:** Primary, secondary, and action-specific buttons (e.g., "Apply Now", "Save Profile", "Post Job").
- **User Profile Card:** A component to display a summary of an applicant's profile for recruiters.
- **Application Status Indicator:** A visual component to show the current status of a job application.
- **Pagination:** For navigating through long lists of job listings or applicants.
- **Modals/Dialogs:** For confirmations, alerts, or quick input forms (e.g., "Are you sure you want to apply?").

## References

- [Naukri](https://naukri.com)
- [Internshala](https://internshala.com)
