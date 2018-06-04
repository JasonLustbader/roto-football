class LeaguesController < ApplicationController
  def show
    @categories = Category.all
    @teams = Team.all
    @team_category_rankings = TeamCategoryRanking.where(category_id: @categories, team_id: @teams)
  end
end
