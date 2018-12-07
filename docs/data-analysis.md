# Data analysis

_See README.md for description of data sources_

## Data processing

The following are prerequisite steps that only need to be performed once globally and may already be installed.

1.  Install [Drake](https://github.com/Factual/drake), a data processing alternative to `make`. See the `data.workflow` for some notes about Drake.
    - On a Mac: `brew install drake`
1.  Install Postgres and PostGIS and create a new database: `mpls2040`
1.  Install `ogr2ogr`

To perform data processing steps, run the following. Drake will tell you what steps are needed and confirm with you.

- Main data processing steps that will do everything including downloading and converting: `drake -w data.workflow`
- Categories of steps:
  - `drake -w data.workflow %download`
  - `drake -w data.workflow %decompress`
  - `drake -w data.workflow %convert`
  - `drake -w data.workflow %import`
  - `drake -w data.workflow %analysis`
  - `drake -w data.workflow %export`

## Map

The final exported analysis will be used to make a Mapbox map.

1. The final export is at: `data/build/changed-grouped.geo.json`
1. The data source that is used in the map is [`shadowflare.2m9lctvv`](https://www.mapbox.com/studio/tilesets/shadowflare.2m9lctvv/). You can replace the data for this source through the web interface.
