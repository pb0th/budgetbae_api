import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  token: string;

  @OneToOne(() => User, (user) => user.refreshToken, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
