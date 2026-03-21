# StackCheck Pro — System Scanner

A Python script that collects your local developer environment info and outputs it as a JSON file for upload to the StackCheck Pro audit tool.

## Requirements

- Python 3.7+
- `pip` available on PATH
- (Optional) `node` / `npm` for npm global package detection
- (Optional) `code` CLI for VS Code extension detection

## Usage

```bash
cd scanner
python scan.py
```

This creates `scanner/scan_output.json`. Upload that file in the StackCheck Pro web app under the **System Scan** module.

## Output Schema

```json
{
  "scannedAt": "ISO 8601 timestamp",
  "os": {
    "platform": "Windows | Linux | Darwin",
    "release": "...",
    "version": "...",
    "machine": "x86_64 | arm64 | ...",
    "pythonVersion": "3.x.x"
  },
  "runtimes": {
    "node": "v20.x.x",
    "npm": "10.x.x",
    "python": "Python 3.x.x",
    "git": "git version 2.x.x",
    "docker": "Docker version ...",
    "go": "go version ...",
    "java": "...",
    "rustc": "rustc x.x.x"
  },
  "npmGlobalPackages": [
    { "name": "package-name", "version": "x.x.x" }
  ],
  "pipPackages": [
    { "name": "package-name", "version": "x.x.x" }
  ],
  "vscodeExtensions": [
    { "id": "publisher.extension-name", "version": "x.x.x" }
  ]
}
```

## Notes

- Tools not installed show as `"not found"` in the `runtimes` section.
- The `code` CLI must be enabled in PATH for VS Code extension detection. In VS Code, run **Shell Command: Install 'code' command in PATH** from the Command Palette.
