import { MigrationInterface, QueryRunner } from "typeorm";

export class NameUpdateDiagnoseResult1774692665013 implements MigrationInterface {
    name = 'NameUpdateDiagnoseResult1774692665013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "ai_advice" text`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "proof"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "proof" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "proof"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ADD "proof" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" DROP COLUMN "ai_advice"`);
    }

}
