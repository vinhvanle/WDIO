Feature: Customer search

    # @demo

    Scenario Outline: <TestID>: Search external customers

        Given Get list of users from reqres.in
        When As an Admin user login to nopcommerce site
        # When Search users in customer list
        Then Verify if all users exist in customers list


        Examples:
            | TestID    |
            | E2E_TC001 |

