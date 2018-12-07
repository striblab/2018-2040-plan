-- Fix gemometries
UPDATE mpls_primary_zoning SET geom = ST_MakeValid(geom) WHERE NOT ST_IsValid(geom);
UPDATE mpls2040_20180730 SET geom = ST_MakeValid(geom) WHERE NOT ST_IsValid(geom);
UPDATE mpls2040_20181004 SET geom = ST_MakeValid(geom) WHERE NOT ST_IsValid(geom);
