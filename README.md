# mongo_audit_trail


Purpose of this codebase is to create a seamless audit trail mechanism for mongo db instances - similar to what log4net / log4js does for logging

### User Stories

1. 
##### As a developer I should be able to call an end point to store my audit information in an unblocking manner so that those audit information can be reported in future.
  - Given:
    * The application is registered with the system for identification
     
  - When
    * Following fields are posted to the api
      - app_id --> text code used by the app
      - collection_identifier - This will be used for reporting later
      - field_identifier --> This will be used for reporting later. This can be an json object also
      - old data --> json object that holds old data. getting old data is app responsibility
      - new data --> json object
      - ts --> time stamp
      - user --> json object as passed by the app. So for a string user id it needs to pass an object
  - Then
    * Above data are stored in the mongodb database and an handle for the audit record is returned 


2. 
##### As a developer I should be able to query the audit database through an end point for my audit information so that those audit can be used with visualization engines
  - Given:
    * The application is registered with the system for identification
     
  - When
    * The call is authenticated
  - Then
    * Following queries will be supported as api:
      - All data for a specific app_id for a specific date range
      - All data for a collection and app_id combination for a specific date range
      - All data for a collection, field and app_id combination for a specific date range
      - All data for a collection, field, user and app_id combination for a specific date range
      - All data for an app_id and user combination for a specific date range
      - All changes for a specific date/time range

3. 
##### As a developer I want to make sure the transport of my data is secured so that I can use this technique for sensitive data
  - Given:
    * TBD
    
  - When
    * TBD
  - Then
    * TBD:
      - TBD
