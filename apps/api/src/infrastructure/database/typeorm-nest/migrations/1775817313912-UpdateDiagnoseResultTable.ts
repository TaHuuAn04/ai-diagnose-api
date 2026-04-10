import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDiagnoseResultTable1775817313912 implements MigrationInterface {
    name = 'UpdateDiagnoseResultTable1775817313912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diagnosis_results" ADD "department" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diagnosis_results" DROP COLUMN "department"`);
    }

}
