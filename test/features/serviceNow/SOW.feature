Feature: SOW

    @demo @smoke @debug

    Scenario Outline: <TestID>: Log a new Interaction with SOW

        Given Create a new SCC UK ITIL user record
        Given Create a new SCC UK ESS user record
        Given As an ITIL user login to serviceNow
        Then I navigate to SOW application
        When I open new interaction form in SOW
        Then I fill in mandatory fields

        Examples:
            | TestID    |
            | SOW_TC001 |

