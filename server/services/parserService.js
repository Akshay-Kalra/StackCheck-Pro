function parsePackageJson(buffer) {
  const text = buffer.toString("utf-8");
  const data = JSON.parse(text);

  const dependencies = data.dependencies || {};
  const devDependencies = data.devDependencies || {};

  const toPackageList = (deps) =>
    Object.entries(deps).map(([name, version]) => ({
      name,
      specifiedVersion: version,
    }));

  return {
    name: data.name || null,
    version: data.version || null,
    dependencies: toPackageList(dependencies),
    devDependencies: toPackageList(devDependencies),
    allPackages: toPackageList({ ...dependencies, ...devDependencies }),
  };
}

function parseRequirementsTxt(buffer) {
  const lines = buffer.toString("utf-8").split("\n");
  return lines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("-r"))
    .map((line) => {
      const match = line.match(/^([A-Za-z0-9_.-]+)\s*([><=!~].+)?$/);
      if (!match) return null;
      return { name: match[1], specifiedVersion: match[2]?.trim() || null };
    })
    .filter(Boolean);
}

function parseExtensionsJson(buffer) {
  const text = buffer.toString("utf-8");
  const data = JSON.parse(text);
  const recommendations =
    data.recommendations || (Array.isArray(data) ? data : []);
  return recommendations.map((id) => String(id).toLowerCase());
}

function parseSystemScan(buffer) {
  const text = buffer.toString("utf-8");
  return JSON.parse(text);
}

module.exports = {
  parsePackageJson,
  parseRequirementsTxt,
  parseExtensionsJson,
  parseSystemScan,
};
