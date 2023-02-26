CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY NOT NULL,
	email VARCHAR(200) NOT NULL,
	password VARCHAR(200) NOT NULL,
	created TIMESTAMPTZ NOT NULL,
	updated TIMESTAMPTZ NOT NULL,
	UNIQUE (email)
);
create type todo_status as ENUM ('notstarted', 'ongoing', 'completed');
CREATE TABLE todolist(
	id BIGSERIAL PRIMARY KEY NOT NULL,
	user_id BIGSERIAL NOT NULL,
	name VARCHAR(200) NOT NULL,
	created TIMESTAMPTZ NOT NULL,
	updated TIMESTAMPTZ NOT NULL,
	status todo_status,
	description VARCHAR(500),
	FOREIGN KEY(user_id) REFERENCES users(id)
);
