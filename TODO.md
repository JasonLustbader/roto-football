## Next time

## Feature List

### Teams can have more players than there are positions to fill

Each team in a league has a fixed number of positions (running backs, quarter back, etc.) for a season, agreed upon by the league. A team's "active lineup" is defined as the players assigned to each position for that week. If there are more players on a team than positions, players that don't fit into a position for a week must be "inactive".

An "inactive" player's scores (from the actual game) do not impact the team's score for the week.  The active and inactive players for a team can change from week to week.

High-level:
* Players are assigned positions for a season
* The game (eventually, league) has a maximum number of active positions allowed
* Players are assigned as active in positions per week

#### Implementation notes

Feature: The stats of inactive players do not affect the team scores in the roto-football game
Cleanup: DRY up id incrementing for factory functions
Feature: The inactive players can change week-to-week
Feature: A team with unfilled positions for a week will get a score of 0 for all categories for that week
Feature: A week cannot be created with a team exceeding the maximum players for a position
Feature: An active player can be deactivated for a week when managing active players before a week is played

### Handle categories where the value is better the lower it is

### Scrape scores from the web into the system

### List team scores in all categories for a season (UI)

### Make ORM with db

### Cross/multi-season features?

### League features?

-drafting
-trading
-free agency
-live update

### Support a "flex" position
