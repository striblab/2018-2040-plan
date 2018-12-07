
-- Table of each change
DROP TABLE IF EXISTS code_changes;
CREATE TABLE code_changes AS
SELECT
	m2040.gid AS m2040_gid,
	m2040.ludec AS land_use,
	m2040.bfdec AS built_form,
	zoning.zone_code AS zone_code,
	ST_SnapToGrid(ST_Intersection(m2040.geom, zoning.geom), 0.00001) AS intersection,
	ST_Area(ST_Intersection(m2040.geom, zoning.geom::geography)) AS area
FROM
	mpls2040_20181205 AS m2040
	LEFT JOIN mpls_primary_zoning AS zoning
		ON ST_Intersects(m2040.geom, zoning.geom)
WHERE
	ST_Area(ST_Intersection(m2040.geom, zoning.geom::geography)) > 100
;
UPDATE code_changes SET intersection = ST_MakeValid(intersection) WHERE NOT ST_IsValid(intersection);



-- Table where each geometry is polygons that are
-- a unique change
DROP TABLE IF EXISTS code_changes_aggregate;
CREATE TABLE code_changes_aggregate AS
SELECT
	c.zone_code,
	c.land_use,
	c.built_form,
	COUNT(*) AS count,
	SUM(c.area) AS area,
	ST_CollectionExtract(ST_Union(c.intersection), 3) AS geom
FROM code_changes AS c
GROUP BY
	c.zone_code,
	c.land_use,
	c.built_form
ORDER BY
	zone_code,
	count DESC
;
