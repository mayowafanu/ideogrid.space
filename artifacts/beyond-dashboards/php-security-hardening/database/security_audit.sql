-- Durable, append-only security event storage for the ideonbod_prs database.
-- Run this migration once against the primary school database.
--
-- This table intentionally has no foreign key to admin/teacher/student rows:
-- security history must survive actor cleanup or account migration.

CREATE TABLE IF NOT EXISTS `security_audit_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_name` VARCHAR(100) NOT NULL,
  `actor_id` BIGINT UNSIGNED DEFAULT NULL,
  `actor_role` ENUM('admin', 'teacher', 'student', 'anonymous', 'system')
    NOT NULL DEFAULT 'anonymous',
  `request_id` VARCHAR(128) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `http_method` VARCHAR(16) DEFAULT NULL,
  `route` VARCHAR(255) DEFAULT NULL,
  `term_name` VARCHAR(100) DEFAULT NULL,
  `session_name` VARCHAR(50) DEFAULT NULL,
  `context_json` JSON NOT NULL,
  `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_security_audit_created_at` (`created_at`),
  KEY `idx_security_audit_event` (`event_name`, `created_at`),
  KEY `idx_security_audit_actor` (`actor_role`, `actor_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Archived rows are kept separately from the live write path. The archive
-- table is also immutable and retains the original event id plus the approval
-- reference and batch that moved it. The CLI retention tool records a
-- SHA-256 manifest for each returned batch; keep that manifest with the
-- export when evidence is moved to incident-response storage.

CREATE TABLE IF NOT EXISTS `security_audit_archive` (
  `id` BIGINT UNSIGNED NOT NULL,
  `event_name` VARCHAR(100) NOT NULL,
  `actor_id` BIGINT UNSIGNED DEFAULT NULL,
  `actor_role` ENUM('admin', 'teacher', 'student', 'anonymous', 'system')
    NOT NULL DEFAULT 'anonymous',
  `request_id` VARCHAR(128) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `http_method` VARCHAR(16) DEFAULT NULL,
  `route` VARCHAR(255) DEFAULT NULL,
  `term_name` VARCHAR(100) DEFAULT NULL,
  `session_name` VARCHAR(50) DEFAULT NULL,
  `context_json` JSON NOT NULL,
  `created_at` TIMESTAMP(6) NOT NULL,
  `archived_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `archive_batch_id` VARCHAR(64) NOT NULL,
  `approval_reference` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_security_archive_created_at` (`created_at`),
  KEY `idx_security_archive_batch` (`archive_batch_id`),
  KEY `idx_security_archive_approval` (`approval_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- These triggers make both tables append-only for ordinary database users.
-- The live delete trigger permits deletion only inside the controlled
-- SQL SECURITY DEFINER retention procedure below.

DROP TRIGGER IF EXISTS `security_audit_log_block_update`;
DROP TRIGGER IF EXISTS `security_audit_log_block_delete`;
DROP TRIGGER IF EXISTS `security_audit_archive_block_update`;
DROP TRIGGER IF EXISTS `security_audit_archive_block_delete`;
DROP PROCEDURE IF EXISTS `archive_security_audit`;

DELIMITER $$

CREATE TRIGGER `security_audit_log_block_update`
BEFORE UPDATE ON `security_audit_log`
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'security_audit_log is append-only';
END$$

CREATE TRIGGER `security_audit_log_block_delete`
BEFORE DELETE ON `security_audit_log`
FOR EACH ROW
BEGIN
  IF COALESCE(@security_audit_retention_job, 0) <> 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'security_audit_log is append-only';
  END IF;
END$$

CREATE TRIGGER `security_audit_archive_block_update`
BEFORE UPDATE ON `security_audit_archive`
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'security_audit_archive is append-only';
END$$

CREATE TRIGGER `security_audit_archive_block_delete`
BEFORE DELETE ON `security_audit_archive`
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'security_audit_archive is append-only';
END$$

CREATE PROCEDURE `archive_security_audit`(
  IN `p_cutoff` DATETIME,
  IN `p_approval_reference` VARCHAR(255)
)
SQL SECURITY DEFINER
BEGIN
  DECLARE v_batch_id VARCHAR(64);
  DECLARE v_archived_count BIGINT UNSIGNED DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @security_audit_retention_job = NULL;
    ROLLBACK;
    RESIGNAL;
  END;

  IF p_cutoff IS NULL
     OR p_cutoff > DATE_SUB(UTC_TIMESTAMP(), INTERVAL 365 DAY) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Audit retention requires a cutoff at least 365 days old';
  END IF;

  IF p_approval_reference IS NULL
     OR CHAR_LENGTH(TRIM(p_approval_reference)) = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An administrator approval reference is required';
  END IF;

  SET v_batch_id = CONCAT(
    'audit-archive-',
    DATE_FORMAT(UTC_TIMESTAMP(), '%Y%m%d%H%i%s'),
    '-',
    CONNECTION_ID()
  );

  START TRANSACTION;

  INSERT INTO security_audit_archive (
    id, event_name, actor_id, actor_role, request_id, ip_address,
    http_method, route, term_name, session_name, context_json, created_at,
    archived_at, archive_batch_id, approval_reference
  )
  SELECT
    id, event_name, actor_id, actor_role, request_id, ip_address,
    http_method, route, term_name, session_name, context_json, created_at,
    UTC_TIMESTAMP(6), v_batch_id, LEFT(TRIM(p_approval_reference), 255)
  FROM security_audit_log
  WHERE created_at < p_cutoff;

  SET @security_audit_retention_job = 1;
  DELETE FROM security_audit_log
  WHERE created_at < p_cutoff;
  SET v_archived_count = ROW_COUNT();
  SET @security_audit_retention_job = NULL;

  COMMIT;

  SELECT v_batch_id AS archive_batch_id, v_archived_count AS archived_count;
END$$

DELIMITER ;