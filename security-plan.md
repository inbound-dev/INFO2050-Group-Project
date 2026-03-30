# Security Plan

---

## 1. Attack Surfaces & Risks

### Apply Form
**Fields:** Full Name, Email, Phone, Bio  
**Risks:**
- Injection attacks (A03)
- Invalid or malformed input
- Excessive input size (DoS risk)  
**Mitigation:**
- Server-side validation
- Input sanitization
- Enforced length limits

---

### Login Form
**Risks:**
- Authentication failures (A07)
- Brute force attacks
- Credential stuffing  
**Mitigation:**
- Password hashing (bcrypt)
- Rate limiting
- Secure session or JWT authentication
- Generic error messages

---

### Contact Form
**Fields:** Name, Email, Message  
**Risks:**
- Injection attacks (A03)
- Spam and abuse  
**Mitigation:**
- Server-side validation
- Input sanitization
- Logging of submissions

---

### Admin Access (Planned)
**Risks:**
- Broken access control (A01)
- Unauthorized access to sensitive data  
**Mitigation:**
- Role-Based Access Control (RBAC)
- Server-side authorization checks

---

## 2. Input Validation Rules

### Apply Form
- **Full Name:** required, max 50 chars, letters/spaces only  
- **Email:** required, valid format  
- **Phone:** optional, numeric/format validation  
- **Bio:** max 500 chars, sanitized  

### Contact Form
- **Name:** required, max 50 chars  
- **Email:** required, valid format  
- **Message:** required, max 500 chars, sanitized  

### Login
- **Identifier:** required  
- **Password:** required, minimum length enforced  
- **Protections:**
  - Rate limiting
  - No detailed error messages

---

## 3. Logging & Monitoring (A09)

The system will log:
- Login attempts (success/failure)
- Admin actions
- Form submissions (Apply/Contact)
- File uploads (planned)

Logs support auditing and detection of suspicious activity.

---

## 4. Security Configuration (A05)

- Sensitive routes are protected
- Error messages do not expose system details
- Secure defaults are enforced
- Environment variables used for secrets (e.g., DB credentials)

---

## 5. Current Limitations

- No backend validation implemented
- No authentication/authorization system
- Frontend-only validation (insecure)
- No logging system yet

---

## 6. Future Enhancements

- Secure file upload (PDF only, size limits, safe storage)
- API rate limiting
- HTTPS enforcement (deployment)
- Expanded logging and monitoring

---

## 7. STRIDE Threat Model

| Threat | Entry Point | Risk | Mitigation |
|--------|------------|------|-----------|
| Spoofing | Login | Impersonation using stolen credentials | Secure authentication, hashing, rate limiting |
| Spoofing | API | Unauthorized access to protected endpoints | Require JWT/session authentication |
| Tampering | Apply Form | Malicious input (e.g., scripts in Bio) | Validation and sanitization |
| Tampering | Contact Form | Malicious message input | Validation and sanitization |
| Tampering | File Upload | Malicious file upload | File type restrictions, size limits, safe storage |
| Repudiation | Admin Actions | Admin denies actions performed | Log actions with timestamps and IDs |
| Repudiation | Form Submissions | Users deny submissions | Log submission events |
| Information Disclosure | Admin Panel | Unauthorized data exposure | RBAC enforcement |
| Information Disclosure | API | Sensitive data in responses | Limit response data, hide errors |
| Information Disclosure | Database | Unauthorized data access | Secure credentials and access control |
| Denial of Service | Login | Brute force attacks | Rate limiting |
| Denial of Service | Forms | Spam submissions | Validation and throttling |
| Elevation of Privilege | Admin Routes | User gains admin access | Server-side role checks |
| Elevation of Privilege | API | Privilege escalation via requests | Backend permission validation |

---

## 8. OWASP Top 10 Mapping

### A01: Broken Access Control
- Unauthorized access to admin or protected routes  
**Mitigation:** RBAC and server-side authorization

---

### A03: Injection
- Malicious input via forms (Apply, Contact, Search)  
**Mitigation:** Parameterized queries, validation, sanitization

---

### A05: Security Misconfiguration
- Exposed endpoints or debug data  
**Mitigation:** Secure configs, hidden errors, environment variables

---

### A07: Identification & Authentication Failures
- Weak login system  
**Mitigation:** Password hashing, secure sessions/JWT, rate limiting

---

### A09: Logging & Monitoring Failures
- No visibility into attacks  
**Mitigation:** Logging login attempts, admin actions, system events