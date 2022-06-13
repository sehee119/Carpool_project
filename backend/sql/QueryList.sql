SELECT
	carpool.id as carpool_id, name, gender, max_passenger, start_date, end_date, dotw, starting_point, destination_point, desired_arrival_time
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id)
ORDER BY created
;