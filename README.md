[![Test Status](https://storage.googleapis.com/bookit-integration-test-runner-output/badge.svg)](https://storage.googleapis.com/bookit-integration-test-runner-output/badge.svg)

# integration-test-runner

Tool to run the backend integration test suite for the book it application. The test runner wraps a Postman collection which contains the automated API, System and Integration tests developed for the project. The application is put into a docker image and automatically triggered via a scheduled job and cloud build on GCP. If any of the tests fail emails are generated to a pre-determined list of recipients with the details of the failures.

## Test Report

The test execution generates a test results report and stores this into a secured Cloud Storage bucket. The report can be accessed at the below link if you have proper access rights.

- [Test Results Report](https://storage.cloud.google.com/bookit-integration-test-runner-output/report.html)

## Test Scenarios Covered

The list below is the high level listing of the test scenarios covered. Both positive and negative test scenarios are executed:

- Security Tests

  - All API's are invoked with the same set of security testing

- Profile Related Tests

  - User should be able to create a profile
  - User should be able to Query their profile
  - User should be able to update their profile
  - Profile Delete
  - User Off-boarding

- Service Provider Related Tests

  - User should be able to access provider config
  - User should be able to create a provider
  - User should not be able to create a provider with the same EIN code
  - User should be able to create service offerings on the provider
  - User should be able to search for and find the provider created
  - User should be able to update service offerings
  - User should be able to create a Staff Membership Request
  - Requested Staff Member should find their open request
  - Staff Member should be able to accept the membership request to join the providers team
  - User should be able to delete the provider

- Appointment Related Tests
  - User should be able Create a new appointment
  - User should be able to find their appointments
  - Staff member should be able to change the status on an appointment
  - User should be able to add a note to an appointment
  - User should be able to find existing appointments for a provider
  - User should be able to cancel an appointment

## Sample Email

Hi Book-it Developers,

Looks like you have some issues with the current deployment.

- Collection Name: bookit-api
- Total Tests: 86
- Number of Failures: 5
- Response times:
  - Min: 69
  - Average: 584.1976744186048
  - Max: 4024
  - Standard Deviation: 1029.0367116619693

The following tests have failed:

- Test: 'Create Service Provider', failed with error 'AssertionError'' for test 'Status code is 201'
- Test: 'Find the provider which was just created', failed with error 'AssertionError'' for test 'Status code is 200'
- Test: 'Find the provider which was just created', failed with error 'JSONError'' for test 'Response includes the provider information'
- Test: 'User profile should have isProvider = true', failed with error 'AssertionError'' for test 'Response should have profile with isProvider === true'
- Test: 'Verify Offerings are created and returned with provider', failed with error 'AssertionError'' for test 'Status code is 200'
- Test: 'Verify Offerings are created and returned with provider', failed with error 'JSONError'' for test 'Provider should have 3 services'
