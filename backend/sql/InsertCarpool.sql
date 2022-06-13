WITH new_carpool AS (
  INSERT INTO carpool VALUES(
    default, $1, $2, $3, $4, 
      $5, $6,
      $7, $8, 
      $9, $10, NOW())
  RETURNING driver_id)
INSERT INTO driver 
  (SELECT driver_id, $11, $12, 0 FROM new_carpool)
  ON CONFLICT DO NOTHING
;