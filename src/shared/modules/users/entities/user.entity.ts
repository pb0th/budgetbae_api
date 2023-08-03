import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RefreshToken } from '../../auth/entities/token.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'bool', default: false })
  isActivated: boolean;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  @JoinColumn()
  refreshToken: RefreshToken;

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}
