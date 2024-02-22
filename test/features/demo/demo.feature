Feature: Demo Feature



    Scenario Outline: Run first demo feature
        Given Google page is opened
        When Search with <searchItem>
        Then Click on first search result
        Then URL should match <expectedURL>

        Examples:
            | TestID     | searchItem | expectedURL           |
            | DEMO_TC001 | WDIO       | https://webdriver.io/ |