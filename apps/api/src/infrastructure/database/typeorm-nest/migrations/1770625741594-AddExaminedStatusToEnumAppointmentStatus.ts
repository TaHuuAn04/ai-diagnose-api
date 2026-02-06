import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExaminedStatusToEnumAppointmentStatus1770625741594 implements MigrationInterface {
    name = 'AddExaminedStatusToEnumAppointmentStatus1770625741594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."appointments_status_enum" RENAME TO "appointments_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('PENDING', 'SCHEDULED', 'EXAMINED', 'LATE', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "public"."appointments_status_enum" USING "status"::"text"::"public"."appointments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum_old" AS ENUM('PENDING', 'SCHEDULED', 'LATE', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "public"."appointments_status_enum_old" USING "status"::"text"::"public"."appointments_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."appointments_status_enum_old" RENAME TO "appointments_status_enum"`);
    }

}
