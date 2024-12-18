# Adobe Programming Challenge

## Description
Programming Challenge:

Take a variable number of identically structured json records and de-duplicate the set.
 
An example file of records is given in the accompanying 'leads.json'.  Output should be same format, with dups reconciled according to the following rules:
1. The data from the newest date should be preferred.
2. Duplicate IDs count as dups. Duplicate emails count as dups. Both must be unique in our dataset. Duplicate values elsewhere do not count as dups.
3. If the dates are identical the data from the record provided last in the list should be preferred.
 
Simplifying assumption: the program can do everything in memory (don't worry about large files).
 
The application should also provide a log of changes including some representation of the source record, the output record and the individual field changes (value from and value to) for each field.
 
Please implement as a command line program.

## Requirements
- Node.js (I'm using v22.2.0 for reference)
- npm

## Setup Instructions
Command-line application built in JavaScript using Node.js.

1. Clone this repo onto local machine.
2. In your CLI, navigate to the repo's directory.
3. Type `npm i` to install required dependencies. 

## Usage
Run the application by typing `node app.js INPUT_FILE_NAME OUTPUT_FILE_NAME`
  - INPUT_FILE_NAME: Name of the file to de-duplicate (required).
  - OUTPUT_FILE_NAME: Name of the file to store the de-duplicated data (required).

## Format of Change Logs
I'll be honest and say that I was a bit confused by the problem description when it mentioned needing to log the field value changes (from and to). I initially thought the logging would be to show which lead was the source and which lead was the duplicate being removed. 

This is my interpretation of the description where I was mostly trying to show that there is a source - duplicate pairing and all of the potential differences in field values.

Logs are stored in an array to represent a grouping of one source to one duplicate and all of the fields that are different between them.

A log is structured as such:
```
"logs": [
    [
      {
        "source": {
          "_id": "jkj238238jdsnfsj23",
          "email": "bill@bar.com",
          "firstName": "Eric",
          "lastName": "Smith",
          "address": "888 Mayberry St",
          "entryDate": "2014-05-07T17:33:20+00:00"
        },
        "duplicate": {
          "_id": "jkj238238jdsnfsj23",
          "email": "coo@bar.com",
          "firstName": "Ted",
          "lastName": "Jones",
          "address": "456 Neat St",
          "entryDate": "2014-05-07T17:32:20+00:00"
        },
        "field": "email",
        "from": "coo@bar.com",
        "to": "bill@bar.com"
      },
      {
        "source": {
          "_id": "jkj238238jdsnfsj23",
          "email": "bill@bar.com",
          "firstName": "Eric",
          "lastName": "Smith",
          "address": "888 Mayberry St",
          "entryDate": "2014-05-07T17:33:20+00:00"
        },
        "duplicate": {
          "_id": "jkj238238jdsnfsj23",
          "email": "coo@bar.com",
          "firstName": "Ted",
          "lastName": "Jones",
          "address": "456 Neat St",
          "entryDate": "2014-05-07T17:32:20+00:00"
        },
        "field": "firstName",
        "from": "Ted",
        "to": "Eric"
      },
    ]
  ]
```
- source - source lead that has duplicate(s)

- duplicate - duplicate lead being removed

- field - field that differs from the source and duplicate

- from - duplicate field being changed

- to - saved field from source

## Example
See `unique_leads.json` and `change_log.json` to see output from this CLI app using `leads.json` as the input file.
