# Security Policy

## Supported Versions

The following versions of the **Business Analytics Platform** currently receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the **Business Analytics Platform** seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT open a public GitHub issue.**
2. Send a detailed report to `security@businessanalytics.enterprise` outlining:
   - Type of issue (e.g., SQL injection, XSS, API auth bypass, buffer overflow).
   - Location of affected code path or API endpoint.
   - Proof-of-concept (PoC) or reproduction steps.
   - Any proposed remediation steps.
3. You will receive an acknowledgment within **24-48 hours**.
4. We will investigate and provide regular updates regarding fix progress and advisory disclosures.

## Security Practices & Architecture

- **CORS Restrictions**: API CORS origins are explicitly configured in `.env` and `backend/app.py`.
- **Subprocess Isolation**: Subprocess calls executing ML pipelines operate in isolated environment contexts with validated paths.
- **Input Sanitization**: All uploaded CSV files undergo strict extension and schema validation before ingestion.
- **Secret Management**: Never commit secrets or API tokens to source control. Always use `.env` files.
