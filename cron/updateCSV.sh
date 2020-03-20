#!/bin/bash
declare -x _MAIN_DIR=$(pwd)

echo "RUNNING -- IN ${_MAIN_DIR} ::"

curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/$(date +%m-%d-%Y).csv > pos_data

size=$(stat -c%s pos_data)
min=3000

if [[ $size -gt $min ]]; then
    cat pos_data | /srv/http/cron/csv2json.sh > /srv/http/data/covid.json
fi

curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv |  /srv/http/cron/csv2json.sh > /srv/http/data/covid-confirmed-ts.json


curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv |  /srv/http/cron/csv2json.sh > /srv/http/data/covid-deaths-ts.json


curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv |  /srv/http/cron/csv2json.sh > /srv/http/data/covid-recovered-ts.json
