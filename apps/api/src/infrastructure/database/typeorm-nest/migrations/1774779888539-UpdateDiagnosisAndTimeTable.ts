import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDiagnosisAndTimeTable1774779888539 implements MigrationInterface {
    name = 'UpdateDiagnosisAndTimeTable1774779888539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shifts" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "feed_back_ai" text`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "ai_advice" text`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "note" text`);
        await queryRunner.query(`ALTER TABLE "working_times" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "advices"`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "advices" text`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "prescription"`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "prescription" jsonb DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "suggested_diagnosis"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "suggested_diagnosis" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "proof"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "proof" text`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "description" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "proof"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "proof" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "suggested_diagnosis"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "suggested_diagnosis" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "prescription"`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "prescription" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "advices"`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "advices" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "working_times" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "ai_advice"`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "feed_back_ai"`);
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "shifts" ADD "date" date NOT NULL`);
    }

}
