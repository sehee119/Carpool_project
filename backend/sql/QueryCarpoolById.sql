select *
from app_user
	join driver on app_user.id = driver.driver_id
	join carpool on app_user.id = carpool.driver_id
where app_user.id = $1
;