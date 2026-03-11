import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConsultingStartTimeAndEndTimeInConsultation1773246021012 implements MigrationInterface {
    name = 'AddConsultingStartTimeAndEndTimeInConsultation1773246021012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" ADD "start_time" TIME WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD "end_time" TIME WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "start_time"`);
    }

}
