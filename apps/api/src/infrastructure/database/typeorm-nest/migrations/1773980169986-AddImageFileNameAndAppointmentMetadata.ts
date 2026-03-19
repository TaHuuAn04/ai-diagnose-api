import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageFileNameAndAppointmentMetadata1773980169986 implements MigrationInterface {
    name = 'AddImageFileNameAndAppointmentMetadata1773980169986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "images" ADD "file_name" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "metadata"`);
    }

}
