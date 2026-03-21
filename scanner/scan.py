import json
import subprocess
import sys
import platform
import shutil
from datetime import datetime, timezone


def run(cmd):
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=15,
        )
        return result.stdout.strip()
    except Exception:
        return None


def get_version(cmd):
    output = run(cmd)
    return output if output else "not found"


def get_pip_packages():
    raw = run("pip list --format=json")
    if not raw:
        return []
    try:
        packages = json.loads(raw)
        return [{"name": p["name"], "version": p["Version"]} for p in packages]
    except (json.JSONDecodeError, KeyError):
        return []


def get_npm_global_packages():
    raw = run("npm list -g --depth=0 --json")
    if not raw:
        return []
    try:
        data = json.loads(raw)
        deps = data.get("dependencies", {})
        return [{"name": name, "version": info.get("version", "unknown")} for name, info in deps.items()]
    except (json.JSONDecodeError, KeyError):
        return []


def get_vscode_extensions():
    if not shutil.which("code"):
        return []
    raw = run("code --list-extensions --show-versions")
    if not raw:
        return []
    extensions = []
    for line in raw.splitlines():
        line = line.strip()
        if "@" in line:
            parts = line.rsplit("@", 1)
            extensions.append({"id": parts[0], "version": parts[1]})
        elif line:
            extensions.append({"id": line, "version": "unknown"})
    return extensions


def main():
    print("Running StackCheck Pro system scanner...")

    scan = {
        "scannedAt": datetime.now(timezone.utc).isoformat(),
        "os": {
            "platform": platform.system(),
            "release": platform.release(),
            "version": platform.version(),
            "machine": platform.machine(),
            "pythonVersion": platform.python_version(),
        },
        "runtimes": {
            "node": get_version("node --version"),
            "npm": get_version("npm --version"),
            "python": get_version("python --version"),
            "python3": get_version("python3 --version"),
            "pip": get_version("pip --version"),
            "git": get_version("git --version"),
            "docker": get_version("docker --version"),
            "go": get_version("go version"),
            "java": get_version("java -version 2>&1"),
            "rustc": get_version("rustc --version"),
        },
        "npmGlobalPackages": get_npm_global_packages(),
        "pipPackages": get_pip_packages(),
        "vscodeExtensions": get_vscode_extensions(),
    }

    output_path = "scan_output.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(scan, f, indent=2)

    print(f"Scan complete. Output written to {output_path}")
    print(f"  - Runtimes checked: {len(scan['runtimes'])}")
    print(f"  - npm global packages: {len(scan['npmGlobalPackages'])}")
    print(f"  - pip packages: {len(scan['pipPackages'])}")
    print(f"  - VS Code extensions: {len(scan['vscodeExtensions'])}")


if __name__ == "__main__":
    main()
