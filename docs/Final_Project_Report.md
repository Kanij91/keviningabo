# Final Project Report

## Chapter 1: Introduction
...

## Chapter 5: System Design and Implementation

### 5.1 Architecture
...

### 5.2 Functional Requirements
...

### 5.3 Non-functional Requirements

#### 5.3.1 Security
The system implements role-based access control (RBAC) to ensure users can only access data relevant to their role.

#### 5.3.2 Data Privacy and Compliance
To ensure compliance with the Kenya Data Protection Act (2019), the system implements a robust data anonymization mechanism for user deletion. When a user account is deleted, their personal identifiable information (PII)—such as name and email address—is permanently removed from the database. However, to maintain the integrity of historical ticket data and system statistics, the user's ticket records are preserved. The 'requester' field in these records is updated to "Former Employee," and the email is replaced with an anonymized string (e.g., `former_employee_<ID>@deleted.com`). This approach balances the individual's right to be forgotten with the organization's need for accurate auditing and reporting.
