import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePatientAndDataInstanceFields1767341463750 implements MigrationInterface {
    name = 'UpdatePatientAndDataInstanceFields1767341463750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" ADD "accuracy" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "data_instances" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "result_diseases" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "citizen_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "UQ_786e6e32aea74c6f1587d2eea6e"`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "medical_insurance" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "UQ_6b5a22ffe345822225488a7ff55"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "UQ_6b5a22ffe345822225488a7ff55" UNIQUE ("medical_insurance")`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "medical_insurance" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "UQ_786e6e32aea74c6f1587d2eea6e" UNIQUE ("citizen_code")`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "citizen_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "result_diseases" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "data_instances" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" DROP COLUMN "accuracy"`);
    }

}
