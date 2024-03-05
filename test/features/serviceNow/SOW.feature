Feature: SOW

    @demo

    Scenario Outline: <TestID>: Log a new Incident with SOW

        Given As an ITIL user login to serviceNow
        Then I navigate to SOW application
        When I open new interaction form in SOW
        Then I fill in mandatory fields



        Examples:
            | TestID    |
            | SOW_TC001 |

