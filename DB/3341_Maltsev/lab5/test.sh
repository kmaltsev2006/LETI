#!/bin/bash

sqlmap -u "http://localhost:3000/unsafe/drivers?exp=1" --batch
sqlmap -u "http://localhost:3000/unsafe/routes?search=test" --batch
sqlmap -u "http://localhost:3000/unsafe/schedule?order=work_date" --batch
