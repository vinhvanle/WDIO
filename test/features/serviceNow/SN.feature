Feature: SOW

    @demo @smoke @debug

    Scenario Outline: <TestID>: Log a new Interaction with SOW

        Given Create a new <Company> ITIL user record
        Given Create a new <Company> ESS user record
        Given As an ITIL user I login to serviceNow
        Then I navigate to SOW application
        When I open new <Form> form in SOW
        Then I fill in interaction mandatory fields
        Given I submit the new form
        # Then I fill in interaction non-mandatory fields
        # Given I submit the current form

        Examples:
            | TestID    | Company | Form     |
            # | SOW_TC001 | SCC UK  | interaction |
            | SOW_TC002 | SCC UK  | incident |

    # @demo
    Scenario Outline: <TestID>: Check VA topics availability
        Given Create a new <Company> <Role> user record
        Given As an <Role> user I login to serviceNow
        Then I navigate to Service Portal application
        When I initiate a Virtual Agent conversation
        When I click Show Me Everything in VA conversation
        Then I can verify <Company> topics availability for <Role> user

        Examples:
            | TestID   | Company | Role |
            | VA_TC001 | SCC UK  | ESS  |
            | VA_TC002 | SCC UK  | ITIL |

