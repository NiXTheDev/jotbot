import { GAD7Score } from "../types/types.ts";
import { PathLike } from "node:fs";
import { anxietySeverityStringToEnum } from "../utils/misc.ts";
import { logger } from "../utils/logger.ts";
import { withDB } from "../utils/dbHelper.ts";

/**
 * Insert GAD-7 score into gad_score_db table
 * @param score
 * @param dbPath
 * @returns StatementResultingChanges
 */
export function insertGadScore(score: GAD7Score, dbPath: PathLike) {
  return withDB(dbPath, (db) => {
    const queryResult = db.prepare(
      `INSERT INTO gad_score_db (userId, timestamp, score, severity, action, impactQuestionAnswer) VALUES (?, ?, ?, ?, ?, ?);`,
    ).run(
      score.userId,
      score.timestamp,
      score.score,
      score.severity,
      score.action,
      score.impactQuestionAnswer,
    );

    if (queryResult.changes === 0) {
      throw new Error("Insert failed: no changes made");
    }

    logger.debug(
      `GAD-7 score inserted successfully: ${JSON.stringify(queryResult)}`,
    );
    return queryResult;
  });
}

/**
 * Update GAD-7 score by ID
 * @param id
 * @param score
 * @param dbPath
 * @returns StatementResultingChanges
 */
export function updateGadScore(
  id: number,
  score: Partial<GAD7Score>,
  dbPath: PathLike,
) {
  return withDB(dbPath, (db) => {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (score.score !== undefined) {
      updates.push("score = ?");
      values.push(score.score);
    }
    if (score.severity !== undefined) {
      updates.push("severity = ?");
      values.push(score.severity);
    }
    if (score.action !== undefined) {
      updates.push("action = ?");
      values.push(score.action);
    }
    if (score.impactQuestionAnswer !== undefined) {
      updates.push("impactQuestionAnswer = ?");
      values.push(score.impactQuestionAnswer);
    }
    if (score.timestamp !== undefined) {
      updates.push("timestamp = ?");
      values.push(score.timestamp);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE gad_score_db SET ${updates.join(", ")} WHERE id = ?;`;

    const queryResult = db.prepare(query).run(...values as number[]);

    if (queryResult.changes === 0) {
      throw new Error(`Update failed: no changes made for GAD-7 score ${id}`);
    }

    return queryResult;
  });
}

/**
 * Delete GAD-7 score by ID
 * @param id
 * @param dbPath
 * @returns StatementResultingChanges
 */
export function deleteGadScore(id: number, dbPath: PathLike) {
  return withDB(dbPath, (db) => {
    const queryResult = db.prepare(`DELETE FROM gad_score_db WHERE id = ?;`)
      .run(id);

    if (queryResult.changes === 0) {
      logger.warn(`No GAD-7 score found with ID ${id} to delete`);
    }

    return queryResult;
  });
}

/**
 * @param id
 * @param dbPath
 * @returns
 */
export function getGadScoreById(
  id: number,
  dbPath: PathLike,
): GAD7Score | undefined {
  return withDB(dbPath, (db) => {
    const gadScore = db.prepare(`SELECT * FROM gad_score_db WHERE id = ?;`).get(
      id,
    );
    if (!gadScore) return undefined;

    logger.debug(`Retrieved GAD-7 score: ${JSON.stringify(gadScore)}`);

    const gadScoreData = gadScore as {
      id: number;
      userId: number;
      timestamp: number;
      score: number;
      severity: string | null;
      action: string | null;
      impactQuestionAnswer: string | null;
    };
    return {
      id: Number(gadScoreData.id),
      userId: Number(gadScoreData.userId),
      timestamp: Number(gadScoreData.timestamp),
      score: Number(gadScoreData.score),
      severity: anxietySeverityStringToEnum(
        gadScoreData.severity?.toString() ?? "",
      ),
      action: gadScoreData.action?.toString() ?? "",
      impactQuestionAnswer: gadScoreData.impactQuestionAnswer?.toString() ?? "",
    };
  });
}

/**
 * Get all GAD-7 scores for a user
 * @param userId
 * @param dbPath
 * @returns
 */
export function getAllGadScoresByUserId(
  userId: number,
  dbPath: PathLike,
): GAD7Score[] {
  return withDB(dbPath, (db) => {
    const scores = db.prepare(
      `SELECT * FROM gad_score_db WHERE userId = ? ORDER BY timestamp DESC;`,
    ).all(userId);

    return scores.map((score) => {
      const scoreData = score as {
        id: number;
        userId: number;
        timestamp: number;
        score: number;
        severity: string | null;
        action: string | null;
        impactQuestionAnswer: string | null;
      };
      return {
        id: Number(scoreData.id),
        userId: Number(scoreData.userId),
        timestamp: Number(scoreData.timestamp),
        score: Number(scoreData.score),
        severity: anxietySeverityStringToEnum(
          scoreData.severity?.toString() ?? "",
        ),
        action: scoreData.action?.toString() ?? "",
        impactQuestionAnswer: scoreData.impactQuestionAnswer?.toString() ?? "",
      };
    });
  });
}
