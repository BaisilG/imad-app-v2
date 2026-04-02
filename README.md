# imad-app-v2

NHS Take Home Pay Calculator (2026/27 preview build).

## Run locally (preview)

```bash
npm install
npm run preview
```

Open: http://localhost:8080

## Test environment

This project uses Node's built-in test runner so no extra test framework is required.

```bash
npm test
```

Current tests validate key calculator flows:
- baseline take-home output
- part-time pro-rating
- London weighting country behavior
- student loan deduction impact
