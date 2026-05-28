import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

export abstract class PothysBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: true,
  })
  updatedAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true, default: null })
  deletedAt?: Date;

  @Column({ type: "char", length: 36, nullable: true, default: null })
  createdBy?: string;

  @Column({ type: "char", length: 36, nullable: true, default: null })
  updatedBy?: string;

  @Column({ type: "tinyint", default: 1 })
  activeStatus: boolean;
}
