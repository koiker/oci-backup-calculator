# Simple calculator for backups.

This is a draft of a simple monthly calculator for OCI backups on Object Storage.
The calculator take as input

- Storage Size
- Number of months
- Anual increase in backup size

Then, the user can add the backup schedule:

- Daily, Weekly, Monthly, Yearly
- Retention period of each backup schedule
- Storage tier

The tool will calculate the total monthly cost based on the input information


## Requirements

- Node.js v20 or higher
- npm and npx
- Oracle OJET


## Instalation

Install Oracle OJET CLI

```bash
npm install -g @oracle/ojet-cli
```

For more information about Oracle OJET: https://docs.oracle.com/en/middleware/developer-tools/jet/18/index.html


Then, to build and run:

```bash
ojet build
ojet serve
```