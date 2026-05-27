import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLesionIndexToAiResultDisease1780000000001 implements MigrationInterface {
  name = 'AddLesionIndexToAiResultDisease1780000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ai_result_diseases" DROP CONSTRAINT "PK_68fe20421f5c2107cbf016fb81d"`);
    await queryRunner.query(`ALTER TABLE "ai_result_diseases" ADD "lesion_index" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "ai_result_diseases" ADD CONSTRAINT "PK_68fe20421f5c2107cbf016fb81d" PRIMARY KEY ("result_id", "disease_id", "lesion_index")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "ai_result_diseases" WHERE "lesion_index" > 0`);
    await queryRunner.query(`ALTER TABLE "ai_result_diseases" DROP CONSTRAINT "PK_68fe20421f5c2107cbf016fb81d"`);
    await queryRunner.query(`ALTER TABLE "ai_result_diseases" DROP COLUMN "lesion_index"`);
    await queryRunner.query(`ALTER TABLE "ai_result_diseases" ADD CONSTRAINT "PK_68fe20421f5c2107cbf016fb81d" PRIMARY KEY ("result_id", "disease_id")`);
  }
}
