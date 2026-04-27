import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldDiagnoseModelAITable1777285741047 implements MigrationInterface {
    name = 'UpdateFieldDiagnoseModelAITable1777285741047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diagnose_models" DROP COLUMN "key_model"`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" ADD "model_config" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" ALTER COLUMN "model_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "diagnose_models" ALTER COLUMN "model_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" DROP COLUMN "model_config"`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" ADD "key_model" character varying(255) NOT NULL`);
    }

}
