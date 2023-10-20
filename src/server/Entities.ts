import 'reflect-metadata';
import { Check, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity("parent1")
export class Parent1Entity {
	@PrimaryGeneratedColumn()
	@Column({ type: "integer", primary: true, nullable: false })
	id?: number;

	@Column({ type: "text", nullable: false })
	name: string;

	@OneToMany(() => Child1Entity, (child1) => child1.parent, { cascade: true, eager: true })
	children: Child1Entity[];
}

@Entity("parent2")
export class Parent2Entity {
	@PrimaryGeneratedColumn()
	@Column({ type: "integer", primary: true, nullable: false })
	id?: number;

	@Column({ type: "text", nullable: false })
	name: string;

	@OneToMany(() => Child2Entity, (child2) => child2.parent2, { cascade: true, eager: true })
	children: Child2Entity[];
}

@Entity("child1")
export class Child1Entity {
	@PrimaryGeneratedColumn()
	@Column({ type: "integer", primary: true, nullable: false })
	id?: number;

	@Column({ type: "text", nullable: false })
	name: string;

	@ManyToOne(() => Parent1Entity, (parent) => parent.children, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn([
		{ name: "parent1", referencedColumnName: "id" }
	])
	parent: Parent1Entity;
}

@Entity("child2")
export class Child2Entity {
	@Column({ type: "text", nullable: false })
	name: string;

	@PrimaryColumn()
	@Column({ type: "integer", primary: true, nullable: false })
	position: number;

	@PrimaryColumn()
	@ManyToOne(() => Parent2Entity, (parent2) => parent2.children, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn([
		{ name: "parent2", referencedColumnName: "id" }
	])
	parent2: Parent2Entity;
}

