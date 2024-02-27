Feature: Sauce Demo

    # @demo

    Scenario Outline: <TestID>: Inventory Demo
        Given As a standard user I Login to inventory app
            | userType | Username                |
            | StdUser  | standard_user           |
            | ProbUser | problem_user            |
            | PerfUser | performance_glitch_user |


        When Inventory page should list <numberOfProducts> products
        Then Validate all products have valid price


        Examples:
            | TestID      | numberOfProducts |
            | SAUCE_TC001 | 6                |

