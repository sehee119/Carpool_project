SELECT
	carpool.id as carpool_id, name as driver_name, gender, max_passenger, 
	candidate.passenger_id as passenger_id, candidate.start_date, candidate.end_date, candidate.dotw,
	candidate.ride_time,
	starting_point, destination_point, desired_arrival_time,
	ride_spot, is_accepted, candidate.created as candidate_time
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id)
    join candidate on carpool.id = candidate.carpool_id
WHERE passenger_id = $1;