const express = require("express");
const multer = require("multer");
const { runAudit, getAuditById } = require("../controllers/auditController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const fields = upload.fields([
  { name: "packageJson", maxCount: 1 },
  { name: "requirementsTxt", maxCount: 1 },
  { name: "extensionsJson", maxCount: 1 },
  { name: "systemScan", maxCount: 1 },
]);

router.post("/", fields, runAudit);
router.get("/:id", getAuditById);

module.exports = router;
