import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWorkingTimeTable1765460572482 implements MigrationInterface {
    name = 'AddWorkingTimeTable1765460572482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_7350602f41e3660d68eba4c6461"`);
        await queryRunner.query(`CREATE TYPE "public"."working_times_status_enum" AS ENUM('AVAILABLE', 'BOOKED', 'UNAVAILABLE')`);
        await queryRunner.query(`CREATE TABLE "working_times" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "doctor_id" uuid NOT NULL, "appointment_id" uuid, "shift_id" uuid NOT NULL, "status" "public"."working_times_status_enum" NOT NULL DEFAULT 'AVAILABLE', CONSTRAINT "REL_7a878ca8f598c5956bd92112f1" UNIQUE ("appointment_id"), CONSTRAINT "PK_704cb523d989a82ddfbb8163002" PRIMARY KEY ("doctor_id", "shift_id"))`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "REL_7350602f41e3660d68eba4c646"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "shift_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "doctor_id"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "PK_3bf6be761f7a587a8f52d500e01"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "PK_82411a5db033e53b07430bd68e1" PRIMARY KEY ("doctor_id", "schedule_id")`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "working_time_id" uuid`);
        await queryRunner.query(`ALTER TABLE "admission_staffs" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "admission_staffs" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "admission_staffs" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "result_diseases" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "result_diseases" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "result_diseases" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "REL_009cea57ed219f26769f1c26dc" UNIQUE ("working_time_id", "working_time_id")`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_009cea57ed219f26769f1c26dc4" FOREIGN KEY ("working_time_id", "working_time_id") REFERENCES "working_times"("doctor_id","shift_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "working_times" ADD CONSTRAINT "FK_0ee3d2481f707906fe0afa52e60" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "working_times" ADD CONSTRAINT "FK_7a878ca8f598c5956bd92112f17" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "working_times" ADD CONSTRAINT "FK_0d13112b4cb161866a37bb0b335" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_times" DROP CONSTRAINT "FK_0d13112b4cb161866a37bb0b335"`);
        await queryRunner.query(`ALTER TABLE "working_times" DROP CONSTRAINT "FK_7a878ca8f598c5956bd92112f17"`);
        await queryRunner.query(`ALTER TABLE "working_times" DROP CONSTRAINT "FK_0ee3d2481f707906fe0afa52e60"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_009cea57ed219f26769f1c26dc4"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "REL_009cea57ed219f26769f1c26dc"`);
        await queryRunner.query(`ALTER TABLE "result_diseases" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "result_diseases" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "result_diseases" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "ai_result_diseases" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "admission_staffs" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "admission_staffs" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "admission_staffs" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "working_time_id"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "PK_82411a5db033e53b07430bd68e1"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "PK_3bf6be761f7a587a8f52d500e01" PRIMARY KEY ("id", "doctor_id", "schedule_id")`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "doctor_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "shift_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "REL_7350602f41e3660d68eba4c646" UNIQUE ("shift_id")`);
        await queryRunner.query(`DROP TABLE "working_times"`);
        await queryRunner.query(`DROP TYPE "public"."working_times_status_enum"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_7350602f41e3660d68eba4c6461" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
