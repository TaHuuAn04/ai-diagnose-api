import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClinicalInfoToDiagnosisResults1777700340438 implements MigrationInterface {
    name = 'AddClinicalInfoToDiagnosisResults1777700340438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "clinical_info" jsonb DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "clinical_info"`);
    }

}
