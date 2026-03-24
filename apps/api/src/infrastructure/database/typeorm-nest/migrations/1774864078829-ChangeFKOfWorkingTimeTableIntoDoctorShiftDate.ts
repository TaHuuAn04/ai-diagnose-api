import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFKOfWorkingTimeTableIntoDoctorShiftDate1774864078829 implements MigrationInterface {
    name = 'ChangeFKOfWorkingTimeTableIntoDoctorShiftDate1774864078829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_times" DROP CONSTRAINT "PK_704cb523d989a82ddfbb8163002"`);
        await queryRunner.query(`ALTER TABLE "working_times" ADD CONSTRAINT "PK_1570264d9c24e9bfaa57e9b6f0a" PRIMARY KEY ("doctor_id", "shift_id", "date")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_times" DROP CONSTRAINT "PK_1570264d9c24e9bfaa57e9b6f0a"`);
        await queryRunner.query(`ALTER TABLE "working_times" ADD CONSTRAINT "PK_704cb523d989a82ddfbb8163002" PRIMARY KEY ("doctor_id", "shift_id")`);
    }

}
