const { v4: uuidv4 } = require("uuid");
const parserService = require("../services/parserService");
const registryService = require("../services/registryService");
const claudeService = require("../services/claudeService");
const Audit = require("../models/Audit");

async function runAudit(req, res, next) {
  try {
    const files = req.files || {};

    const parsed = {
      npm: files.packageJson
        ? parserService.parsePackageJson(files.packageJson[0].buffer)
        : null,
      pypi: files.requirementsTxt
        ? parserService.parseRequirementsTxt(files.requirementsTxt[0].buffer)
        : null,
      vscode: files.extensionsJson
        ? parserService.parseExtensionsJson(files.extensionsJson[0].buffer)
        : null,
      system: files.systemScan
        ? parserService.parseSystemScan(files.systemScan[0].buffer)
        : null,
    };

    const [npmVersions, pypiVersions, vscodeInfo] = await Promise.all([
      parsed.npm
        ? registryService.fetchNpmVersions(parsed.npm.allPackages)
        : Promise.resolve([]),
      parsed.pypi
        ? registryService.fetchPypiVersions(parsed.pypi)
        : Promise.resolve([]),
      parsed.vscode
        ? registryService.fetchVscodeExtensionInfo(parsed.vscode)
        : Promise.resolve([]),
    ]);

    const auditContext = {
      npm: parsed.npm ? { meta: parsed.npm, versions: npmVersions } : null,
      pypi: pypiVersions.length ? pypiVersions : null,
      vscode: vscodeInfo.length ? vscodeInfo : null,
      system: parsed.system,
    };

    const findings = await claudeService.analyzeWithClaude(auditContext);

    const id = uuidv4();
    const inputSummary = {
      hasPackageJson: !!parsed.npm,
      hasRequirementsTxt: !!parsed.pypi,
      hasExtensionsJson: !!parsed.vscode,
      hasSystemScan: !!parsed.system,
    };

    await Audit.create({ id, inputSummary, report: findings });

    return res.status(200).json({ id, report: findings });
  } catch (err) {
    next(err);
  }
}

async function getAuditById(req, res, next) {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({ error: "Audit not found." });
    }
    return res.status(200).json(audit);
  } catch (err) {
    next(err);
  }
}

module.exports = { runAudit, getAuditById };
