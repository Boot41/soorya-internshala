from enum import Enum

class UserType(str, Enum):
    APPLICANT = "applicant"
    RECRUITER = "recruiter"
