SELECT
	carpool.id as carpool_id, name, gender, max_passenger, 
	candidate.start_date, candidate.end_date, candidate.dotw, 
	starting_point, destination_point, desired_arrival_time,
	ride_spot, is_accepted
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id)
    join candidate on carpool.id = candidate.carpool_id
WHERE app_user.id = $1;