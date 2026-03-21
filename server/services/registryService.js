const axios = require("axios");

const NPM_REGISTRY = "https://registry.npmjs.org";
const PYPI_REGISTRY = "https://pypi.org/pypi";
const VSCODE_MARKETPLACE =
  "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery";

async function fetchNpmVersions(packages) {
  const results = await Promise.allSettled(
    packages.map(async ({ name, specifiedVersion }) => {
      try {
        const { data } = await axios.get(`${NPM_REGISTRY}/${encodeURIComponent(name)}/latest`, {
          timeout: 8000,
        });
        const latestVersion = data.version;
        const current = specifiedVersion
          ? specifiedVersion.replace(/^[^0-9]*/, "")
          : null;
        return {
          name,
          specifiedVersion: specifiedVersion || null,
          latestVersion,
          isOutdated: current ? current !== latestVersion : false,
        };
      } catch {
        return {
          name,
          specifiedVersion: specifiedVersion || null,
          latestVersion: null,
          isOutdated: false,
          fetchError: true,
        };
      }
    })
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
}

async function fetchPypiVersions(packages) {
  const results = await Promise.allSettled(
    packages.map(async ({ name, specifiedVersion }) => {
      try {
        const { data } = await axios.get(`${PYPI_REGISTRY}/${encodeURIComponent(name)}/json`, {
          timeout: 8000,
        });
        const latestVersion = data.info.version;
        const current = specifiedVersion
          ? specifiedVersion.replace(/^[^0-9]*/, "")
          : null;
        return {
          name,
          specifiedVersion: specifiedVersion || null,
          latestVersion,
          isOutdated: current ? !current.startsWith(latestVersion.split(".")[0]) : false,
        };
      } catch {
        return {
          name,
          specifiedVersion: specifiedVersion || null,
          latestVersion: null,
          isOutdated: false,
          fetchError: true,
        };
      }
    })
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
}

async function fetchVscodeExtensionInfo(extensionIds) {
  if (!extensionIds.length) return [];

  const body = {
    filters: [
      {
        criteria: extensionIds.map((id) => ({
          filterType: 7,
          value: id,
        })),
        pageSize: extensionIds.length,
        pageNumber: 1,
      },
    ],
    flags: 914,
  };

  try {
    const { data } = await axios.post(VSCODE_MARKETPLACE, body, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;api-version=7.1-preview.1",
      },
    });

    const extensions = data?.results?.[0]?.extensions || [];
    return extensions.map((ext) => {
      const latestVersion = ext.versions?.[0]?.version || null;
      return {
        id: `${ext.publisher.publisherName}.${ext.extensionName}`.toLowerCase(),
        displayName: ext.displayName,
        latestVersion,
        publisherName: ext.publisher.publisherName,
      };
    });
  } catch {
    return extensionIds.map((id) => ({
      id,
      displayName: null,
      latestVersion: null,
      fetchError: true,
    }));
  }
}

module.exports = { fetchNpmVersions, fetchPypiVersions, fetchVscodeExtensionInfo };
