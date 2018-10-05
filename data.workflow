; /usr/bin/drake
;
; This file describes and performs the data processing
; workflow using Drake, a Make-like format focused on data.
; https://github.com/Factual/drake
;
; Full documentation (it is suggested to switch to Viewing mode)
; https://docs.google.com/document/d/1bF-OKNLIG10v_lMes_m4yyaJtAaJKtdK0Jizvi_MNsg/
;
; Suggested groups/tags of tasks:
; Download, Convert, Combine, Analysis, and Export
;
; Run with: drake -w data.workflow
;


; Base directory for all inputs and output.  Note that the $BASE variable
; is not used in the task definition (first line), but for the commands,
; it is needed.
BASE=data


; Download planning zones
sources/minneapolis-primary-planning-zones.zip, %download <- [-timecheck]
  mkdir -p $BASE/sources
  wget -O $OUTPUT "https://opendata.arcgis.com/datasets/f780d0fe4edc44cd8c4c9e0a4d9efccd_0.zip"


; Decompress
sources/minneapolis-primary-planning-zones/Planning_Primary_Zoning.shp, %decompress <- sources/minneapolis-primary-planning-zones.zip
  unzip -d $BASE/sources/minneapolis-primary-planning-zones -o $INPUT
  touch $OUTPUT

sources/mpls2040-20180730/MPLS2040_Draft_FLU_BltFrm.shp, %decompress <- sources/MPLS2040_Draft_FLU_BltFrm-20180730.zip
  unzip -d $BASE/sources/mpls2040-20180730 -o $INPUT
  touch $OUTPUT

sources/mpls2040-20181004/MPLS2040Data/Mpls_2040_FLU_BltFrm_Sept_21_2018.shp, %decompress <- sources/MPLS2040Data-20181004.zip
  unzip -d $BASE/sources/mpls2040-20181004 -o $INPUT
  touch $OUTPUT


; Convert to 4326
build/mpls-primary-planning-zones-4326/mpls-primary-planning-zones-4326.shp, %convert <- sources/minneapolis-primary-planning-zones/Planning_Primary_Zoning.shp
  mkdir -p $BASE/build/mpls-primary-planning-zones-4326
  ogr2ogr -f "ESRI Shapefile" $OUTPUT $INPUT -t_srs EPSG:4326 -overwrite

build/mpls2040-20180730-4326/mpls2040-20180730-4326.shp, %convert <- sources/mpls2040-20180730/MPLS2040_Draft_FLU_BltFrm.shp
  mkdir -p $BASE/build/mpls2040-20180730-4326
  ogr2ogr -f "ESRI Shapefile" $OUTPUT $INPUT -t_srs EPSG:4326 -overwrite

build/mpls2040-20181004-4326/mpls2040-20181004-4326.shp, %convert <- sources/mpls2040-20181004/MPLS2040Data/Mpls_2040_FLU_BltFrm_Sept_21_2018.shp
  mkdir -p $BASE/build/mpls2040-20181004-4326
  ogr2ogr -f "ESRI Shapefile" $OUTPUT $INPUT -t_srs EPSG:4326 -overwrite


; Import into Postgres
build/mpls-primary-planning-zones-4326.sql, %import <- build/mpls-primary-planning-zones-4326/mpls-primary-planning-zones-4326.shp
  shp2pgsql -d $BASE/build/mpls-primary-planning-zones-4326/mpls-primary-planning-zones-4326 mpls_primary_zoning > $OUTPUT

build/mpls2040-20180730-4326.sql, %import <- build/mpls2040-20180730-4326/mpls2040-20180730-4326.shp
  shp2pgsql -d $BASE/build/mpls2040-20180730-4326/mpls2040-20180730-4326 mpls2040_20180730 > $OUTPUT

build/mpls2040-20181004-4326.sql, %import <- build/mpls2040-20181004-4326/mpls2040-20181004-4326.shp
  shp2pgsql -d $BASE/build/mpls2040-20181004-4326/mpls2040-20181004-4326 mpls2040_20181004 > $OUTPUT

build/db-created, %db, %import <- [-timecheck]
  psql -U ${PG_USER:?"PG_USER needs to be set"} -c "SELECT 1 FROM pg_database WHERE datname = 'mpls2040'" | grep -q 1 || psql -U ${PG_USER:?"PG_USER needs to be set"} -c "CREATE DATABASE mpls2040" && \
  psql -U ${PG_USER:?"PG_USER needs to be set"} -d mpls2040 -c "CREATE EXTENSION IF NOT EXISTS postgis;" && \
  psql -U ${PG_USER:?"PG_USER needs to be set"} -d mpls2040 -c "CREATE EXTENSION IF NOT EXISTS postgis_topology;" && \
  touch $OUTPUT

build/db-tables-imported, %db, %import <- build/db-created, build/mpls-primary-planning-zones-4326.sql, build/mpls2040-20180730-4326.sql, build/mpls2040-20181004-4326.sql, sources/zoning-definitions.sql, lib/fix-geometries.sql
  psql -U ${PG_USER:?"PG_USER needs to be set"} -d mpls2040 < $INPUT1
  psql -U ${PG_USER:?"PG_USER needs to be set"} -d mpls2040 < $INPUT2
  psql -U ${PG_USER:?"PG_USER needs to be set"} -d mpls2040 < $INPUT3
  psql -U ${PG_USER:?"PG_USER needs to be set"} -d mpls2040 < $INPUT4
  psql -U ${PG_USER:?"PG_USER needs to be set"} -d mpls2040 < $INPUT5


; Cleanup tasks
%sources.cleanup, %cleanup, %WARNING <-
  rm -rv $BASE/sources/*
%build.cleanup, %cleanup, %WARNING <-
  rm -rv $BASE/build/*
