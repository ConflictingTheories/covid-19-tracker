#!/bin/bash
declare -x _MAIN_DIR=$(pwd)

echo "RUNNING -- IN ${_MAIN_DIR} ::"

curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/$(date +%m-%d-%Y).csv > pos_local_data

size=$(stat -c%s pos_local_data)
min=3000

if [[ $size -gt $min ]]; then
    cat pos_local_data | ./csv2json.sh > ../data/covid.json
fi

curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv |  ./csv2json.sh > ../data/covid-confirmed-ts.json


curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv |  ./csv2json.sh > ../data/covid-deaths-ts.json


curl -X GET https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv |  ./csv2json.sh > ../data/covid-recovered-ts.json