Feature: Sauce Demo

    # @demo

    Scenario Outline: Inventory Demo
        Given Login to inventory app at <URL>
        When Inventory page should list <numberOfProducts> products
        Then Validate all products have valid price


        Examples:
            | TestID      | URL                   | numberOfProducts |
            | SAUCE_TC001 | https://saucedemo.com | 6                |

