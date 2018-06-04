module LeagueHelper
  def team_category_rankings
    @team_category_rankings_memo ||=
      @team_category_rankings.each_with_object({}) do |ranking, hash|
        hash[[ranking.team_id, ranking.category_id]] = ranking.value
      end
  end
end
