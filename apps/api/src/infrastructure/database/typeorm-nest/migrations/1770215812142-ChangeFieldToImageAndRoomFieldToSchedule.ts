import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldToImageAndRoomFieldToSchedule1770215812142 implements MigrationInterface {
    name = 'ChangeFieldToImageAndRoomFieldToSchedule1770215812142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_147631221765e87d689ee13e588"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_e3142ce1ad274a19e98a01c473a"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "appointment_id"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "consultation_id"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "room" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD "doctor_id" uuid`);
        await queryRunner.query(`ALTER TABLE "images" ADD "reference_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."images_reference_type_enum" AS ENUM('APPOINTMENT', 'CONSULTATION', 'AVATAR')`);
        await queryRunner.query(`ALTER TABLE "images" ADD "reference_type" "public"."images_reference_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "images" ADD "order" integer`);
        await queryRunner.query(`ALTER TABLE "images" ADD "base64" text`);
        await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "data_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."images_type_enum" RENAME TO "images_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."images_type_enum" AS ENUM('AVATAR', 'PATIENT_SYMPTOMS', 'DOCTOR_SYMPTOMS', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "type" TYPE "public"."images_type_enum" USING "type"::"text"::"public"."images_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."images_type_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_c014294c3e8b8685465a8c1b98" ON "images" ("reference_id", "reference_type") `);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_b7f3d0151b76508ba896d15e574" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_38a07f1bd948cba8d470a793e2f"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_98828d5858c20e5edc7966e1e09"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_b7f3d0151b76508ba896d15e574"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c014294c3e8b8685465a8c1b98"`);
        await queryRunner.query(`CREATE TYPE "public"."images_type_enum_old" AS ENUM('AVATAR', 'SYMSTOMS')`);
        await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "type" TYPE "public"."images_type_enum_old" USING "type"::"text"::"public"."images_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."images_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."images_type_enum_old" RENAME TO "images_type_enum"`);
        await queryRunner.query(`ALTER TABLE "images" ALTER COLUMN "data_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "base64"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "reference_type"`);
        await queryRunner.query(`DROP TYPE "public"."images_reference_type_enum"`);
        await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "reference_id"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "doctor_id"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "room"`);
        await queryRunner.query(`ALTER TABLE "images" ADD "consultation_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "images" ADD "appointment_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_e3142ce1ad274a19e98a01c473a" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_147631221765e87d689ee13e588" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "rooms" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "room" character varying(255) NOT NULL, "doctor_id" uuid NOT NULL, "schedule_id" uuid NOT NULL, CONSTRAINT "PK_3bf6be761f7a587a8f52d500e01" PRIMARY KEY ("id", "doctor_id", "schedule_id"))`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_98828d5858c20e5edc7966e1e09" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_38a07f1bd948cba8d470a793e2f" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
