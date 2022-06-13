SELECT
  carpool.id as carpool_id, name, gender, max_passenger, start_date::text, end_date::text, 
  dotw, starting_point, starting_coord, destination_point, destination_coord, desired_arrival_time
FROM app_user 
  join carpool on app_user.id = carpool.driver_id
  join driver using(driver_id)
WHERE gender = ANY($1) AND
  (start_date <= $2 OR end_date >= $3) AND
  dotw @> $4
;