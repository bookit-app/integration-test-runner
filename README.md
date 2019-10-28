# integration-test-runner

Tool to run the backend integration test suite for the book it application. The test runner wraps a Postman collection which contains the automated API, System and Integration tests developed for the project. The application is put into a docker image and automatically triggered via a scheduled job and cloud build on GCP. If any of the tests fail emails are generated to a pre-determined list of recipients with the details of the failures.

## Test Scenarios Covered

The list below is the high level listing of the test scenarios covered. Both positive and negative test scenarios are executed:

* Security Tests
    * All API's are invoked with the same set of security testing

* Profile Related Tests
    * User Onboarding
    * Profile Creation
    * Profile Updates
    * Profile Query
    * Profile Delete
    * User Off-boarding

* Service Provider Related Tests
    * Query for staff classification configuration
    * Query for style configuration
    * Creation of Service Provider
    * Linkage of Service Provider to Profile
    * Query of Service Provider details
    * Creation of Service Offerings for a Provider
    * Search for Service provider based on various scenarios
    * Deletion of Service Provider

## Sample Email

Hi Book-it Developers,

Looks like you have some issues with the current deployment. Thought you would like to know that the following tests have failed:

Test: 'User profile should have isProvider = true', failed with error 'AssertionError'' for test 'Response should have profile with isProvider === true'
