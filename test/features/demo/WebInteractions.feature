Feature: Web Interactions Feature

    @demo

    Scenario Outline: Demo Web Interactions
        Given A web page is opened at <URL>
        When Perform web interactions at <URL>


        Examples:
            | TestID    | URL                                |
            | WEB_TC001 | https://the-internet.herokuapp.com |

