DROP TABLE IF EXISTS app_user CASCADE;
CREATE TABLE app_user(
	id serial PRIMARY KEY,
	name varchar,
	birth_date date,
	gender varchar(6),
	phone_num varchar,
	address varchar,
	company_name varchar
);
DROP TABLE IF EXISTS driver;
CREATE TABLE driver (
	driver_id int PRIMARY KEY,
	car_category int,
	car_num varchar,
	drive_count int,
	foreign key(driver_id) references app_user
);
DROP TABLE IF EXISTS carpool CASCADE;
CREATE TABLE carpool (
	id serial PRIMARY KEY,
	driver_id int references app_user on delete set null,
	start_date date,
	end_date date,
	dotw text[],
	starting_point varchar,
	starting_coord varchar,
	destination_point varchar,
	destination_coord varchar,
	desired_arrival_time time,
	max_passenger int
);
DROP TABLE IF EXISTS candidate;
CREATE TABLE candidate (
	carpool_id int,
	passenger_id int,
	ride_spot varchar,
	start_date date,
	end_date date,
	dotw text[],
	ride_time time,
	is_accepted bool,
	PRIMARY KEY(carpool_id, passenger_id),
	foreign key(carpool_id) references carpool,
	foreign key(passenger_id) references app_user
);

insert into app_user values(default, '김인하', '1999-12-12', 'Male', '01023459876');
insert into app_user values(default, '박인덕', '2000-08-08', 'Female', '01098874532');
insert into app_user values(default, '최탐탐', '1997-01-01', 'Female', '01033332222');
insert into app_user values(default, '이길동', '1998-05-05', 'Male', '01045677654');
insert into app_user values(default, '지석진', '1997-01-01', 'Female', '01098766789');
insert into app_user values(default, '손흥민', '1992-07-07', 'Male', null);
insert into driver values (1, 3, '12우4567', 4);
insert into driver values (2, 3, '80사5958', 0);
insert into driver values (4, 3, '11바0707', 0);
insert into driver values (5, 3, '27사1122', 2);

insert into carpool values(
	default, 1, '2022-05-13', '2022-05-27', ARRAY['월','화','수'], 
		'부평역', '126.7233507,37.4895676',
		'인하대', '126.6538126,37.4507292', 
		'09:00', 3);
insert into carpool values(
	default, 2, '2022-05-16', '2022-05-27', ARRAY['월','화','목','금'], 
		'서울시청', '126.9715661,37.5568086',
		'인천항', '126.6022125,37.4538096',
		'08:40', 2);
insert into carpool values(
	default, 3, '2022-05-20', '2022-06-15', ARRAY['월','화','수','목','금'], 
		'강남역', '126.9715661,37.5568086',
		'인하대', '126.6538126,37.4507292',
		'08:30', 2);
insert into carpool values(
	default, 4, '2022-05-20', '2022-06-15', ARRAY['화','수','목','금'], 
		'노원역', '126.9715661,37.5568086',
		'인하대', '126.6538126,37.4507292',
		'09:00', 2);
insert into carpool values(
	default, 5, '2022-05-20', '2022-06-15', ARRAY['수','목','금'], 
		'광진구청', '126.9715661,37.5568086',
		'일산역', '126.6538126,37.4507292',
		'08:40', 2);
insert into candidate values(
	1, 3, '동암역', '2022-05-15', '2022-05-27', ARRAY['월', '화', '수'], '08:30', false
);
insert into candidate values(
	1, 2, '동암역', '2022-05-15', '2022-05-27', '{월,목}', '08:30', false
);

select * from driver;
select * from app_user;
select * from carpool;
select * from candidate;


