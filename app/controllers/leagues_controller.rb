class LeaguesController < ApplicationController
  def show
    @categories = Category.all
  end
end
