import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldsDefinitions1765430903579 implements MigrationInterface {
    name = 'UpdateFieldsDefinitions1765430903579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "data_instances" DROP CONSTRAINT "UQ_2293ab9158a5bad60ebe010d5a2"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "UQ_13e9deaee15691605417b569b97"`);
        await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "chatbots" DROP CONSTRAINT "UQ_b208365e20a6a6f9bfb6b5b46fd"`);
        await queryRunner.query(`ALTER TABLE "chatbots" ALTER COLUMN "model_config" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" DROP CONSTRAINT "UQ_6d3a60cd058fe37b33743afab29"`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" DROP CONSTRAINT "UQ_367ad6752b67350cb2f346cf8b6"`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ALTER COLUMN "severity_level" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ALTER COLUMN "severity_level" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ALTER COLUMN "severity_level" SET DEFAULT 'MINOR'`);
        await queryRunner.query(`ALTER TABLE "ai_diagnosis_results" ALTER COLUMN "severity_level" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" ADD CONSTRAINT "UQ_367ad6752b67350cb2f346cf8b6" UNIQUE ("model_url")`);
        await queryRunner.query(`ALTER TABLE "diagnose_models" ADD CONSTRAINT "UQ_6d3a60cd058fe37b33743afab29" UNIQUE ("key_model")`);
        await queryRunner.query(`ALTER TABLE "chatbots" ALTER COLUMN "model_config" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chatbots" ADD CONSTRAINT "UQ_b208365e20a6a6f9bfb6b5b46fd" UNIQUE ("access_token")`);
        await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "type" SET DEFAULT 'SYMSTOMS'`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "UQ_13e9deaee15691605417b569b97" UNIQUE ("data_url")`);
        await queryRunner.query(`ALTER TABLE "data_instances" ADD CONSTRAINT "UQ_2293ab9158a5bad60ebe010d5a2" UNIQUE ("image_url")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" SET DEFAULT 'MALE'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL`);
    }

}
